## GlobeBay D3

[Live][site]

GlobeBay is an interactive, single-page visualization of how eBay listings are distributed geographically. It was written with JavaScript, D3.js, jQuery, and HTML.

### About

In order to populate the map, a query is first dispatched to the eBay Finding API based on the parameters specified by the user. A successful query triggers subsequent calls to the Google Maps Geocoding API, requesting longitude and latitude geometry for the location of each eBay listing. All of the relevant information from both API returns is packaged into a geoJSON feature for each listing, which is rendered on the map as a clickable / hoverable marker.

Because the 'All Countries' search sends a request to each of the nineteen eBay global API endpoints (US, Canada, Spain, etc), number of results per country is capped at 20 to reduce loadtimes.

![screencap]

### Implementation

#### 3D Globe
The map is an SVG element whose paths are generated from a server-side file containing geodata for country borders. Taking advantage of D3's projections, the geoOrthographic function allows for fairly straightforward rendering of the familiar watersphere we know and love:

```javascript
let orthoProjection = d3.geoOrthographic()
  .scale(window.innerHeight / 2.2)
  .rotate([20, 0, 0])
  .clipAngle(90)
  .translate([(window.innerWidth * 0.8)/ 2, window.innerHeight / 2]);

let geoPath = d3.geoPath()
  .projection(orthoProjection)

let world = svg.append('g')
  .attr('class', 'world');

export const drawMap = function() {
  world.selectAll('path')
    .data(worldMap.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
};
```
####  Navigation
D3 allows for incredible depth of calculation when rotating coordinates - but for those without a background in rotation formalism mathematics (like myself) - creating a pleasant enough user experience for rotating the globe is as simple as setting an event listener for dragging movement, finding the origin of the drag, running the new x / y coordinates through the projection's rotate function, and re-rendering. I also set a variable for a sensitivity multiplier, to reduce how responsive rotation is to mouse movement.

```javascript
let sens = 0.25;

.call(d3.drag()
  .subject(function() { let r = orthoProjection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
  .on("drag", function() {
    orthoProjection.rotate([d3.event.x * sens, -d3.event.y * sens]);
    svg.selectAll("path").attr("d", geoPath);
}));
```

#### Tooltips
A tooltip displaying listing info appears to the right of the cursor when hovering over a marker. A bit of custom logic was used to determine whether the tooltip was being rendered far enough to the right of the viewport that it would be clipped off (overflow hidden), and if so the x coordinates are recalculated so the tooltip appears at cursor left instead.

```javascript
.on('mouseover', function(d) {
  let xCoord;
  // Tooltip width is set in CSS to 10%, so if the hovered X is further than 87%
  // to the right of the page  (10% + ~3% for cursor and spacing),
  // flip the tooltip to appear to the leftside of the cursor
  if (window.innerWidth * .87 < d3.event.pageX) {
    xCoord = (d3.event.pageX - (document.getElementsByClassName('tooltip')[0].offsetWidth + 30))
  } else {
    xCoord = (d3.event.pageX + 30);
  }
  tooltip
    .html(
      `<section>${d.properties.title}</section>` + `<img src="${d.properties.img}" />` + `<p>${d.properties.currency} $${d.properties.price}</p>`
    )
    .style('left', (xCoord) + "px")
    .style('top', (d3.event.pageY) + "px");
})
```

[site]: https://pauliewax.github.io/d3globe/
[screencap]: ./docs/screencap.png
