angular.module('app')
    .controller('assignController', function($http, $location, $scope) {
        var self = this;
        $http.get("/employees")
            .success(function(data) {
                self.rows = data;
                console.log(self.rows);
                self.rows.rows.forEach(function(d) {
                    $scope.itemArray.push({
                        id: d[3],
                        name: d[0] + " " + d[1]
                    });
                });
                console.log($scope.itemArray);
            })
        $http.get("/runs")
            .success(function(data) {
                self.runs = data;
            });
        var i = 0;
        $scope.itemArray = [];

        /*
        $scope.selected = { id : 0, name : "Jess2e" };
           $scope.itemArray = [
        {id: 1, name: 'first'},
        {id: 2, name: 'second'},
        {id: 3, name: 'third'},
        {id: 4, name: 'fourth'},
        {id: 5, name: 'fifth'},
    ];*/

        $scope.selectedItems = [];

    })