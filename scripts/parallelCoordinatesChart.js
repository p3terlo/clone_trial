const AdvantageAPIkey = "1CM19T0YJXP6L6RL";
const FinnhubAPIkey = "bpkhng7rh5rcgrlrac8g";
const IEXCloudkey = "pk_082890e2408448e6a98d6eb27d0d86be"

// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 10, left: 50},
	width = 460 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

function parallelCoordinatesChart(svg, companies) { 
	data = [];
	for (let i=0 ; i<companies.length ; i++) {
		try { 
			//'batch?types=quote,news,chart&range=1m&last=10'
			d3.json('https://cloud.iexapis.com/stable/stock/' + companies[i] + '/book?token=pk_082890e2408448e6a98d6eb27d0d86be', function(stock) {
				let row = {};	
				//console.log(stock)
				row['Stock'] = companies[i]
				row['avgTotalVolume'] = stock['quote']['avgTotalVolume']
				row['marketCap'] = stock['quote']['marketCap']
				row['week52High'] = stock['quote']['week52High']
				row['week52Low'] = stock['quote']['week52Low']
				data.push(row)
			})
		} catch (e) {
			console.log(e)
		}
	data['columns'] = ['Stock', 'avgTotalVolume', 'marketCap', 'week52High', 'week52Low']
	}

	//console.log(data)

	// append the svg object to the body of the page
	var svg = d3.select(".parallelCoordinatesChart")
		.append("svg")
	  	.attr("width", width + margin.left + margin.right)
	  	.attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	  	.attr("transform",
	  		"translate(" + margin.left + "," + margin.top + ")");

	var colors = d3.scaleOrdinal(d3.schemeCategory10)

  	dimensions = data['columns']

  	// For each dimension, I build a linear scale. I store all in a y object
  	var y = {}
  	for (i in dimensions) {
  		name = dimensions[i]
  		y[name] = d3.scaleLinear()
     		.domain( [d3.extent(data, function(d) { return +d[name]; })] )
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
  	svg
  	.selectAll("myPath")
  	.data(data)
  	.enter()
  	.append("path")
    	.attr("class", function (d) { return "line " + d.Stock } ) // 2 class for each line: 'line' and the group name
    	.attr("d",  path)
    	.style("fill", "none" )
    	.style("stroke", function(d){ return( color(d.Stock))} )
    	.style("opacity", 0.5)
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
