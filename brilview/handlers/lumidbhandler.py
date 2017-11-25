from brilview import bvconfig
from ConfigParser import SafeConfigParser
from distutils.spawn import find_executable
import sqlalchemy as sql
import os
import time
import utils


DEFAULT_ENGINE = None


@utils.return_error_on_exception
def get_live_bestlumi(query):
    return _get_live_bestlumi(get_engine(), query)


@utils.return_error_on_exception
def get_iovtags():
    return _get_iovtags(get_engine())


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
    print(servicemap)
    return create_engine(servicemap, servicename)


def _get_iovtags(engine):
    resultproxy = engine.execute('select tagname from cms_lumi_prod.iovtags')
    return [t[0] for t in resultproxy.fetchall()]


def _get_live_bestlumi(engine, query):
    if 'latest' in query:
        interval = float(query['latest']) / 1000.0
        interval = interval if interval > 86400 else 86400
        select = sql.text(
            'select * from '
            '(select avg, fillnum, runnum, lsnum, nbnum, timestamp '
            'from cms_bril_monitoring.FASTBESTLUMI '
            'order by timestamp desc) vals, '
            '(select max(timestamp) as maxts '
            'from cms_bril_monitoring.FASTBESTLUMI) ts '
            'where vals.timestamp >= (ts.maxts - interval \'{}\' second)'
            .format(interval))
        resultproxy = engine.execute(select)
        rows = resultproxy.fetchall()
    elif 'since' in query:
        since = float(query['since']) / 1000.0
        select = sql.text(
            'select * from '
            '(select avg, fillnum, runnum, lsnum, nbnum, timestamp '
            'from cms_bril_monitoring.FASTBESTLUMI '
            'where timestamp >= to_date(\'1970-01-01\', \'YYYY-MM-DD\') + '
            'numtodsinterval(:since, \'SECOND\')'
            'order by timestamp ASC)'
            'where rownum < 4000')
        resultproxy = engine.execute(select, since=since)
        rows = resultproxy.fetchall()
    return {
        'avg': [r[0] for r in rows],
        'fillnum': [r[1] for r in rows],
        'runnum': [r[2] for r in rows],
        'lsnum': [r[3] for r in rows],
        'nbnum': [r[4] for r in rows],
        'timestamp': [_datetime2milliseconds(r[5]) for r in rows],
    }


def _datetime2milliseconds(dt):
    return time.mktime(dt.timetuple())*1e3 + dt.microsecond/1e3


if __name__ == '__main__':
    servicemap = parseservicemap('../data/db_read.ini')
    engine = create_engine(servicemap, 'online')
    print(_get_iovtags(engine))
    print(get_iovtags())
