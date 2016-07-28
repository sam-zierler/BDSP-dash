angular.module('app')
    .controller('runsController', function($http, $location, $scope, d3Service) {
        var self = this;
        var rows;
        $http.get("/runs")
            .success(function(data) {
                rows = data;
                //barGraph("visDiv",rows["rows"]);
        });
        $scope.deThree = function() {
            d3Service();
        }
    })