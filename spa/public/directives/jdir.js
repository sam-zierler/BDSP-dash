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
    .directive('adminPanel', function(){
        return {
            template : "HELLO"
        };
    })
    .factory('d3Service', ['$log', function() {
        var d3;
        d3 = 3;
        window.alert("HELLO"); 
        return d3;
    }]);