angular.module('app')
    .controller('summaryController', function($scope, ftToArr, calcAverages, getFusionTable) {
        var self = this;
        var promise = getFusionTable.runsTable();
        promise.then(function(result) {
                self.rows = result;
                self.dailyAverages = calcAverages.dailyAverages(self.rows);
                self.weeklyAvgs = calcAverages.weeklyAverages(self.rows);
            },
            function(result) {
                self.rows = undefined
            }
        );
        $scope.weekAvg = function() {
                if(typeof self.weeklyAvgs !== 'undefined') {
                    return self.weeklyAvgs[self.weeklyAvgs.length - 1].value;
                }
                else return 0;
            };
        var weekStart = moment().startOf('week').format("YYYY-MM-DD hh:mm:ss");
        var weekNow = moment().format("YYYY-MM-DD hh:mm:ss");
        $scope.gmQuery = {
            select: "col4",
            from: "1k9_64K9pd2eB5JiphqOD26JJpglwvy8uG4OaBSkC",
            where: "col1 >= \'" + weekStart + "\' and col1 <= \'" + weekNow + "\'"
        };
    })