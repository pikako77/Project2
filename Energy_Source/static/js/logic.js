function init() {

	build_selector_yr();
	build_selector_state();
	build_map();

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
	d3.json("/data/energyType").then((year) => {
		year.forEach((sample) => {
			selector
				.append("option")
				.text(sample)
				.property("value", sample);
		}); //foreach
	}); //d3.json("/data/year").then((year)
}

function modify_geoJson(energyType, yr){
	let state = [];
	let consump = [];

	d3.json(`/${energyType}/${yr}`).then((data) => {
		// console.log(data.length);
		for (i= 0; i<data.length -1; i++){
			state[i] = data[i].State;
			consump[i] = data[i].consumption;
		}

	for (i= 0; i<statesData.features.length -1; i++){
		for ( j = 0 ; j < state.length-1 ; j++){

			if (statesData.features[i].properties["Abbr"] == state[j]){

				statesData.features[i].properties["consumption"] = consump[j];
				//console.log(statesData.features[i].properties);
			}
		}
		
	}

	});
    return statesData;
}

function build_map() {
	let statesData_updated =[];
	var selector = d3.select("#map");
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
	statesData_updated = modify_geoJson('Coal', 2017);

	console.log(statesData_updated);
	var geojson = L.geoJson(statesData_updated, { style: style }).addTo(myMap);



	function getColor(d) {
	// 	chroma.scale(['#fafa6e','#2A4858'])
	// .mode('lch').colors(6);

		return d > 370000? '#d53e4f' :
			d > 300000 ? '#f46d43' :
				d > 250000 ? '#fdae61' :
					d > 200000 ? '#fee08b' :
						d > 150000 ? '#ffffbf' :
							d > 100000 ? 'e6f598':
								d > 50000 ? '#abdda4' :
									d > 0 ? '#66c2a5' :
									'#3288bd';
	}
	
	function style(feature) {
		return {
			fillColor: getColor(feature.properties.consumption),
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		};
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
	
	
	var info = L.control();
	
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

			this._div.innerHTML = '<h3>US Population Density</h3>' + (props ?
				'<b>' +  props.name + '</b><br />' + props.consumption + '<h4> people / mi<sup>2</sup></h4>'
				: '<h4>Hover over a state</h4>');
	};
	//'<h4>{props.name}</h4>'
	info.addTo(myMap);
	
	
	var legend = L.control({ position: 'bottomright' });
	
	legend.onAdd = function (myMap) {
		
		grades = [];

		// let consump_min = Math.min(consump);
		// let consump_max = Math.max(consump);

		// console.log(consump_min);
		// console.log(consump_max);

		// console.log(statesData_updated.features[0].properties);

		// var div = L.DomUtil.create('div', 'info legend'),
		// 	grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		// 	labels = [];

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 10, 20, 50, 100, 200, 500, 1000],
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

}







///////////////////
init();