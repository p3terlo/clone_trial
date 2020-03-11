const apiKey = "R1TE9XCC432MADLL";



function DifferenceChart(svg, ticker1, ticker2) {
  var data = {};
  var differenceArray = [];
  var percentages = [];

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
    .y(function(d) { return y(d["New York"]); });

var area = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d["New York"]); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // get ticker data
  d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ticker1+"&apikey="+apiKey, function(data1) {
    d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ticker2+"&apikey="+apiKey, function(data2) {

      var d1 = data1["Time Series (Daily)"];
      for (var d in d1) {
        var a = d1[d];
        data[d] = {"New York": a["5. adjusted close"]};
      }

      var d2 = data2["Time Series (Daily)"];
      for (var d in d2) {
        var a = d2[d];
        data[d]["San Francisco"] = a["5. adjusted close"];
      }

      for (var d in data) {
        differenceArray.push({"date": d, "New York": data[d]["New York"], "San Francisco": data[d]["San Francisco"]});
      }


      for (var i = 0; i<differenceArray.length - 1; i++) {
        var percent1 = (differenceArray[i]["New York"]-differenceArray[i+1]["New York"]) / differenceArray[i+1]["New York"] * 100;
          var percent2 = (differenceArray[i]["San Francisco"]-differenceArray[i+1]["San Francisco"]) / differenceArray[i+1]["San Francisco"] * 100;
        percentages.push({"date": differenceArray[i].date, "New York": percent1, "San Francisco": percent2});
      }

      //percentages = percentages.slice(0,20);
      console.log(percentages);

      percentages.forEach(function(d) {
    d.date = parseDate(d.date);
    d["New York"]= +d["New York"];
    d["San Francisco"] = +d["San Francisco"];
  });

  x.domain(d3.extent(percentages, function(d) { return d.date; }));

  y.domain([
    d3.min(percentages, function(d) { return Math.min(d["New York"], d["San Francisco"]); }),
    d3.max(percentages, function(d) { return Math.max(d["New York"], d["San Francisco"]); })
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
      .attr("d", area.y0(function(d) { return y(d["San Francisco"]); }));

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
      .text("Temperature (ºF)");
    });
  });
  return;
}
