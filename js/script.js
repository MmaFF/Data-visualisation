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

        // Load time series data from the new CSV file
        d3.csv("data/2.1 Short-term visitor arrivals.csv").then(timeSeriesData => {
            // Convert numeric fields appropriately if needed
            timeSeriesData.forEach(d => {
                d.trip = +d.trip;
                d.data = d3.timeParse("%b-%y")(d.data);  // Parse the "month-year" format
            });

            // Specification for Time Series Line Chart
            const specTimeSeries = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Line chart showing number of trips over time.",
                "data": { "values": timeSeriesData },
                "mark": "line",
                "width": 800,
                "height": 400,
                "encoding": {
                    "x": {
                        "field": "data",
                        "type": "temporal",
                        "title": "Date",
                        "axis": { "labelAngle": -45 }
                    },
                    "y": {
                        "field": "trip",
                        "type": "quantitative",
                        "title": "Number of Trips"
                    },
                    "tooltip": [
                        { "field": "data", "type": "temporal", "title": "Date" },
                        { "field": "trip", "type": "quantitative", "title": "Number of Trips" }
                    ]
                }
            };

            // Embed the time series line chart visualization
            vegaEmbed('#visTimeSeries', specTimeSeries).catch(console.error);
        }).catch(error => console.error('Error loading the CSV data:', error));

        d3.csv("data/tourism.csv").then(tourismData => {
            tourismData.forEach(d => {
                d.trips = +d.trips;
                d.quarter = d3.timeParse("%Y-Q%q")(d.quarter);  // Assuming the format is "2023-Q1"
            });
        
            // Load TopoJSON for Australia state boundaries
            d3.json("data/AUS_state.topojson").then(geoData => {
                // Specification for Choropleth Map with Time Axis
                const specMap = {
                    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                    "description": "Choropleth map showing number of trips per state over time.",
                    "data": {
                        "values": tourismData,
                        "format": { "type": "topojson", "feature": "name" }
                    },
                    "mark": {
                        "type": "geoshape",
                        "stroke": "white"
                    },
                    "projection": {
                        "type": "mercator"
                    },
                    "encoding": {
                        "color": {
                            "field": "trips",
                            "type": "quantitative",
                            "title": "Number of Trips"
                        },
                        "tooltip": [
                            { "field": "state", "type": "nominal", "title": "State" },
                            { "field": "trips", "type": "quantitative", "title": "Number of Trips" }
                        ]
                    },
                    "width": 600,
                    "height": 400
                };
        
                // Embed the map visualization
                vegaEmbed('#visMap', specMap).catch(console.error);
        
                // Add scatter plot for comparison with the map
                const specScatter = {
                    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                    "description": "Scatter plot comparing trips across states.",
                    "data": { "values": tourismData },
                    "mark": "point",
                    "width": 600,
                    "height": 400,
                    "encoding": {
                        "x": {
                            "field": "quarter",
                            "type": "temporal",
                            "title": "Quarter"
                        },
                        "y": {
                            "field": "trips",
                            "type": "quantitative",
                            "title": "Number of Trips"
                        },
                        "color": { "field": "state", "type": "nominal", "title": "State" },
                        "tooltip": [
                            { "field": "state", "type": "nominal", "title": "State" },
                            { "field": "trips", "type": "quantitative", "title": "Number of Trips" }
                        ]
                    }
                };
        
                // Embed the scatter plot visualization
                vegaEmbed('#visScatter', specScatter).catch(console.error);
            }).catch(error => console.error('Error loading the TopoJSON data:', error));
        }).catch(error => console.error('Error loading the CSV data:', error));
    };
    document.head.appendChild(d3Script);
});