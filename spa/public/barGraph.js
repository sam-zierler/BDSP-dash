//create bar graph
function barGraphInit(elem, data) {

	// clear chartDiv before the graph is redrawn
	elem.innerHTML = "";
	//document.getElementById(elem).innerHTML = "";
	d3.select(window).on('resize', function() {
		barGraphInit(elem,data);
	});

	pWidth = elem.clientWidth - 20;
	hWidth = elem.clientHeight - 20;

	var margin = {top: 10, right: 30, bottom: 30, left: 30},
	    width = pWidth - margin.left - margin.right,
	    height = 480 - margin.top - margin.bottom;

	//set x and y scales
	var x = d3.scaleTime().rangeRound([0, width]);
	var y = d3.scaleLinear()
		.range([height, 0]);

	//read in and parse data from google charts
	data.forEach(function(d) {
		d1 = d[0];
		str = String(d1);
		d.date = new Date(str.substring(0,15));
		d.close = d[1];
	});

	dateRange = getDateRange();
	//create histogram object which bins google charts data by date
	var histogram = d3.histogram()
		.value(function(d) { return d.date; })
	//groupBy = document.getElementById("group").value;
	groupBy = "week";
	var xAxisDivisions = function() { return d3.timeWeek.every(1)};
	x.domain([new Date(dateRange[0]), new Date(dateRange[1])]).nice(1);
	switch(groupBy) {
		case "day": 
			histogram.thresholds(x.ticks(d3.timeDay));
			histogram.domain(x.domain());
			xAxisDivisions = function() { return d3.timeWeek.every(1)};
			break;
		case "month":
			histogram.thresholds(x.ticks(d3.timeMonth));
			histogram.domain(x.domain());
			xAxisDivisions = function() { return d3.timeMonth.every(1)};
			break;
		default:
			x.domain([new Date(dateRange[0]).moveToDayOfWeek(0,-1), 
					new Date(dateRange[1]).moveToDayOfWeek(0)]);
			histogram.domain(x.domain());
			histogram.thresholds(x.ticks(d3.timeWeek));
	}
	var bins = histogram(data);
	if(bins.length == 1) {
	//	alert("Invalid date range");
	//	return;
	}
	y.domain([0, d3.max(bins, function(d) {
		return (parseInt(totalTons(d) / 100) + 1) * 100; 
	})]);

	//start drawing the graph, starting with enclosing svg tag
	var svg = d3.select(eval(elem)).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(xAxisDivisions()));

	svg.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y).tickSize(-width,0,0));

	var bar = svg.selectAll(".bar")
		.data(bins)
		.enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d) { 
			return "translate(" + x(d.x0) + "," + y(totalTons(d)) + ")";
		})
		.on('mouseover', function(d) {
			d3.select(this).select("text").attr("opacity", 1.0);
		})
		.on('mouseout', function(d) {
			d3.select(this).select("text").attr("opacity", 0.0);
		});

	bar.append("rect")
		.attr("x", 1)
		.attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
		.attr("height", function(d) { 
			return height - y(totalTons(d)); });

	bar.append("text")
		.attr("dy", "-1.0em")
		.attr("y", 6)
		.attr("x", function(d) { return (x(d.x1) - x(d.x0)) / 2; })
		.attr("text-anchor", "middle")
		.attr("opacity", "0.0")
		.text(function(d) {
			sum = totalTons(d);
			if( sum == 0 ) {
				sum = "";
			}
			return sum;
		});
		
	//math needed to calculate how far over to move the tick labels
	//in order to center them so that the graph makes sense
	function moveLabels() {	
		var xAxisWidth = d3.select("g.axis--x .domain").node().getBBox()["width"];
		var xAxisTicks = d3.selectAll("g.axis--x g.tick")["_groups"][0].length;
		var wOffset = (xAxisWidth / xAxisTicks / 2 + 1);
		d3.selectAll("g.axis--x g.tick text")
			.attr("transform", function() {
				return "translate(" + wOffset + ", 0)";
			});
	}
	//calculates the total tons collected for each given calendar day
	function totalTons(d) {
		var sum = 0;
		if(d.length > 0) {
			for(i=0; i < d.length; i++) {
				sum += parseInt(d[i][1]);
			}
		}
		return sum;
	}
	function getDateRange() {
		//min = new Date(document.getElementById("startDate").value).addDays(1);
		//max = new Date(document.getElementById("endDate").value).addDays(2);

		// Set the minString to midnight on minDate and the maxString to midnight on the day after maxDate
		//var minString = min.getFullYear() + "-" + (min.getMonth() + 1) + "-" + (min.getDate()) + " 00:00:00";	
		//var maxString = max.getFullYear() + "-" + (max.getMonth() + 1) + "-" + (max.getDate()) + " 00:00:00";
		//return [minString, maxString];
		return ["2016-06-01 00:00:00", "2016-07-31 00:00:00"]; 
	}
}



