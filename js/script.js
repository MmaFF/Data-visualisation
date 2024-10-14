document.addEventListener("DOMContentLoaded", function() {
    // Load D3.js library for CSV parsing
    const d3Script = document.createElement('script');
    d3Script.src = "https://d3js.org/d3.v7.min.js";
    d3Script.onload = function() {
        // Load map visualization without data for initial testing
        const specMap = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "Map of Australia for testing without data",
            "width": 800,
            "height": 500,
            "data": {
                "url": "js/ne_10m_admin_0_countries2.topojson",
                "format": {
                    "type": "topojson",
                    "feature": "ne_10m_admin_0_countries2"
                }
            },
            "projection": {
                "type": "mercator"
            },
            "mark": {
                "type": "geoshape",
                "fill": "lightgray",
                "stroke": "white"
            },
            "encoding": {
                "tooltip": [
                    { "field": "properties.NAME", "type": "nominal", "title": "Country" }
                ]
            }
        };

        // Embed the map visualization
        vegaEmbed('#visMap', specMap).catch(console.error);
    };
    document.head.appendChild(d3Script);
});