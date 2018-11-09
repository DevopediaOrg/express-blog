var chart = document.getElementsByTagName('piechartTopics')[0];
var datafile = chart.getAttribute('src');

d3.json(datafile, function(data) {
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .showLabels(true)
          .labelThreshold(.05)
          .labelType("value") // "key", "value" or "percent"
          .donut(true)
          .donutRatio(0.35)
          ;

      chart.pie.valueFormat(d3.format(',.0d'));
    
      d3.select("piechartTopics").append("svg")
          .datum(data)
          .transition().duration(350)
          .call(chart);
    
      nv.utils.windowResize(chart.update);

      return chart;
    });
});