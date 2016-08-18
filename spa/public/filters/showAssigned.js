angular.module('app')
    .filter('showAssigned', function($filter) {
        return function(data, show) {
            var unassignedData = [];
            if(show || typeof data === "undefined") {
                return data;
            }
            else {
                data.forEach(function(d) {
                   if(!d.isAssigned) {
                       unassignedData.push(d);
                   } 
                });
                return unassignedData;
            }
        };
    });