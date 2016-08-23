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
        //self.unassignedQuantity = 0;

        self.getUnassignedQuantity = function() {
            return self.unassignedQuantity;
        }

        function getAssignments(run_id) {
            return $q(function(resolve, reject) {
                $http.get("/assignments/" + run_id)
                    .success(function(data) {
                        resolve(data);

                    })
                    .error(function(data) {
                        reject("NOPE");
                    })
            })
        }
        this.runsTable = function() {
            if (typeof self.runs_promise === 'undefined') {
                self.runs_promise = $q(function(resolve, reject) {
                    $http.get("/runs")
                        .success(function(data) {
                            self.runs_table = ftToArr.convert(data);
                            var localUnassignedQuantity = 0;
                            self.runs_table.forEach(function(d) {
                                var rID = "" + d.truckID + d.start;
                                var result;
                                var promise = getAssignments(rID);
                                promise.then(
                                    function(res) {
                                        res.forEach(function(d) {
                                            d.id = d.empl_id;
                                        })
                                        var result = res;
                                        d.assigned = result;
                                        if (d.assigned.length == 0) {
                                            d.isAssigned = false;
                                            localUnassignedQuantity++;
                                            self.unassignedQuantity = localUnassignedQuantity;
                                        }
                                        else {
                                            d.isAssigned = true;
                                        }
                                    },
                                    function(fail) {
                                        console.log("FAIL");
                                    });
                            });
                            console.log("Had to get table runs");
                            resolve(self.runs_table);
                        });
                });
            }
            return self.runs_promise;
        }

        this.emplTable = function() {
            if (typeof self.empl_promise === 'undefined') {
                self.empl_promise = $q(function(resolve, reject) {
                    $http.get("/employees")
                        .success(function(data) {
                            self.empl_table = ftToArr.convert(data);
                            console.log("Had to get table empl");
                            resolve(self.empl_table);
                        });
                });
            }
            return self.empl_promise;
        }
        
        this.forceRefresh = function() {
            this.runsTable().then(function(data) {
                this.runs_table = data;
            });
            this.emplTable().then(function(data) {
                this.empl_table = data;
            });
        }

        this.forceRefresh();
    });