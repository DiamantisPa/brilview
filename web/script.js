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
        byls: true
    };
    this.chart_width = 1200;
    this.status = "";
    this.message = "";

    this.reflow = reflow;
    this.update_chart = update_chart;

    this.chart_width_options = {
        "400px": 400,
        "600px": 600,
        "900px": 900,
        "1200px": 1200,
        "1500px": 1500,
        "1800px": 1800,
        "2100px": 2100
    };

    this.beamstatus_options = {
        "ANY": null,
        "STABLE BEAMS": "STABLE BEAMS",
        "ADJUST": "ADJUST",
        "SQUEEZE": "SQUEEZE",
        "FLAT TOP": "FLAT TOP"
    };
    this.unit_options = ["hz/ub", "/ub", "/mb"];
    this.type_options = {
        "Online": null,
        "PLTZERO": "pltzero",
        "BCM1F": "bcm1f",
        "HFOC": "hfoc",
        "PCC": "pxl"
    };



    var chartData = [{
        x: [1, 2, 3, 4],
        y: [16, 5, 11, 9],
        mode: "lines"
    }, {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        mode: "lines"
    }];
    var chartLayout = {
        width: me.chart_width,
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
        // chart = new Highcharts.Chart(options);
    });

    function reflow() {
        $timeout(function() {
            Plotly.relayout('chart1', {width: me.chart_width, height: 600});
        });
    }

    function update_chart() {
        var body = me.query;
        console.log(body);

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
                    chartData[0].x = x;
                    chartData[0].y = data["delivered"];
                    chartData[1].x = x;
                    chartData[1].y = data["recorded"];
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
