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

    // myGroup.selectAll("text")
    //     .data(root.leaves())
    //     .enter()
    //     .append("text")
    //       .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
    //       .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
    //       .text(function(d){ return d.data.name; })
    //       .attr("font-size", "19px")
    //       .attr("fill", "white")

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
}
