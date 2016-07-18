/*Created by Michael Tingey on 2016-04-01.
	Updated on 2016-05-05.
	Edited by Jesse Deisinger 07/05/16
	Copyright © 2016 SUNY New Paltz. All rights reserved. */

/* Setup code for page */

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

/* Google charts data and query variables */
var collectionQuery;
var collectionData;
var employeeData;
var optionsSet = false;

/* getDateRange() gets the start and end date values from the UI
 * and returns an array of their values as formatted strings */
function getDateRange() {
	min = new Date(document.getElementById("startDate").value).addDays(1);
	max = new Date(document.getElementById("endDate").value).addDays(2);

	// Set the minString to midnight on minDate and the maxString to midnight on the day after maxDate
	var minString = min.getFullYear() + "/" + (min.getMonth() + 1) + "/" + (min.getDate()) + " 00:00:00";
	var maxString = max.getFullYear() + "/" + (max.getMonth() + 1) + "/" + (max.getDate()) + " 00:00:00";
	return [minString, maxString];
}

/* setPickerDates() sets the initial values of the start and end date UI elements
 * based on the earliest and latest entries in the Fusion Table */
function setPickerDates() {
	var minDate = collectionData.getValue(0, 0);
	var maxDate = collectionData.getValue(collectionData.getNumberOfRows() - 1, 0);
	
	// Store the month and day values of the min and max dates
	var minDateMonth = minDate.getMonth() + 1;
	var maxDateMonth = maxDate.getMonth() + 1;
	var minDateDay = minDate.getDate();
	var maxDateDay = maxDate.getDate();
	
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
	var minDateISO = minDate.getFullYear() + "/" + minDateMonth + "/" + minDateDay;
	var maxDateISO = maxDate.getFullYear() + "/" + maxDateMonth + "/" + maxDateDay;
	
	// Set the proper attributes for the input fields
	document.getElementById("startDate").min = minDateISO;
	document.getElementById("startDate").max = maxDateISO;
	document.getElementById("startDate").value = minDateISO;
	document.getElementById("endDate").min = minDateISO;
	document.getElementById("endDate").max = maxDateISO;
	document.getElementById("endDate").value = maxDateISO;
	document.getElementById("tippingFee").min = 0;
	document.getElementById("tippingFee").defaultValue = 0
}

//-----------------------------------------------------------------------------
// Processes the employee QueryResponse.
//-----------------------------------------------------------------------------
function handleEmployeeResponse(response)
{
	if (response.isError())
	{
		alert("Error in employee query: " + response.getMessage() + " " + response.getDetailedMessage());
	}
	else {
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
	return 0;
}

//----------------------------------------------------------------------------
// Displays the chart's summary values.
//----------------------------------------------------------------------------
function displaySummaryValues()
{
	var tippingFee = calcTippingFee(collectionData);
	var empPay = calcEmpPay(collectionData);
	var totalCost = tippingFee + empPay;
	var tonsAndHours = calcTonsAndHours(collectionData);
	var tonsPerHour = tonsAndHours.tons / tonsAndHours.hours
		
	document.getElementById("summaryDiv").innerHTML = "<strong>Summary</strong>" +
	"<br /><br />Average Deposit (tons/hr): " + tonsPerHour.toFixed(2) + 
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
	setPickerDates();
	
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
	if (response.isError()) {
		alert("Error in collection query: " + response.getMessage() + " " + response.getDetailedMessage());
	}
	else {
		collectionData = response.getDataTable();
		
		// If the customization options have not initialized, set them
		if (!optionsSet)
		{
			initializeOptions();
		}

		//----------------------------------------------------------------------------
		// D3 chart creation
		//----------------------------------------------------------------------------
		barGraphInit(collectionData);
		//chartInit(collectionData);
		displaySummaryValues();
	}
	optionsSet = true;
	return 0;
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
	dateRange = getDateRange();

	try {	
		collectionQuery.setQuery("SELECT 'start', 'tons', 'end' FROM " + tonsTableId + " WHERE 'start' >= '"
			+ dateRange[0] + "' AND 'start' <= '" + dateRange[1] + "' ORDER BY 'start'");
		collectionQuery.send(handleCollectionResponse);
	}
	catch(err) {
		console.log("Chart not updated");
	}
}


$(document).ready(function() {
	$(".uiElement").change(function() {
		updateChart();
	});
});

