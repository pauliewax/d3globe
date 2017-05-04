import {worldMap} from './countries';
import {capitals} from './testpoints';

let width = 1000,
    height = 800;

let svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

let mercProjection = d3.geoMercator()
  .scale(120)
  .translate([width/2, height/2]);

let geoPath = d3.geoPath()
  .projection(mercProjection)
  .pointRadius(5);

let world = svg.append('g')
  .attr('class', 'world');

world.selectAll('path')
  .data(worldMap.features)
  .enter()
  .append('path')
  .attr('d', geoPath);

  let statecaps = svg.append('g')
    .attr('class', 'statecaps');

  statecaps.selectAll('path')
    .data(capitals.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .on('click', function(){
      d3.select(this).remove();
    });
