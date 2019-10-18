var energyType = 'Coal';
var yr = 1960;

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

// function modify_geoJson(energyType, yr) {
// 	console.log('modify_geoJson', energyType, yr);

// 	let state = [];
// 	let consump = [];
	

// 	d3.json("/data/year").then((year) => {
// 		var selector_yr = d3.select("#selDataset_yr");
// 		var selector_nrg = d3.select("#selDataset_enegeryType");

// 		d3.json("/data/energyType").then((energyType) => {
// 			energyType.forEach((sample) => {
// 				selector_nrg.append("option")
// 					.text(sample)
// 					.property("value", sample);
// 			}); //foreach energyType
// 			year.forEach((sample) => {
// 				selector_yr.append("option")
// 					.text(sample)
// 					.property("value", sample);
// 			}); //foreach year


// 			d3.json(`/${energyType}/${yr}`).then((data) => {
// 				// console.log(data.length);
// 				for (i = 0; i < data.length; i++) {
// 					state[i] = data[i].State;
// 					consump[i] = data[i].consumption;
// 				}

// 				for (i = 0; i < statesData.features.length; i++) {
// 					for (j = 0; j < state.length; j++) {

// 						if (statesData.features[i].properties["Abbr"] == state[j]) {
// 							tmp = consump[j].replace(",", "").replace(",", "");
// 							console.log(consump[j], tmp);
// 							statesData.features[i].properties["consumption"] = +tmp;
// 							console.log(statesData.features[i].properties);
// 						}
// 					}

// 				}

// 			}); //d3.json(`/${energyType}/${yr}`).then((data)
// 		}); //d3.json("/data/energyType").then((year) 
// 	});//d3.json("/data/year").then((year) 
// 			return statesData;
// }
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
		// var selector = d3.select("#map");
		
function build_map(energyType, yr) {
		console.log('modify_geoJson', energyType, yr);

	let state = [];
	let consump = [];
	

	// d3.json("/data/year").then((yr_label) => {
		
	// 	var selector_yr = d3.select("#selDataset_yr");
	// 	var selector_nrg = d3.select("#selDataset_enegeryType");
	// 	console.log('build map', energyType, yr);
		
	// 	d3.json("/data/energyType").then((energyType_label) => {
			
	// 		energyType_label.forEach((sample) => {
	// 			selector_nrg.append("option")
	// 				.text(sample)
	// 				.property("value", sample);
	// 		}); //foreach energyType
	// 		console.log('yr', yr_label);
	// 		yr_label.forEach((sample) => {
	// 			selector_yr.append("option")
	// 				.text(sample)
	// 				.property("value", sample);
	// 		}); //foreach year


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
							// console.log('check reformatting',consump[j], tmp);
							statesData.features[i].properties["consumption"] = +tmp;
							// console.log('check properties',statesData.features[i].properties);
						}
					}

				}

				//var selector = d3.select("#map");
		console.log('Check updated GeoJson', statesData);

		function getColor(d) {
			// 	chroma.scale(['#fafa6e','#2A4858'])
			// .mode('lch').colors(6);

			return d > 1500000 ? '#d53e4f' :
				d > 1000000 ? '#f46d43' :
					d > 50000 ? '#fdae61' :
						d > 10000 ? '#fee08b' :
							d > 5000 ? '#ffffbf' :
								d > 2000 ? 'e6f598' :
									d > 1000 ? '#abdda4' :
										d > 0 ? '#66c2a5' :
											'#3288bd';
		}

		function style(feature) {
			// console.log('style()')
			// console.log('style feature', feature);
			// console.log('feature.properties.consumption', feature.properties.consumption);
			// console.log('feature.properties.name', feature.properties.name);
			let curStyle = {
				fillColor: getColor(feature.properties.consumption),
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7
			};
			console.log('curStyle', curStyle);
			return curStyle;
		}




		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
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

		// function zoomToFeature(e) {
		// 	map.fitBounds(e.target.getBounds());
		// }

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				//click: zoomToFeature
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
			// this._div.innerHTML = '<h3>US Population Density</h3>' + (props ?
			// 	'<b>' +  props.name + '</b><br />' + props.density + '<h4> people / mi<sup>2</sup></h4>'
			// 	: '<h4>Hover over a state</h4>');

			this._div.innerHTML = '<h3>US Energy consumption </h3>' + (props ?
				`<h5>${props.name}</h5><h5>${props.consumption} BTU</h5>`
				: '<h4>Hover over a state</h4>');
		};
		//'<h4>{props.name}</h4>'
		info.addTo(myMap);



		legend.onAdd = function (myMap) {

			grades = [];

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 1000, 2000, 5000, 10000, 50000, 1000000, 1500000],
				labels = [];

			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < grades.length; i++) {
				div.innerHTML +=
					'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
					grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
			}

			return div;
		};
		legend.addTo(myMap);


		
	});//d3.json("/data/year").then((year) 
				
				
}


function optionChanged_nrg(nrgType) {


	newEnergyType = nrgType.replace(" ","") ;  // remove space for Natural Gas option 
	console.log("Update energy type",newEnergyType);
	optionChanged(newEnergyType , yr);
}

function optionChanged_yr(yr) {
	newYr = yr ;
	console.log("Update yr",newYr);
	optionChanged(EnergyType , newYr);
}

function optionChanged(newEnergyType,newYr) {

	build_map(newEnergyType, newYr);
}		



///////////////////
init();
