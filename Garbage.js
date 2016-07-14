/*Created by Michael Tingey on 2016-04-01.
	Updated on 2016-05-05.
	Edited by Jesse Deisinger 07/05/16
	Copyright © 2016 SUNY New Paltz. All rights reserved. */

google.charts.load("current", {packages:['corechart', 'table']});
google.charts.setOnLoadCallback(initializeChart);

var tonsTableId, empTableId; 

var xmlHttp = new XMLHttpRequest();
var url = "garbageData.php";

xmlHttp.onreadystatechange = function() {
	if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		var tableArray = JSON.parse(xmlHttp.responseText);
		tonsTableId = tableArray[0];
		empTableId = tableArray[1];
	}
};
xmlHttp.open("POST", url, true);
xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlHttp.send("Test=test");

var collectionQuery;

//Visualization DataTable type
var collectionData;
//Visualization DataTable type
var employeeData;
var bins;
var optionsSet = false;

//----------------------------------------------------------------------------
// Unpack google DataTable to an array
//----------------------------------------------------------------------------

function datatableToArray(dt) {
	var data = collectionData.Lf;	
	data.forEach(function(d) {
		d.forEach(function(c) {
			
		});
	});
	return arr;
}

//----------------------------------------------------------------------------
// Calculate tons/hrs.
//----------------------------------------------------------------------------
function calcTonsPerShiftHours ()
{
	var tons = 0;
	var shiftDurations = 0;
	
	// For each row of data,
	for (dataIndex = 0; dataIndex < collectionData.getNumberOfRows(); dataIndex++)
	{
		// Accumulate the 'Tons' value
		tons += collectionData.getValue(dataIndex, 1);
		
		var currentDateTime = collectionData.getValue(dataIndex, 2);
		var previousDateTime = collectionData.getValue(dataIndex, 0);
		
		// Accumulate the elapsed time between the current 'DateTime' value and the previous one,
		// if the day of the month is the same
		if (currentDateTime.getDate() == previousDateTime.getDate())
			shiftDurations += currentDateTime - previousDateTime;
	}
	
	// Convert the shift durations from ms to hrs
	shiftDurations /= 3600000;
	
	return tons / shiftDurations;
}

//----------------------------------------------------------------------------
// Calculate tipping fee.
//----------------------------------------------------------------------------
function calcTippingFee()
{
	var tons = 0;
	
	// For each row of data,
	for (dataIndex = 0; dataIndex < collectionData.getNumberOfRows(); dataIndex++)
	{
		// Accumulate the 'Tons' value
		tons += collectionData.getValue(dataIndex, 1);
	}
	
	return document.getElementById("tippingFee").value * tons;
}

//----------------------------------------------------------------------------
// Calculate the total pay for checked employees.
//----------------------------------------------------------------------------
function calcEmpPay()
{
	var totalPay = 0;
	var shiftDurations = 0;
	var activeEmployees = new Array();
	
	//-------------------------------------------------------------------------
	// Calculate the number of hours worked.
	//-------------------------------------------------------------------------
	// For each row of data,
	for (index = 0; index < collectionData.getNumberOfRows(); index++)
	{
		var currentDateTime = collectionData.getValue(index, 0);
		var previousDateTime = index == 0 ? currentDateTime : collectionData.getValue(index - 1, 0);
		
		// Accumulate the elapsed time between the current 'DateTime' value and the previous one,
		// if the day of the month is the same
		if (currentDateTime.getDate() == previousDateTime.getDate())
			shiftDurations += currentDateTime - previousDateTime;
	}
	
	// Convert the shift durations from ms to hrs
	shiftDurations /= 3600000;
	
	//-------------------------------------------------------------------------
	// Get the rate for each active employee.
	//-------------------------------------------------------------------------
	// Store a list of the employee checkboxes
	var allEmployees = document.getElementById("employeeCheckboxes").children;
	
	// Store a list of the indices of the checked checkboxes
	for (index = 0; index < allEmployees.length; index++)
	{
		if (allEmployees[index].checked == true)
		{
			activeEmployees.push(index);
		}
	}
	
	//-------------------------------------------------------------------------
	// Accumulate the total pay for each active employee.
	//-------------------------------------------------------------------------
	for (index = 0; index < activeEmployees.length; index++)
	{
		totalPay += shiftDurations * employeeData.getValue(index, 2);
	}
	
	return totalPay;
}

//-----------------------------------------------------------------------------
// Processes the employee QueryResponse.
//-----------------------------------------------------------------------------
function handleEmployeeResponse(response)
{
	if (response.isError())
	{
		alert("Error in employee query: " + response.getMessage() + " " + response.getDetailedMessage());
		
		return;
	}
	
	employeeData = response.getDataTable();
	var employeeCheckboxes = document.getElementById("employeeCheckboxes");
	
	// For each row of data,
	for (dataIndex = 0; dataIndex < employeeData.getNumberOfRows(); dataIndex++)
	{
		// Create a checkbox for the current employee
		employeeCheckboxes.innerHTML += "<input class = 'uiElement' type = 'checkbox' id = 'employee'" + 
			dataIndex + "'> " + employeeData.getValue(dataIndex, 1) + ", " + 
			employeeData.getValue(dataIndex, 0) + "<br />";
	}
	
	// Add an extra break after the last checkbox
	employeeCheckboxes.innerHTML += "<br />";
	//Add event handler for on change so UI updates
	$(".uiElement").change(function() {
		updateChart();
	})
}

//----------------------------------------------------------------------------
// Displays the chart's summary values.
//----------------------------------------------------------------------------
function displaySummaryValues()
{
	var tippingFee = calcTippingFee();
	var empPay = calcEmpPay();
	var totalCost = tippingFee + empPay;
	
	document.getElementById("summaryDiv").innerHTML = "<strong>Summary</strong>" +
	"<br /><br />Average Deposit (tons/hr): " + calcTonsPerShiftHours().toFixed(2) + 
	"<br /><br />Tipping Total: $" + tippingFee.toFixed(2) +
	"<br /><br />Employee Pay Due: $" + empPay.toFixed(2) +
	"<br /><br />Total operating cost: $" + totalCost.toFixed(2);
}

//----------------------------------------------------------------------------
// Initializes the chart customization options.
//----------------------------------------------------------------------------
function initializeOptions()
{
	//-------------------------------------------------------------------------
	// Initialize the customization div.
	//-------------------------------------------------------------------------
	var minDate = collectionData.getValue(0, 0);
	var maxDate = collectionData.getValue(collectionData.getNumberOfRows() - 1, 0);
	
	var minDateMonth;
	var maxDateMonth;
	var minDateDay;
	var maxDateDay;
	
	var minDateISO;
	var maxDateISO;
	
	// Store the month and day values of the min and max dates
	minDateMonth = minDate.getMonth() + 1;
	maxDateMonth = maxDate.getMonth() + 1;
	minDateDay = minDate.getDate();
	maxDateDay = maxDate.getDate();
	
	// Ensure the month and day values are 2 digits.
	if (minDateMonth < 10)
		minDateMonth = "0" + minDateMonth;
	if (maxDateMonth < 10)
		maxDateMonth = "0" + maxDateMonth;
	if (minDateDay < 10)
		minDateDay = "0" + minDateDay;
	if (maxDateDay < 10)
		maxDateDay = "0" + maxDateDay;
	
	// Generate the ISO strings (YYYY-MM-DD) for the min and max dates
	minDateISO = minDate.getFullYear() + "-" + minDateMonth + "-" + minDateDay;
	maxDateISO = maxDate.getFullYear() + "-" + maxDateMonth + "-" + maxDateDay;
	
	// Set the proper attributes for the input fields
	document.getElementById("startDate").min = minDateISO;
	document.getElementById("startDate").max = maxDateISO;
	document.getElementById("startDate").value = minDateISO;
	document.getElementById("endDate").min = minDateISO;
	document.getElementById("endDate").max = maxDateISO;
	document.getElementById("endDate").value = maxDateISO;
	document.getElementById("tippingFee").min = 0;
	document.getElementById("tippingFee").defaultValue = 0
	
	//-------------------------------------------------------------------------
	// Initialize the employee div.
	//-------------------------------------------------------------------------
	var employeeQuery;
	
	employeeQuery = new google.visualization.Query("https://www.google.com/fusiontables/gvizdata?tq=");
	
	employeeQuery.setQuery("SELECT * FROM " + empTableId + " ORDER BY 'LastName'");
	
	employeeQuery.send(handleEmployeeResponse);
}

//-----------------------------------------------------------------------------
// Processes the collection QueryResponse.
//-----------------------------------------------------------------------------
function handleCollectionResponse(response)
{
	if (response.isError())
	{
		alert("Error in collection query: " + response.getMessage() + " " + response.getDetailedMessage());
		
		return;
	}
	
	collectionData = response.getDataTable();

	//----------------------------------------------------------------------------
	// D3 chart creation
	//----------------------------------------------------------------------------
	
	barGraphInit();
	//chartInit();
	displaySummaryValues();
	
	// If the customization options have not initialized, set them
	if (!optionsSet)
	{
		optionsSet = true;
		
		initializeOptions();
	}

	
}

//-----------------------------------------------------------------------------
// Creates and sends a Query to the collection Fusion Table.
//-----------------------------------------------------------------------------
function initializeChart()
{
	collectionQuery = new google.visualization.Query("https://www.google.com/fusiontables/gvizdata?tq=");
	
	collectionQuery.setQuery("SELECT 'start', 'tons', 'end' FROM " + tonsTableId + " ORDER BY 'start'");
	
	collectionQuery.send(handleCollectionResponse);
	
	// Specify the enter key as an instruction to update the chart
	window.addEventListener("keypress", function (e)
	{
		if (e.keyCode === 13)
			updateChart();
	});
}

//----------------------------------------------------------------------------
// Updates the LineChart according to the customization options.
//----------------------------------------------------------------------------
function updateChart()
{
	min = new Date(document.getElementById("startDate").value);
	max = new Date(document.getElementById("endDate").value);
	
	// Set the minString to midnight on minDate and the maxString to midnight on the day after maxDate
	var minString = min.getFullYear() + "." + (min.getMonth() + 1) + "." + (min.getDate() + 1) + " 00:00:00";
	var maxString = max.getFullYear() + "." + (max.getMonth() + 1) + "." + (max.getDate() + 2) + " 00:00:00";
	
	try {	
		collectionQuery.setQuery("SELECT 'start', 'tons', 'end' FROM " + tonsTableId + " WHERE 'start' >= '"
			+ minString + "' AND 'start' <= '" + maxString + "' ORDER BY 'start'");
		collectionQuery.send(handleCollectionResponse);
	}
	catch(err) {
		console.log("Chart not updated");
	}
}

//create bar graph
function barGraphInit() {

	// clear chartDiv before the graph is redrawn
	if(optionsSet) {
		document.getElementById("chartDiv").innerHTML = "";
	}

	//
	d3.select(window).on('resize', barGraphRefresh);

	var margin = {top: 10, right: 30, bottom: 30, left: 30},
	    width = 640 - margin.left - margin.right,
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

	x.domain([d3.min(data, function(d) { return d.date; }),
			d3.max(data, function(d) { return d.date; })])
		.nice(1);

	//create histogram object which bins google charts data by date
	var histogram = d3.histogram()
		.value(function(d) { return d.date; })
		.domain(x.domain())
		.thresholds(x.ticks(d3.timeWeek));
	var bins = histogram(data);

	y.domain([0, d3.max(bins, function(d) { return totalTons(d); })]);

	//start drawing the graph, starting with enclosing svg tag
	var svg = d3.select("#chartDiv").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(d3.timeWeek.every(1)));

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
	
	var xAxisWidth = d3.select("g.axis--x .domain").node().getBBox()["width"];
	var xAxisTicks = d3.selectAll("g.axis--x g.tick")["_groups"][0].length;
	var wOffset = (xAxisWidth / xAxisTicks / 2 + 1);
	d3.selectAll("g.axis--x g.tick text")
		.attr("transform", function() {
			return "translate(" + wOffset + ", 0)";
		});
	
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

	//function to resize chart, not used
	//in favor of just redrawing the whole thing

	function barGraphRefresh() {
		var rect = d3.selectAll("g.bar");
		rect.exit().remove();
		rect.enter().append("rect")
			.attr('x', 1)
			.attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
			//.attr('y', function(d) { return y(totalTons(d)); })
			.attr("height", function(d) { return height - y(totalTons(d)); }); 
	}

}


//Creates line graph in D3
function chartInit() {
	
	//refresh chart when window size changes
	d3.select(window).on('resize',chartRefresh);

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
		.attr("preserveAspectRatio","xMidYMid meet")
		.attr("id", "chart")
	    .append("g")
	    	.attr("id", "chartArea")
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
	    if(optionsSet) {
	    	var svg = d3.select("body").transition();
		svg.select(".line")
  		    .attr("d", valueline(data));
	    }
	    else {
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
	    }
	    d3.select(".xaxis")
    		.call(d3.axisBottom(x).ticks(d3.timeDay.every(1)));
	    d3.select(".yaxis")
	        .call(d3.axisLeft(y));

	    //function to resize chart
	    function chartRefresh() {
		var chart = d3.select("#chartDiv");
		var width = document.getElementById('chartDiv').clientWidth, 
		    height = parseInt(d3.select("#chartDiv").style("height"));
		d3.select("#chart")
			.attr("width", width);
		x.range([0, width - margin.left - margin.right]);
		x.domain(d3.extent(data, function(d) { 
		    return d.date; 
		}))
		chart.select(".xaxis")
    			.call(d3.axisBottom(x).ticks(d3.timeDay.every(1)));
			
		chart.selectAll('.line')
		    .attr("d", valueline(data));
		console.log("RESIZE");
	    }
}
$(document).ready(function() {
	$(".uiElement").change(function() {
		updateChart();
	});
});

