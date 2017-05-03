## GlobeBay D3 Data Visualization

### Background

GlobeBay is an interactive, visual representation of how eBay listings are distributed geographically.

### Functionality & MVP  

Users are able to manipulate the map according to the following parameters:

- [ ] Render results that match specific queries
- [ ] Filter results by price range
- [ ] Set a limit on the amount of results returned
- [ ] Sort results by region.

In addition, this project will include:

- [ ] A production README

### Wireframes

This app will consist of a single page, featuring a globe populated with query results. A form will allow users to specify search constraints, and toggles for region-specific results will highlight or deselect the corresponding areas. The worldmap will be draggable, allowing users to rotate the globe in order to change focus. Results will appear as pinpoints on the map, which upon hovering will render a small window with more detailed information relating to the specific result.

![wireframe]

### Architecture and Technologies

This project will be implemented with the following technologies:

- `D3.js` for handling visual representation,
- `JavaScript` for fetching data,
- `HTML` and `CSS` for formatting,
- `eBay API` for access to data,
- `geoJSON / topoJSON / leaflet` possibly to handle topographic information

In addition to the entry file, there will be three scripts involved in this project:

`app.js`: this script will handle the necessary logic for dispatching requests to the eBay API, along with rendering the return JSON data.

### Implementation Timeline

**Day 1**: Learn the foundation of `D3.js` and create the basic skeleton necessary for building a data visualization app. Determine whether additional libraries will be required to render geodata or a 3D map.

- Create the appropriate filetree for running a D3 app.
- Install dependencies required to generate a 3D map.

**Day 2**: Spend the day learning how to use the eBay API. Get comfortable with making AJAX requests to the API, learning what parameters can be specified and how to do so. Figure out whether other languages/libraries will be necessary to manipulate or filter content.

- Successfully dispatch AJAX requests to eBay API
- Fetch data according to specific query parameters

**Day 3**: Create a draggable, selectable globe in D3.js. Design forms for users to make requests from eBay API.

- Render globe using D3.js
- Set up frontend interaction to make eBay API requests


**Day 4**: Configure population of globe with return JSON from eBay API, allow users to select areas of globe that show data.

- Render API return JSON on D3.js globe
- Build out region toggling functionality

[wireframe]: ./wireframe.png
