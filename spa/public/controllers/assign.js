angular.module('app')
    .controller('assignController', function($http, $scope, $q, getFusionTable) {
        var self = this;
        $scope.itemArray = [];
        $scope.showAssignedValue = true
        var promise = getFusionTable.emplTable();
        promise.then(function(result) {
                self.empl = result;
                self.empl.forEach(function(d) {
                    $scope.itemArray.push({
                        id: d.ID,
                        name: d.FirstName + " " + d.LastName,
                        rate: d.Rate
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
                    $scope.runrows = self.runs;
                },
                function(result) {
                    self.runs = undefined;
                }
            );
        });
        $scope.saveAssignment = function(empl, index) {
            var row = {
                empl_id: empl.id,
                run_id: self.runs[index].truckID + self.runs[index].start,
                name: empl.name,
                rate: Number(empl.rate).toFixed(2)
            };
            $http.post("/assignments", row)
                .success(function(data) {
                    console.log("SAVED")
                    self.runs[index].assigned = true;
                });
        }
        $scope.deleteAssignment = function(empl, index) {
            var row = {
                empl_id: empl,
                run_id: self.runs[index].truckID + self.runs[index].start
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