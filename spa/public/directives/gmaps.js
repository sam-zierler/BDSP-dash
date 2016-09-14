angular.module('gmaps.directives', [])

/** -------------------gmap directive---------------------
 * 
 * This directive displays a Google Map that displays the
 * KML routes returned from a query of a Fusion Table. 
 * The directive also has a height attribute, which does 
 * exactly what you would expect.
 * 
 * ------------------------------------------------------*/

.directive('gmap', function($parse) {
    var query;
    var height;

    function createGmap(elem, mQuery) {
        google.maps.visualRefresh = true;
        var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
            (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
        if (isMobile) {
            var viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
        }
        var mapDiv = elem;

        var map = new google.maps.Map(mapDiv, {
            //centers the map on the city of Poughkeepsie
            center: new google.maps.LatLng(41.700174, -73.920869),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend-open'));
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend'));

        var layer = new google.maps.FusionTablesLayer({
            map: map,
            heatmap: {
                enabled: false
            },
            query: mQuery,
            options: {
                styleId: 2,
                templateId: 4
            }
        });
    }
    
    return {
        restrict: 'E',
        replace: false,
        controller: function($scope) {
            query = $scope.query;
            height = $scope.height;
        },
        scope: {
            query: '=',
            height: '@'
        },
        link: function(scope, element, attrs) {
            element[0].style.height = height;
            
            //needs to be a block element or browser ignores height attribute
            element[0].style.display = 'block';
            createGmap(element[0], query);
            
            //watch for a change in the value of query, necessary because
            //of the async nature of the setting of query
            scope.$watch('query', function(newValue, oldValue) {
                query = newValue;
                //converting all data passed thru into an array
                if (typeof query !== 'undefined') {
                    createGmap(element[0], query);
                }
            });
        }
    };
});
