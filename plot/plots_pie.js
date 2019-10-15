
var trace1 = {
  labels: ['Coal', 'NaturalGas', 'Petroleum', 'Nuclear', 'Renewable'],
  values: [13839632, 28042043, 36261788, 8418968, 10895475],
  type: 'pie'
};

var data = [trace1];

var layout = {
  title: "2017 US Primary Energy Consumption by Source",
};

Plotly.newPlot("plot", data, layout);

