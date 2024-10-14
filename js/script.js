document.addEventListener("DOMContentLoaded", function() {
    // Load D3.js library for CSV parsing
    const d3Script = document.createElement('script');
    d3Script.src = "https://d3js.org/d3.v7.min.js";
    d3Script.onload = function() {
        // Load first CSV file for the original visualizations
        d3.csv("data/Filtered_Australian_Tourism_Data.csv").then(data => {
            // Convert numeric fields appropriately
            data.forEach(d => {
                d.Visitors = +d.Visitors;
                d.Rating = +d.Rating;
            });

            // Define a shared selection named "CategorySelect"
            const sharedSelection = {
                "CategorySelect": {
                    "type": "multi",
                    "fields": ["Category"],
                    "bind": "legend"  // Bind selection to the legend to allow selection by clicking the legend
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
                "selection": sharedSelection,
                "encoding": {
                    "x": { "field": "Category", "type": "nominal", "title": "Category" },
                    "y": { "aggregate": "mean", "field": "Rating", "type": "quantitative", "title": "Average Rating" },
                    "color": {
                        "condition": {
                            "selection": "CategorySelect",
                            "field": "Category",
                            "type": "nominal"
                        },
                        "value": "lightgray"  // Unselected bars are gray
                    },
                    "tooltip": [
                        { "field": "Category", "type": "nominal", "title": "Category" },
                        { "aggregate": "mean", "field": "Rating", "type": "quantitative", "title": "Average Rating" }
                    ]
                }
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
                "selection": sharedSelection,
                "encoding": {
                    "x": { "field": "Category", "type": "nominal", "title": "Category" },
                    "y": { "field": "Visitors", "type": "quantitative", "title": "Number of Visitors" },
                    "color": {
                        "condition": {
                            "selection": "CategorySelect",
                            "field": "Category",
                            "type": "nominal"
                        },
                        "value": "lightgray"  // Unselected bars are gray
                    },
                    "tooltip": [
                        { "field": "Category", "type": "nominal", "title": "Category" },
                        { "field": "Visitors", "type": "quantitative", "title": "Number of Visitors" }
                    ]
                }
            };
            vegaEmbed('#visVisitors', specVisitors);

            // Synchronize selections between the two visualizations
            vegaEmbed('#visRatings', specRatings).then((result1) => {
                vegaEmbed('#visVisitors', specVisitors).then((result2) => {
                    const view1 = result1.view;
                    const view2 = result2.view;
                    view1.addSignalListener('CategorySelect_tuple', function(name, value) {
                        view2.signal('CategorySelect_tuple', value).run();
                    });
                    view2.addSignalListener('CategorySelect_tuple', function(name, value) {
                        view1.signal('CategorySelect_tuple', value).run();
                    });
                });
            });

        }).catch(error => console.error('Error loading the CSV data:', error));

        // Load scatter plot from the new CSV file
        d3.csv("data/2.1 Short-term visitor arrivals.csv").then(scatterData => {
            // Convert numeric fields appropriately if needed
            scatterData.forEach(d => {
                d.Visitors = +d.Visitors;
                d.Rating = +d.Rating;
            });

            // Specification for Scatter Plot Visualization
            const specScatter = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Scatter plot showing relationship between rating and number of visitors.",
                "data": { "values": scatterData },
                "mark": "point",
                "width": 600,
                "height": 400,
                "encoding": {
                    "x": {
                        "field": "Rating",
                        "type": "quantitative",
                        "title": "Average Rating"
                    },
                    "y": {
                        "field": "Visitors",
                        "type": "quantitative",
                        "title": "Number of Visitors"
                    },
                    "color": {
                        "field": "Category",
                        "type": "nominal",
                        "title": "Category"
                    },
                    "tooltip": [
                        { "field": "Category", "type": "nominal", "title": "Category" },
                        { "field": "Rating", "type": "quantitative", "title": "Average Rating" },
                        { "field": "Visitors", "type": "quantitative", "title": "Number of Visitors" }
                    ]
                }
            };

            // Embed the scatter plot visualization
            vegaEmbed('#visScatter', specScatter).catch(console.error);
        }).catch(error => console.error('Error loading the scatter CSV data:', error));
    };
    document.head.appendChild(d3Script);
});