let randomNums = [100, 1000, 800, 300]

let svg = d3.select('body')
  .append('svg')
  .attr('height', 150)
  .attr('width', 1000)

function drawChart(dataArray) {
  let newVals = svg.selectAll('rect')
                  .data(dataArray)
  newVals.enter()
    .append('rect')
    .attr('x', function(d,i){
      return i * 25;
    })
    .attr('width', 15)
    .attr('fill', '#dddddd')
    .merge(newVals)
        .attr('height', function(d){
          return d/10 * 1.5
        })
        .attr('y', function(d){
          return 150 - d/10 * 1.5;
        });

  newVals.exit()
    .remove();
}


drawChart([100, 100, 100]);
drawChart(randomNums);
