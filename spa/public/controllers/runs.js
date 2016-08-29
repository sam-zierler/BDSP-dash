angular.module('app')
    .controller('runsController', function($scope, ftToArr, getFusionTable, calcSums) {
        var self = this;
        $scope.search = {};
        var promise = getFusionTable.runsTable();
        promise.then(function(result) {
                self.rows = result;
                $scope.rows = self.rows;
                for(var i = 0; i < self.rows.length; i++) {
                    if(self.rows[i].start) {
                       $scope.search.start = self.rows[i].start.substring(0, 10);
                       break;
                    }
                }
                for(var i = self.rows.length - 1; i >= 0; i--) {
                  if(self.rows[i].start) {
                      $scope.search.end = self.rows[i].start.substring(0, 10);
                      break;
                  }
                }
            },
            function(result) {
                self.rows = undefined;
            }
        );
        $scope.calcSums = calcSums;

    })