import {worldMap} from './countries';

let width = 1000,
    height = 1000;

let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let world = svg.append('g');

let mercProjection = d3.geoMercator()
  .scale(100)
  .rotate([71.057,0])
  .center([0,42.313])
  .translate([width/2, height/2]);

let geoPath = d3.geoPath()
  .projection(mercProjection);

world.selectAll('path')
  .data(worldMap.features)
  .enter()
  .append('path')
  .attr('fill', '#ddd')
  .attr('stroke', 'black')
  .attr('d', geoPath);
