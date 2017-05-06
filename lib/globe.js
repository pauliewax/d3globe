import {worldMap} from './countries';

let svg = d3.select('body')
  .append('svg');

let mercProjection = d3.geoMercator()
  .scale(160)
  .translate([500, 500]);

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
        .html(
          `<section>${d.properties.title}</section>` + `<img src="${d.properties.img}" />` + `<p>$${d.properties.price}</p>`
        )
        .style('left', (d3.event.pageX + 10) + "px")
        .style('top', (d3.event.pageY - 100) + "px");
    })
    .on('mouseout', function(d){
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });
};
