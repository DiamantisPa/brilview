from brilview import bvconfig, bvlogging
from ConfigParser import SafeConfigParser
from distutils.spawn import find_executable
import sqlalchemy as sql
import os
import datetime
import utils


DEFAULT_ENGINE = None


@utils.return_error_on_exception
def get_last_fill_number(query=None):
    return {
        'status': 'OK',
        'data': _get_last_fill_number(get_engine(), query)
    }


@utils.return_error_on_exception
def get_atlaslumi(query):
    return {
        'status': 'OK',
        'data': _get_atlaslumi(get_engine(), query)
    }


@utils.return_error_on_exception
def get_live_bestlumi(query):
    return {
        'status': 'OK',
        'data': _get_live_bestlumi(get_engine(), query)
    }


@utils.return_error_on_exception
def get_iovtags():
    return {
        'status': 'OK',
        'data': _get_iovtags(get_engine())
    }


def parseservicemap(authfile):
    """Parse service config ini file

    :param authfile: file path
    :returns: parsed service map
    :rtype: {servicealias:[protocol,user,passwd,descriptor]}

    """
    result = {}
    parser = SafeConfigParser()
    parser.read(authfile)
    for s in parser.sections():
        protocol = parser.get(s, 'protocol')
        user = parser.get(s, 'user')
        passwd = parser.get(s, 'pwd')
        descriptor = parser.get(s, 'descriptor')
        result[s] = [protocol, user, passwd, descriptor]
    return result


def create_engine(servicemap, servicename):
    user = servicemap[servicename][1]
    passwd = servicemap[servicename][2].decode('base64')
    descriptor = servicemap[servicename][3]
    connurl = 'oracle+cx_oracle://{}:{}@{}'.format(user, passwd, descriptor)
    return sql.create_engine(connurl)


def get_engine(use_cached=True):
    if use_cached and DEFAULT_ENGINE is not None:
        return DEFAULT_ENGINE
    authfile = None
    servicename = 'online'
    if hasattr(bvconfig, 'lumidbhandler'):
        if (
                'authfile' in bvconfig.lumidbhandler and
                bvconfig.lumidbhandler['authfile']
        ):
            authfile = bvconfig.lumidbhandler['authfile']
        if (
                'connection' in bvconfig.lumidbhandler and
                bvconfig.lumidbhandler['connection']
        ):
            servicename = bvconfig.lumidbhandler['connection']
    if authfile is None:
        whichbrilcalc = find_executable('brilcalc')
        if whichbrilcalc is not None:
            authfile = os.path.join(
                os.path.dirname(whichbrilcalc), '..',
                'lib/python2.7/site-packages/brilws/data/readdb3.ini')
    if authfile is None:
        raise RuntimeError('Cannot create SQL engine without authfile path')
    servicemap = parseservicemap(authfile)
    return create_engine(servicemap, servicename)


def _get_iovtags(engine):
    resultproxy = engine.execute('select tagname from cms_lumi_prod.iovtags')
    return [t[0] for t in resultproxy.fetchall()]


def _get_live_bestlumi(engine, query):
    if 'latest' in query:
        interval = float(query['latest']) / 1000.0
        interval = interval if interval < 86400 else 86400
        select = sql.text(
            'select * from '
            '(select avg, fillnum, runnum, lsnum, nbnum, timestamp '
            'from cms_bril_monitoring.FASTBESTLUMI '
            'order by timestamp DESC) vals, '
            '(select max(timestamp) as maxts '
            'from cms_bril_monitoring.FASTBESTLUMI) ts '
            'where vals.timestamp >= (ts.maxts - interval \'{}\' second) '
            'order by timestamp ASC'
            .format(interval))
        resultproxy = engine.execute(select)
        rows = resultproxy.fetchall()
    elif 'since' in query:
        since = float(query['since']) / 1000.0
        select = sql.text(
            'select * from '
            '(select avg, fillnum, runnum, lsnum, nbnum, timestamp '
            'from cms_bril_monitoring.FASTBESTLUMI '
            'where timestamp >= '
            'TIMESTAMP \'1970-01-01 00:00:00\' AT TIME ZONE \'UTC\' + '
            'numtodsinterval(:since, \'SECOND\') '
            'order by timestamp desc)'
            'where rownum < 300 ORDER BY timestamp ASC')
        resultproxy = engine.execute(select, since=since)
        rows = resultproxy.fetchall()
    return {
        'avg': [r[0] for r in rows],
        'fillnum': [r[1] for r in rows],
        'runnum': [r[2] for r in rows],
        'lsnum': [r[3] for r in rows],
        'nbnum': [r[4] for r in rows],
        'timestamp': [_datetime2seconds(r[5]) * 1000 for r in rows],
    }


def _get_atlaslumi(engine, query):
    if ('fillnum' not in query or query['fillnum'] is None):
        fillnum = _get_last_fill_number(engine, {'source': 'atlas'})
    else:
        fillnum = int(query['fillnum'])
    if fillnum < 1000:
        raise ValueError('fillnum {} out of range.'. format(fillnum))
    select = (
        'select DIPTIME, LHCFILL, LUMI_TOTINST '
        'from CMS_BEAM_COND.ATLAS_LHC_LUMINOSITY where LHCFILL=:fillnum '
        'ORDER BY DIPTIME ASC')
    resultproxy = engine.execute(select, fillnum=fillnum)
    rows = resultproxy.fetchall()
    return {
        'timestamp': [_datetime2seconds(r[0]) * 1000 for r in rows],
        # 'fillnum': [r[1] for r in rows],
        'lumi_totinst': [r[2] for r in rows],
        'single_fillnum': fillnum
    }


def _get_last_fill_number(engine, query=None):
    select = 'select max(FILLNUM) from cms_lumi_prod.ids_datatag'
    if (query is not None and 'source' in query):
        src = query['source'].lower()
        if src == 'atlas':
            select = 'select max(LHCFILL) from CMS_BEAM_COND.ATLAS_LHC_LUMINOSITY'
        elif (src == 'cms' or src == 'bril'):
            select = 'select max(FILLNUM) from cms_lumi_prod.ids_datatag'
    print(select)
    resultproxy = engine.execute(select);
    rows = resultproxy.fetchall()
    return int(rows[0][0])


def _datetime2seconds(dt):
    return (dt - datetime.datetime(1970, 1, 1)).total_seconds()


if __name__ == '__main__':
    servicemap = parseservicemap('../data/db_read.ini')
    engine = create_engine(servicemap, 'online')
    print(_get_iovtags(engine))
    print(get_iovtags())
