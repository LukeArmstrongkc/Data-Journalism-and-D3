var svgWidth = 960;
var svgHeight = 600;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chart = svg.append("g")
  

// Import Data
d3.csv("data.csv")
  .then(function(stateData) {

    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });


var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {return (`${d.state}<br>Population in Poverty: ${d.poverty}%<br>Population w/o Health Care: ${d.healthcare}%`);});

chart.call(toolTip);

chart.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "20")
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
    .on("click", function(data) {toolTip.show(data, this);})
    .on("mouseout", function(data, index){toolTip.hide(data);});

chart.append("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .selectAll("tspan")
      .data(stateData)
      .enter()
      .append("tspan")
          .attr("x", function(data) {
              return xLinearScale(data.poverty - 0);
          })
          .attr("y", function(data) {
              return yLinearScale(data.healthcare - 0.2);
          })
          .text(function(data) {
              return data.abbr
          });

chart.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

chart.append("g")
      .call(leftAxis);

chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height /2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)"); 

chart.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
});
