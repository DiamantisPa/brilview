var app = angular.module('app', []);

app.controller("TestController", function($http, $timeout) {
    var me = this;

    this.query = {
        query_type: "timelumi",
        begin: null,
        end: null,
        timeunit: "RUN",
        unit: "hz/ub",
        beamstatus: null,
        normtag: null,
        datatag: null,
        hltpath: null,
        type: null,
        // selectjson: "",
        byls: true,
        measurement: "Delivered & Recorded"
    };
    this.chart_width = 1200;
    this.status = "";
    this.message = "";

    this.reflow = reflow;
    this.update_chart = update_chart;
    this.chart_clear = chart_clear;
    this.chart_pop_series = chart_pop_series;
    this.autofill_query_end = autofill_query_end;

    this.chart_width_options = {
        "400px": 400, "600px": 600, "900px": 900, "1200px": 1200,
        "1500px": 1500, "1800px": 1800, "2100px": 2100
    };

    this.beamstatus_options = {
        "ANY": null, "STABLE BEAMS": "STABLE BEAMS", "ADJUST": "ADJUST",
        "SQUEEZE": "SQUEEZE", "FLAT TOP": "FLAT TOP"
    };

    this.unit_options = ["hz/ub", "/ub", "/mb"];
    this.type_options = {
        "Online": null, "PLTZERO": "pltzero", "BCM1F": "bcm1f", "HFOC": "hfoc",
        "PCC": "pxl", "DT": "dt", "Mixed": null
    };

    var chartData = [];
    var chartLayout = {
        legend: {
            orientation: "h"
        },
        width: me.chart_width,
        height: 600,
        xaxis: {
            type: "date"
        }
    };
    var chartConfig = {
        displaylogo: false,
        showTips: false,
        modeBarButtonsToRemove: ["sendDataToCloud", "lasso2d"]
    };


    $timeout(function() {
        Plotly.newPlot('chart1', chartData, chartLayout, chartConfig);
    });

    function reflow() {
        $timeout(function() {
            Plotly.relayout('chart1', {width: me.chart_width, height: 600});
        });
    }

    function chart_clear() {
        while(chartData.length > 0) {
            chartData.pop();
        }
        Plotly.redraw('chart1');
    }

    function chart_pop_series() {
        chartData.pop();
        Plotly.redraw('chart1');
    }

    function autofill_query_end() {
        if (me.query.end === null || me.query.end === "") {
            me.query.end = me.query.begin;
        }
    }

    function update_chart() {
        var body = me.query;
        console.log(body);
        var name = body.type + " " + body.normtag + " " + body.beamstatus;
        name += " " + body.hltpath + " " + body.datatag + " (" + body.unit + ")";
        var series = [];
        if (body.measurement === "Delivered & Recorded" || body.measurement === "Delivered") {
            series.push({
                yfield: "delivered",
                name: "Delivered " + name
            });
        }
        if (body.measurement === "Delivered & Recorded" || body.measurement === "Recorded") {
            series.push({
                yfield: "recorded",
                name: "Recorded " + name
            });
        }

        $http.post("/api/query", body)
            .then(function(response) {
                var i, x, y1, y2, data;
                console.log(response);
                me.status = response.data.status;
                me.message = response.data.message;
                if (me.status === "OK") {
                    me.message = "";
                    data = response.data.data;
                    x = [];
                    for (i = 0; i < data["tssec"].length; i++) {
                        x.push(data["tssec"][i] * 1000);
                    }
                    for (i = 0; i < series.length; i++) {
                        chartData.push({
                            x: x,
                            y: data[series[i].yfield],
                            name: series[i].name,
                            mode: "lines"
                        });
                    }
                    console.log(chartData);
                    Plotly.redraw('chart1');
                }
            }, function(response) {
                me.status = "HTTP failed";
                me.message = response.data;
                console.error(response);
            });
    };

});
