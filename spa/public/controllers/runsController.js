angular.module('app')
    .controller('runsController', function($scope, ftToArr, fusionTables, calcSums) {
        var self = this;
        $scope.search = {};
        var promise = fusionTables.runsTable();
        promise.then(function(result) {
                self.rows = result;
                $scope.rows = self.rows;
                for(var i = 0; i < self.rows.length; i++) {
                    if(self.rows[i].start) {
                       $scope.search.start = self.rows[i].start.substring(0, 10);
                       break;
                    }
                }
                for(var j = self.rows.length - 1; j >= 0; j--) {
                  if(self.rows[j].start) {
                      $scope.search.end = self.rows[j].start.substring(0, 10);
                      break;
                  }
                }
            },
            function(result) {
                self.rows = undefined;
            }
        );
        $scope.calcSums = calcSums;
    });