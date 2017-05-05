import './globe';

$('#priceRange').change(function(e){
  $('#priceDisplay')[0].innerText = `$${e.currentTarget.value}`;
});

$('#numEntries').change(function(e){
  $('#entriesDisplay')[0].innerText = `${e.currentTarget.value}`;
});

$('#searchForm').submit(function(e){
  e.preventDefault();
  let searchQuery = $('#searchQuery').val();
  let priceRange = $('#priceRange').val();
  let numResults = $('#numEntries').val();
  $.ajax({
    type: 'GET',
    url: 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords',
    dataType:'jsonp',
    data: {
      "SECURITY-APPNAME": "PaulEng-GlobeBay-PRD-608f655c9-1423e662",
      "keywords": `${searchQuery}`,
      "itemFilter.name": "MaxPrice",
      "itemFilter.value": `${priceRange}`,
      "paginationInput.entriesPerPage": `${numResults}`,
    },
    success: function(result) {
      window.test = result.findItemsByKeywordsResponse[0].searchResult[0].item;
    }
  });
});

// GEOJSON COORDINATES WANT LONG THEN LAT
// $.ajax({
//   type: 'GET',
//   url: 'https://maps.googleapis.com/maps/api/geocode/json',
//   dataType:'json',
//   data: {
//     "address": "5824 bell blvd 11364",
//     "key": "AIzaSyA0QnQQk7D3mtmaW5IQmxJCdIbMfoAsaOU"
//   },
//   success: function(result) {
//     console.log(result.results[0].geometry.location);
//   }
// });
