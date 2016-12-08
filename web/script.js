var app = angular.module('app', []);

app.controller("TestController", function($http, $timeout) {
    var me = this;
    this.run_from = 0;
    this.run_to = 0;
    this.status = "";
    this.message = "";

    var chart = null;
    var options = {
        chart: {
            renderTo: "chart1"
        },
        xAxis: {
            type: "datetime"
        },
        series: [{
            name: 'field 5',
            data: [7.0, 6.9, 9.5]
        }, {
            name: 'field 6',
            data: [14.5, 18.2, 21.5]
        }]
    };

    $timeout(function() {
        chart = new Highcharts.Chart(options);
    });

    this.update_chart = function() {
        var body = {
            "from": me.run_from,
            "to": me.run_to};
        console.log(body);
        $http.post("/api/query", body)
            .then(function(response) {
                var chartData, data, i;
                console.log(response);
                me.status = response.data.status;
                if (me.status === "OK") {
                    me.message = "";
                    data = response.data.data;
                    chartData = [];
                    for (i = 0; i < data.length; i++) {
                        chartData.push([data[i][3], data[i][5]]);
                    }
                    console.log(data);
                    console.log(chartData);
                    chart.series[0].setData(chartData);
                    chartData = [];
                    for (i = 0; i < data.length; i++) {
                        chartData.push([data[i][3], data[i][6]]);
                    }
                    console.log(chartData);
                    chart.series[1].setData(chartData);
                } else {
                    me.message = response.data.data;
                }
            }, function(response) {
                me.status = "HTTP failed";
                console.error(response);
            });
    };

});
