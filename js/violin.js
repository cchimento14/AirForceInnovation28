var dataset; //declare global varible, initially empty
d3.csv("data.csv", function(d) {
    return {
        year: d.year,
        solicitation: d.solicitation,
        solicitation_date_gen: d3.timeParse(d.solicitation_date_gen),
        employees: parseFloat(d.employees),
        special: d.special,
        pitch: d.pitch,
        prev_award: d.prev_award,
        phase: d.phase,
        select: d.select,
        financing_status: d.financing_status,
        cost: parseFloat(d.cost)
        };
    }).then(function(data) {
        dataset = data;


// // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
//
// // Read the data and compute summary statistics for each specie
// //d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) { Davis. This is the part we can't use in v5

  var allGroup =["Special Topic","Open Topic","Pitch Day"]

  d3.select("#selectButton")
     .selectAll('myOptions')
     .data(allGroup)
     .enter()
     .append('option')
     .text(function (d) { return d; }) // text showed in the menu
     .attr("value", function (d) { return d; }) // corresponding value returned by the but

  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2)

//   // Build and Show the Y scale
  var y = d3.scaleLinear()
    .domain([ 0, d3.quantile(dataset.map(d => d.employees).sort(d3.ascending),0.95)])          // Note that here the Y scale is set manually
    .range([height, 0])
  svg.append("g").call( d3.axisLeft(y) )

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["0", "1"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  var histogram = d3.histogram()
    .domain(y.domain())
    .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)

  var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.select;}) //()
    .rollup(function(d) {   // For each key..
        input = d.map(function(g) { return g.employees;})    // Keep the variable called employees
        bins = histogram(input)   // And compute the binning on it.
            return(bins)
        })
        .entries(dataset)

// What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum = 0
    for ( i in sumstat ){
      allBins = sumstat[i].value
      lengths = allBins.map(function(a){return a.length;})
      longuest = d3.max(lengths)
        if (longuest > maxNum) { maxNum = longuest }
        }

  var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

    svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
          )

          function update(selectedGroup) {

                // Create new data with the selection?
                var dataFilter = dataset.map(function(d){return {time: d.time, value:d[selectedGroup]} })

                // Give these new data to update line
                line
                    .datum(dataFilter)
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                      .x(function(d) { return x(+d.time) })
                      .y(function(d) { return y(+d.value) })
                    )
                    .attr("stroke", function(d){ return myColor(selectedGroup) })
              }

              // When the button is changed, run the updateChart function
              d3.select("#selectButton").on("change", function(d) {
                  // recover the option that has been chosen
                  var selectedOption = d3.select(this).property("value")
                  // run the updateChart function with this selected option
                  update(selectedOption)
              })

});
