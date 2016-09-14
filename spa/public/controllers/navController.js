angular.module('app')
    .controller('navController', function($scope, $http) {
        var changeRun = function() {
            $http.get('/runs/change/1JFf3z0WVkO0RJOfWNnPvUJ3KFwtHg42Rm-Y3z-LJ')
                .success(function(data) {
                    console.log('SUCCESS');
                });
        };
        $scope.changeRun = changeRun;
    });