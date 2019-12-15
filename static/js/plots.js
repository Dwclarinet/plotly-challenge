// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/samples.json").then((importedData) => {
    var data = importedData;
    //Get the IDs
    var samples = data.samples;
    var optionValue = d3.select("select");
    //Put the IDs into the dropdown list
    samples.forEach((sample) => {
        optionValue.append("option")
        .text(sample.id)
    });
    // Find starting info
    var searchElement = d3.select("#exampleSelect1");
    var searchValue = searchElement.property("value");

    function buildBarPlot() {
        // Get current value
        var searchElement = d3.select("#exampleSelect1");
        var searchValue = searchElement.property("value");
        // Find chosen object
        var sample = samples.find(x => x.id == searchValue);
        // Use only top 10 samples
        var sample_values = sample.sample_values.slice(0,10);
        var otu_ids = sample.otu_ids.slice(0,10);
        var otu_labels = sample.otu_labels.slice(0,10);
        var trace = {
            x: sample_values,
            y: otu_ids,
            type: "bar",
            orientation: "h",
            text: otu_labels,
        };
        var data = [trace];
        var layout = {
            xaxis: {
                title: "Sample Value"
            },
            yaxis: {
                type: "category",
                title: "OTU ID",
                showgrid: "true",
                side: "top"
            },
            title: `Test Subject: ${searchValue}`,
            autosize: "true"
        }
        Plotly.newPlot("plot1", data, layout), {responsive: true};
    }

    function bubbleChart(searchValue) {
        // Get current value
        var searchElement = d3.select("#exampleSelect1");
        var searchValue = searchElement.property("value");
        // Find chosen object
        var sample = samples.find(x => x.id == searchValue);
        var sample_values = sample.sample_values;
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;
        var trace ={
            x: otu_ids,
            y: sample_values,
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels,
            mode: "markers"
        }
        var data = [trace];
        var layout = {
            title: `Test Subject: ${searchValue}`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Value"
            },
            autosize: "true"
        }
        Plotly.newPlot("plot3", data, layout, {responsive: true});
    }

    function metaData(searchValue) {
        // Ger current value
        var searchElement = d3.select("#exampleSelect1");
        var searchValue = searchElement.property("value");
        var metaData = data.metadata;
        // Find chosen Object
        var sample = metaData.find(x => x.id == searchValue);
        var metaField = d3.select("#metaData");
        metaField.html("");
        Object.entries(sample).forEach((data) => {
            metaField.append("h6")
            .text(`${data}`);
        });
    }

    // Run initial plots for starting value
    buildBarPlot(searchValue);
    bubbleChart(searchValue);
    metaData(searchValue);

    // Whenever new value is chose, run plot functions
    d3.select("select").on("change", function(searchValue){
        buildBarPlot(searchValue);
        bubbleChart(searchValue);
        metaData(searchValue);
    })
})