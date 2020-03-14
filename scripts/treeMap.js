function TreeMap(svg,data){
    console.log(data);

    this.svg = svg;
    let boundingBox = svg.node().getBoundingClientRect();
    let margin = {top: 10, bottom: 10, left: 10, right: 10}
    let svgHeight = boundingBox.height;
    let svgWidth = boundingBox.width;
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;
    let x = d3.scaleLinear().domain([0,width]).range([0,width]);
    let y = d3.scaleLinear().domain([0,height]).range([0,height]);

    let color = d3.scaleOrdinal()
        .domain(['Industrials','Health Care','Information Technology','Consumer Discretionary','Utilities','Financials','Materials','Real Estate','Consumer Staples','Energy','Telecommunication Services'])
        .range(d3.schemeSet3);
    
    let myGroup = svg
        .attr('width', width)
        .attr('height', height)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let grandparent = myGroup.append("g")
        .attr("class", "grandparent");
    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top + 15)
        .attr("fill", '#bbbbbb');
    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");

    let root = d3.hierarchy(data).sum(function(d){
        return d['Market Cap'];
    });

    let treemap = d3.treemap()
        .size([width,height])
        .paddingTop(20)
        .paddingRight(0)
        .paddingInner(0)
        .round(false)
        (root)

    display(root)

    function display(d) {
        // console.log('in display function, d = ', d);

        grandparent
            .datum(d.parent)
            .on('click', transition)
            .select('text')
            .text(name(d));
        grandparent
            .datum(d.parent)
            .select("rect")
            .attr("fill", function () {
                return '#bbbbbb'
            });

        let g1 = myGroup.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth");
        let g = g1.selectAll("g")
            .data(d.children)
            .enter()
            .append("g");

        g.filter(function (d) {
            return d.children;
        })
            .classed("children", true)
            .on("click", transition);
        g.selectAll(".child")
            .data(function (d) {
                return d.children || [d];
            })
            .enter().append("rect")
            .attr("class", "child")
            .call(rect);

        g.append("rect")
            .attr("class", "parent")
            .call(rect)
            .append("title")
            .text(function (d){
                return d.data.name;
        });

        // Adds titles 
        g.append("foreignObject")
            .call(rect)
            .attr("class", "foreignobj")
            .append("xhtml:div")
            .html(function (d) {
                // console.log('lesgetitle d = ', d);
                if (d.depth == 1) {
                    return '' + '<p class="title"> ' + d.data.name + '</p>';
                } else if (d.depth == 2) {
                    return '' + '<p class="title"> ' + d.data['Symbol'] + '</p>';
                }
            })
            .attr("class", "textdiv");

        function transition(d) {
            // if (transitioning || !d) return;
            transitioning = true;
            var g2 = display(d),
                t1 = g1.transition().duration(650),
                t2 = g2.transition().duration(650);
            // Update the domain only after entering new elements.
            x.domain([d.x0, d.x1]);
            y.domain([d.y0, d.y1]);
            // Enable anti-aliasing during the transition.
            myGroup.style("shape-rendering", null);
            // Draw child nodes on top of parent nodes.
            myGroup.selectAll(".depth").sort(function (a, b) {
                return a.depth - b.depth;
            });
            // Fade-in entering text.
            g2.selectAll("text").style("fill-opacity", 0);
            g2.selectAll("foreignObject div").style("display", "none");
            /*added*/
            // Transition to the new view.
            t1.selectAll("text").call(text).style("fill-opacity", 0);
            t2.selectAll("text").call(text).style("fill-opacity", 1);
            t1.selectAll("rect").call(rect);
            t2.selectAll("rect").call(rect);
            /* Foreign object */
            t1.selectAll(".textdiv").style("display", "none");
            /* added */
            t1.selectAll(".foreignobj").call(foreign);
            /* added */
            t2.selectAll(".textdiv").style("display", "block");
            /* added */
            t2.selectAll(".foreignobj").call(foreign);
            /* added */
            // Remove the old node when the transition is finished.
            t1.on("end.remove", function(){
                this.remove();
                transitioning = false;
            });
        }

        return g;
    }

    function text(text) {
        text.attr("x", function (d) {
            return x(d.x);
        })
            .attr("y", function (d) {
                return y(d.y);
            });
    }

    function foreign(foreign) { /* added */
        foreign
            .attr("x", function (d) {
                return x(d.x0);
            })
            .attr("y", function (d) {
                return y(d.y0);
            })
            .attr("width", function (d) {
                return x(d.x1) - x(d.x0);
            })
            .attr("height", function (d) {
                return y(d.y1) - y(d.y0);
            });
    }

    function rect(rect) {
        rect
            .attr("x", function (d) {
                return x(d.x0);
            })
            .attr("y", function (d) {
                return y(d.y0);
            })
            .attr("width", function (d) {
                return x(d.x1) - x(d.x0);
            })
            .attr("height", function (d) {
                return y(d.y1) - y(d.y0);
            })
            .attr('fill', function(d) { 
                // console.log('fill d = ', d);
                if (d.depth === 1) {
                    return color(d.data.name); 
                } else if (d.depth === 2) {
                    return color(d.parent.data.name);
                }
            })
            .style("stroke", "black");
    }

    function name(d) {
        return breadcrumbs(d);
    }

    function breadcrumbs(d) {
        var res = "";
        var sep = " / ";
        d.ancestors().reverse().forEach(function(i){
            res += i.data.name + sep;
        });
        return res
            .split(sep)
            .filter(function(i){
                return i!== "";
            })
            .join(sep);
    }
    
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