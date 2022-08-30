from brilview import bvconfig, bvlogging, common
from distutils.spawn import find_executable
import sqlalchemy as sql
import sys
import os
import datetime
import base64
from . import utils

if sys.version_info[0] == 2:
    from ConfigParser import SafeConfigParser
else:
    from configparser import SafeConfigParser

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
    #passwd = servicemap[servicename][2].decode('base64')
    passwd = base64.b64decode(servicemap[servicename][2].encode('ascii')).decode('utf-8')
    descriptor = servicemap[servicename][3]
    connurl = 'oracle+cx_oracle://{}:{}@{}'.format(user, passwd, descriptor)
    print('create_engine ', connurl)
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
            authfile = common.get_cmmdauth_location(whichbrilcalc)
            
            #authfile = os.path.join(
            #    os.path.dirname(whichbrilcalc), '..',
            #    'lib/python2.7/site-packages/brilws/data/readdb3.ini')
    if authfile is None:
        raise RuntimeError('Cannot create SQL engine without authfile path')
    servicemap = parseservicemap(authfile)
    return create_engine(servicemap, servicename)


def _get_iovtags(engine):
    resultproxy = engine.execute('select tagname from cms_lumi_prod.iovtags')
    return [t[0] for t in resultproxy.fetchall()]


def _get_live_bestlumi(engine, query):

    print()
    print("_get_live_bestlumi")
    print()

    metadata = sql.MetaData()
    metadata.reflect(bind=engine)
    insp = sql.inspect(engine)

    print("metadata", metadata)
    print("metadata tables", metadata.tables)
    print("tables", insp.get_table_names())

    select = sql.text('select table_name from all_tables')
    resultproxy = engine.execute(select)
    print("fetch all", resultproxy.fetchall())
    # for table_name in metadata.tables:
    #     print(table_name)
    #     for column in insp.get_columns(table_name):
    #         for name,value in column.items():
    #             print('  ', end='')
    #             if value:
    #                 field = name if value in [True, 'auto'] else value 
    #                 print(field, end=' ')
    #         print()
    # select = sql.text(
    #     'select table_name, column_name '
    #     'from all_tab_columns '
    #     'where table_name = cms_bril_monitoring.FASTBESTLUMI')
    # resultproxy = engine.execute(select)
    # print("fetch all columns", resultproxy.fetchall())

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
        print("resultproxy", resultproxy)
        rows = resultproxy.fetchall()
        print("rows", rows)
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
        print("resultproxy", resultproxy)
        rows = resultproxy.fetchall()
        print("rows", rows)
    return {
        'avg': [r[0] for r in rows],
        'fillnum': [r[1] for r in rows],
        'runnum': [r[2] for r in rows],
        'lsnum': [r[3] for r in rows],
        'nbnum': [r[4] for r in rows],
        'timestamp': [_datetime2seconds(r[5]) * 1000 for r in rows],
    }


def _get_atlaslumi(engine, query):
    print()
    print('atlas schema')
    print()

    metadata = sql.MetaData()
    metadata.reflect(engine)
    insp = sql.inspect(engine)

    # print("metadata tables", metadata.tables.keys())
    # print("tables", insp.get_table_names())

    # for table_name in metadata.tables:
    #     print(table_name)
    #     for column in insp.get_columns(table_name):
    #         for name,value in column.items():
    #             print('  ', end='')
    #             if value:
    #                 field = name if value in [True, 'auto'] else value 
    #                 print(field, end=' ')
    #         print()

    # select = sql.text('select owner, table_name from all_tables')
    # resultproxy = engine.execute(select)
    # print("fetch all", resultproxy.fetchall())
    # print()

    # select = sql.text('select * from all_tab_cols')
    # resultproxy = engine.execute(select)
    # print("fetch all columns", resultproxy.fetchall())
    print("columns ATLAS_LHC_LUMINOSITY', 'CMS_OMS_DIPLOGGER")
    columns_table = insp.get_columns('ATLAS_LHC_LUMINOSITY', 'CMS_OMS_DIPLOGGER') #schema is optional
    
    for c in columns_table :
        print(c['name'], c['type'])
    print()
    # print("columns LHCFILL', 'CMS_LUMI_PROD")
    # columns_table = insp.get_columns('LHCFILL', 'CMS_LUMI_PROD') #schema is optional
    
    # for c in columns_table :
    #     print(c['name'], c['type'])
    # print()
    # print("columns cms_lumi_prod.ids_datatag")
    # columns_table = insp.get_columns('ids_datatag', 'cms_lumi_prod') #schema is optional
    
    # for c in columns_table :
    #     print(c['name'], c['type'])
    # print()
   
    # print("cms_bril_monitoring.FASTBESTLUMI")
    # columns_table = insp.get_columns('FASTBESTLUMI', 'cms_bril_monitoring') #schema is optional
    
    # for c in columns_table :
    #     print(c['name'], c['type'])
    # print()

    print("CMS_OMS_DIPLOGGER.LHC_RUN_CONFIGURATION")
    columns_table = insp.get_columns('LHC_RUN_CONFIGURATION', 'CMS_OMS_DIPLOGGER') #schema is optional
    
    for c in columns_table :
        print(c['name'], c['type'])
    print()
    # works
    # select = (
    #         'select * from '
    #         '(select * '
    #         'from CMS_OMS_DIPLOGGER.ATLAS_LHC_LUMINOSITY '
    #         'where  LUMI_TOTINST > 0 '
    #         'order by diptime desc) '
    #         'where rownum < 1000')

    # resultproxy = engine.execute(select)
    # print("fetch rows", resultproxy.fetchall())

    select = (
        'select DIPTIME, DIP_ID, FILL_NO '
        'from CMS_OMS_DIPLOGGER.LHC_RUN_CONFIGURATION '
        'ORDER BY DIP_ID ASC')
    
    fillnum = '8151'
    resultproxy = engine.execute(select)
    print("dip_ids ", resultproxy.fetchall())

    select = (
        'select DIPTIME '
        'from CMS_OMS_DIPLOGGER.LHC_RUN_CONFIGURATION '
        'where FILL_NO=:fillnum '
        'ORDER BY DIPTIME ASC')

    resultproxy = engine.execute(select, fillnum=fillnum)
    rows = resultproxy.fetchall()
    diptimes = [r[0] for r in rows]
    #rows = resultproxy.fetchall()
    print('rows diptime', rows)
    mintime = diptimes[0]
    maxtime = diptimes[-1]
    print('mintime ', diptimes)
    print('maxtime ', diptimes)
    #rows = [r[0] for r in rows]
    select = (
        'select DIPTIME, DIP_ID, LUMI_TOTINST '
        'from CMS_OMS_DIPLOGGER.ATLAS_LHC_LUMINOSITY '
        'where DIPTIME between mintime=:mintime and maxtime=:maxtime '
        'order by DIPTIME asc')

    resultproxy = engine.execute(select, mintime=mintime, maxtime=maxtime)
    rows = resultproxy.fetchall()
    print('lumi based on time', rows)
    #print('rows type', type(rows))
    # print('min', rows[0])
    # print('max', rows[-1])
    # min = rows[0]
    # max = rows[-1]
    select = (
        'select DIPTIME, DIP_ID '
        'from CMS_OMS_DIPLOGGER.ATLAS_LHC_LUMINOSITY '
        'where rownum < 1000 order by DIPTIME asc')
    
    resultproxy = engine.execute(select)
    rows = resultproxy.fetchall()
    print('CMS_OMS_DIPLOGGER.ATLAS_LHC_LUMINOSITY', rows)

    select = (
        'select DIPTIME, DIP_ID, LUMI_TOTINST '
        'from CMS_OMS_DIPLOGGER.ATLAS_LHC_LUMINOSITY '
        'where DIP_ID between 1001312019 and 1001313017 '
        'order by DIP_ID asc')
    
    resultproxy = engine.execute(select)
    rows = resultproxy.fetchall()
    print('rows', rows)
    # print()

    # if ('fillnum' not in query or query['fillnum'] is None):
    #     fillnum = _get_last_fill_number(engine, {'source': 'atlas'})
    # else:
    #     fillnum = int(query['fillnum'])
    # if fillnum < 1000:
    #     raise ValueError('fillnum {} out of range.'. format(fillnum))
    
    # select = (
    #     'select DIPTIME, DIP_ID, LUMI_TOTINST '
    #     'from CMS_OMS_DIPLOGGER.ATLAS_LHC_LUMINOSITY where DIP_ID=:fillnum '
    #     'ORDER BY DIPTIME ASC')

    # resultproxy = engine.execute(select, fillnum=fillnum)
    # rows = resultproxy.fetchall()
    lumi_test = [r[2] for r in rows]
    #print('lumi_totinst', lumi_test)
    return {
        'timestamp': [_datetime2seconds(r[0]) * 1000 for r in rows],
        # 'fillnum': [r[1] for r in rows],
        'lumi_totinst': [r[2] for r in rows],
        #'single_fillnum': fillnum
    }


def _get_last_fill_number(engine, query=None):
    select = 'select max(FILLNUM) from cms_lumi_prod.ids_datatag'
    if (query is not None and 'source' in query):
        src = query['source'].lower()
        if src == 'atlas':
            select = 'select max(FILL_NO) from CMS_OMS_DIPLOGGER.LHC_RUN_CONFIGURATION'
        elif (src == 'cms' or src == 'bril'):
            select = 'select max(FILLNUM) from cms_lumi_prod.ids_datatag'

    resultproxy = engine.execute(select)
    print('get last fill number, resultproxy=', resultproxy.fetchall())
    rows = resultproxy.fetchall()
    print('get last fill number, rows=', rows)
    return int(rows[0][0])


def _datetime2seconds(dt):
    return (dt - datetime.datetime(1970, 1, 1)).total_seconds()

def _get_dip_ids(engine, fillnum=None):
    if fillnum is None:
        raise ValueError('fillnum is None. Please provide a valid value.')
    else:
        select = (
        'select DIP_ID '
        'from CMS_OMS_DIPLOGGER.LHC_RUN_CONFIGURATION where FILL_NO=:fillnum '
        'ORDER BY DIP_ID ASC')
    
    fillnum = str(fillnum)
    resultproxy = engine.execute(select, fillnum=fillnum)
    rows = resultproxy.fetchall()
    print(rows)

if __name__ == '__main__':
    servicemap = parseservicemap('../data/db_read.ini')
    print('servicemap ', servicemap)
    engine = create_engine(servicemap, 'online')
    print(_get_iovtags(engine))
    print(get_iovtags())
