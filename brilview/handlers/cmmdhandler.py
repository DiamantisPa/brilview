import subprocess
import re
import numpy as np
from brilview import common

def brilcalcGlobalLumiHandler(brilcalcargs,unit='/pb',cmmd=[]):
    '''
    brilcalcargs: arguments for brilcalc lumi without --byls
    cmmd : for passing brilcalc command in case you don't run standard brilcalc
    output:
       {'status':'OK'/'ERROR', 
         'data': [ [fillnum,runnum,tssec,delivered,recorded] ]
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
    args += ['-u', unit, '--output-style', 'csv', '--without-checkjson','--tssec']
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
        tssec =  int(items[1])
        delivered = float(items[4])
        recorded = float(items[5])
        resultdata.append( [fillnum,runnum,tssec,delivered,recorded] )
    if iserror:
        return {'status':'ERROR', 'data': '\n'.join( result_strarray ) }
    return { 'status':'OK', 'data': resultdata}
        
def brilcalcLumiHandler(brilcalcargs, unit='/ub',cmmd=[]):
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
    args += ['-u', unit, '--byls', '--output-style', 'csv', '--without-checkjson','--tssec']
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

def brilcalcBXLumiHandler(brilcalcargs, unit='/ub',cmmd=[]):
    '''
    output:
       {'status':'OK'/'ERROR', 
        'data': [ [fillnum,runnum,lsnum,tssec,bxid_array,bxdelivered_array,bxrecorded_array] ]
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
    xingMin = 0.001
    args += ['lumi'] + brilcalcargs
    args += ['-u', unit, '--xing', '--output-style', 'csv', '--without-checkjson','--tssec','--xingMin',str(xingMin)]
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
        bxlumi_str = items[9]
        bxlumi_str = re.sub(r'\[|\]','',bxlumi_str)        
        bxlumi = np.fromstring(bxlumi_str,dtype='f4', sep=' ')
        bxid_array = bxlumi[0::3].astype(int)
        bxdelivered_array = bxlumi[1::3]
        bxrecorded_array =  bxlumi[2::3]
        resultdata.append( [fillnum, runnum,lsnum,tssec,bxid_array.tolist(),bxdelivered_array.tolist(),bxrecorded_array.tolist() ] )
    if iserror:
        return {'status':'ERROR', 'data': '\n'.join( result_strarray ) }
    return { 'status':'OK', 'data': resultdata}

def brilcalcBeamHandler(brilcalcargs, cmmd=[]):
    pass

def brilcalcBXBeamHandler(brilcalcargs, cmmd=[]):
    pass
    
if __name__ == '__main__':
     #from project root run python -m brilview.handlers.cmmdhandler
     print brilcalcLumiHandler(
         ['-r', '284077'], unit='/mb',cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
     print brilcalcBXLumiHandler(
         ['-r', '284077'], unit='/mb',cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
    #print brilcalcLumiHandler(
    #    ['-r', '284077'],
    #    cmmd=['/home/data/brilws/brilcalc-run.py'])
