const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

//init the sample and feature objects
let ids = []
let samples = [];
let features = [];
var currentId;

// Fetch the JSON data and console log it
d3.json(url).then(function (data) {
   
    //init the dropdown menu 
    for (var i = 0; i < data.names.length; i++) {
        ids.push(data.names[i]);
        d3.select("select").append('option').text(ids[i]);

        features.push({
            'id': data.metadata[i].id,
            'ethnicity': data.metadata[i].ethnicity,
            'gender': data.metadata[i].gender,
            'age': data.metadata[i].age,
            'location': data.metadata[i].location,
            'bbtype': data.metadata[i].bbtype,
            'wfreq': data.metadata[i].wfreq,

        });

        samples.push({
            'id': data.samples[i].id,
            'otu_ids': data.samples[i].otu_ids,
            'sample_values': data.samples[i].sample_values,
            'otu_labels': data.samples[i].otu_labels,

        });

    }

    //init the dempgraphic info
    d3.select("#sample-metadata").html(`id : ${features[0].id} <br> 
                                        ethnicity :${features[0].ethnicity} <br>
                                        gender : ${features[0].gender} <br>
                                        age : ${features[0].age} <br>
                                        location : ${features[0].location} <br>
                                        bbtype : ${features[0].bbtype} <br>
                                        wfreq : ${features[0].wfreq} <br>`);



    //plot the bar chart and bubble chart for the first item in dropdown menu  
    var newSample = samples.find(item => item.id == features[0].id)

    barChart(newSample);
    bubbleChart(newSample);
    //********************************************************/

});

//############# on_change function for the dropdown menu ######################

d3.select('select').on("change", function () {
    //read the new id
    var selected = d3.select('select').node().value;
    

    //find all features of the new id, then update the data and dispaly it
    var newSelection = features.find(item => item.id == selected)

    d3.select("#sample-metadata").html(`id : ${newSelection.id} <br> 
                                        ethnicity :${newSelection.ethnicity} <br>
                                        gender : ${newSelection.gender} <br>
                                        age : ${newSelection.age} <br>
                                        location : ${newSelection.location} <br>
                                        bbtype : ${newSelection.bbtype} <br>
                                        wfreq : ${newSelection.wfreq} <br>`);



    //update the sample    
    var newSample = samples.find(item => item.id == selected)
    
    //update the bar chart
    barChart(newSample);

    //update the bubble chart
    bubbleChart(newSample);
    
});

//===========================  bar chart function  ================================
function barChart(sample) {
    var graphData = [];
    for (var i = 0; i < sample.sample_values.length; i++) {
        graphData.push({
            'otu_ids': sample.otu_ids[i],
            'sample_values': sample.sample_values[i],
            'otu_labels': sample.otu_labels[i],
        });
    }


    graphData.sort((firstItem, secondItem) => secondItem.sample_values - firstItem.sample_values);

    var labels = [];
    //if an id has less than 10 values, I set the cutPoint to its length (instead of 10). 
    var cutPoint = 10;
    if (graphData.length < 10) {
        cutPoint = graphData.length;
    }
    var x_values = graphData.map(item => item.sample_values).slice(0, cutPoint);
    var y_values = [];
    var hover_labels = graphData.map(item => item.otu_labels).slice(0, cutPoint);

    for (var i = 0; i < cutPoint; i++) {
        labels.push(`OUT ${graphData[i].otu_ids}`);
    }

    let trace1 = {
        y: labels.reverse(),
        x: x_values.reverse(),
        type: "bar",
        orientation: 'h',
        hovertext: hover_labels.reverse(),

    };
  
    var traceData = [trace1];
    Plotly.newPlot("bar", traceData);
}

//================Bubble Chart Function=====================
function bubbleChart(sample) {
    var graphData = [];
    for (var i = 0; i < sample.sample_values.length; i++) {
        graphData.push({
            'otu_ids': sample.otu_ids[i],
            'sample_values': sample.sample_values[i],
            'otu_labels': sample.otu_labels[i],
        });
    }

    //set bubble chart values/layout
    var x_values = graphData.map(item => item.otu_ids);
    var y_values = graphData.map(item => item.sample_values);
    var markerSize = graphData.map(item => Math.floor(item.sample_values/1.5));
    var markerColors=graphData.map(item => item.otu_ids);
    var textValues=graphData.map(item => item.otu_labels);

    
    let trace1 = {
        x: x_values,
        y: y_values,
        mode: 'markers',
        text:textValues,
        marker:{
            size: markerSize,
            color:markerColors,
            opacity:0.6,
        }
    };

    let layout = {
        height: 450,
        width: 800,
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        }

    };

    var traceData = [trace1];
    Plotly.newPlot("bubble", traceData, layout);
}
