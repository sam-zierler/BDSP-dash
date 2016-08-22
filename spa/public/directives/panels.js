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
        replace: false,
        controller: function($scope) {
            var value = $scope.value;
            var title = $scope.title;
            var maxValue = $scope.maxValue;
            var minValue = $scope.minValue;
        },
        scope: {
            value: '=',
            title: '@',
            maxValue: '@',
            minValue: '@'
        },

        link: function(scope, element, attrs) {
            if (!attrs.maxValue) {
                attrs.maxValue = 100;
            }
            if (!attrs.minValue) {
                attrs.minValue = 0;
            }
            scope.$watch('value', function(newValue, oldValue) {
                scope.value = newValue;
                scope.title = attrs.title;
                scope.minValue = attrs.minValue;
                scope.maxValue = attrs.maxValue;
                element[0].innerHTML = "";
                var g = new JustGage({
                    parentNode: element[0],
                    value: scope.value,
                    min: attrs.minValue,
                    max: attrs.maxValue,
                    levelColors: ["#FF0000", "#FFFF00", "#00FF00"],
                    title: scope.title
                });
            })
        }
    }
});