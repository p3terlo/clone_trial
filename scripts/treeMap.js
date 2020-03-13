function TreeMap(svg,data){
    console.log(data);

    this.svg = svg;
    let boundingBox = svg.node().getBoundingClientRect();
    let margin = {top: 10, bottom: 10, left: 10, right: 10}
    let svgHeight = boundingBox.height;
    let svgWidth = boundingBox.width;
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;
    let x = d3.scaleLinear().rangeRound([0, width]);
    let y = d3.scaleLinear().rangeRound([0, height]);
    

    // let mySvg = svg
    //     .attr('width', width)
    //     .attr('height', height)

    // let group = svg.append('g')
    //     .call(render, treemap(data))

    // let nodes = d3.hierarchy(data).sum(function(d){
    //     return d['Market Cap'];
    // })

    //  let treemap = d3.treemap()
    //     .size([width,height])
    //     .paddingTop(25)
    //     .paddingRight(5)
    //     .paddingInner(0)
    //     .tile(d3.treemapSquarify)
    //     (nodes)

    // function render(group, root) {
    //     let node = group
    //         .selectAll("g")
    //         .data(root.children.concat(root))
    //         .join("g");
    
    //     node.filter(d => d === root ? d.parent : d.children)
    //         .attr("cursor", "pointer")
    //         .on("click", d => d === root ? zoomout(root) : zoomin(d));
    
    //     // node.append("title")
    //     //     .text(d => d === root ? );
    
    //     node.append("rect")
    //         .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
    //         .attr("fill", d => d === root ? "#fff" : d.children ? "#ccc" : "#ddd")
    //         .attr("stroke", "#fff");
    
    //     node.append("clipPath")
    //         .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    //         .append("use")
    //         .attr("xlink:href", d => d.leafUid.href);
    
    //     node.append("text")
    //         .attr("clip-path", d => d.clipUid)
    //         .attr("font-weight", d => d === root ? "bold" : null)
    //         .selectAll("tspan")
    //         .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
    //         .join("tspan")
    //         .attr("x", 3)
    //         .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
    //         .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
    //         .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
    //         .text(d => d);
    
    //     group.call(position, root);
    //     }
    
    

    // let myGroup = svg
    //     .attr('width', width)
    //     .attr('height', height)
    //     .append('g')
    //         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // let root = d3.hierarchy(data).sum(function(d){
    //     return d['Market Cap'];
    // })
    
    // d3.treemap()
    //     .size([width,height])
    //     .paddingTop(25)
    //     .paddingRight(5)
    //     .paddingInner(0)
    //     (root)

    // let color = d3.scaleOrdinal()
    //     .domain(['Industrials','Health Care','Information Technology','Consumer Discretionary','Utilities','Financials','Materials','Real Estate','Consumer Staples','Energy','Telecommunication Services'])
    //     .range(d3.schemeSet3);

    // myGroup.selectAll('rect')
    //     .data(root.leaves())
    //     .enter()
    //     .append('rect')
    //     .attr('x', function (d) { return d.x0; })
    //     .attr('y', function (d) { return d.y0; })
    //     .attr('width', function (d) { return d.x1 - d.x0; })
    //     .attr('height', function (d) { return d.y1 - d.y0; })
    //     .style("stroke", "black")
    //     .attr('fill', function(d) { return color(d.parent.data.name); } )
    //     // NATHAN: Call your parallelCoordChart with parallelCoordinatesChart(allCompInSector(d)) probably
    //     .on('click', function(d){ console.log(allCompInSector(d)); })

    // myGroup.selectAll("titles")
    //     .data(root.descendants().filter(function(d){return d.depth==1}))
    //     .enter()
    //     .append("text")
    //     .attr("x", function(d){ return d.x0})
    //     .attr("y", function(d){ return d.y0+21})
    //     .text(function(d){ return d.data.name })
    //     .attr("font-size", "15px")
    //     .attr("fill", "black")

    // myGroup.append("text")
    //     .attr("x", width/2 - 100)
    //     .attr("y", 14)    // +20 to adjust position (lower)
    //     .text("S&P 500 Companies by Sector")
    //     .attr("font-size", "19px")
    //     .attr("fill",  "grey" )

    // function allCompInSector(d) {
    //     let compArr = [];
    //     for (let i = 0; i < d.parent.children.length; i++) {
    //         compArr.push(d.parent.children[i].data.Symbol);
    //     }
    //     return compArr;
    // }
}