document.addEventListener("DOMContentLoaded", function() {
    // Load D3.js library for CSV parsing
    const d3Script = document.createElement('script');
    d3Script.src = "https://d3js.org/d3.v7.min.js";
    d3Script.onload = function() {
        d3.csv("data/Filtered_Australian_Tourism_Data.csv").then(data => {
            // Convert numeric fields appropriately
            data.forEach(d => {
                d.Visitors = +d.Visitors;
                d.Rating = +d.Rating;
            });

            // Create a selection that can be used for filtering both charts
            const selection = {
                "selection": {
                    "CategorySelect": {
                        "type": "multi",
                        "fields": ["Category"],
                        "bind": "legend"
                    }
                }
            };

            // Visualization 1: Average Rating by Category
            const specRatings = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Average Rating by Category",
                "data": { "values": data },
                "mark": "bar",
                "width": "container",
                "height": "container",
                "encoding": {
                    "x": { "field": "Category", "type": "nominal", "title": "Category" },
                    "y": { "aggregate": "mean", "field": "Rating", "type": "quantitative", "title": "Average Rating" },
                    "color": {
                        "field": "Category",
                        "type": "nominal",
                        "legend": {"title": "Select Category"}
                    }
                },
                "selection": selection["selection"]
            };
            vegaEmbed('#visRatings', specRatings);

            // Visualization 2: Number of Visitors by Category
            const specVisitors = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Visitors by Category",
                "data": { "values": data },
                "mark": "bar",
                "width": "container",
                "height": "container",
                "encoding": {
                    "x": { "field": "Category", "type": "nominal", "title": "Category" },
                    "y": { "field": "Visitors", "type": "quantitative", "title": "Number of Visitors" },
                    "color": {
                        "field": "Category",
                        "type": "nominal",
                        "legend": null  // Hide the legend as we already use it in specRatings
                    }
                },
                "selection": selection["selection"]
            };
            vegaEmbed('#visVisitors', specVisitors);
        }).catch(error => console.error('Error loading the CSV data:', error));
    };
    document.head.appendChild(d3Script);
});