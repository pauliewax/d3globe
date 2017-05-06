import {drawMap, drawMarkers} from './globe';

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

  if (ebayListings) {
    ebayListings.forEach((listing)=>{
      console.log(listing)
      $.ajax({
        type: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        dataType:'json',
        data: {
          "address": `${listing.location[0]}`,
          "key": "AIzaSyA0QnQQk7D3mtmaW5IQmxJCdIbMfoAsaOU"
        },
        success: function(geocode) {
          geocode.results[0] ? featureBuilder(listing, geocode.results[0].geometry.location) : console.log(`Google Maps Geocoding API could not find coordinates for ${listing.location}`);
          drawMarkers(window.geoJSON);
        },
      });
    });
  } else {
    console.log("eBay Finding API returned zero results for a region");
  }
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
  location: listing.location[0],
  img: listing.galleryURL[0]
  }
};
window.geoJSON.features.push(geojsonFeature);
}

drawMap();
