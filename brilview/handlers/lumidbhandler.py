from brilview import bvconfig
from ConfigParser import SafeConfigParser
import sqlalchemy as sql


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


def get_engine():
    authfile = '../data/db_read.ini'
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
