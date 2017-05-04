import {worldMap} from './countries';
import {rodents_json} from './testpoints';

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
  .projection(mercProjection);

let world = svg.append('g')
  .attr('class', 'world');

world.selectAll('path')
  .data(worldMap.features)
  .enter()
  .append('path')
  .attr('d', geoPath);

  let rats = svg.append('g');

  rats.selectAll('path')
    .data(rodents_json.features)
    .enter()
    .append('path')
    .attr('fill', '#900')
    .attr('stroke', '#999')
    .attr('d', geoPath);
