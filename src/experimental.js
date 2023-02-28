
const fetchData = async () => {
    return await fetch('./src/originalData.json').then(res => { return res.json() }).then(resData => { return resData })
}

let parseTime = d3.timeParse("%d %b %Y %H:%M %p");
console.log(parseTime("22 May 2022 10:56 PM"))

var result = fetchData()
    .then(data => {

        // console.log("data length ", data.length)
        // console.log("loading ", data[multidata_index]['ComputerName'])



        function HSVtoRGB(h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }

        function randomColors(total) {
            var i = 360 / (total - 1); // distribute the colors evenly on the hue range
            var r = []; // hold the generated colors
            for (var x = 0; x < total; x++) {
                r.push(HSVtoRGB(i * x, 100, 100)); // you can also alternate the saturation and value for even more contrast between the colors
            }
            return r;
        }

        const getUniqueData = (key) => {
            return data.map((x) => x[key]).filter((x, i, a) => a.indexOf(x) === i)
        }

        let uniqueComputers = getUniqueData("ComputerName").sort()

        let uniqueUpdates = data.map(d => {
            let space_count = 0;
            let third_space_index = 0;
            let str = d["Patch Name"]

            for (let str_i = 0; str_i < str.length; str_i++) {
                if (space_count === 3) {
                    third_space_index = str_i;
                    break;
                }
                if (str[str_i] === " ")
                    space_count++
            }

            // console.log("third space index ", third_space_index)
            // console.log("patches ", d["Patch Name"]);

            return (str.slice(0, third_space_index))
        }).filter((x, i, a) => a.indexOf(x) === i)

        let uniqueColors = randomColors(uniqueUpdates.length)

        console.log("unique updates ", uniqueUpdates)
        console.log("unique colors ", uniqueColors)


        // console.log("derived string ", str.slice(0,29))

        console.log("unique computers ", uniqueComputers)
        console.log("ineer ", window.innerWidth)
        

        var margin = { top: 20, right: 20, bottom: 30, left: 50 }


        /* default_width = 700 - margin.left - margin.right;
        default_height = 10;
        default_ratio = default_width / default_height; */

        current_width = window.innerWidth;
        current_height = 10;
        current_ratio = current_width / current_height;

        // var width = current_ratio > default_ratio ? default_width : current_width,
        var width, height;

        // width is default as window width, later resized w.r.t to width of div(check last lines of code)
        width = current_width - margin.left - margin.right
        height = current_height;


        // start loop for multi timelines
        for (let multidata_index = 0; multidata_index < uniqueComputers.length; multidata_index++) {

            // width = 1200,
            // height = 50 - margin.top - margin.bottom;
            // height = ((multidata_index + 1)*100) - margin.top - margin.bottom;


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


            const reDraw = (param) => {


                filteredTimeline = data.filter((d, i) => {
                    return d["ComputerName"] === param
                })

                // console.log(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); }))

                var x = d3.scaleTime()
                    .domain(d3.extent(filteredTimeline, function (d) { return parseTime(d.InstallDate); }))
                    .range([0, width - margin.left - margin.right]);
                    // .range([0, parseInt(d3.select(`.timeline${multidata_index}`).style('width'), 10)]);
                

                var xAxis = d3.axisBottom(x)
                // .ticks(d3.timeHour.every(12))


                // console.log(filteredTimeline)

                // removes
                /* d3.selectAll(".dot").remove()
                d3.selectAll(".x-axis").remove() */


                // document.getElementById("updates").innerHTML = filteredTimeline.length;

                svg.selectAll(".dot")
                    .data(filteredTimeline)
                    .enter().append("circle")
                    .attr("class", "dot")   // x(parseTime(d.InstallDate));
                    .attr("cx", function (d) { return x(parseTime(d.InstallDate)) })
                    .attr("cy", function (d) { return (height) })
                    .attr("fill", "#fff")
                    .attr("r", 2.5)
                    .attr("stroke", "black")
                    .attr("stroke-width", "1.5")
                    .on("mouseover", (d) => {
                        svg.selectAll(".dot").style("cursor", "pointer");
                        svg.select("path").style("cursor", "pointer");
    
                        tooltip.html(`
                                <strong>Patch Name: </strong>${d["Patch Name"]} <br/> 
                                <strong>Patch Release: </strong>${d["PatchReleaseDate"]} <br/>
                                <strong>Patch Installed On: </strong>${d["InstallDate"]} <br/>
                                <strong>Patch Category: </strong>${d["PatchCategory"]}
                            `);
    
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
            }

            // filterData()

            // For retrieving unique values from JSON data

            // const uniqueDates = getUniqueData("InstallDate")



            // console.log("dropdown ", filteredDropdownData)

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

            d3.select("body").append("div").attr("class", `timeline${multidata_index}`)
            d3.select(`.timeline${multidata_index}`).append("div").attr("class", `computer-id${multidata_index} computer-names`)
            document.getElementsByClassName(`computer-id${multidata_index}`)[0].innerHTML = `${uniqueComputers[multidata_index]}`
            // $(this).select(`.computer-id${multidata_index}`).innerHTML = uniqueComputers[multidata_index]

            var svg = d3.select(`.timeline${multidata_index}`)
                        .style("overflow", "hidden")
                        .style("resize", "horizontal")
                        .append("div")
                        .attr("id", `timeline-chart${multidata_index}`)
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("class", "fishy")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            d3.select(`.timeline${multidata_index}`)
                .style("border", "1px solid black")
                .style("margin", "5px 20px")
                .style("border-radius", "7px")
                .style("resize", "horizontal")

            console.log("div width ", $(`.timeline${multidata_index}`).width())

            // changing width of chart w.r.t to width of div
            width = $(`.timeline${multidata_index}`).width() - margin.right
            

            reDraw(uniqueComputers[multidata_index])
            // reDraw()
        }
    })