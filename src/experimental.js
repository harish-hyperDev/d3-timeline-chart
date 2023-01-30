var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960,
    height = 350 - margin.top - margin.bottom;


const fetchData = async () => {
    return await fetch('./src/originalData.json').then(res => { return res.json() }).then(resData => { return resData })
}


let parseTime = d3.timeParse("%d %b %Y %H:%M %p");
console.log(parseTime("22 May 2022 10:56 PM"));

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
        let firstPageLoad = true;

        firstPageLoad && (document.getElementById("updates").innerHTML = 0);

        const getUniqueData = (key) => {
            return filteredDropdownData.map((x) => x[key]).filter((x, i, a) => a.indexOf(x) === i)
        }

        const zoom = d3.zoom().on("zoom", () => svg.select(".x-axis").call(customizedXTicks, d3.event.transform.rescaleX(x)))
        .scaleExtent([-Infinity, Infinity]);

        const intervalScale = d3.scaleThreshold()
                                .domain([0.03, 1, 7, 28, 90, 365, Infinity])
                                .range(["minute", "hour", "day", "week", "month", "quarter", "year"]);

        function customizedXTicks(selection, scale) {
            let startDate = new Date(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); }[0]))
            // get interval d3 has decided on by comparing 2nd and 3rd ticks
            const t1 = new Date(scale.ticks()[1]);
            const t2 = new Date(scale.ticks()[2]);
            // get interval as days
            const interval = (t2 - t1) / 86400000;
            // get interval scale to decide if minutes, days, hours, etc
            const intervalType = intervalScale(interval);
            // get new labels for axis
            newTicks = scale.ticks().map(t => `${diffEx(t, origin, intervalType)} ${intervalType}s`);
            // update axis - d3 will apply tick values based on dates
            selection.call(d3.axisBottom(scale));
            // now override the d3 default tick values with the new labels based on interval type
            d3.selectAll(".x-axis .tick > text").each(function (t, i) {
                d3.select(this)
                    .text(newTicks[i])
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");
            });

            function diffEx(from, to, type) {
                let t = moment(from).diff(moment(to), type, true);
                return Number.isInteger(t) ? t : parseFloat(t).toFixed(1);
            }
        }

        var svg = d3.select("#timeline-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "fishy")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

        

        var x = d3.scaleTime()
            .domain(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); })).nice()
            .range([0, width])

        function reDraw (param) {
            console.log("filtering ->", param)

            filteredTimeline = data.filter((d, i) => {
                return d["ComputerName"] === param
            })

            console.log(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); }))

            x = d3.scaleTime()
                .domain(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); })).nice()
                .range([0, width])

            console.log(filteredTimeline)

            // Removing the previous dots before drawing new ones.
            d3.selectAll(".dot").remove()
            d3.selectAll(".x-axis").remove()

            document.getElementById("updates").innerHTML = filteredTimeline.length;

            svg.selectAll(".dot")
                .data(filteredTimeline)
                .enter().append("circle")
                .attr("class", "dot")   // x(parseTime(d.InstallDate));
                .attr("cx", function (d) { return x(parseTime(d.InstallDate)) })
                .attr("cy", function (d) { return (height) })
                .attr("fill", "#fff")
                .attr("r", 3.8)
                .attr("stroke", "black")
                .attr("stroke-width", "2.5")

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
                .call(d3.axisBottom(x));
        }

        const uniqueComputers = getUniqueData("ComputerName").sort()

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
                if (firstPageLoad) {
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

        dropDown.on("change", function () {
            if (firstPageLoad)
                firstPageLoad = false

            reDraw(d3.select(this).property("value"))
        })
    })