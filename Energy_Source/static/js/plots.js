
// Create the Traces
var trace1 = {
  x: data.year,
  y: data.energyCoal,
  mode: "markers",
  type: "scatter",
  name: "Coal",
  marker: {
    color: "#2077b4",
    symbol: "hexagram"
  }
};

var trace2 = {
  x: data.year,
  y: data.energyNaturalGas,
  mode: "markers",
  type: "scatter",
  name: "Natural Gas",
  marker: {
    color: "orange",
    symbol: "diamond-x"
  }
};

var trace3 = {
  x: data.year,
  y: data.energyPetroleum,
  mode: "markers",
  type: "scatter",
  name: "Petroleum",
  marker: {
    color: "red",
    symbol: "cross"
  }
};

var trace4 = {
  x: data.year,
  y: data.energyNuclear,
  mode: "markers",
  type: "scatter",
  name: "Nuclear",
  marker: {
    color: "rgba(156, 165, 196, 1.0)",
    symbol: "star-triangle-up"
  }
};

var trace5 = {
  x: data.year,
  y: data.energyRenewable,
  mode: "markers",
  type: "scatter",
  name: "Renewable",
  marker: {
    color: "green",
    symbol: "circle"
  }
};


// Create the data array for the plot
var data = [trace1, trace2, trace3, trace4, trace5];

// Define the plot layout
var layout = {
  title: "Energy Consumption by Source",
  xaxis: { title: "Year" },
  yaxis: { title: "Total consumption, billion Btu" }
};

// Plot the chart to a div tag with id "plot"
Plotly.newPlot("plot", data, layout);
