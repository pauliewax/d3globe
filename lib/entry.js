import {drawMap, drawMarkers} from './globe';
import {capitals} from './testpoints';

window.geoJSON = {
type: "FeatureCollection",
features: [
]
};

$('#numEntries').change(function(e){
  $('#entriesDisplay')[0].innerText = `${e.currentTarget.value}`;
});

$('#searchForm').submit(function(e){
  e.preventDefault();
  let searchQuery = $('#searchQuery').val(),
  minPrice = $('#minPrice').val(),
  maxPrice = $('#maxPrice').val(),
  priceRange = $('#priceRange').val(),
  numResults = $('#numEntries').val(),
  globalId = $('#siteVersion').find(':selected').data('id'),
  countryIso = $('#siteVersion').find(':selected').data('iso');

  window.geoJSON = {
  type: "FeatureCollection",
  features: [
  ]
  };

  if  (globalId !== 'world') {
    $.ajax({
      type: 'GET',
      url: 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords',
      dataType:'jsonp',
      data: {
        "SECURITY-APPNAME": "PaulEng-GlobeBay-PRD-608f655c9-1423e662",
        "keywords": `${searchQuery}`,
        "itemFilter(0).name": "MinPrice",
        "itemFilter(0).value": `${minPrice}`,
        "itemFilter(1).name": "MaxPrice",
        "itemFilter(1).value": `${maxPrice}`,
        "itemFilter(2).name": 'LocatedIn',
        "itemFilter(2).value": `${countryIso}`,
        "paginationInput.entriesPerPage": `${numResults}`,
        "GLOBAL-ID": `EBAY-${globalId}`,
      },
      success: geocoder
    });
  } else {
    let countries = $('option').filter((idx, op)=>op.dataset.id !== 'world');
    if (numResults > 20) {
      numResults = 20;
      $('#numEntries').val('20');
      $('#entriesDisplay')[0].innerText = '20';
    }
    countries.each((idx, country)=>{
      globalId = country.dataset.id;
      countryIso = country.dataset.iso;
      $.ajax({
        type: 'GET',
        url: 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords',
        dataType:'jsonp',
        data: {
          "SECURITY-APPNAME": "PaulEng-GlobeBay-PRD-608f655c9-1423e662",
          "keywords": `${searchQuery}`,
          "itemFilter(0).name": "MinPrice",
          "itemFilter(0).value": `${minPrice}`,
          "itemFilter(1).name": "MaxPrice",
          "itemFilter(1).value": `${maxPrice}`,
          "itemFilter(2).name": 'LocatedIn',
          "itemFilter(2).value": `${countryIso}`,
          "paginationInput.entriesPerPage": `${numResults}`,
          "GLOBAL-ID": `EBAY-${globalId}`,
        },
        success: geocoder
      });
    });
  }

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
      geocode.results[0] ? featureBuilder(listing, geocode.results[0].geometry.location) : console.log(`Coordinates for ${listing.location} not found`);
      drawMarkers(window.geoJSON);
      },
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
  price: listing.sellingStatus[0].convertedCurrentPrice[0].__value__,
  location: listing.location
  }
};
window.geoJSON.features.push(geojsonFeature);
}

drawMap();
