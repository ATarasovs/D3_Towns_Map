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
