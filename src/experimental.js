var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960,
    height = 350 - margin.top - margin.bottom;

const fetchData = async () => {
    return await fetch('./src/data.json').then(res => { return res.json() }).then(resData => { return resData })
}

let parseTime = d3.timeParse("%d %b %Y %H:%M %p");
console.log(parseTime("22 May 2022 10:56 PM"))

var result = fetchData()
    .then(data => {
        
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return parseTime(d.InstallDate); }))
            .range([0, width]);

        // var y = d3.scaleLinear()
        //     .range([0, height])
        //     .domain([0, d3.max(data, function (d) { return d.date; })]);

        var xAxis = d3.axisBottom(x)
                    .ticks(d3.timeDay.every(1))
                    
        // var yAxis = d3.axisLeft(y);

        var tooltip = d3.select("body")
            .append("div")
            .attr('class', 'tooltip')
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#fff")
            .style("padding", "5px")
            .style("border-radius", "7px")
            .text("");


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
            .attr("cx", function (d) { return x(parseTime(d.InstallDate)); })
            .attr("cy", function (d) { return (height) })
            .attr("fill", "red")            
            .attr("r", 4)
            .on("mouseover", (d) => {
                svg.selectAll(".dot").style("cursor", "pointer");
                svg.select("path").style("cursor", "pointer");
                tooltip.text(
                        `ComputerName: ${d.ComputerName}`
                        );
                return tooltip.style("visibility", "visible");
            })

            .on("mousemove", () => {

                return tooltip.style("top", (d3.event.pageY - 40) + "px")
                    .style("left", (d3.event.pageX - 15) + "px")

            })

            .on("mouseout", () => {
                svg.selectAll(".dot").style("cursor", "default");
                svg.select("path").style("cursor", "default");
                return tooltip.style("visibility", "hidden")
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);



        console.log(data)
    })