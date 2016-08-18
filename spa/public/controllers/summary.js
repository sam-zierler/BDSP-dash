angular.module('app')
    .controller('summaryController', function($http, $location, $scope, ftToArr) {
        var self = this;
        $http.get("/runs")
            .success(function(data) {
                self.rows = ftToArr.convert(data);
                self.dailyAverages = calcDailyAverages();
        });
        var weekStart = moment().startOf('week').format("YYYY-MM-DD hh:mm:ss");
        var weekNow = moment().format("YYYY-MM-DD hh:mm:ss");
        $scope.gmQuery = {
            select: "col4",
            from: "1k9_64K9pd2eB5JiphqOD26JJpglwvy8uG4OaBSkC",
            where: "col1 >= \'" + weekStart + "\' and col1 <= \'" + weekNow + "\'"
        };  
        var calcDailyAverages = function() {
            var average = {};
            var avgArray = [];
            var numOfTerms = {};
            self.rows.forEach(function(d) {
                if(typeof average[d.start.substring(0,10)] !== "undefined") {
                    average[d.start.substring(0,10)] += parseInt(d.tons);
                    numOfTerms[d.start.substring(0,10)]++;
                }
                else {
                    average[d.start.substring(0,10)] = parseInt(d.tons);
                    numOfTerms[d.start.substring(0,10)] = 1;
                }
            });
            for(var key in average) {
                average[key] = (average[key] / numOfTerms[key]);
                avgArray.push( { date: key, value: average[key] });
            }
            return avgArray;
        }
    })