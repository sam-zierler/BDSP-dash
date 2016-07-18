//Creates line graph in D3
function chartInit(collectionData) {
	
	//refresh chart when window size changes
	d3.select(window).on('resize', function() {
		chartInit(collectionData);
	});

	document.getElementById("chartDiv").innerHTML = "";

	// Set the dimensions of the canvas / graph
	pWidth = document.getElementById('chartDiv').clientWidth;
	hWidth = document.getElementById('chartDiv').clientHeight;
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
	    width = pWidth - margin.left - margin.right,
	    height = 460 - margin.top - margin.bottom;
	

	// Parse the date / time
	var parseDate = d3.timeParse("%d-%b-%y");

	// Set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// Define the line
	var valueline = d3.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.close); });
	    
	// Adds the svg canvas
	var svg = d3.select("#chartDiv")
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

	// Get the data
            var data = collectionData.Lf;	
	    data.forEach(function(d) {
		d1 = d.c[0].v;
		str = String(d1);
		d.date = Date.parse(str.substring(0,15));
		d.close = d.c[1].v;
	    });
	    //Scale the range of the data
	    x.domain(d3.extent(data, function(d) { 
		    return d.date; 
	    }));
	    y.domain([0, d3.max(data, function(d) { return d.close; })]);
	   
	    // Add the valueline path.
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

	    groupBy = document.getElementById("group").value;
	    switch(groupBy) {
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
