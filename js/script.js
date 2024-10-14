document.addEventListener("DOMContentLoaded", function() {
    // Load D3.js library for CSV parsing
    const d3Script = document.createElement('script');
    d3Script.src = "https://d3js.org/d3.v7.min.js";
    d3Script.onload = function() {
        d3.csv("data/tourism.csv").then(data => {
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

            // Map Visualization
            const specMap = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Bubble map showing number of visitors by Australian states.",
                "width": 800,
                "height": 500,
                "data": {
                    "url": "data/ne_10m_admin_0_countries.json",
                    "format": {
                        "type": "topojson",
                        "feature": "countries"
                    }
                },
                "projection": {
                    "type": "mercator"
                },
                "layer": [
                    {
                        "mark": {
                            "type": "geoshape",
                            "fill": "lightgray",
                            "stroke": "white"
                        },
                        "encoding": {
                            "shape": {
                                "field": "geometry",
                                "type": "geojson"
                            }
                        }
                    },
                    {
                        "data": {
                            "values": data
                        },
                        "mark": "circle",
                        "encoding": {
                            "longitude": {
                                "field": "longitude",
                                "type": "quantitative"
                            },
                            "latitude": {
                                "field": "latitude",
                                "type": "quantitative"
                            },
                            "size": {
                                "field": "Visitors",
                                "type": "quantitative",
                                "title": "Number of Visitors"
                            },
                            "color": {
                                "value": "steelblue"
                            },
                            "tooltip": [
                                { "field": "State", "type": "nominal", "title": "State" },
                                { "field": "Visitors", "type": "quantitative", "title": "Number of Visitors" }
                            ]
                        }
                    }
                ]
            };
            vegaEmbed('#visMap', specMap);
        }).catch(error => console.error('Error loading the CSV data:', error));
    };
    document.head.appendChild(d3Script);
});