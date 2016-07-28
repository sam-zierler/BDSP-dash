angular.module('deisingj1.directives', [])
    .directive('barGraph', function () {
        return {
            restrict: 'EA',        
            controller: function(panel, $scope){
                $scope.vm = panel;
            },
            templateUrl: 'directives/panel.html'
        }
    })
    .factory('d3Service', function() {
        var d3;
        d3 = 3;
        window.alert("HELLO"); 
        return d3;
    });