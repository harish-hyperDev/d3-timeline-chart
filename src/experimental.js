
// const fetchData = async () => {
//     return await fetch('originalData.json').then(res => { return res.json() }).then(resData => { return resData })
// }

let parseTime = d3.timeParse("%d %b %Y %H:%M %p");
console.log(parseTime("22 May 2022 10:56 PM"))

// var result = fetchData()
d3.json('originalData.json', async function (err, data) {
    // .then(data => {

    // console.log("data length ", data.length)
    // console.log("loading ", data[multidata_index]['ComputerName'])
    if(err) 
        console.log("error fetching data");

    const getUniqueData = (key) => {
        return data.map((x) => x[key]).filter((x, i, a) => a.indexOf(x) === i)
    }

    let uniqueComputers = getUniqueData("ComputerName").sort()

    let uniqueUpdates = await data.map( (d) => {
        let space_count = 0;
        let third_space_index = 0;
        let str = d["Patch Name"]

        for (let str_i = 0; str_i < str.length; str_i++) {
            if (space_count === 3) {
                third_space_index = str_i;
                break;
            }
            
            // console.log("splits ", str.split(" ").length)
            
            if (str[str_i] === " ") {
                space_count++
            }
        }

        // console.log("third space index ", third_space_index)
        // console.log("patches ", d["Patch Name"]);

        return (str.slice(0, third_space_index))
    }) // .filter((x, i, a) => a.indexOf(x) === i)
    uniqueUpdates = [...new Set(uniqueUpdates)]

    // START OF Testing functions for getting unique colors based on length of 'uniqueUpdates.length'
    const getMyColor = (colorsLength) => {
        console.log("x ", colorsLength)
        let r = [];
        for (let i = 0; i < colorsLength; i++) {
            let n = (Math.random() * 0xfffff * 1000000).toString(16);
            r.push('#' + n.slice(0, 6));
        }
        return r;
    };

    var myColor = d3.scaleSequential()
                    .domain([0, uniqueUpdates.length])
                    .interpolator(d3.interpolateViridis);

    
    console.log("d3 color", d3.color(myColor(0)))
    
    function rgbToHex(x) {
        // console.log("to hex ", x.split("(")[1].split(")")[0].split(","))
        let r = x.split("(")[1].split(")")[0].split(",")[0]
        let g = x.split("(")[1].split(")")[0].split(",")[1]
        let b = x.split("(")[1].split(")")[0].split(",")[2]
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }
    
    // alert(rgbToHex(0, 51, 255));
    console.log("d3 color ", myColor(73))
    // END OF Testing functions for getting unique colors based on length of 'uniqueUpdates.length'
    
    let uniqueHexColors = /*d3.scaleLinear()
                            .domain([0, uniqueUpdates.length])
                            .range(["#a9a9a9", "#FFA500", "#FFC0CB"])*/

                        d3.scaleQuantize()
                            .domain([0,50])
                            .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", 
                            "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
                        

    console.log("test hex ", d3.interpolateViridis(0.91))
    // console.log("ordinals ", rgbToHex(uniqueHexColors(15)))
    // console.log("hex colors ", uniqueHexColors[0])

    // let rgbRegex = /(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])/
    // console.log("regex test ", myColor(2).match(rgbRegex))

    // let nc = myColor(2)
    // nc = nc.split('(')
    // nc = nc.split(")")
    // console.log("split test ", nc)

    console.log("my colors ", getMyColor(100))
    console.log("unique updates ", uniqueUpdates)


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

    console.log("width ", width)


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

            // removes the previous chart before drawing new one.
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
                .attr("stroke", (d) => {
                                        // console.log("stroke color ", d); 
                                        let uc
                                        for(let i = 0; i < uniqueUpdates.length; i ++) {
                                            if(d["Patch Name"].includes(uniqueUpdates[i])) {
                                                
                                                // console.log("at i ", i, d["Patch Name"], " ---->>> ", uniqueUpdates[i])
                                                // 2022-02 Update for Windows 10 Version 20H2 for x64-based Systems (KB5001716)
                                                
                                                // uc = rgbToHex(uniqueHexColors(i));
                                                uc = uniqueHexColors(i)
                                                break;
                                            } else {
                                                uc = "#FFC0CB"
                                            }
                                        }
                                            
                                        // console.log("my uc ", uc)
                                        // console.log("uq ", d3.color(uc))
                                        return uc
                                    })

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
            .style("overflow", "hidden")
            // .style("resize", "horizontal")
            // .style("resize", "horizontal")

        console.log("div width ", $(`.timeline${multidata_index}`).width())

        $(`.timeline${multidata_index}`).resizable({
            handles: 'e, w'
        });

        $(`.timeline${multidata_index}`).resize( function () {
            console.log("resized chart ", multidata_index)
            // $('body').prepend('<div>' + $(`.timeline${multidata_index}`).width() + '</div>');
        })


        /* document.querySelector(`.timeline${multidata_index}`)
                .addEventListener("resize", () => { 
                    // console.log("resized chart ", multidata_index) 
                    $('body').prepend('<div>' + $(`.timeline${multidata_index}`).width() + '</div>');
                }) */

        // changing width of chart w.r.t to width of div
        width = $(`.timeline${multidata_index}`).width() - margin.right


        reDraw(uniqueComputers[multidata_index])
        // reDraw()
    }
})
