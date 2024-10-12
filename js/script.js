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
                d.Revenue = +d.Revenue;
            });

            // Visualization 1: Number of Visitors by Tourism Category
            const spec1 = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Visitors by Category in Australia",
                "data": { "values": data },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "Category", "type": "nominal", "title": "Tourism Category" },
                    "y": { "field": "Visitors", "type": "quantitative", "title": "Number of Visitors" }
                }
            };
            vegaEmbed('#vis1', spec1);

            // Visualization 2: Number of Visitors with Accommodation Availability
            const spec2 = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Visitors by Accommodation Availability",
                "data": { "values": data },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "Accommodation_Available", "type": "nominal", "title": "Accommodation Available" },
                    "y": { "field": "Visitors", "type": "quantitative", "title": "Number of Visitors" },
                    "color": { "field": "Category", "type": "nominal" }
                }
            };
            vegaEmbed('#vis2', spec2);

            // Visualization 3: Ratings Distribution by Tourism Category
            const spec3 = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Ratings by Category",
                "data": { "values": data },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "Category", "type": "nominal", "title": "Tourism Category" },
                    "y": { "field": "Rating", "type": "quantitative", "title": "Rating" }
                }
            };
            vegaEmbed('#vis3', spec3);

            // Visualization 4: Revenue by Tourism Category
            const spec4 = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Revenue by Category in Australia",
                "data": { "values": data },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "Category", "type": "nominal", "title": "Tourism Category" },
                    "y": { "field": "Revenue", "type": "quantitative", "title": "Revenue ($AUD)" }
                }
            };
            vegaEmbed('#vis4', spec4);
        }).catch(error => console.error('Error loading the CSV data:', error));
    };
    document.head.appendChild(d3Script);
});