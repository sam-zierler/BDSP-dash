angular.module('app')
    .filter('dateRange', function() {
        return function(input, min, max) {
            var out = [];
            if(min === '' || typeof min === 'undefined') {
                min = '2016';
            }
            var minDate = moment(min);
            var maxDate = moment(max).add(1, 'd');
            angular.forEach(input, function(d) {
                var inputDate = moment(d.start);
                if(inputDate.isBefore(maxDate) && inputDate.isAfter(minDate)) {
                    out.push(d);
                }
            });
            return out;
        };
    });