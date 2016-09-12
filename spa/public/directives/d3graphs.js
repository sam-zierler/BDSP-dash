angular.module('d3graphs.directives', []).directive('lineGraph', function($parse) {
    var data;
    
    function graphInit(elem, data) {

        elem.innerHTML = "";

        // Set the dimensions of the canvas / graph
        pWidth = elem.clientWidth - 20;
        hWidth = elem.clientHeight - 20;
        var margin = {
                top: 30,
                right: 20,
                bottom: 30,
                left: 50
            },
            width = pWidth - margin.left - margin.right,
            height = 460 - margin.top - margin.bottom;


        // Parse the date / time
        var parseDate = d3.timeParse("%d-%b-%y");
        // Get the data
        data.forEach(function(d) {
            d.date = moment(d.date).toDate();
            d.value = parseInt(d.value);
        });

        // Set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // Define the line
        var valueline = d3.line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d.value);
            });

        // Adds the svg canvas
        var svg = d3.select(elem)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            //.attr("preserveAspectRatio","xMidYMid meet")
            .attr("id", "chart")
            .append("g")
            .attr("id", "chartArea")
            .attr("width", width)
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        x.domain(d3.extent(data, function(d) {
            return d.date;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.value;
        })]);
        // Add the valueline path.
        for(var i = 0; i < data.length; i++) {
            if(isNaN(data[i].value)) {
                data.splice(i, 1);
            }
            if(data[i].date == "Invalid Date") {
                data.splice(i, 1);
            }
        }
        if(valueline(data).includes("NaN")) {
            console.log("NaN error with graph");
            return false;
        } 
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));
        // Add the X Axis
        svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + height + ")");


        // Add the Y Axis
        svg.append("g")
            .attr("class", "yaxis");

        groupBy = "week";
        switch (groupBy) {
            case "week":
                d3.select(".xaxis")
                    .call(d3.axisBottom(x).ticks(d3.timeWeek.every(1)));
                break;
            case "month":
                d3.select(".xaxis")
                    .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)));
                break;
            default:
                d3.select(".xaxis")
                    .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)));
        }
        d3.select(".yaxis")
            .call(d3.axisLeft(y));
    }
    return {
        restrict: 'E',
        replace: false,
        controller: function($scope) {
            data = $scope.data;
        },
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('data', function(newValue, oldValue) {
                data = newValue;
                element[0].setAttribute("style", "display:inline-block;width:100%; height: 100%;");
                //converting all data passed thru into an array
                if (typeof data !== 'undefined') {
                    graphInit(element[0], data);
                }
            });
        }
    }
});