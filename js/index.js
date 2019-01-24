$(document).ready(function() {
    //append background
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);

    // append <g> to svg container
    g = svg.append("g");

    // call zoom for zooming and dragging
    svg.call(zoom);
    // .call(zoom.event);
    drawMap();
    initButtonClick();
    initKeyPress();
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

function getTownsList() {
    marks = [];
    var cities = [];
    var size = 0;

    towns = $.ajax({
        dataType: "json",
        url: "http://35.211.124.163/Circles/Towns/" + townsNumber,
        mimeType: "application/json",
        success: function(result){
            $.each(result, function(i, obj) {
                var latitude  = obj.lat;
                var longitude  = obj.lng;
                var town = obj.Town;
                var population  = obj.Population;
                var county = obj.County;

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
        }
    });
}

//in zoom
function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.scale + "px");
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
