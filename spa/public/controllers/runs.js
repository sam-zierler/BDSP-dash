angular.module('app')
    .controller('runs', function($http, $location, $scope){
        var self = this;
        var rows;
        $http.get("/runs")
            .success(function(data) {
                rows = data["rows"];
                barGraph("visDiv",rows);
        })
        function barGraph(elem, rows) {
            barGraphInit(elem, rows);
        }
    })