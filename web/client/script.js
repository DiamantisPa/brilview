var app = angular.module('app', []);

app.controller("TestController", function($http, $timeout) {
    var me = this;
    this.run_from = 0;
    this.run_to = 0;

    var chart = null;
    var options = {
        chart: {
            renderTo: "chart1"
        },
        series: [{
            name: 'series1',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5]
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
                chart.series[0].setData(response.data);
            }, function(response) {
                console.error(response);
            });
    };

});
