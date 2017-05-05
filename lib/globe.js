import {worldMap} from './countries';

let width = 1000,
    height = 800;

let svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

let mercProjection = d3.geoMercator()
  .scale(124)
  .translate([width/2, height/2]);

let geoPath = d3.geoPath()
  .projection(mercProjection)
  .pointRadius(5);

export const drawMap = function() {
  let world = svg.append('g')
    .attr('class', 'world');

  world.selectAll('path')
    .data(worldMap.features)
    .enter()
    .append('path')
    .attr('d', geoPath);
};

export const drawMarkers = function(geojson) {
  let mapMarkers = svg.append('g')
  .attr('class', 'mapMarkers');

  mapMarkers.selectAll('path')
  .data(geojson.features)
  .enter()
  .append('path')
  .attr('d', geoPath)
  .on('click', function(){
    d3.select(this).remove();
  });
};
