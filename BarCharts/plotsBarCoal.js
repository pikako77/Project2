
var trace1 = {
  x: data.map(row => row.stateName),
  y: data.map(row => row.coalSearchResults),
  name: "Coal",
  type: "bar"
};


var trace2 = {
  x: data.map(row => row.stateName),
  y: data.map(row => row.naturalSearchResults),
  name: "NaturalGas",
  type: "bar"
};

var trace3 = {
  x: data.map(row => row.stateName),
  y: data.map(row => row.petroleumSearchResults),
  name: "Petroleum",
  type: "bar"
};

var trace4 = {
  x: data.map(row => row.stateName),
  y: data.map(row => row.nuclearlSearchResults),
  name: "Nuclear",
  type: "bar"
};

var trace5 = {
  x: data.map(row => row.stateName),
  y: data.map(row => row.renewableSearchResults),
  name: "Renewable",
  type: "bar"
};
// Combining both traces
var data = [trace1];

// Apply the group barmode to the layout
var layout = {
  title: "Coal Consumption by State",
  // barmode: "group"
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("plot", data, layout);
