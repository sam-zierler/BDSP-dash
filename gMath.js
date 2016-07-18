//----------------------------------------------------------------------------
// Calculate tons/hrs.
//----------------------------------------------------------------------------
function calcTonsAndHours(collectionData)
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
	
	return {tons: tons, hours: shiftDurations };
}
//----------------------------------------------------------------------------
// Calculate tipping fee.
//----------------------------------------------------------------------------
function calcTippingFee(collectionData)
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
function calcEmpPay(collectionData)
{
	var totalPay = 0;
	var shiftDurations = 0;
	var activeEmployees = new Array();
	
	//-------------------------------------------------------------------------
	// Calculate the number of hours worked.
	//-------------------------------------------------------------------------
	// For each row of data,
	var tonsAndHours = calcTonsAndHours(collectionData);
	
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
		totalPay += tonsAndHours.hours * employeeData.getValue(index, 2);
	}
	
	return totalPay;
}

