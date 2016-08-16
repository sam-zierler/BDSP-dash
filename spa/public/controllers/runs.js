angular.module('app')
    .controller('runsController', function($http, $location, $scope, ftToArr) {
        var self = this;
        $scope.search = {};
        $http.get("/runs")
            .success(function(data) {
                self.rows = ftToArr.convert(data);
                $scope.rows = self.rows;
                $scope.search.start = self.rows[0].start.substring(0,10);
                $scope.search.end = self.rows[self.rows.length - 1].start.substring(0,10);
        });
    })