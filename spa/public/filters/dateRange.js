angular.module('app')
    .filter('dateRange', function() {
        return function(input, min, max) {
            var out = [];
            console.log(min);
            var minDate = moment(min);
            var maxDate = moment(max).add(1, 'd');
            angular.forEach(input, function(d) {
                console.log(d.start);
                var inputDate = moment(d.start);
                console.log(inputDate);
                if(inputDate.isBefore(maxDate) && inputDate.isAfter(minDate)) {
                    out.push(d);
                }
            });
            return out;
        };
    });