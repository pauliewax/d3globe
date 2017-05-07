import {worldMap} from './countries';

let svg = d3.select('body')
  .append('svg');

let mercProjection = d3.geoMercator()
  .scale(window.innerWidth * .13)
  .translate([window.innerWidth/2.6, window.innerHeight/2]);

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
  mapMarkers.selectAll('a')
    .remove();

  mapMarkers.selectAll('a')
    .data(geojson.features)
    .enter()
    .append('a')
      .attr('xlink:href', function(d) {return `${d.properties.url}`})
    .append('path')
    .attr('d', geoPath)
    .on('mouseover', function(d) {
      let xCoord = (window.innerWidth * .87 < d3.event.pageX) ? (d3.event.pageX - (document.getElementsByClassName('tooltip')[0].offsetWidth + 30)) : (d3.event.pageX + 30);
      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      tooltip
        .html(
          `<section>${d.properties.title}</section>` + `<img src="${d.properties.img}" />` + `<p>${d.properties.currency} $${d.properties.price}</p>`
        )
        .style('left', (xCoord) + "px")
        .style('top', (d3.event.pageY) + "px");
    })
    .on('mouseout', function(d){
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });
};

d3.select(window).on('resize', resize);

function resize() {
  mercProjection = d3.geoMercator()
    .scale(window.innerWidth * .13)
    .translate([window.innerWidth/2.6, window.innerHeight/2]);
  geoPath = d3.geoPath()
    .projection(mercProjection)
    .pointRadius(5);
  world.selectAll('path').attr('d', geoPath);
  mapMarkers.selectAll('path').attr('d', geoPath);
}
