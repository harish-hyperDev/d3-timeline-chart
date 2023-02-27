var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960,
    height = 350 - margin.top - margin.bottom;




const fetchData = async () => {
    return await fetch('./src/originalData.json').then(res => { return res.json() }).then(resData => { return resData })
}

let parseTime = d3.timeParse("%d %b %Y %H:%M %p");
console.log(parseTime("22 May 2022 10:56 PM"))

var result = fetchData()
    .then(data => {

        // Reference of the JSON data structure
        /* {
            "InstallDate": "07 May 2022 12:56 PM",
            "ComputerName": "DESKTOP-BTTOPL3",
            "Policy": "Manual",
            "Group": "Default",
            "Tags": "",
            "Patch Name": "Security Intelligence Update for Microsoft Defender Antivirus - KB2267602 (Version 1.363.1567.0)",
            "PatchCategory": "Definition Update",
            "PatchReleaseDate": "07 May 2022"
        } */        

        
        var filteredDropdownData = data;
        var filteredTimeline = data;
        let firstPageLoad = true

        firstPageLoad && (document.getElementById("updates").innerHTML = 0);

        const getUniqueData = (key) => {
            return filteredDropdownData.map((x) => x[key]).filter((x, i, a) => a.indexOf(x) === i)
        }

        const reDraw = (param) => {
            console.log("filtering ->", param)

            /* console.log(data.filter((d,i) => {
                return d["ComputerName"] === param
            })) */

            filteredTimeline = data.filter((d,i) => {
                return d["ComputerName"] === param
            })

            console.log(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); }))

            var x = d3.scaleTime()
                .domain(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); }))
                .range([0, width]); 

            var xAxis = d3.axisBottom(x)
                // .ticks(d3.timeHour.every(12))

            
            console.log(filteredTimeline)

            d3.selectAll(".dot").remove()
            d3.selectAll(".x-axis").remove()

            /*
                x = d3.scaleTime()
                    .domain(d3.extent(filteredTimeline, function (d) { console.log("in x ", d); return parseTime(d.InstallDate); }))
                    .range([0, width]);

                d3.axisBottom(x)
             */

            document.getElementById("updates").innerHTML = filteredTimeline.length;

            svg.selectAll(".dot")
                .data(filteredTimeline)
                .enter().append("circle")
                .attr("class", "dot")   // x(parseTime(d.InstallDate));
                .attr("cx", function (d) { return x(parseTime(d.InstallDate)) })
                .attr("cy", function (d) { return (height) })
                .attr("fill", "black")
                .attr("r", 4)
                .on("mouseover", (d) => {
                    svg.selectAll(".dot").style("cursor", "pointer");
                    svg.select("path").style("cursor", "pointer");
                    tooltip.text(                        
                        "Patch Name: " + d["Patch Name"] + "\n" +
                        "Patch Release: " + d["PatchReleaseDate"] + "\n" +
                        "Patch Installed On: " + d["InstallDate"] + "\n" + 
                        "Patch Category: " + d["PatchCategory"] + "\n"                        
                    );
                    return tooltip.style("visibility", "visible");
                })

                .on("mousemove", () => {

                    return tooltip.style("top", (d3.event.pageY + 25) + "px")
                        .style("left", (d3.event.pageX - 15) + "px")

                })

                .on("mouseout", () => {
                    svg.selectAll(".dot").style("cursor", "default");
                    svg.select("path").style("cursor", "default");
                    return tooltip.style("visibility", "hidden")
                });

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            
            /* filteredDropdownData = data.filter((d,i) => {
                return d["ComputerName"] === param
            }) */

            /* console.log(data.filter((d,i) => {
                return d["ComputerName"] === param
            })) */
        }        

        // filterData()

        // For retrieving unique values from JSON data
        

        // const uniqueDates = getUniqueData("InstallDate")
        const uniqueComputers = getUniqueData("ComputerName").sort()

        console.log(uniqueComputers)
        // console.log(uniqueDates)

        console.log("dropdown ", filteredDropdownData)
        // let x = d3.scaleTime()
        //     .domain(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); }))
        //     .range([0, width]);

        // var y = d3.scaleLinear()
        //     .range([0, height])
        //     .domain([0, d3.max(data, function (d) { return d.date; })]);
        // var yAxis = d3.axisLeft(y);
        
        // let xAxis = d3.axisBottom(x)
        // .ticks(d3.timeHour.every(12))

        
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

        // Inserting data to dropdown
        var dropDown = d3.select("select")
        var options = dropDown.selectAll("option")
                                .data(function () {
                                    if(firstPageLoad) {
                                        firstPageLoad = false
                                        console.log("if true block")
                                        return (["---Select---", ...uniqueComputers])
                                    }
                                    else {
                                        console.log("else block")
                                        return (uniqueComputers)

                                    }
                                })
                                .enter()
                                .append("option")
                                            
            options.text((d) => d)
                    .attr("value", (d) => d)

            dropDown.on("change", function () { reDraw(d3.select(this).property("value")) })

        var svg = d3.select("#timeline-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "fishy")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // console.log(data)
    })