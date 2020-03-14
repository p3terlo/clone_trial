const apiKey = "R1TE9XCC432MADLL";
var data = {};
var differenceArray = [];
var percentages = [];
var expandedPercentages = [];

function DifferenceChart(svg, ticker1, ticker2) {

  console.log('creating difference chart')

  d3.selectAll('.DifferenceChart > *').remove();

  var marginD = {top: 20, right: 20, bottom: 30, left: 50},
  width = svg.node().getBoundingClientRect().width - marginD.left - marginD.right,
  height = svg.node().getBoundingClientRect().height - marginD.top - marginD.bottom;

  var parseDate = d3.timeParse("%Y-%m-%d");

  var x = d3.scaleTime()
  .range([0, width]);

  var y = d3.scaleLinear()
  .range([height, 0]);

  var xAxis = d3.axisBottom()
  .scale(x);

  var yAxis = d3.axisLeft()
  .scale(y);

  var line = d3.area()
  .curve(d3.curveBasis)
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d[ticker1]); });

  var area = d3.area()
  .curve(d3.curveBasis)
  .x(function(d) { return x(d.date); })
  .y1(function(d) { return y(d[ticker1]); });

  var svg = svg
  .append("g")
  .attr("transform", "translate(" + marginD.left + "," + marginD.top + ")");

  // get ticker data
  d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol="+ticker1+"&apikey="+apiKey, function(data1) {
    d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol="+ticker2+"&apikey="+apiKey, function(data2) {

      var d1 = data1["Time Series (Daily)"];
      for (var d in d1) {
        var a = d1[d];
        data[d] = {[ticker1]: a["5. adjusted close"]};
      }

      var d2 = data2["Time Series (Daily)"];
      for (var d in d2) {
        var a = d2[d];
        if (data[d])
          data[d][ticker2] = a["5. adjusted close"];
        else
          data[d] = {[ticker2]: a["5. adjusted close"]};
      }

      for (var d in data) {
        differenceArray.push({"date": d, [ticker1]: data[d][ticker1], [ticker2]: data[d][ticker2]});
      }

      for (var i = 0; i<differenceArray.length - 1; i++) {
        if (differenceArray[i+1][ticker1]==undefined || differenceArray[i+1][ticker2]==undefined)
          break;
        var percent1 = (differenceArray[i][ticker1]-differenceArray[i+1][ticker1]) / differenceArray[i+1][ticker1] * 100;
        var percent2 = (differenceArray[i][ticker2]-differenceArray[i+1][ticker2]) / differenceArray[i+1][ticker2] * 100;
        percentages.push({"date": differenceArray[i].date, [ticker1]: percent1, [ticker2]: percent2});
      }

      expandedPercentages = percentages;

      percentages = percentages.slice(0,50);

      percentages.forEach(function(d) {
        d.date = parseDate(d.date);
        d[ticker1] = +d[ticker1];
        d[ticker2] = +d[ticker2];
      });

      x.domain(d3.extent(percentages, function(d) { return d.date; }));

      y.domain([
        d3.min(percentages, function(d) { return Math.min(d[ticker1], d[ticker2]); }),
        d3.max(percentages, function(d) { return Math.max(d[ticker1], d[ticker2]); })
      ]);

      svg.datum(percentages);

      svg.append("clipPath")
      .attr("id", "clip-below")
      .append("path")
      .attr("d", area.y0(height));

      svg.append("clipPath")
      .attr("id", "clip-above")
      .append("path")
      .attr("d", area.y0(0));

      svg.append("path")
      .attr("class", "area above")
      .attr("clip-path", "url(#clip-above)")
      .attr("d", area.y0(function(d) { return y(d[ticker2]); }));

      svg.append("path")
      .attr("class", "area below")
      .attr("clip-path", "url(#clip-below)")
      .attr("d", area);

      svg.append("path")
      .attr("class", "line")
      .attr("d", line);

      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Daily % Change");
    });
  });
  return;
}
