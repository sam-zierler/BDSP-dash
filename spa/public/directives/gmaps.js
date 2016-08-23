angular.module('gmaps.directives', []).directive('gmap', function($parse) {
    var query;
    var height;

    function gmaps_create(elem, mQuery) {
        google.maps.visualRefresh = true;
        var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
            (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
        if (isMobile) {
            var viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
        }
        var mapDiv = elem;
        //mapDiv.style.width = isMobile ? '100%' : '500px';

        var map = new google.maps.Map(mapDiv, {
            center: new google.maps.LatLng(41.740663487976036, -74.08123282818212),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend-open'));
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend'));

        layer = new google.maps.FusionTablesLayer({
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

        if (isMobile) {
            var legend = document.getElementById('googft-legend');
            var legendOpenButton = document.getElementById('googft-legend-open');
            var legendCloseButton = document.getElementById('googft-legend-close');
            legend.style.display = 'none';
            legendOpenButton.style.display = 'block';
            legendCloseButton.style.display = 'block';
            legendOpenButton.onclick = function() {
                legend.style.display = 'block';
                legendOpenButton.style.display = 'none';
            }
            legendCloseButton.onclick = function() {
                legend.style.display = 'none';
                legendOpenButton.style.display = 'block';
            }
        }
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
            element[0].style.display = "block";
            gmaps_create(element[0], query);
            scope.$watch('query', function(newValue, oldValue) {
                query = newValue;
                //converting all data passed thru into an array
                if (typeof query !== 'undefined') {
                    gmaps_create(element[0], query);
                }
            });
        }
    }
});
