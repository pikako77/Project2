////////////////////////////////////
// Initial setting
let energyType = 'Coal';
let yr = 2017;
let normalizationConst = 10e3; // for plot. apply in all energyType except Nuclear
let ColorStep = 9;

// Color code from https://www.colorhexa.com/color-names
let ColorStart = "#ffff99";// Canary (light yellow)
let ColorMid = '#ff0038';//"Carmine red";
let ColorEnd = '#002e63';//"Cool black";
let lastColor = "#2c1608"; //Zinnwaldite brown


////////////////////////////////////////////
function init() {

	build_selector_yr();
	build_selector_state();

	build_map(energyType, yr);

}

function build_selector_yr() {

	var selector = d3.select("#selDataset_yr");
	// Use the list of sample names to populate the select options
	d3.json("/data/year").then((year) => {
		year.forEach((sample) => {
			selector
				.append("option")
				.text(sample)
				.property("value", sample);
		}); //foreach
	}); //d3.json("/data/year").then((year)
}

function build_selector_state() {
	var selector = d3.select("#selDataset_enegeryType");
	// Use the list of sample names to populate the select options
	d3.json("/data/energyType").then((energyType) => {

		energyType.forEach((sample) => {
			selector
				.append("option")
				.text(sample)
				.property("value", sample);
		}); //foreach
	}); //d3.json("/data/year").then((year)
}


function get_min(data_array) {
	let min_val = 9999;

	for (i = 0; i < data_array.length; i++) {
		if (data_array[i] < min_val) {
			min_val = data_array[i];
		}
	}
	return min_val;

}

function get_max(data_array) {
	let max_val = -9999;

	for (i = 0; i < data_array.length; i++) {
		if (data_array[i] > max_val) {
			max_val = data_array[i];
		}
	}
	return max_val;
}

function get_interval(var_min, var_max, ColorStep) {
	let interval = [];
	let start_val = Math.floor(var_min / 10) * 10;
	let end_val = Math.floor(var_max / 10) * 10;

	for (let i = start_val; i < ColorStep; i++) {
		interval[i] = start_val + i * (end_val - start_val) / (ColorStep + 1);
	}

	// console.log(interval);
	return interval;
}

function findIndex(val, interval) {
	let valColorIdx = -1; // initialization

	for (let i = 0; i < interval.length; i++) {
		if (val > interval[i] && val <= interval[i + 1]) {
			valColorIdx = i;
		}
	}
	if (val > interval[-1]) {
		valColorIdx = interval.length + 1;
	}
	
	return valColorIdx;
}

function getColorScale(colorStart, colorMid, colorEnd) {
	const scaleLch = chroma.scale([colorStart, colorMid, colorEnd])
		.mode("lch")
		.colors(ColorStep);

	return scaleLch;

}
function getColor(d, var_min, var_max, ColorStep) {

	const scaleLch = getColorScale(ColorStart, ColorMid, ColorEnd);

	let idx = -1;

	ColorScaleInterval = get_interval(var_min, var_max, ColorStep);
	idx = findIndex(d, ColorScaleInterval);
	last_idx = ColorScaleInterval.length - 1;

	let colorVal = scaleLch[idx];
	if (d == 0) colorVal = scaleLch[0];
	if (d >= ColorScaleInterval[last_idx]) colorVal = lastColor;

	return colorVal;
}

// Creating map object
var myMap = L.map("map", {
	center: [37.8, -96],
	zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "mapbox.light",
	accessToken: API_KEY
}).addTo(myMap);


var legend = L.control({ position: 'bottomright' });
var info = L.control();


function build_map(energyType, yr) {
	console.log('modify_geoJson', energyType, yr);

	let state = [];
	let consump = [];
	let consumption_array = [];


	d3.json(`/${energyType}/${yr}`).then((data) => {
		console.log('d3.json(`/${energyType}/${yr}`)', data);
		console.log(data.length);
		for (i = 0; i < data.length; i++) {
			state[i] = data[i].State;
			consump[i] = data[i].consumption;
		}

		for (i = 0; i < statesData.features.length; i++) {
			for (j = 0; j < state.length; j++) {

				if (statesData.features[i].properties["Abbr"] == state[j]) {
					tmp = consump[j].replace(",", "").replace(",", "").replace(",", "");
					
					statesData.features[i].properties["consumption"] = +tmp;
					
					consumption_array[i] = +tmp;

					if (energyType !== 'Nuclear') {
						statesData.features[i].properties["consumption"] = statesData.features[i].properties["consumption"] / normalizationConst;
						consumption_array[i] = consumption_array[i] / normalizationConst;
					}
				}
			}

		}


		//console.log('Check updated GeoJson', statesData);
		let consumption_min = get_min(consumption_array);
		let consumption_max = get_max(consumption_array);

		function style(feature) {

			let curStyle = {
				fillColor: getColor(feature.properties.consumption, consumption_min, consumption_max, 9),
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7
			};

			return curStyle;
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.9
			});

			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				layer.bringToFront();
			}
			info.update(layer.feature.properties);
		}

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
			});
		}

		//var geojson;
		// ... our listeners
		//
		var geojson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(myMap);

		info.onAdd = function (myMap) {
			this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			this.update();
			return this._div;
		};

		// method that we will use to update the control based on feature properties passed
		info.update = function (props) {

			if (energyType !== 'Nuclear') {
				this._div.innerHTML = '<h3>US Energy consumption </h3>' + (props ?
					`<h5>${props.name}</h5><h5>${props.consumption} x 1000 BTU</h5>`
					: '<h4>Hover over a state</h4>');
			}
			else {
				this._div.innerHTML = '<h3>US Energy consumption </h3>' + (props ?
					`<h5>${props.name}</h5><h5>${props.consumption} BTU</h5>`
					: '<h4>Hover over a state</h4>');
			}

		};

		info.addTo(myMap);

		legend.onAdd = function (myMap) {

			grades = [];

			var div = L.DomUtil.create('div', 'info legend'),

				grades = get_interval(consumption_min, consumption_max, ColorStep),
				labels = [];

			colorScale = getColorScale(ColorStart, ColorMid, ColorEnd);


			// loop through our density intervals and generate a label with a colored square for each interval
			if (energyType !== 'Nuclear') {
				for (var i = 0; i < grades.length; i++) {
					div.innerHTML +=
						'<i style="background:' + colorScale[i + 1] + '"></i> ' +
						grades[i] + (grades[i + 1]   ? '&ndash;' + grades[i + 1] + 'x 1000' + '<br>' : '+');
				}
				div.innerHTML +=
					'<i style="background:' + lastColor +  '"></i> ';
			}
			else {
				for (var i = 0; i < grades.length; i++) {
					div.innerHTML +=
						'<i style="background:' + colorScale[i + 1] + '"></i> ' +
						grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				}
				div.innerHTML +=
					'<i style="background:' + lastColor + '"></i> ';
			}
			return div;
		};

		legend.addTo(myMap);

	});//d3.json("/data/year").then((year) 


}


function optionChanged_nrg(nrgType) {

	newEnergyType = nrgType.replace(" ", "");  // remove space for Natural Gas option 
	console.log("Update energy type", newEnergyType);
	optionChanged(newEnergyType, yr);
}

function optionChanged_yr(yr) {
	newYr = yr;
	console.log("Update yr", newYr);
	optionChanged(energyType, newYr);
}

function optionChanged(newEnergyType, newYr) {

	build_map(newEnergyType, newYr);
}

///////////////////
init();
