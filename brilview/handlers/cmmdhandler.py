import subprocess
import re
import numpy as np
import os
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
           without_correction: boolean
         }

    output:
    {'status':'OK'/'ERROR',
    'data': {'fillnum': [],
                  'runnum': [],
                  'tssec': [],
                  'delivered': [],
                  'recorded':[],
                  'lsnum':[],
                  'hltpathid':[],
                  'hltpathid2name':{id:name},
                  'hltpathname2id':{name:id},
                }
    or {'message':str}
    }

    '''
    begin = ''
    end = ''
    selectjson = ''

    cmd = 'brilcalc'
    if (
            hasattr(bvconfig, 'brilcommandhandler') and
            'command' in bvconfig.brilcommandhandler and
            bvconfig.brilcommandhandler['command']
    ):
        cmd = bvconfig.brilcommandhandler['command']

    cmdargs = [
        cmd, 'lumi', '--output-style', 'csv', '--without-checkjson', '--tssec']
    if 'selectjson' not in commandargs:
        if 'begin' not in commandargs or 'end' not in commandargs:
            return 'ERROR: parameters begin, end or selectjson are missing'
        else:
            begin = commandargs['begin']
            end = commandargs['end']
            cmdargs += ['--begin', str(begin), '--end', str(end)]
    else:
        selectjson = commandargs['selectjson']
        cmdargs += ['-i', selectjson]

    byls = commandargs.get('byls', False)
    if byls:
        cmdargs.append('--byls')

    without_correction = commandargs.get('without_correction', False)
    if without_correction:
        cmdargs.append('--without-correction')

    hltpath = None

    unit = '/ub'
    if 'unit' in commandargs and commandargs['unit']:
        unit = commandargs['unit']
    cmdargs += ['-u', unit]

    if 'type' in commandargs and commandargs['type']:
        cmdargs += ['--type', commandargs['type']]

    if 'normtag' in commandargs and commandargs['normtag']:
        normtag = str(commandargs['normtag']).replace('.', '').replace('/', '')
        if normtag == '' or os.path.isfile(normtag):
            return {'status': 'ERROR', 'message': 'Bad normtag: ' + normtag}
        cmdargs += ['--normtag', normtag]

    if 'beamstatus' in commandargs and commandargs['beamstatus']:
        cmdargs += ['-b', commandargs['beamstatus'].upper()]

    if 'hltpath' in commandargs and commandargs['hltpath']:
        cmdargs += ['--hltpath', commandargs['hltpath']]
        hltpath = commandargs['hltpath']

    print cmdargs
    try:
        r = subprocess.check_output(cmdargs, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        if e.returncode != 0:
            return {'status': 'ERROR', 'message': e.output}
    result_strarray = [
        l for l in r.split('\n') if len(l) > 0 and not l.startswith('#')]

    if not result_strarray:  # no data found
        return {'status': 'ERROR', 'message': 'No data found'}
    iserror = False
    fillnums = []
    runnums = []
    lsnums = []
    tssecs = []
    delivereds = []
    recordeds = []
    hltpathids = []
    hltpathid2name = {}
    hltpathname2id = {}
    allpaths = []
    for line in result_strarray:
        items = line.split(',')
        if items[0].find(':') == -1:  # output is an error message because the first data field always n:m
            iserror = True
            break

        [runnum, fillnum] = [int(x) for x in items[0].split(':')]

        fillnums.append(fillnum)
        runnums.append(runnum)

        # special treat hltpathname field
        if byls:
            if hltpath:
                pathname = items[3]
                if pathname not in allpaths:
                    allpaths.append(pathname)
                hltpathid = allpaths.index(pathname)
                hltpathids.append(hltpathid)
                hltpathid2name[hltpathid] = pathname
                hltpathname2id[pathname] = hltpathid
                del items[3]  # delete hltpath field
            else:
                del items[3:5]  # delete beamstatus, E fields
        else:
            del items[2:4]  # delete nls,ncms or ncms,hltpath for hlt

        if byls:
            tssecs.append(int(items[2]))
            lsnum = int(items[1].split(':')[0])
            lsnums.append(lsnum)
            delivereds.append(float(items[3]))
            recordeds.append(float(items[4]))
        else:
            tssecs.append(int(items[1]))
            delivereds.append(float(items[2]))
            recordeds.append(float(items[3]))

    if iserror:
        return {'status': 'ERROR', 'message': '\n'.join(result_strarray)}
    resultdata = {
        'fillnum': fillnums,
        'runnum': runnums,
        'lsnum': lsnums,
        'tssec': tssecs,
        'delivered': delivereds,
        'recorded': recordeds,
        'hltpathid': hltpathids,
        'hltpathid2name': hltpathid2name,
        'hltpathname2id': hltpathname2id
    }
    return {'status': 'OK', 'data': resultdata}


def brilcalcBXLumiHandler(brilcalcargs, unit='/ub', cmmd=[]):
    '''
    output:
       {'status':'OK'/'ERROR',
        'data': [ [fillnum,runnum,lsnum,tssec,bxid_array,bxdelivered_array,bxrecorded_array] ]
        or 'errormessagestring'
    }
    '''
    if not brilcalcargs:
        return {'status': 'ERROR', 'data': 'Empty input command'}
    args = []
    if cmmd:
        args = cmmd
    else:
        args = ['brilcalc']
    xingMin = 0.001
    args += ['lumi'] + brilcalcargs
    args += [
        '-u', unit, '--xing', '--output-style', 'csv', '--without-checkjson',
        '--tssec', '--xingMin', str(xingMin)
    ]
    try:
        r = subprocess.check_output(args, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        if e.returncode != 0:
            return {'status': 'ERROR', 'data': e.output}
    result_strarray = [
        l for l in r.split('\n') if len(l) > 0 and not l.startswith('#')
    ]
    if not result_strarray:  # no data found
        return {'status': 'ERROR', 'data': 'No data found'}
    resultdata = []
    iserror = False
    for line in result_strarray:
        items = line.split(',')
        if items[0].find(':') == -1:  # output is an error message
            iserror = True
            break
        [runnum, fillnum] = [int(x) for x in items[0].split(':')]
        [lsnum, cmsalive] = [int(x) for x in items[1].split(':')]
        tssec = int(items[2])
        bxlumi_str = items[9]
        bxlumi_str = re.sub(r'\[|\]', '', bxlumi_str)
        bxlumi = np.fromstring(bxlumi_str, dtype='f4', sep=' ')
        bxid_array = bxlumi[0::3].astype(int)
        bxdelivered_array = bxlumi[1::3]
        bxrecorded_array = bxlumi[2::3]
        resultdata.append([
            fillnum, runnum, lsnum, tssec, bxid_array.tolist(),
            bxdelivered_array.tolist(), bxrecorded_array.tolist()
        ])
    if iserror:
        return {'status': 'ERROR', 'data': '\n'.join(result_strarray)}
    return {'status': 'OK', 'data': resultdata}


def brilcalcBeamHandler(brilcalcargs, cmmd=[]):
    pass


def brilcalcBXBeamHandler(brilcalcargs, cmmd=[]):
    pass


if __name__ == '__main__':
    # from project root run python -m brilview.handlers.cmmdhandler
    # print brilcalcLumiHandler(
    #    ['-r', '284077'], unit='/mb',cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
    # print brilcalcBXLumiHandler(
    #    ['-r', '284077'], unit='/mb',cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
    # print brilcalcLumiHandler(
    #    ['-r', '284077'],
    #    cmmd=['/home/data/brilws/brilcalc-run.py'])
    bvconfig.update({"brilcommandhandler": {}})
    bvconfig.brilcommandhandler['command'] = '/home/zhen/work/brilws/brilcalc-run.py'
    print brilcalcLumiHandler({'begin': 284077, 'end': 284077, 'byls': True})
