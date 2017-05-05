import {drawMap, drawMarkers} from './globe';
import {capitals} from './testpoints';

window.geoJSON = {
type: "FeatureCollection",
features: [
]
};

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
    success: geocoder
  });
});

function geocoder(listings) {
  let ebayListings = listings.findItemsByKeywordsResponse[0].searchResult[0].item;
  ebayListings.forEach((listing)=>{
    $.ajax({
      type: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      dataType:'json',
      data: {
        "address": `${listing.location}`,
        "key": "AIzaSyA0QnQQk7D3mtmaW5IQmxJCdIbMfoAsaOU"
      },
      success: function(geocode) {
      featureBuilder(listing, geocode.results[0].geometry.location);
      }
    });
  });
}

function featureBuilder(listing, coords) {
  let geojsonFeature = {
  type: "Feature",
  geometry: {
  type: "Point",
  coordinates: [
  coords.lng,
  coords.lat
  ]
  },
  properties: {
  title: listing.title[0],
  price: listing.sellingStatus[0].convertedCurrentPrice[0].__value__
  }
};
window.geoJSON.features.push(geojsonFeature);
}

drawMap();
drawMarkers(capitals);
