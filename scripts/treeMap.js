function TreeMap(svg,data){

    this.svg = svg;
    let boundingBox = svg.node().getBoundingClientRect();
    let margin = {top: 20, bottom: 20, left: 20, right: 20}
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
        (root)

    let color = d3.scaleOrdinal()
        .domain(['Industrials','Health Care','Information Technology','Consumer Discretionary','Utilities','Financials','Materials','Real Estate','Consumer Staples','Energy','Telecommunication Services'])
        .range(d3.schemeSet3);

    myGroup.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .attr('fill', function(d) { return color(d.parent.data.name); } )
}