//Creates line graph in D3
function chartInit(elem, data) {

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
		d.date = moment(d.start).toDate();
		d.tons = parseInt(d.tons);
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
			return y(d.tons);
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
		return d.tons;
	})]);
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
