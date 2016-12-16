import subprocess
import re
import numpy as np
from brilview import bvconfig


def brilcalcLumiHandler(commandargs={}):
    '''
    brilcalcargs: arguments for brilcalc lumi

    the handler decides if --byls is needed according to input time parameters
    input:
         commandargs: arguments for command
         {
           begin: str '^\d\d/\d\d/\d\d \d\d:\d\d:\d\d$|^\d{6}$|^\d{4}$'
           end: str '^\d\d/\d\d/\d\d \d\d:\d\d:\d\d$|^\d{6}$|^\d{4}$'
           timeunit: run,fill,strdate
           unit: str
           beamstatus: str (must be in 'stable beams','squeeze','flat top','adjust')
           normtag: str textbox or dropdown select
           datatag: str
           hltpath:  str //'^HLT_[\w\*\?\[\]\!]+$' reject wildcard patterns ??
           type:  str or None
           selectjson: jsonstr
           byls: boolean
         }

    output:
    {'status':'OK'/'ERROR',
    'data': {'fillnum': [],
                  'runnum': [],
                  'tssec': [],
                  'delivered': [],
                   'recorded':[],
                    'lsnum':[] or None }
    or {'message':str}
    }

    '''
    begin = ''
    end = ''
    selectjson = ''

    cmd = 'brilcalc'
    if hasattr(bvconfig, 'brilcommandhandler') and bvconfig.brilcommandhandler.has_key('command') and bvconfig.brilcommandhandler['command'] :
        cmd = bvconfig.brilcommandhandler['command']
    cmdargs = [cmd,'lumi','--output-style', 'csv', '--without-checkjson','--tssec']
    if not commandargs.has_key('selectjson') :
        if not commandargs.has_key('begin') or not commandargs.has_key('end')  :
            return 'ERROR: parameters begin, end or selectjson are not provided'
        else:
            begin = commandargs['begin']
            end = commandargs['end']
            cmdargs += ['--begin',str(begin),'--end',str(end)]
    else:
        selectjson = commandargs['selectjson']
        cmdargs += ['-i',selectjson]

    byls = False
    if commandargs.has_key('byls') and commandargs['byls'] is True:
        byls = True
        cmdargs.append('--byls')

    unit = '/ub'
    if commandargs.has_key('unit') and commandargs['unit'] :
        unit = commandargs['unit']
    cmdargs += ['-u',unit]

    if commandargs.has_key('type') and commandargs['type']:
        cmdargs += [ '--type', commandargs['type'] ]

    if commandargs.has_key('beamstatus') and commandargs['beamstatus']:
        cmdargs += [ '-b', commandargs['beamstatus'].upper() ]

    if commandargs.has_key('hltpath') and commandargs['hltpath']:
        cmdargs += [ '--hltpath', commandargs['hltpath'] ]
    r = subprocess.check_output(cmdargs, stderr=subprocess.STDOUT)
    result_strarray = [l for l in r.split('\n') if len(l) > 0 and not l.startswith('#')]
    if not result_strarray: #no data found
        return { 'status':'ERROR', 'message':'No data found' }
    iserror = False
    fillnums = []
    runnums = []
    lsnums = []
    tssecs = []
    delivereds = []
    recordeds = []

    for line in result_strarray:
        items = line.split(',')
        if items[0].find(':') == -1: #output is an error message
            iserror = True
            break
        [runnum,fillnum] = [ int(x) for x in items[0].split(':') ]

        fillnums.append(fillnum)
        runnums.append(runnum)

        if byls:
            tssecs.append( int(items[2]) )
            delivereds.append( float(items[5]) )
            recordeds.append( float(items[6]) )
            lsnum = [ int(x[0]) for x in items[1].split(':') ]
            lsnums.append(lsnum)
        else:
            tssecs.append( int(items[1]) )
            delivereds.append( float(items[4]) )
            recordeds.append( float(items[5]) )

    if iserror:
        return {'status':'ERROR', 'message': '\n'.join( result_strarray ) }

    resultdata = {'fillnum':fillnums, 'runnum':runnums, 'lsnum':lsnums ,'tssec':tssecs, 'delivered':delivereds,'recorded':recordeds}
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
     #print brilcalcLumiHandler(
     #    ['-r', '284077'], unit='/mb',cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
     #print brilcalcBXLumiHandler(
     #    ['-r', '284077'], unit='/mb',cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
     #print brilcalcLumiHandler(
     #    ['-r', '284077'],
     #    cmmd=['/home/data/brilws/brilcalc-run.py'])
     bvconfig.update({"brilcommandhandler": {}})
     bvconfig.brilcommandhandler['command'] = '/home/zhen/work/brilws/brilcalc-run.py'
     print brilcalcLumiHandler({'begin':284077,'end':284077})
