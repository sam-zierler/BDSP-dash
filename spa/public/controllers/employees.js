angular.module('app')
    .controller('employeesController', function($http, $location, $scope) {
        var self = this;
        $http.get("/employees")
            .success(function(data) {
                self.rows = data;
            });
        $http.get("/runs")
            .success(function(data) {
                self.runs = data;
            });
        $scope.chartData = "[{date: '2016-07-25',value: 17}, {date: '2016-07-26',value: 18}, {date: '2016-07-27',value: 19}, {date: '2016-07-28',value: 20}, {date: '2016-07-29',value: 18}]";

    });