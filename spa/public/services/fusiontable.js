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
    .service('getFusionTable', function($q, $http, ftToArr) {
        this.empl_table = [];
        this.runs_table = [];
        var self = this;
        this.forceRefresh = function() {
            $http.get("/runs")
                .success(function(data) {
                    self.runs_table = ftToArr.convert(data);
                });
            $http.get("/employees")
                .success(function(data) {
                    self.empl_table = ftToArr.convert(data);
                });
        }
        this.forceRefresh();
        
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