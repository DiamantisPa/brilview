#!/usr/bin/env python
import sys
import os
import re

from distutils.core import setup
from setuptools import setup
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
    packages = ['brilview', 'brilview.cli','brilview.handlers','web'],
    entry_points = {
        "console_scripts" : ['brilview = brilview.cli.brilview_main:brilview_main']
        },
    package_data = {'data':['brilview/data/*.yaml'],},
    include_package_data = True,
)

