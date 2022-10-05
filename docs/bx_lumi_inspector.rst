Per bunch luminosity inspector
==============================

This component is for plotting per bunch luminosity from brilcalc.

2 charts are available:

* Luminosity values - :ref:`lumi-values`
* Luminosity ratios - :ref:`ratios`

Charts can be shown/hidden by toggling the switches at the bottom of the page.


Querying
--------

Data queries are performed using Query panel at the top of the page.

Fill in fields in "Time" and "Options" sections, and hit "QUERY" button. After
successful query, new data is stored in memory (similar as :ref:`memory` in
:doc:`total_lumi_inspector`).

.. _lumi-values:

Luminosity values chart
-----------------------

This chart displays plain queried data values. In contrast to other charts, this
one is automatically populated (if possible) with delivered luminosity data after
successful query. You can also add series manually from memory using form in the
"Add series" tab at the bottom of chart container.


.. _ratios:

Luminosity ratios chart
-----------------------

This chart is for plotting ratios between two series of data. Using form at the
bottom of the chart container choose two data series from memory to make ratio
and click "ADD RATIO" button.
