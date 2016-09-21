angular.module('app')
    .controller('assignController', function($http, $scope, $q, getFusionTable) {
        var self = this;
        $scope.itemArray = [];
        $scope.showAssignedValue = true;
        var promise = getFusionTable.emplTable();
        promise.then(function(result) {
                self.empl = result;
                self.empl.forEach(function(d) {
                    $scope.itemArray.push({
                        id: d.ID,
                        name: d.FirstName + ' ' + d.LastName,
                        rate: d.Rate
                    });
                });
            },
            function(result) {
                self.empl = undefined;
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
        $scope.saveAssignment = function(empl, run) {
            var row = {
                emplId: empl.id,
                runId: run.truckID + run.start,
                name: empl.name,
                rate: Number(empl.rate).toFixed(2)
            };
            $http.post('/assignments', row)
                .success(function(data) {
                    console.log('SAVED');
                    run.isAssigned = true;
                });
        };
        $scope.deleteAssignment = function(empl, run) {
            var row = {
                emplId: empl,
                runId: run.truckID + run.start
            };
            $http.post('/assignments/delete', row)
                .success(function(data) {
                    console.log('Deleted');
                });
        };
        function getAssignments(runId) {
            return $q(function(resolve, reject) {
                $http.get('/assignments/' + runId)
                    .success(function(data) {
                        resolve(data);

                    })
                    .error(function(data) {
                        reject('NOPE');
                    });
            });
        }
    });