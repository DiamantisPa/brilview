#!/usr/bin/env python
import sys
import os
import re
import subprocess

from distutils import log
from distutils.core import Command
from setuptools import setup
from setuptools.command.sdist import sdist as _sdist

class SdistWithBuildStatic(_sdist):
    '''
        Custom sdist, checks if build_static has run and web/dist directory exists
    '''
    def make_distribution(self):
        #self.run_command('build_static')
        thispath = os.path.dirname(os.path.realpath(__file__))
        distpath = os.path.join(thispath,'brilview','web','dist')
        if not os.path.isdir(distpath) or not os.path.exists(distpath):
	    raise RuntimeError( 'Prerequisite directory %s does not exist, run python setup.py build_static to create it\n'%distpath )
        return _sdist.make_distribution(self)

class BuildStatic(Command):
    user_options = []

    def initialize_options(self):
        """Abstract method that is required to be overwritten"""
        pass
    
    def finalize_options(self):
        """Abstract method that is required to be overwritten"""
        pass

    def run(self):
        log.info("running [npm install --unsafe-perm]")
        subprocess.check_output( ['npm', 'install','--unsafe-perm'], cwd='brilview/web' )

    
with open("README.md", "rb") as f:
    long_desc = f.read().decode('utf-8')
version = re.search(
                '^__version__\s*=\s*"(.*)"',
                open('brilview/_version.py').read(),
                re.M
                ).group(1)
print version

setup(
    name = "brilview",
    author = "Jonas Daugalas,Zhen Xie",
    url = "https://github.com/jonasdaugalas/brilview",
    download_url = 'https://github.com/jonasdaugalas/brilws/tarball/'+version,
    license = "MIT",
    version = version,
    description = "bril data viewer",
    long_description = long_desc,
    packages = ['brilview', 'brilview.cli','brilview.handlers'],
    entry_points = {
        "console_scripts" : ['brilview = brilview.cli.brilview_main:brilview_main']
        },
    package_data = {'data':['brilview/data/*.yaml'],'web':['brilview/web/dist/*']},
    include_package_data = True,
    cmdclass={
        'build_static': BuildStatic, #add a build_static command
        'sdist': SdistWithBuildStatic, #make sure build_static command is run as part of sdist.
    },
)


