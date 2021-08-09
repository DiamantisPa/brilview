Develop
=======

See https://github.com/cms-bril/brilview

Server
------

See ``README.md``

Client
------

See ``brilview/web/README.md``

Install
-------

From source::

  python setup.py install

Distribute
----------

Build source distribution and upload to `pypi <https://pypi.python.org/pypi>`_ index::

  python setup.py build_static
  python setup.py sdist
  python setup.py sdist upload -r https://pypi.python.org/pypi
