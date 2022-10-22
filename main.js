var csv_data;
var state = true;

const margin = {top: 20, right: 40, bottom: 20, left: 40};

const width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
        .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand()
    .range([0,800])
    .round(true)
    .paddingInner(0.1);

const yScale = d3.scaleLinear()
    .range([height,0]);

const xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5, "s");

const yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(10, "s");

svg.append("g")
    .attr("class", "xAxis")

svg.append("g")
    .attr("class", "yAxis")
    // .call(yAxis)

// var yAxisDisplay = svg.append("g")
//     .attr("class", "axis y-axis")
//     .call(yAxis);

var yLabel = svg.append("text")
    .text("Stores")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", 0 + (width/500-20))
    .attr("y", 0 + (height/500-12))
    .attr("writing-mode", "horizontal-lr")
    .attr("font-size", 15);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

svg.append("g")
    .call(d3.axisLeft(yScale));

let type = d3.select('#group-by').node().value
//let sort = d3.select('#sort').node().value

function update(data, type){
    //Set x and y domains
    yScale.domain([0,d3.max(data.map(d=>d[type]))])
	xScale.domain(data.map(d=>d.company))

    const bars = svg.selectAll('.bar')
    .data(data)
    // .data(data, function(d){return d.company})

    bars.enter()
    .append("rect")
    .attr("x", d=>xScale(d.company))
    .attr("y", d=>yScale(d[type]))
    .merge(bars)
    .transition()
    .delay(1000)
    .duration(1000)
    .attr('x', d=>xScale(d.company))
    .attr('y', d => yScale(d[type]))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height-yScale(d[type]))
    .attr("fill", "steelblue")
    .attr("opacity", "10")
    .attr("class", "bar");

    bars.exit()
    .transition()
    .duration(1000)
    .remove();

    svg.select(".xAxis")
    .transition()
    .duration(1000)
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

    svg.select(".yAxis")
    .transition()
    .duration(1000)
    .call(yAxis)
    .attr("transform", `translate(0, 0)`);
}

d3.csv('coffee-house-chains.csv', d3.autotype).then(data => {
    update(data, type)

    document.querySelector("#group-by").addEventListener('change', (x)=> {
        type= x.target.value;
        update(data, type);
})
document.querySelector("#group-by").onclick=(function() {
    if (state == true) {
        update(data.sort((a,b) => b[type] - a[type]), type);
        state = false; 
    } else {
        update(data.sort((a,b) => a[type] - b[type]), type);
        state = true;

    }  
    })

})