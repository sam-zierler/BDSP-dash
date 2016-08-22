angular.module('app')
    .controller('assignController', function($http, $scope, $q, getFusionTable) {
        var self = this;
        $scope.itemArray = [];
        var promise = getFusionTable.emplTable();
        promise.then(function(result) {
                self.empl = result;
                self.empl.forEach(function(d) {
                    $scope.itemArray.push({
                        id: d.ID,
                        name: d.FirstName + " " + d.LastName
                    });
                });
            },
            function(result) {
                self.empl = undefined
            }
        ).then(function() {
            var promise2 = getFusionTable.runsTable();
            promise2.then(
                function(data) {
                    self.runs = data;
                    data.forEach(function(d) {
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
                                }
                                else {
                                    d.isAssigned = true;
                                }
                            },
                            function(fail) {
                                console.log("FAIL");
                            });
                    });
                    $scope.runrows = self.runs;
                },
                function(result) {
                    self.runs = undefined;
                }
            );
        });
        $scope.saveAssignment = function(empl, run, name) {
            var row = {
                empl_id: empl,
                run_id: run,
                name
            };
            $http.post("/assignments", row)
                .success(function(data) {
                    console.log("SAVED")
                });
        }
        $scope.deleteAssignment = function(empl, run) {
            var row = {
                empl_id: empl,
                run_id: run
            };
            $http.post("/assignments/delete", row)
                .success(function(data) {
                    console.log("Deleted")
                });
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
    })