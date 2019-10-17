var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Type";


// function used for updating x-scale var upon click on axis label
function xScale(d3Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(d3Data, d => d[chosenXAxis]) * 0.8,
      d3.max(d3Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip

// function updateToolTip(chosenXAxis, circlesGroup) {

//   if (chosenXAxis === "poverty") {
//     var label = "Poverty%";
//   }
//   else {
//     var label = "Age";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>Poverty: ${d.poverty}% <br>Obesity: ${d.obesity}%`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//     return circlesGroup;
// }

// Retrieve data from the CSV file and execute everything below
d3.csv("./db/Alltypes.csv").then(function(d3Data, err) {
  if (err) throw err;

  // parse data
  d3Data.forEach(function(data) {
    data.Type = data.Type;
    data.State = data.State;
    data.Total = +data.Total
    
  });
});


//   xLinearScale function above csv import
  var xLinearScale = xScale(d3Data, chosenXAxis);

//   Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(d3Data, d => d.Total)])
    .range([height, 0]);



  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(d3Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("r", 15)
    .attr("fill", "lightblue")
    .attr("opacity", ".6");


//   // circlesGroup.selectAll()
//   //   .data(d3Data)
//   //   .enter()
//   //   .append("text")
//   //   .attr("cx", d => xLinearScale(d[chosenXAxis]))
//   //   .attr("cy", d => yLinearScale(d[chosenYAxis]))
//   //   // .attr("cy", d => yLinearScale(d.healthcare)) //JK: this should change dynamically
//   //   .text(d => d.abbr);

//   // circlesGroup.append()
//   //   .text(function(state) {

//   //   return d.abbr;

//   //   }).attr("cx", d => xLinearScale(d[chosenXAxis]))
//   //   .attr("cy", d => yLinearScale(d.healthcare))


//   // Create group for  3 x- axis labels

//   var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

//   var povertyLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "poverty") // value to grab for event listener
//     .classed("active", true)
//     .text("In Poverty (%)");

//   var ageLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "age") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Age (Mediam)");

//   var incomeLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 60)
//     .attr("value", "income") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Household Income (Median)");


//   // append y axis

//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Obese (%)");
  
//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 20 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Smoke (%)");
  
//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 40 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Lakes Healthcare (%)");

//   // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//       var value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {

//         // replaces chosenXAxis with value
//         chosenXAxis = value;

//         console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(d3Data, chosenXAxis);

//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "poverty") {
//           povertyLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           incomeLabel
//             .classed("active", false)
//             .classed("inactive", true);
          
//         }
//         else if (chosenXAxis === "age") {
//           povertyLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           ageLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           incomeLabel
//             .classed("active", false)
//             .classed("inactive", true);

//         }
//         else {
//           povertyLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           incomeLabel
//             .classed("active", true)
//             .classed("inactive", false);
          
//         }  

//       }


//       // else (value !== chosenYAxis) {

//       //   // replaces chosenXAxis with value
//       //   chosenYAxis = value;

//       //   console.log(chosenYAxis)

//       //   // functions here found above csv import
//       //   // updates y scale for new data
//       //   yLinearScale = yScale(d3Data, chosenYAxis);

//       //   // updates y axis with transition
//       //   yAxis = renderAxes(yLinearScale, yAxis);

//       //   // updates circles with new x values
//       //   circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

//       //   // updates tooltips with new info
//       //   circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

//       //   // changes classes to change bold text
//       //   if (chosenYAxis === "healthcare") {
//       //     povertyLabel
//       //       .classed("active", true)
//       //       .classed("inactive", false);
//       //     ageLabel
//       //       .classed("active", false)
//       //       .classed("inactive", true);
//       //     incomeLabel
//       //       .classed("active", false)
//       //       .classed("inactive", true);
          
//       //   }
//       //   else if (chosenYAxis === "smokes") {
//       //     povertyLabel
//       //       .classed("active", false)
//       //       .classed("inactive", true);
//       //     ageLabel
//       //       .classed("active", true)
//       //       .classed("inactive", false);
//       //     incomeLabel
//       //       .classed("active", false)
//       //       .classed("inactive", true);

//       //   }
//       //   else {
//       //     povertyLabel
//       //       .classed("active", false)
//       //       .classed("inactive", true);
//       //     ageLabel
//       //       .classed("active", false)
//       //       .classed("inactive", true);
//       //     incomeLabel
//       //       .classed("active", true)
//       //       .classed("inactive", false);
          
//       //   }  

//       // }
    
    
//     });




//   }).catch(function(error) {
//   console.log(error);
// });
