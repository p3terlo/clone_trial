function TreeMap(svg,data){
    // Variable to keep track of which sector is selected
    var selectedSector = null;
    var selectedSectorColor = null;

    this.svg = svg;
    let boundingBox = svg.node().getBoundingClientRect();
    let margin = {top: 0, bottom: 10, left: 10, right: 10}
    let svgHeight = boundingBox.height;
    let svgWidth = boundingBox.width;
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;
    let x = d3.scaleLinear().domain([0,width]).range([0,width]);
    let y = d3.scaleLinear().domain([0,height]).range([0,height]);


    let color = d3.scaleOrdinal()
        .domain(['Industrials','Health Care','Information Technology','Consumer Discretionary','Utilities','Financials','Materials','Real Estate','Consumer Staples','Energy','Telecommunication Services'])
        .range(d3.schemeDark2);
    
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
        .attr("height", margin.top + 20)
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
            .on("click", transition)


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
                if (d.depth == 1) {
                    return '' + '<p class="title"> ' + d.data.name + '</p>';
                } else if (d.depth == 2) {
                    return '' + '<p class="title"> ' + d.data['Symbol'] + '</p>';
                }
            })
            .attr("class", "textdiv")
            .on('click', function(d) {
                if (d.depth === 1) {
                    // Call parallel coordinates here
                    console.log('onclick d = ', d);
                    selectedSector = (d.data)['Sector']
                    selectedSectorColor = color(selectedSector)
                    parallelCoordinatesChart(d3.select('.parallelCoordinatesChart'), allCompInSector(d), selectedSectorColor)
                } else if (d.depth === 2) {
                    // Call candlestick here
                    compTicker(d);
                }
            });

        function transition(d) {
            selectedSector = (d.data)['name']
            selectedSectorColor = color(selectedSector)
            parallelCoordinatesChart(d3.select('.parallelCoordinatesChart'), allCompInSector(d), selectedSectorColor)

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
            // Transition to the new view.
            t1.selectAll("text").call(text).style("fill-opacity", 0);
            t2.selectAll("text").call(text).style("fill-opacity", 1);
            t1.selectAll("rect").call(rect);
            t2.selectAll("rect").call(rect);
            t1.selectAll(".textdiv").style("display", "none");
            t1.selectAll(".foreignobj").call(foreign);
            t2.selectAll(".textdiv").style("display", "block");
            t2.selectAll(".foreignobj").call(foreign);
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

    function foreign(foreign) {
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
                if (d.depth === 1) {
                    return color(d.data.name); 
                } else if (d.depth === 2) {
                    return color(d.parent.data.name);
                }
            })
            .style("stroke", "black")
            .style('stroke-width', 1)
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
    
    function allCompInSector(d) {
        if (d.depth === 1) {
            console.log('making compArr');
            let compArr = [];
            for (let i = 0; i < d.children.length; i++) {
                compArr.push(d.children[i].data.Symbol);
            }
            return compArr;
        }
    }

    function compTicker(d) {
        if (d.depth === 2) {
            return d.data['Symbol'];
        }
    }
}
