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
        $scope.gmQuery = {
            select: "col4",
            from: "1k9_64K9pd2eB5JiphqOD26JJpglwvy8uG4OaBSkC",
            where: "col1 >= \'2016-07-01 00:00:00\' and col1 <= \'2016-07-30 00:00:00\'"
        };
    })