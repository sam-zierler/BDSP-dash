angular.module('app')
    .controller('runsController', function($http, $location, $scope) {
        var self = this;
        $http.get("/runs")
            .success(function(data) {
                self.rows = data;
        });

    })