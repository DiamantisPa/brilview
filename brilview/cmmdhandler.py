import os
import sys
import subprocess

def brilcalcLumiHandler(brilcalcargs,cmmd=[]):
    '''
    brilcalcargs: arguments for brilcalc lumi 
    cmmd : for passing brilcalc command in case you don't run standard brilcalc
    '''
    print cmmd
    if not brilcalcargs:
        print 'about to return empty'
        return ''
    args = []
    if cmmd:
        args = cmmd
    else:
        args = ['brilcalc']
    args = args+['lumi']+brilcalcargs+['--output-style','csv','--without-checkjson']
    result = subprocess.check_output(args,stderr=subprocess.STDOUT)
    return '\n'.join([i for i in result.split('\n') if  len(i) > 0])
if __name__=='__main__':
    print brilcalcLumiHandler(['-r','284077'],cmmd=['/home/zhen/work/brilws/brilcalc-run.py'])
    #print brilcalcLumiHandler(['-r','284077'],cmmd=['/afs/cern.ch/cms/lumi/brilconda-1.1.7/bin/python','/home/data/brilws/brilcalc-run.py'])
