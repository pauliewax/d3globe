import {worldMap} from './countries';

let width = 1000,
    height = 800;

let svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

let mercProjection = d3.geoMercator()
  .scale(126)
  .translate([width/2, height/2]);

let geoPath = d3.geoPath()
  .projection(mercProjection)
  .pointRadius(5);

  let world = svg.append('g')
  .attr('class', 'world');
export const drawMap = function() {

  world.selectAll('path')
    .data(worldMap.features)
    .enter()
    .append('path')
    .attr('d', geoPath);
};

let mapMarkers = svg.append('g')
.attr('class', 'mapMarkers');

let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip');

export const drawMarkers = function(geojson) {
  mapMarkers.selectAll('path')
    .remove();

  mapMarkers.selectAll('path')
    .data(geojson.features)
    .enter()
    .append('path')
  .merge(mapMarkers)
    .attr('d', geoPath)
    .on('mouseover', function(d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip
        .html(d.properties.title + '<br/>' + `<b>$${d.properties.price}</b>`)
        .style('left', (d3.event.pageX) + "px")
        .style('top', (d3.event.pageY - 40) + "px");
    })
    .on('mouseout', function(d){
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });
};
