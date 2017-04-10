Luminosity inspector
====================

Brilview application has a total luminosity inspector component (further: total
lumi) for plotting total luminosity values. This component is currently the
default view you see when you visit Brilview application.

Total lumi is meant for querying total luminosity from brilcalc and visualising
it in 3 types of charts:

* Luminosity values - :ref:`lumi-values`
* Cumulative luminosity - :ref:`cumulative`
* Luminosity ratios - :ref:`ratios`

Charts can be shown/hidden by toggling the switches at the bottom of the page
(see image bellow).

.. image:: _static/img/totlumi/toggles.png

Querying
--------

Data queries are performed using Query panel at the top of the page.

.. image:: _static/img/totlumi/query.png

Fill in fields in "Time range" and "Options" sections, and hit "QUERY" button.
Next to the button there is a status indicator which also shows error messages
in case of failed queries. After successful query, new data is stored in memory
(see :ref:`memory`).

.. _memory:

Memory
------

Memory is an in-browser cache for queried data. It holds up to 10 query results
(dropping the oldest ones when full). Chart containers access this memory to
pick data for plotting. To inspect current memory switch to "Memory" tab at the
top of the page (see image bellow).

.. image:: _static/img/totlumi/memory.png

From this "Memory" tab you have ability to:

* remove results from memory

  * all at a time with "REMOVE ALL" button
  * or one by one with "remove" button next to each result

* download CSV file for each result by clicking "csv" button next to it

.. _lumi-values:

Luminosity values chart
-----------------------

This chart displays plain queried data values. In contrast to other charts, this
one is automatically populated (if possible) with recorded luminosity data after
successful query. You can also add series manually from memory using form at the
bottom of chart container.

.. image:: _static/img/totlumi/plain.png

.. _cumulative:

Cumulative luminosity chart
---------------------------

This chart works almost the same as plain luminosity chart (see
:ref:`lumi-values`) and the only difference is that it recalculates values to
add up with time for each series. Use form at the bottom of chart container to
add series.

.. _ratios:

Luminosity ratios chart
-----------------------

This chart is for plotting ratios between two series of data. Using form at the
bottom of chart container choose two data series from memory to make ratio and
click "ADD RATIO" button. When adding series, timestamps of data points might be
slightly modified to align lumisections.


Common chart controls
---------------------

For all charts in this total lumi component there are few common controls. The
common controls are placed immediately bellow each chart (see image bellow).

.. image:: _static/img/totlumi/common.png

Controls:

* **Chart height**: chart height in pixels
* **Chart type**: how chart is drawn - lines, bars, dots, etc.
* **Log Y axis**: should Y axis be of logarithmic or linear scale
* **FILL separators**: put vertical lines on FILL number change
* **RUN separators**: put vertical lines on RUN number change
* **CLEAR CHART**: remove all series from chart
* **POP SERIES**: remove single last series from chart
