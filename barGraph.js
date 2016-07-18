//create bar graph
function barGraphInit(collectionData) {

	// clear chartDiv before the graph is redrawn

	document.getElementById("chartDiv").innerHTML = "";

	d3.select(window).on('resize', function() {
		barGraphInit(collectionData);
	});

	pWidth = document.getElementById('chartDiv').clientWidth;
	hWidth = document.getElementById('chartDiv').clientHeight;

	var margin = {top: 10, right: 30, bottom: 30, left: 30},
	    width = pWidth - margin.left - margin.right,
	    height = 480 - margin.top - margin.bottom;

	//set x and y scales
	var x = d3.scaleTime().rangeRound([0, width]);
	var y = d3.scaleLinear()
		.range([height, 0]);

	//read in and parse data from google charts
	var data = collectionData.Lf;
	data.forEach(function(d) {
		d1 = d.c[0].v;
		str = String(d1);
		d.date = new Date(str.substring(0,15));
		d.close = d.c[1].v;
	});

	dateRange = getDateRange();
	console.log(new Date(dateRange));
	//create histogram object which bins google charts data by date
	var histogram = d3.histogram()
		.value(function(d) { return d.date; })
	groupBy = document.getElementById("group").value;
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
		alert("Invalid date range");
		return;
	}
	y.domain([0, d3.max(bins, function(d) {
		return (parseInt(totalTons(d) / 100) + 1) * 100; 
	})]);

	//start drawing the graph, starting with enclosing svg tag
	var svg = d3.select("#chartDiv").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(xAxisDivisions()));

	var bar = svg.selectAll(".bar")
		.data(bins)
		.enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d) { 
			return "translate(" + x(d.x0) + "," + y(totalTons(d)) + ")";
		});

	bar.append("rect")
		.attr("x", 1)
		.attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
		.attr("height", function(d) { 
			return height - y(totalTons(d)); });

	bar.append("text")
		.attr("dy", ".50em")
		.attr("y", 6)
		.attr("x", function(d) { return (x(d.x1) - x(d.x0)) / 2; })
		.attr("text-anchor", "middle")
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
				sum += d[i].close;
			}
		}
		return sum;
	}
}



