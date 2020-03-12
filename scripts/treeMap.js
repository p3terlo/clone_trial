function TreeMap(svg,data){

    this.svg = svg;
    let boundingBox = svg.node().getBoundingClientRect();
    let margin = {top: 10, bottom: 10, left: 10, right: 10}
    let svgHeight = boundingBox.height;
    let svgWidth = boundingBox.width;
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;
    

    let myGroup = svg
        .attr('width', width)
        .attr('height', height)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let root = d3.hierarchy(data).sum(function(d){
        return d['Market Cap'];
    })
    
    d3.treemap()
        .size([width,height])
        .paddingTop(25)
        .paddingRight(5)
        .paddingInner(0)
        (root)

    let color = d3.scaleOrdinal()
        .domain(['Industrials','Health Care','Information Technology','Consumer Discretionary','Utilities','Financials','Materials','Real Estate','Consumer Staples','Energy','Telecommunication Services'])
        .range(d3.schemeSet3);

    myGroup.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .attr('fill', function(d) { return color(d.parent.data.name); } )
        // NATHAN: Call your parallelCoordChart with parallelCoordinatesChart(allCompInSector(d)) probably
        .on('click', function(d){ console.log(allCompInSector(d)); })

    myGroup.selectAll("titles")
        .data(root.descendants().filter(function(d){return d.depth==1}))
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0})
        .attr("y", function(d){ return d.y0+21})
        .text(function(d){ return d.data.name })
        .attr("font-size", "15px")
        .attr("fill", "black")

    myGroup.append("text")
        .attr("x", width/2 - 100)
        .attr("y", 14)    // +20 to adjust position (lower)
        .text("S&P 500 Companies by Sector")
        .attr("font-size", "19px")
        .attr("fill",  "grey" )

    function allCompInSector(d) {
        let compArr = [];
        for (let i = 0; i < d.parent.children.length; i++) {
            compArr.push(d.parent.children[i].data.Symbol);
        }
        return compArr;
    }

    // function zoom(d) {

    //     console.log('clicked: ' + d.data.name + ', depth: ' + d.depth);
        
    //     currentDepth = d.depth;
    //     parent.datum(d.parent || root);
        
    //     x.domain([d.x0, d.x1]);
    //     y.domain([d.y0, d.y1]);
        
    //     let t = d3.transition()
    //         .duration(800)
    //         .ease(d3.easeCubicOut);
        
    //     cells
    //         .transition(t)
    //         .style("left", function(d) { return nearest(x(d.x0), snap) + "%"; })
    //         .style("top", function(d) { return nearest(y(d.y0), snap) + "%"; })
    //         .style("width", function(d) { return nearest(x(d.x1) - x(d.x0), snap) + "%"; })
    //         .style("height", function(d) { return nearest(y(d.y1) - y(d.y0), snap) + "%"; });
        
    //     cells // hide this depth and above
    //         .filter(function(d) { return d.ancestors(); })
    //         .classed("hide", function(d) { return d.children ? true : false });
        
    //     cells // show this depth + 1 and below
    //         .filter(function(d) { return d.depth > currentDepth; })
    //         .classed("hide", false);
        
    //     // if currentDepth == 3 show prev/next buttons
        
    // }
}