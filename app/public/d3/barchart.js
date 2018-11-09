var chart = document.getElementsByTagName('barchartAuthors')[0];
var datafile = chart.getAttribute('src');

d3.json(datafile, function(data) {
  nv.addGraph(function() {
    var chart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label.replace(/^([A-Z]).* /g, "$1 "); })
        .y(function(d) { return d.value })
        .margin({top: 0, right: 20, bottom: 50, left: 100})
        .showValues(false)
        .color(['#FF8006', '#056B10', '#777'])
        .tooltips(true)
        .showControls(false)
        .stacked(false)
    ;
    chart.groupSpacing(0.4);

    chart.yAxis
        .tickFormat(d3.format(',.0d'));

    d3.select("barchartAuthors").append("svg")
        .datum(data)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
});
