import subprocess
import traceback
import re
import numpy as np
import os
import csv
from brilview import bvconfig, bvlogging


RE_FILENAME_ALLOWED_CHARS = re.compile(r'^([a-zA-Z0-9]|_|-|\.)+$')


def return_error_on_exception(func):
    def decorated(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            bvlogging.get_logger().warn(traceback.format_exc())
            return {
                'status': 'ERROR',
                'message': e.message
            }
    return decorated


def get_normtag_filenames():
    if (
            hasattr(bvconfig, 'brilcommandhandler') and
            'normtag_directory' in bvconfig.brilcommandhandler and
            bvconfig.brilcommandhandler['normtag_directory']
    ):
        normtag_directory = bvconfig.brilcommandhandler['normtag_directory']
    else:
        return []
    filenames = os.listdir(normtag_directory)
    jsons = [x for x in filenames if x.endswith('.json')]
    normtags = [x for x in jsons if x.startswith('normtag')]
    return normtags


def make_normtag_filepath(normtag):
    if (
            hasattr(bvconfig, 'brilcommandhandler') and
            'normtag_directory' in bvconfig.brilcommandhandler and
            bvconfig.brilcommandhandler['normtag_directory']
    ):
        normtag_directory = bvconfig.brilcommandhandler['normtag_directory']
    else:
        return None
    if re.match(RE_FILENAME_ALLOWED_CHARS, normtag) is None:
        return None
    fpath = os.path.join(normtag_directory, normtag)
    fpath = os.path.normpath(fpath)
    if fpath.startswith(normtag_directory):
        return fpath
    else:
        return None


@return_error_on_exception
def get_brilcalc_lumi(args={}):
    '''
    input:
      args: {
          begin: str '^\d\d/\d\d/\d\d \d\d:\d\d:\d\d$|^\d{6}$|^\d{4}$'
          end: str '^\d\d/\d\d/\d\d \d\d:\d\d:\d\d$|^\d{6}$|^\d{4}$'
          unit: str
          beamstatus: str ('stable beams' | 'squeeze' | 'flat top' | 'adjust')
          normtag: str textbox or dropdown select
          datatag: str
          hltpath:  str //'^HLT_[\w\*\?\[\]\!]+$' reject wildcard patterns ??
          type:  str or None
          selectjson: jsonstr
          byls: boolean
          without_correction: boolean
          pileup: boolean
          minbiasxsec: float
      }
    output: {
        'status':'OK'|'ERROR',
        'data'?: {
            'fillnum': [],
            'runnum': [],
            'tssec': [],
            'delivered': [],
            'recorded':[],
            'lsnum':[],
            'hltpathid':[],
            'hltpathid2name':{id:name},
            'hltpathname2id':{name:id},
            'pileup': []
        },
        'message'?: str
    }

    '''

    cmd = get_total_lumi_command_template()
    cmd.extend(parse_time_range_args(args))
    byls = False
    if args.get('byls', False):
        cmd.append('--byls')
        byls = True
    if args.get('without_correction', False):
        cmd.append('--without-correction')

    unit = '/ub'
    if 'unit' in args and args['unit']:
        unit = args['unit']
    cmd.extend(['-u', unit])

    if 'type' in args and args['type']:
        cmd.extend(['--type', args['type']])

    if 'normtag' in args and args['normtag']:
        normtag = args['normtag']
        if normtag == '':
            return {'status': 'ERROR', 'message': 'Empty normtag'}
        normtag_file = make_normtag_filepath(normtag)
        if normtag_file is not None and os.path.isfile(normtag_file):
            normtag = normtag_file
        cmd.extend(['--normtag', normtag])

    if 'beamstatus' in args and args['beamstatus']:
        cmd.extend(['-b', args['beamstatus'].upper()])

    pileup = False
    if 'pileup' in args and args['pileup']:
        if not byls:
            raise ValueError('Pileup option must go with "byls"')
        pileup = True
        if 'minbiasxsec' in args:
            cmd.extend(['--minBiasXsec', str(args['minbiasxsec'])])

    hltpath = None
    if 'hltpath' in args and args['hltpath']:
        cmd.extend(['--hltpath', args['hltpath']])
        hltpath = args['hltpath']

    bvlogging.get_logger().debug(cmd)

    try:
        r = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        if e.returncode != 0:
            out = re.sub('File ".*?"', '<FILE>', e.output)
            return {'status': 'ERROR', 'message': out}

    result = {
        'status': 'OK',
        'data': parse_brilcalc_output(r, byls, pileup, hltpath)
    }
    return result


def parse_brilcalc_output(result, byls, pileup, hltpath):
    lines = [l for l in result.splitlines() if
             len(l) and not l.startswith('#')]

    if not len(lines):  # no data found
        raise ValueError('Empty result')

    reader = csv.reader(lines)
    fillnums = []
    runnums = []
    lsnums = []
    tssecs = []
    delivereds = []
    recordeds = []
    pileups = []
    hltpathids = []
    hltpathid2name = {}
    hltpathname2id = {}
    allpaths = []
    for row in reader:
        if row[0].find(':') == -1:
            # output is an error - first data field always n:m
            raise RuntimeError('/n'.join(lines))

        [runnum, fillnum] = [int(x) for x in row[0].split(':')]
        fillnums.append(fillnum)
        runnums.append(runnum)

        if byls:
            # special treat hltpathname field
            if hltpath:
                pathname = row[3]
                if pathname not in allpaths:
                    allpaths.append(pathname)
                hltpathid = allpaths.index(pathname)
                hltpathids.append(hltpathid)
                hltpathid2name[hltpathid] = pathname
                hltpathname2id[pathname] = hltpathid
                # colbase = 4
                del row[3]  # delete hltpath field
            else:
                # colbase = 5
                del row[3:5]  # delete beamstatus, E fields
        else:
            # colbase = 4
            del row[2:4]  # delete nls,ncms or ncms,hltpath for hlt

        if byls:
            lsnums.append(int(row[1].split(':')[0]))
            del row[1]
        tssecs.append(int(row[1]))
        delivereds.append(float(row[2]))
        recordeds.append(float(row[3]))
        if pileup:
            pileups.append(float(row[4]))

    return {
        'fillnum': fillnums,
        'runnum': runnums,
        'lsnum': lsnums,
        'tssec': tssecs,
        'delivered': delivereds,
        'recorded': recordeds,
        'hltpathid': hltpathids,
        'hltpathid2name': hltpathid2name,
        'hltpathname2id': hltpathname2id,
        'pileup': pileups
    }


def get_total_lumi_command_template():
    if (
            hasattr(bvconfig, 'brilcommandhandler') and
            'command' in bvconfig.brilcommandhandler and
            bvconfig.brilcommandhandler['command']
    ):
        cmd = bvconfig.brilcommandhandler['command']
    else:
        cmd = 'brilcalc'
    return [
        cmd, 'lumi', '--output-style', 'csv', '--without-checkjson', '--tssec'
    ]


def parse_time_range_args(args):
    if 'selectjson' in args:
        return ['-i', args['selectjson']]
    elif 'begin' in args and 'end' in args:
        return ['--begin', str(args['begin']), '--end', str(args['end'])]
    else:
        raise KeyError(
            'Cannot parse time range. Missing "begin", "end" or "selectjson"')


def get_brilcalc_bxlumi(brilcalcargs, unit='/ub', cmmd=[]):
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


if __name__ == '__main__':
    print('normtag files', get_normtag_filenames())
