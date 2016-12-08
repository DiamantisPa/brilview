import subprocess
from brilview import common

def brilcalcLumiHandler(brilcalcargs, cmmd=[]):
    '''
    brilcalcargs: arguments for brilcalc lumi
    cmmd : for passing brilcalc command in case you don't run standard brilcalc
    output:
      {'status':'OK'/'ERROR', 
       'data': [ [fillnum,runnum,lsnum,tssec,cmsalive,beamstatusid,delivered,recorded] ]
             or 'errormessagestring'
      }
    '''
    if not brilcalcargs:
        return {'status':'ERROR','data':'Empty input command'}
    args = []
    if cmmd:
        args = cmmd
    else:
        args = ['brilcalc']
    args += ['lumi'] + brilcalcargs
    args += ['--byls', '--output-style', 'csv', '--without-checkjson','--tssec']
    r = subprocess.check_output(args, stderr=subprocess.STDOUT)
    result_strarray = [l for l in r.split('\n') if len(l) > 0 and not l.startswith('#')]
    if not result_strarray: #no data found
        return { 'status':'ERROR', 'data':'No data found' }
    resultdata = []
    iserror = False
    for line in result_strarray:
        items = line.split(',')
        if items[0].find(':') == -1: #output is an error message
            iserror = True
            break
        [runnum,fillnum] = [ int(x) for x in items[0].split(':') ]
        [lsnum,cmsalive] = [ int(x) for x in items[1].split(':') ]
        tssec =  int(items[2])
        beamstatus = items[3]
        beamstatusid = common.beamstatustoid[beamstatus]
        delivered = float(items[5])
        recorded = float(items[6])
        resultdata.append( [fillnum,runnum,lsnum,tssec,cmsalive,beamstatusid,delivered,recorded] )
    if iserror:
        return {'status':'ERROR', 'data': '\n'.join( result_strarray ) }
    return { 'status':'OK', 'data': resultdata}


if __name__ == '__main__':
     #from project root run python -m brilview.handlers.cmmdhandler
     print brilcalcLumiHandler(
         ['-r', '284077'], cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
    #print brilcalcLumiHandler(
    #    ['-r', '284077'],
    #    cmmd=['/home/data/brilws/brilcalc-run.py'])
