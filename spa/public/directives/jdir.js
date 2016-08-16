angular.module('deisingj1.directives', []).directive('barGraph', function() {
        return {
            restrict: 'EA',
            controller: function(panel, $scope) {
                $scope.vm = panel;
            },
            templateUrl: 'directives/panel.html'
        }
    }

).directive('adminPanel', function() {
        return {
            controller: function($scope) {
                $scope.header = "Heythere";
            },
            templateUrl: 'directives/admin-panel.html'
        }
    }

).directive('barsChart', function($parse) {
    var data;
    return {
        restrict: 'E',
        replace: false,
        controller: function($scope) {
            data = $scope.data;
        },
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('data', function(newValue, oldValue) {
                data = newValue;
                element[0].setAttribute("style", "display:inline-block;width:100%; height: 100%;");
                //converting all data passed thru into an array
                if(typeof data !== 'undefined') {
                    chartInit(element[0], data);
                }
            });
        }
    }
});