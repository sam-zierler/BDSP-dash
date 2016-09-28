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
        };
    })
    .service('fusionTables', function($q, $http, ftToArr) {
        this.emplTable = [];
        this.runsTable = [];
        var self = this;

        self.getUnassignedQuantity = function() {
            return self.unassignedQuantity;
        };

        this.getAssignments = function(run_id) {
            return $q(function(resolve, reject) {
                $http.get("/assignments/" + run_id)
                    .success(function(data) {
                        resolve(data);
                    })
                    .error(function(data) {
                        reject("NOPE");
                    });
            });
        };
        this.getRunsTable = function() {
            if (typeof self.runs_promise === 'undefined') {
                self.runs_promise = $q(function(resolve, reject) {
                    $http.get("/runs")
                        .success(function(data) {
                            self.runsTable = ftToArr.convert(data);
                            var localUnassignedQuantity = 0;
                            self.runsTable.forEach(function(d) {
                                d.duration = (moment(d.end).valueOf() - moment(d.start).valueOf()) / 1000;
                                var hr = parseInt(d.duration / 3600) + "";
                                var min = Math.ceil((d.duration % 3600) / 60) + "";
                                if (hr.length < 2) {
                                    hr = "0" + hr;
                                }
                                if (min.length < 2) {
                                    min = "0" + min;
                                }
                                d.duration_string = hr + ":" + min;
                                var rID = "" + d.truckID + d.start;
                                var promise = self.getAssignments(rID);
                                promise.then(
                                    function(res) {
                                        if (Array.isArray(res)) {
                                            res.forEach(function(d) {
                                                d.id = d.empl_id;
                                            });
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
                                        }
                                        else {
                                            throw(new Error('object received is not an array'));
                                        }
                                    },
                                    function(fail) {
                                        console.log("FAIL");
                                    }
                                );
                            });
                            resolve(self.runsTable);
                        });
                });
            }
            return self.runs_promise;
        };

        this.getEmplTable = function() {
            if (typeof self.empl_promise === 'undefined') {
                self.empl_promise = $q(function(resolve, reject) {
                    $http.get("/employees")
                        .success(function(data) {
                            self.emplTable = ftToArr.convert(data);
                            resolve(self.emplTable);
                        });
                });
            }
            return self.empl_promise;
        };
        
        this.forceRefresh = function() {
            this.runs_promise = undefined;
            this.empl_promise = undefined;
            this.getRunsTable().then(function(data) {
                this.runsTable = data;
            });
            this.getEmplTable().then(function(data) {
                this.emplTable = data;
            });
        };
        this.forceRefresh();
    });