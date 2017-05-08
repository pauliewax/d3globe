import {drawMap, drawWater, drawMarkers} from './globe';

let geoJSON = {
type: "FeatureCollection",
features: [
]
};

let amountEmptyResults;

$('#numEntries').change(function(e){
  $('#entriesDisplay')[0].innerText = `${e.currentTarget.value}`;
});

$('#searchForm').submit(function(e){
  e.preventDefault();
  let searchQuery = $('#searchQuery').val(),
  minPrice = $('#minPrice').val(),
  maxPrice = $('#maxPrice').val(),
  numResults = $('#numEntries').val(),
  globalId = $('#siteVersion').find(':selected').data('id'),
  countryIso = $('#siteVersion').find(':selected').data('iso');

  $('#loader').addClass('loader');

  geoJSON = {
  type: "FeatureCollection",
  features: [
  ]
  };

  amountEmptyResults = 0;

  if  (globalId !== 'world') {
    $.ajax({
      type: 'GET',
      url: 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords',
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
        url: 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords',
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
  let globalId = $('#siteVersion').find(':selected').data('id');
  let ebayListings = listings.findItemsByKeywordsResponse[0].searchResult[0].item;

  if (ebayListings) {
    let allRequests = [];
    ebayListings.forEach((listing)=>{
      allRequests.push(
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
            drawMarkers(geoJSON);
          },
        })
      );
    });

    $.when.apply($, allRequests).then(function() {
        $('#loader').removeClass('loader');
    });
  } else {
    let searchQuery = $('#searchQuery').val();
    amountEmptyResults += 1;
    console.log("eBay Finding API returned zero results for a region");
    if (amountEmptyResults === 19) {
      alert(`No results found for "${searchQuery}"`);
    } else if (globalId !== 'world') {
      alert(`No results found for "${searchQuery}"`);
    }
  }
}

function featureBuilder(listing, coords) {
  if (!listing.galleryURL) {
    console.log(`eBay Finding API did not return an image for ${listing.title[0]}`);
  }

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
  currency: Object.values(listing.sellingStatus[0].convertedCurrentPrice[0])[0], //under key @currencyId, can't be invoked
  url: listing.viewItemURL[0],
  img: listing.galleryURL ? listing.galleryURL[0] : ''
  }
};
geoJSON.features.push(geojsonFeature);
}

drawWater();
drawMap();
