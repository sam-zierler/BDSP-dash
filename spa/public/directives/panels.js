angular.module('panels.directives', []).directive('sPanel', function() {
    return {
        transclude: true,
        controller: function($scope) {
            header = $scope.header;
        },
        scope: {
            header: '@'
        },
        link: function(scope, element, attrs) {
            scope.header = attrs.header;
        },
        templateUrl: 'directives/templates/panel.html'
    }
}).directive('gauge', function() {
    return {
        controller: function($scope) {
            var value = $scope.value;
            var title = $scope.title;
        },
        scope: {
            value: '@',
            title: '@'
        },
        link: function(scope, element, attrs) {
            scope.value = attrs.value;
            scope.title = attrs.title;
            var g = new JustGage({
                parentNode: element[0],
                value: scope.value,
                min: 0,
                max: 100,
                levelColors: ["#FF0000", "#FFFF00", "#00FF00"],
                title: scope.title
            });
        }
    }
});