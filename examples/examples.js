/* svg.append("g")
    .attr("class", "y axis")
    .call(yAxis); */


/* 
var m = [20, 15, 15, 120], //top right bottom left
    w = 960 - m[1] - m[3],
    h = 500 - m[0] - m[2],
    miniHeight = laneLength * 12 + 50,
    mainHeight = h - miniHeight - 50;

//scales
var x = d3.scaleLinear()
    .domain([timeBegin, timeEnd])
    .range([0, w]);
var x1 = d3.scaleLinear()
    .range([0, w]);
var y1 = d3.scaleLinear()
    .domain([0, laneLength])
    .range([0, mainHeight]);
var y2 = d3.scaleLinear()
    .domain([0, laneLength])
    .range([0, miniHeight]);

var chart = d3.select("body")
    .append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("class", "chart");

chart.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", w)
    .attr("height", mainHeight);

var main = chart.append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("width", w)
    .attr("height", mainHeight)
    .attr("class", "main");

var mini = chart.append("g")
    .attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
    .attr("width", w)
    .attr("height", miniHeight)
    .attr("class", "mini");

//main lanes and texts
main.append("g").selectAll(".laneLines")
    .data(items)
    .enter().append("line")
    .attr("x1", m[1])
    .attr("y1", function (d) { return y1(d.lane); })
    .attr("x2", w)
    .attr("y2", function (d) { return y1(d.lane); })
    .attr("stroke", "lightgray")

main.append("g").selectAll(".laneText")
    .data(lanes)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", -m[1])
    .attr("y", function (d, i) { return y1(i + .5); })
    .attr("dy", ".5ex")
    .attr("text-anchor", "end")
    .attr("class", "laneText");

//mini lanes and texts
mini.append("g").selectAll(".laneLines")
    .data(items)
    .enter().append("line")
    .attr("x1", m[1])
    .attr("y1", function (d) { return y2(d.lane); })
    .attr("x2", w)
    .attr("y2", function (d) { return y2(d.lane); })
    .attr("stroke", "lightgray");

mini.append("g").selectAll(".laneText")
    .data(lanes)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", -m[1])
    .attr("y", function (d, i) { return y2(i + .5); })
    .attr("dy", ".5ex")
    .attr("text-anchor", "end")
    .attr("class", "laneText");

var itemRects = main.append("g")
    .attr("clip-path", "url(#clip)");

//mini item rects
mini.append("g").selectAll("miniItems")
    .data(items)
    .enter().append("rect")
    .attr("class", function (d) { return "miniItem" + d.lane; })
    .attr("x", function (d) { return x(d.start); })
    .attr("y", function (d) { return y2(d.lane + .5) - 5; })
    .attr("width", function (d) { return x(d.end - d.start); })
    .attr("height", 10);

//mini labels
mini.append("g").selectAll(".miniLabels")
    .data(items)
    .enter().append("text")
    .text(function (d) { return d.id; })
    .attr("x", function (d) { return x(d.start); })
    .attr("y", function (d) { return y2(d.lane + .5); })
    .attr("dy", ".5ex");

//brush
var brush = d3.brush()   
    .on("brush", display);

mini.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", 1)
    .attr("height", miniHeight - 1);

display();

function display() {
    var rects, labels,
        minExtent = brush.extent()[0],
        maxExtent = brush.extent()[1],
        visItems = items.filter(function (d) { return d.start < maxExtent && d.end > minExtent; });

    mini.select(".brush")
        .call(brush.extent([minExtent, maxExtent]));

    x1.domain([minExtent, maxExtent]);

    //update main item rects
    rects = itemRects.selectAll("rect")
        .data(visItems, function (d) { return d.id; })
        .attr("x", function (d) { return x1(d.start); })
        .attr("width", function (d) { return x1(d.end) - x1(d.start); });

    rects.enter().append("rect")
        .attr("class", function (d) { return "miniItem" + d.lane; })
        .attr("x", function (d) { return x1(d.start); })
        .attr("y", function (d) { return y1(d.lane) + 10; })
        .attr("width", function (d) { return x1(d.end) - x1(d.start); })
        .attr("height", function (d) { return .8 * y1(1); });

    rects.exit().remove();

    //update the item labels
    labels = itemRects.selectAll("text")
        .data(visItems, function (d) { return d.id; })
        .attr("x", function (d) { return x1(Math.max(d.start, minExtent) + 2); });

    labels.enter().append("text")
        .text(function (d) { return d.id; })
        .attr("x", function (d) { return x1(Math.max(d.start, minExtent)); })
        .attr("y", function (d) { return y1(d.lane + .5); })
        .attr("text-anchor", "start");

    labels.exit().remove();

} */

/* var testData = [
    {label: "person a", times: [
      {"starting_time": 1355752800000, "ending_time": 1355759900000},
      {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
    {label: "person b", times: [
      {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
    {label: "person c", times: [
      {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
    ];

var width = 500, height = 500, radius = Math.min(width, height) / 2

var svg = d3.select("#timeline-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)


var g = svg.append("g")
    .attr("transform", "translate (" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal()
    .range(['#ffd384', '#94ebcd', '#fbaccc', '#d3e0ea', '#fa7f72']);

var pie = d3.pie().value((d) => { return d.share })

var tooltip = d3.select("body")
    .append("div")
    .attr('class', 'tooltip')
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#fff")
    .style("padding", "5px")
    .style("border-radius", "7px")
    .text(""); */



/* var chart = d3.timeline()
    .tickFormat( //
        {
            format: d3.timeFormat("%I %p"),
            tickTime: d3.timeHour,
            tickInterval: 1,
            tickSize: 30
        })
    .display("circle"); // toggle between rectangles and circles
var svg = d3.select("#timeline-chart").append("svg").attr("width", width)
    .datum(testData).call(chart);
 */


