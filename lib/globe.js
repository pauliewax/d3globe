import {worldMap} from './countries';

let svg = d3.select('body')
  .append('svg');

let orthoProjection = d3.geoOrthographic()
  .scale(window.innerHeight / 2.2)
  .rotate([20, 0, 0])
  .clipAngle(90)
  .translate([(window.innerWidth * 0.8)/ 2, window.innerHeight / 2]);

let geoPath = d3.geoPath()
  .projection(orthoProjection)
  .pointRadius(5);

let world = svg.append('g')
  .attr('class', 'world');

export const drawMap = function() {
  let sens = 0.25;
  world.selectAll('path')
    .data(worldMap.features)
    .enter()
    .append('path')
    .attr('d', geoPath)

    .call(d3.drag()
      .subject(function() { let r = orthoProjection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
      .on("drag", function() {
        orthoProjection.rotate([d3.event.x * sens, -d3.event.y * sens]);
        svg.selectAll("path").attr("d", geoPath);
    }));
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
      let xCoord;
      // If the hovered point is further than 87% to the right of the page,
      // flip the tooltip to appear to the leftside of the cursor
      if (window.innerWidth * .87 < d3.event.pageX) {
        xCoord = (d3.event.pageX - (document.getElementsByClassName('tooltip')[0].offsetWidth + 30))
      } else {
        xCoord = (d3.event.pageX + 30);
      }
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
