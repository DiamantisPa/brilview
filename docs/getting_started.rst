Getting started
===============

You have two options for using Brilview:

* :ref:`central-brilview` - visit centrally deployed Brilview at
  https://brilview.web.cern.ch
* :ref:`private-brilview` - run Brilview locally

.. _central-brilview:

Central Brilview
----------------

We have central Brilview hosted by CERN web services at https://brilview.web.cern.ch


.. _private-brilview:

Private Brilview
----------------

Private Brilview means running backend (running brilcalc, doing aggregations,
etc.) on your own machine.

Prerequisite
^^^^^^^^^^^^

Before installing and/or running Brilview, you first need:

* brilconda ``bin`` directory in the beginning of your ``$PATH`` variable, so
  that ``pip`` and ``python`` would be picked from brilconda installation. For
  this step you will probably need to install brilconda and modify ``$PATH``
  variable - read how to do it:
  https://cms-service-lumi.web.cern.ch/cms-service-lumi/brilwsdoc.html#brilcondainstallation
  and
  https://cms-service-lumi.web.cern.ch/cms-service-lumi/brilwsdoc.html#prerequisite
* installed and working brilcalc - read how to do it:
  https://cms-service-lumi.web.cern.ch/cms-service-lumi/brilwsdoc.html#installation


Install
^^^^^^^

Install ``brilview`` using brilconda ``pip``::

  pip install brilview

Run
^^^

Run brilview::

  brilview

Default browser should open Brilview client app on ``localhost:8008`` (visit
manually if not opened).
