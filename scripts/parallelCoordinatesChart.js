const AdvantageAPIkey = "1CM19T0YJXP6L6RL";
const FinnhubAPIkey = "bpkhng7rh5rcgrlrac8g";
const IEXCloudkey = "pk_082890e2408448e6a98d6eb27d0d86be"

// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 10, left: 100};
	//width = svg.node().getBoundingClientRect().width - margin.left - margin.right,
	//height = svg.node().getBoundingClientRect().width - margin.top - margin.bottom;

var sectordata = [];

function parallelCoordinatesChart(svg, companies) {
	function apiCall(callback) {
		var companyString = '';
		for (let i=0 ; i<companies.length ; i++) {
			try {
			//'batch?types=quote,news,chart&range=1m&last=10'
				d3.json('https://cloud.iexapis.com/stable/stock/' + companies[i] + '/book?token=pk_35dd1844f0ed4482a98158403e6d4900', function(stock) {
					let row = {};
					row['Stock'] = companies[i]
					console.log(companies[i])
					row['avgTotalVolume'] = stock['quote']['avgTotalVolume']
					row['marketCap'] = stock['quote']['marketCap']
					row['week52High'] = stock['quote']['week52High']
					row['week52Low'] = stock['quote']['week52Low']
					sectordata.push(row)
					//debugger;
				})
			} catch (e) {
				console.log(e)
			}
			//console.log('company: ' + companies[i] + ', company + 1: ' + companies[i+1] + ', i: ' + i)
		}
		sectordata['columns'] = ['Stock', 'avgTotalVolume', 'marketCap', 'week52High', 'week52Low']
		//debugger;
		var i = 0
		call()
		function call() {
			if ((sectordata.length == companies.length) || (i > 5)) {
				console.log('sectordata.legnth='+ sectordata.length + ' ,companies.length=' + companies.length)
				draw(sectordata)
			} else {
				console.log('calling timeout, sectordata.length='+ sectordata.length + ' ,companies.length=' + companies.length)
				i = i+1
				setTimeout(call, 2000)
			}
		}
	}

	function draw(sectordata) {
		d3.selectAll(".parallelCoordinatesChart > *").remove();

		console.log('drawing')
		console.log(sectordata)
		//debugger;
		// append the svg object to the body of the page
		var svg = d3.select(".parallelCoordinatesChart")
		  	.append("g")
		  	.attr("transform",
		  		"translate(" + margin.left + "," + margin.top + ")");

		var width = d3.select(".parallelCoordinatesChart").node().getBoundingClientRect().width - margin.left - margin.right,
		height = d3.select(".parallelCoordinatesChart").node().getBoundingClientRect().height - margin.top - margin.bottom;

		var colors = d3.scaleOrdinal(d3.schemeCategory10)

	  	dimensions = ['avgTotalVolume', 'marketCap', 'week52High', 'week52Low']

	  	var y = {}
	  	for (i in dimensions) {
	  		name = dimensions[i]
	  		y[name] = d3.scaleLinear()
	     		.domain(d3.extent(sectordata, function(d) { return +d[name] }) )
	      		.range([height, 0])
	  	}

	  	x = d3.scalePoint()
	  		.range([0, width])
		  	.domain(dimensions);

	  	// The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
	  	function path(d) {
	  		return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
	  	}

		// Draw the lines
	  	svg.selectAll('myPath')
	  		.append('g')
	  		.data(sectordata)
	  		.enter().append('path')
	    	.attr('d', path)
	    	.style('fill', 'none')
	    	.style('stroke', function(d) { return (colors(d.Stock) )} )
	    	.style('opacity', 0.5)
	    	//.on("mouseover", highlight)
	    	//.on("mouseleave", doNotHighlight )

	  	// Draw the axis:
	  	svg.selectAll("myAxis")
		    // For each dimension of the dataset I add a 'g' element:
		    .data(dimensions).enter()
		    .append("g")
		    .attr("class", "axis")
		    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
		    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
		    .append("text")
		    .style("text-anchor", "middle")
		    .attr("y", -9)
		    .text(function(d) { return d; })
		    .style("fill", "black")
	}
	apiCall(draw)
	//console.log(sectordata)
}
