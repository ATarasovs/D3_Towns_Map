/**
 * Author: Aleksandrs Tarasovs
 * Date: 24.01.2019
 *
 * The core functionality of D3 map was built with the help of https://bost.ocks.org/mike/map/ tutorial.
 */


$(document).ready(function() {

    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if (!(isChrome)) {
        svg.append("rect") //append background to the map
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

        g = svg.append("g"); // append <g> to svg container

        svg.call(zoom);  // call zoom for zooming and dragging

        // draw UK map using D3
        drawMap();

        // functions on button click
        initButtonClick();

        // functions on key press
        initKeyPress();
    } else {
        alert("It was detected that you are using Google Chrome browser. Please use Mozilla Firefox, to allow program to work properly.")
    }

});

function drawMap() {
    d3.json("uk.json", function(error, uk) {

        subunits = topojson.feature(uk, uk.objects.subunits);

        // Draw subunits (England, Scotland, etc....)
        g.selectAll(".subunit")
            .data(subunits.features)
            .enter().append("path")
            .attr("class", function(d) { return "subunit " + d.id; })
            .attr("d", path);

        // Attach labels to subunits
        g.selectAll(".subunit-label")
            .data(subunits.features)
            .enter().append("text")
            .attr("class", function(d) { return "subunit-label " + d.id; })
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.properties.name; });
    });
}

// Get json with cities (town names, lat, long, population and county)
function getTownsList() {
    marks = [];
    var size = 0; // image size assigned based on the population

    // request json from url
    towns = $.ajax({
        dataType: "json",
        url: "http://35.211.124.163/Circles/Towns/" + townsNumber,
        mimeType: "application/json",
        success: function(result){
            $.each(result, function(i, obj) {
                var latitude  = obj.lat; // latitude
                var longitude  = obj.lng; // longitude
                var town = obj.Town; // town name
                var population  = obj.Population; //population
                var county = obj.County; // county

                if (population <= 50000) {
                    size = 7;
                } else if (population > 50000 && population <= 100000) {
                    size = 9;
                } else if (population > 100000 && population <= 150000) {
                    size = 11;
                } else {
                    size = 13;
                }

                marks = marks.concat({long: longitude, lat: latitude, town: town, population: population, county: county, size: size});
            });
            appendCities();
        }
    });
}

// Function to append cities to  the map
function appendCities() {
    g.selectAll("image").remove();
    g.selectAll(".townTitle").remove();

    g.selectAll("image")
        .data(marks)
        .enter()
        .append("image")
        .attr('class','mark city')
        .attr('attribute-town',  function(d) { return d.town})
        .attr('style','cursor: pointer;')
        .attr('width', function(d) { return d.size})
        .attr('height', function(d) { return d.size})
        .attr("xlink:href",'http://icons.iconarchive.com/icons/aha-soft/standard-city/256/city-icon.png')
        .attr("transform", function(d) { return "translate(" + projection([d.long,d.lat]) + ")"; })
        .attr("text-anchor", "middle")
        .append("title")
        .text(function(d) { return "Town: " + d.town + "\nCounty: " + d.county + "\nPopulation: " + d.population});
}

function initButtonClick() {
    $('.requestButton').click(function(){
        townsNumber = $(".numberInput").val();
        if (townsNumber != null && townsNumber != "") {
            getTownsList();

        } else {
            g.selectAll(".mark").remove();
            alert("Input number must be a valid integer");
        }
    });

    $(document).on("click", ".city", function (e) {
        window.open("https://en.wikipedia.org/wiki/" + $(this).attr('attribute-town'));
    });


}

function initKeyPress() {
    $('.numberInput').keyup(function(e){
        if((e.keyCode == 13)){
            townsNumber = $(".numberInput").val();
            if (townsNumber != null && townsNumber != "") {
                getTownsList();
            } else {
                g.selectAll(".mark").remove();
                alert("Input number must be a valid integer");
            }
        }
    });
}

// Zoom
function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.scale + "px");
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
