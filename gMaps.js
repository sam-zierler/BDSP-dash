function setMap(startDate, endDate) {
	var url = "https://fusiontables.googleusercontent.com/fusiontables/embedviz?q=select+col4+from+1JFf3z0WVkO0RJOfWNnPvUJ3KFwtHg42Rm-Y3z-LJ+where+%27start%27%3E%3D%27" + startDate + "%27+and+%27start%27%3C=%27" + endDate + "%27&viz=MAP&h=false&lat=41.74054140411736&lng=-74.0814259472312&t=1&z=18&l=col4&y=2&tmplt=4&hml=KML";
	d3.select("#gMaps")
		.attr("src", url);
}
