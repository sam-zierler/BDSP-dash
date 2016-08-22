angular.module('app')
    .service('ftToArr', function() {
        this.convert = function(tbl) {
            var newArr = [];
            var columns = tbl.columns;
            tbl.rows.forEach(function(d) {
                var rowObj = {};
                for (var i = 0; i < d.length; i++) {
                    rowObj[columns[i]] = d[i];
                }
                newArr.push(rowObj);
            });
            return newArr;
        }
    })
    .service('calcAverages', function() {
        this.dailyAverages = function(tbl) {
            var average = {};
            var avgArray = [];
            var numOfTerms = {};
            tbl.forEach(function(d) {
                if (typeof average[d.start.substring(0, 10)] !== "undefined") {
                    average[d.start.substring(0, 10)] += parseInt(d.tons);
                    numOfTerms[d.start.substring(0, 10)]++;
                }
                else {
                    average[d.start.substring(0, 10)] = parseInt(d.tons);
                    numOfTerms[d.start.substring(0, 10)] = 1;
                }
            });
            for (var key in average) {
                average[key] = (average[key] / numOfTerms[key]);
                avgArray.push({
                    date: key,
                    value: average[key]
                });
            }
            return avgArray;
        }
        this.weeklyAverages = function(tbl) {
            var average = {};
            var avgArray = [];
            var numOfTerms = {};
            tbl.forEach(function(d) {
                var week = moment(d.start, "YYYY-MM-DD hh:mm:ss");
                var weekYearStr = week.week() + "-" + week.year();
                if (typeof average[weekYearStr] !== "undefined") {
                    average[weekYearStr] += parseInt(d.tons);
                    numOfTerms[weekYearStr]++;
                }
                else {
                    average[weekYearStr] = parseInt(d.tons);
                    numOfTerms[weekYearStr] = 1;
                }
            });
            for (var key in average) {
                average[key] = (average[key] / numOfTerms[key]);
                avgArray.push({
                    date: key,
                    value: average[key]
                });
            }
            return avgArray;
        }
    })
    .service('getFusionTable', function($q, $http, ftToArr) {
        this.empl_table = [];
        this.runs_table = [];
        var self = this;
        $http.get("/runs")
            .success(function(data) {
                self.runs_table = ftToArr.convert(data);
            });
        $http.get("/employees")
            .success(function(data) {
                self.empl_table = ftToArr.convert(data);
            });

        this.runsTable = function() {
            return $q(function(resolve, reject) {
                if (self.runs_table.length == 0) {
                    $http.get("/runs")
                        .success(function(data) {
                            self.runs_table = ftToArr.convert(data);
                            console.log("Had to get table runs");
                            resolve(self.runs_table);
                        });
                }
                else {
                    console.log("had table runs");
                    resolve(self.runs_table);
                }
            });
        }

        this.emplTable = function() {
            return $q(function(resolve, reject) {
                if (self.empl_table.length == 0) {
                    $http.get("/employees")
                        .success(function(data) {
                            self.empl_table = ftToArr.convert(data);
                            console.log("Had to get table empl");
                            resolve(self.empl_table);
                        });
                }
                else {
                    console.log("had table empl");
                    resolve(self.empl_table);
                }
            });
        }
    });