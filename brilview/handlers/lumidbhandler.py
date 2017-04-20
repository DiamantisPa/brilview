from brilview import bvconfig
from ConfigParser import SafeConfigParser
from distutils.spawn import find_executable
import sqlalchemy as sql
import os


DEFAULT_ENGINE = None


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


def get_iovtags():
    return _get_iovtags(get_engine())


def _get_iovtags(engine):
    resultproxy = engine.execute('select tagname from cms_lumi_prod.iovtags')
    return [t[0] for t in resultproxy.fetchall()]


if __name__ == '__main__':
    servicemap = parseservicemap('../data/db_read.ini')
    engine = create_engine(servicemap, 'online')
    print(_get_iovtags(engine))
    print(get_iovtags())
