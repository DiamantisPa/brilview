import os
import sys
import subprocess

def brilcalcLumiHandler(brilcalcargs,cmmd=None):
    '''
    brilcalcargs: arguments for brilcalc lumi 
    cmmd : for passing brilcalc command in case you don't run standard brilcalc
    '''
    if not brilcalcargs:
        print 'about to return empty'
        return ''
    args = []
    if cmmd:
        args.append(cmmd)
    else:
        args.append('brilcalc')
    args = args+['lumi']+brilcalcargs+['--output-style','csv','--without-checkjson']
    result = subprocess.check_output(args,stderr=subprocess.STDOUT)
    return '\n'.join([i for i in result.split('\n') if  len(i) > 0])
if __name__=='__main__':
    print brilcalcLumiHandler(['-r','284077'],cmmd='/home/zhen/work/brilws/brilcalc-run.py')
        
