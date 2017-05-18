import {drawMap, drawWater, drawMarkers} from './globe';

let memo = {};

let geoJSON = {
  type: "FeatureCollection",
  features: [
  ]
};

let badRequests;
let goodRequests;
let errors;

$('#numEntries').change(function(e){
  $('#entriesDisplay')[0].innerText = `${e.currentTarget.value}`;
});

$('#searchForm').submit(ebayQuery);

function handleErrors() {
  $('#errors')[0].innerText=errors.join('\n\n');
  errors.length > 1 ? $('#errorBox').removeClass('hidden') : $('#errorBox').addClass('hidden');
}

function ebayQuery(e){
  e.preventDefault();

  let searchQuery = $('#searchQuery').val(),
  minPrice = $('#minPrice').val(),
  maxPrice = $('#maxPrice').val(),
  numResults = $('#numEntries').val(),
  globalId = $('#siteVersion').find(':selected').data('id'),
  countryIso = $('#siteVersion').find(':selected').data('iso');

  if (searchQuery !== '') {
    $('#loader').addClass('loader');
    errors = ["Sorry!"];
  } else {
    errors = ["Sorry!", "Invalid Search Terms."];
  }

  geoJSON = {
  type: "FeatureCollection",
  features: [
  ]
  };
  badRequests = 0;
  goodRequests = 0;

  handleErrors();

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
      success: geocoder,
      error: function (jqXHR, exception) {
        if (!errors.includes("eBay API returned an Internal Error")) {
          errors.push("eBay API returned an Internal Error");
        }
        $('#loader').removeClass('loader');
      },
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
        success: geocoder,
        error: function (jqXHR, exception) {
          if (!errors.includes("eBay API returned an Internal Error")) {
            errors.push("eBay API returned an Internal Error");
          }
          $('#loader').removeClass('loader');
        },
      });
    });
  }
  handleErrors();
}

function geocoder(listings) {
  let globalId = $('#siteVersion').find(':selected').data('id');
  let ebayListings = listings.findItemsByKeywordsResponse[0].searchResult[0].item;

  if (ebayListings) {
    let unfinishedRequests = [];
    ebayListings.forEach((listing)=>{
      if (memo[listing.location[0]]) {
        console.log(`Using coordinates for ${listing.location[0]} from memo`);
        featureBuilder(listing, memo[listing.location[0]]);
        drawMarkers(geoJSON);
      } else {
        unfinishedRequests.push(
          $.ajax({
            type: 'GET',
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            dataType:'json',
            data: {
              "address": `${listing.location[0]}`,
              "key": "AIzaSyA0QnQQk7D3mtmaW5IQmxJCdIbMfoAsaOU"
              // pw AIzaSyA0QnQQk7D3mtmaW5IQmxJCdIbMfoAsaOU
              // pj AIzaSyAz-diemkIokDa5XU5_OQOrXJ5AMfjeG8Y
            },
            success: function(geocode) {
              if (geocode.error_message) {
                console.log(geocode.error_message);
                if (!errors.includes("Exceeded daily limit on queries to Geocoding API.")) {
                  errors.push("Exceeded daily limit on queries to Geocoding API.");
                }
              } else if (geocode.results[0])  {
                memo[listing.location[0]] = geocode.results[0].geometry.location;
                featureBuilder(listing, geocode.results[0].geometry.location);
              } else {
                console.log(`Google Maps Geocoding API could not find coordinates for ${listing.location}`);
              }
              drawMarkers(geoJSON);
            },
            error: function (jqXHR, status, err) {
              console.log('Error from Google API', err);
              badRequests += 1;
            },
          })
        );
      }
    });

    $.when.apply($, unfinishedRequests).then(function() {
      handleErrors();
      goodRequests += 1;
      if (globalId === 'world') {
        if (goodRequests + badRequests === 19) {
          $('#loader').removeClass('loader');
        }
      } else {
        $('#loader').removeClass('loader');
      }
    });
  } else {
    let searchQuery = $('#searchQuery').val();
    badRequests += 1;
    console.log("eBay Finding API returned zero results for a region");
    if (badRequests === 19 || globalId !== 'world') {
      $('#loader').removeClass('loader');
      errors.push(`No results found for "${searchQuery}."`);
    } else if (goodRequests + badRequests === 19){
      $('#loader').removeClass('loader');
    }
    handleErrors();
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
  currency: Object.values(listing.sellingStatus[0].convertedCurrentPrice[0])[0], //under key starting with @, can't do listing.@currencyId
  url: listing.viewItemURL[0],
  img: listing.galleryURL ? listing.galleryURL[0] : ''
  }
};
geoJSON.features.push(geojsonFeature);
}

drawWater();
drawMap();

window.onload = function() {
  let i = 1;
  let typist = setInterval(function(){
    let letters = "Vintage Nintendo Console".split('');
    $('#searchQuery').val(letters.slice(0,i).join(''));
    if (i === letters.length) {
      clearInterval(typist);
      $('#searchForm').submit();
    }
  i += 1;
  },80);
};
