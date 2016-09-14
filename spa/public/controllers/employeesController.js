angular.module('app')
    .controller('employeesController', function($scope, getFusionTable) {
        var self = this;
        var promise = getFusionTable.emplTable();
        promise.then(function(result) { self.rows = result; }, 
            function(result) { self.rows = undefined; } 
        );
        
    });