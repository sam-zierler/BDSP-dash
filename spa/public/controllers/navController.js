angular.module('app')
    .controller('navController', function($scope, $http, getFusionTable) {
        var self = this;
        var changeTable = function(tableId) {
            $http.get('/runs/change/' + tableId)
                .success(function(data) {
                    console.log('SUCCESS');
                    getFusionTable.forceRefresh();
                });
        };
        $scope.changeTable = self.changeTable;
    });