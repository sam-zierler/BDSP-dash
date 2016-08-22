angular.module('app')
    .controller('runsController', function($scope, ftToArr, getFusionTable) {
        var self = this;
        $scope.search = {};
        var promise = getFusionTable.runsTable();
        promise.then(function(result) {
                self.rows = result;
                $scope.rows = self.rows;
                $scope.search.start = self.rows[0].start.substring(0, 10);
                $scope.search.end = self.rows[self.rows.length - 1].start.substring(0, 10);
            },
            function(result) {
                self.rows = undefined
            }
        );
    })