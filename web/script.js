var app = angular.module('app', []);

app.controller("TestController", function($http, $timeout) {
    var me = this;
    this.time_from = null;
    this.time_to = null;
    this.time_unit = "RUN";
    this.lumi_type = null;
    this.normtag = null;
    this.byls = true;
    this.beam_status = null;
    this.status = "";
    this.message = "";

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

    this.update_chart = function() {
        var body = {
            "type": "timelumi",
            "from": me.time_from,
            "to": me.time_to,
            "time_unit": me.time_unit};
        console.log(body);

        $http.post("/api/query", body)
            .then(function(response) {
                var i, x, y1, y2, data;
                console.log(response);
                me.status = response.data.status;
                if (me.status === "OK") {
                    me.message = "";
                    data = response.data.data;
                    x = [];
                    y1 = [];
                    y2 = [];
                    for (i = 0; i < data.length; i++) {
                        x.push(data[i][3] * 1000);
                        y1.push(data[i][6]);
                        y2.push(data[i][7]);
                    }
                    chartData[0].x = x;
                    chartData[0].y = y1;
                    chartData[1].x = x;
                    chartData[1].y = y2;
                    Plotly.redraw('chart1');
                } else {
                    me.message = response.data.data;
                }
            }, function(response) {
                me.status = "HTTP failed";
                me.message = response.data;
                console.error(response);
            });
    };

});
