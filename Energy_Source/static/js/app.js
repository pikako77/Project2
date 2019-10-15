function build_map(energy_type, yr) {

    console.log('build_map');
    console.log(energy_type);
    console.log(yr);
    d3.json(`/${energy_type}/${yr}`).then((data) => {
        var selector = d3.select("#map");
        selector.html("");



        var count = 0;
        for (var i in data) {
            if (data.hasOwnProperty(i)) count++;
            console.log(data[i]);
            Object.entries(data[i]).forEach(([key, value]) => {
                selector.append("h5").text(`${key}: ${value}`);
            });

        }


        return data;
    }); // d3.json(`/${energy_type}/${yr}`).then( (data)

}  // function build_map(energy_type , yr)

function init() {
    energy_type = 'Coal';
    firstYr = '1960';

    build_map(energy_type, firstYr);

}//function init()


// Initialize the dashboard
init();
