angular.module('app')
    .controller('navController', function($scope, $http, fusionTables) {
        var self = this;
        var changeTable = function(tableId) {
            $http.get('/runs/change/' + tableId)
                .success(function(data) {
                    console.log('SUCCESS');
                    fusionTables.forceRefresh();
                });
        };
        $scope.changeTable = self.changeTable;
    });