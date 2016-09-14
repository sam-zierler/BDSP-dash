angular.module('app')
    .controller('summaryController', function($scope, ftToArr, calcAverages, getFusionTable, calcSums) {
        var self = this;
        var promise = getFusionTable.runsTable();
        promise.then(function(result) {
                self.rows = result;
                self.dailyAverages = calcAverages.dailyAverages(self.rows);
                self.weeklyAvgs = calcAverages.weeklyAverages(self.rows);
                $scope.lifeTimeAverage = calcAverages.lifeTimeAverage(self.rows);
                $scope.totalForWeek = calcSums.lifetime(self.rows);                
                $scope.ftService = getFusionTable;
            },
            function(result) {
                self.rows = undefined;
            }
        );
        $scope.weekAvg = function() {
            if (typeof self.weeklyAvgs !== 'undefined') {
                return self.weeklyAvgs[self.weeklyAvgs.length - 1].value;
            }
            else {
                return 0;
            }
        };
        var weekStart = moment().startOf('week').format('YYYY-MM-DD hh:mm:ss');
        var weekNow = moment().format('YYYY-MM-DD hh:mm:ss');
        
        //For testing porpoises
        weekStart = '2016-07-01 00:00:00';
        weekNow = '2016-09-01 00:00:00';
        
        $scope.gmQuery = {
            select: 'col4',
            from: '1k9_64K9pd2eB5JiphqOD26JJpglwvy8uG4OaBSkC',
            where: 'col1 >= \'' + weekStart + '\' and col1 <= \'' + weekNow + '\''
        };
    });