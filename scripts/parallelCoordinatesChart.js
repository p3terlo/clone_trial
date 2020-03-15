// const AdvantageAPIkey = '1CM19T0YJXP6L6RL';
// const FinnhubAPIkey = 'bpkhng7rh5rcgrlrac8g';
// const IEXCloudkey = 'pk_082890e2408448e6a98d6eb27d0d86be'

// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 10, left: 100};

var sectordata = [];

function parallelCoordinatesChart(svg, companies, color) {
	console.log('in parallelCoord, companies = ', companies);
	var firstStock = null;
	var secondStock = null;

	var highlight = function(color, firstStock, secondStock){
		d3.select('.parallelCoordinatesChart').selectAll('path')
			.transition().duration(200)
			.style('stroke', '#636363')
			.style('opacity', '0.2')

		if (firstStock) {
		    d3.selectAll('.' + firstStock)
		    	.transition().duration(200)
		    	.style('stroke', color)
		    	.style('opacity', '1')
		}

	    if (secondStock) {
	    	d3.selectAll('.' + secondStock)
		    	.transition().duration(200)
		    	.style('stroke', color)
		    	.style('opacity', '1')
		    }
	}

	var resetHighlight = function(color){
		d3.selectAll('path')
			.transition().duration(200).delay(1000)
			.style('stroke', color)
			.style('opacity', '1')
	}

	function apiCall(callback) {
		var companyString = '';
		for (let i=0 ; i<companies.length ; i++) {
			try {
				d3.json('https://cloud.iexapis.com/stable/stock/' + companies[i] + '/book?token=pk_35dd1844f0ed4482a98158403e6d4900', function(stock) {
					let row = {};
					row['Stock'] = companies[i]
					row['avgTotalVolume'] = stock['quote']['avgTotalVolume']
					row['marketCap'] = stock['quote']['marketCap']
					row['week52High'] = stock['quote']['week52High']
					row['week52Low'] = stock['quote']['week52Low']
					row['changePercent'] = stock['quote']['changePercent']
					row['latestPrice'] = stock['quote']['latestPrice']
					row['volume'] = stock['quote']['volume']
					sectordata.push(row)
				})
			} catch (e) {
				console.log(e)
			}
		}
		sectordata['columns'] = ['Stock', 'avgTotalVolume', 'marketCap', 'week52High', 'week52Low', 'changePercent', 'latestPrice', 'volume']

		var i = 0
		call()
		function call() {
			if ((sectordata.length == companies.length) || (i > 3)) {
				draw(sectordata)
			} else {
				i = i+1
				setTimeout(call, 1000)
			}
		}
	}

	function draw(sectordata) {
		d3.selectAll('.parallelCoordinatesChart > *').remove();

		// Append the svg object to the body of the page
		var svg = d3.select('.parallelCoordinatesChart')
		  	.append('g')
		  	.attr('transform',
		  		'translate(' + margin.left + ',' + margin.top + ')');

		var width = d3.select('.parallelCoordinatesChart').node().getBoundingClientRect().width - margin.left - margin.right,
		height = d3.select('.parallelCoordinatesChart').node().getBoundingClientRect().height - margin.top - margin.bottom;

		// Choose axis based on checkboxes selected
		var dimensions = []
		if (d3.select('#Average_Total_Volume').property('checked')) {
			dimensions.push('avgTotalVolume')
		}
		if (d3.select('#Market_Capitalization').property('checked')) {
			dimensions.push('marketCap')
		}
		if (d3.select('#Week_52_High').property('checked')) {
			dimensions.push('week52High')
		}
		if (d3.select('#Week_52_Low').property('checked')) {
			dimensions.push('week52Low')
		}
		if (d3.select('#Percent_Change').property('checked')) {
			dimensions.push('changePercent')
		}
		if (d3.select('#Latest_Price').property('checked')) {
			dimensions.push('latestPrice')
		}
		if (d3.select('#Volume').property('checked')) {
			dimensions.push('volume')
		}

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
	  		.attr('class', function(d) { return d.Stock})
	    	.attr('d', path)
	    	.style('fill', 'none')
	    	.style('stroke', color)
	    	.style('opacity', 0.8)

	  	// Draw the axis
	  	svg.selectAll('myAxis')
		    .data(dimensions).enter()
		    .append('g')
		    .attr('class', 'axis')
		    .attr('transform', function(d) { return 'translate(' + x(d) + ')'; })
		    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
		    .append('text')
		    .style('text-anchor', 'middle')
		    .attr('y', -9)
		    .text(function(d) { return d; })
		    .style('fill', 'black')

		this.update = function(data) {
			this.updatePositions = function(selection) {
				selection
					.on('mouseover', function(datum) {
						var tooltip = d3.select('#myTooltip');
						tooltip.style('display', 'block');
						tooltip.style('left', d3.event.pageX + 'px');
						tooltip.style('top', d3.event.pageY + 'px');
						tooltip.style('position', 'absolute');
						tooltip.html(datum.Stock);
					})
					.on('mousemove', function(datum) {
						var tooltip = d3.select('#myTooltip');
						tooltip.style('left', d3.event.pageX + 'px');
						tooltip.style('top', d3.event.pageY + 'px');
					})
					.on('mouseleave', function(datum) {
						var tooltip = d3.select('#myTooltip');
						tooltip.style('display', 'none');
					})
					.on('click', function(datum) {
						if ((!firstStock) && (!secondStock)) {
							resetHighlight(color)
						}

						if (!firstStock) {
							firstStock = datum.Stock
							highlight(color, firstStock, secondStock)
						} else if ((!secondStock) && (firstStock != datum.Stock )) {
							secondStock = datum.Stock
							highlight(color, firstStock, secondStock)
						}

						if (firstStock && secondStock) {
							DifferenceChart(d3.select('#differenceChart'), firstStock, secondStock);
							firstStock = null;
							secondStock = null;
						}
					})
				return selection;
			};
			this.updatePositions(d3.select('body').select('.parallelCoordinatesChart').selectAll('path'));
		};
		this.update(sectordata);
	}

	apiCall(draw)
}
