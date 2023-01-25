var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960,
    height = 500 - margin.top - margin.bottom;

// Step 2: Define the data
var data = [
    { date: "2000-01-01", value: 50 },
    { date: "2001-01-01", value: 75 },
    { date: "2002-01-01", value: 100 },
    { date: "2003-01-01", value: 125 },
    { date: "2004-01-01", value: 150 }
];

// Step 3: Create scales and axes
var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d.value; }))
    .range([0, width]);

var y = d3.scaleLinear()
    .range([0, height])
    .domain([0, d3.max(data, function (d) { return d.date; })]);

var xAxis = d3.axisBottom(x)
// var yAxis = d3.axisLeft(y);

// Step 4: Append SVG elements and bind data
var svg = d3.select("#timeline-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("class", "fishy")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", function (d) { return x(d.value); })
    .attr("cy", function () { return height; })
    .attr("r", 5);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

