/*	Created by Michael Tingey on 2016-04-01.
	Updated on 2016-05-05.
	Edited by Jesse Deisinger 07/05/16
	Copyright © 2016 SUNY New Paltz. All rights reserved. */

google.charts.load("current", {packages:['corechart', 'table']});
google.charts.setOnLoadCallback(initializeChart);

var collectionQuery;

//Visualization DataTable type
var collectionData;
//Visualization DataTable type
var employeeData;

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
		
		var currentDateTime = collectionData.getValue(dataIndex, 0);
		var previousDateTime = dataIndex == 0 ? currentDateTime : collectionData.getValue(dataIndex - 1, 0);
		
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
		employeeCheckboxes.innerHTML += "<input type = 'checkbox' id = 'employee" + dataIndex + "'> " + employeeData.getValue(dataIndex, 1) + ", " + employeeData.getValue(dataIndex, 0) + "<br />";
	}
	
	// Add an extra break after the last checkbox
	employeeCheckboxes.innerHTML += "<br />";
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
	
	employeeQuery.setQuery("SELECT * FROM 1N5MESRSevHsiuQilArUgqb_QDaxCyBk-HhMMh_3f ORDER BY 'LastName'");
	
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
	
	d3Init();
	
	
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
	
	collectionQuery.setQuery("SELECT 'DateTime', 'Tons' FROM 1rc7Pm9ejg15CeLVOM5dC7eu00VJjccGTu6uhksbY ORDER BY 'DateTime'");
	
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
	var minString = min.getFullYear() + "." + (min.getMonth() + 1) + "." + (min.getDate() + 1);
	var maxString = max.getFullYear() + "." + (max.getMonth() + 1) + "." + (max.getDate() + 2);
	
	collectionQuery.setQuery("SELECT 'DateTime', 'Tons' FROM 1rc7Pm9ejg15CeLVOM5dC7eu00VJjccGTu6uhksbY WHERE 'DateTime' >= '"
	+ minString + "' AND 'DateTime' <= '" + maxString + "' ORDER BY 'DateTime'");
	
	collectionQuery.send(handleCollectionResponse);
}
function d3refresh() {
	var svg = d3.select("#chartDiv");
	pWidth = document.getElementById('chartDiv').clientWidth;
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
	    width = pWidth - margin.left - margin.right,
	    height = 460 - margin.top - margin.bottom;
	svg.attr("width", width);
	

}
//Creates table in D3
function d3Init() { 
	// Set the dimensions of the canvas / graph
	pWidth = document.getElementById('chartDiv').clientWidth;
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
	    .append("g")
		.attr("transform", 
		      "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
            var data = collectionData.Lf;	
	    data.forEach(function(d) {
		d.date = d.c[0].v;
		d.close = d.c[1].v;
	    });
	    // Scale the range of the data
	    x.domain(d3.extent(data, function(d) { return d.date; }));
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
		.attr("transform", "translate(0," + height + ")")

	    // Add the Y Axis
	    svg.append("g")
		.attr("class", "yaxis");
	    }
	    d3.select(".xaxis")
    		.call(d3.axisBottom(x));
	    d3.select(".yaxis")
	        .call(d3.axisLeft(y));

}
