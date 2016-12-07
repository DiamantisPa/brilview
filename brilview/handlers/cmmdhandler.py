import subprocess


def brilcalcLumiHandler(brilcalcargs, cmmd=[]):
    '''
    brilcalcargs: arguments for brilcalc lumi
    cmmd : for passing brilcalc command in case you don't run standard brilcalc
    '''
    print 
    if not brilcalcargs:
        print 'about to return empty'
        return []
    args = []
    if cmmd:
        args = cmmd
    else:
        args = ['brilcalc']
    args += ['lumi'] + brilcalcargs
    args += ['--byls', '--output-style', 'csv', '--without-checkjson']
    result = subprocess.check_output(args, stderr=subprocess.STDOUT)
    result = [l for l in result.split('\n')
              if len(l) > 0 and not l.startswith('#')]
    return [float(l.split(',')[5]) for l in result]


if __name__ == '__main__':
    # print brilcalcLumiHandler(
    #     ['-r', '284077'], cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
    print brilcalcLumiHandler(
        ['-r', '284077'],
        cmmd=['/afs/cern.ch/cms/lumi/brilconda-1.1.7/bin/python',
              '/home/data/brilws/brilcalc-run.py'])
