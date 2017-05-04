import './globe';

$('#searchForm').submit(function(e){
  e.preventDefault();
  let searchQuery = $('#searchQuery').val();
  let priceRange = $('#priceRange').val();
  $.ajax({
    type: 'GET',
    url: 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords',
    dataType:'jsonp',
    data: {
      "SECURITY-APPNAME": "PaulEng-GlobeBay-PRD-608f655c9-1423e662",
      "keywords": `${searchQuery}`,
    },
    success: function(results) {
      console.log(results.findItemsByKeywordsResponse[0].searchResult[0].item);
    }
  });
});

$('#priceRange').change(function(e){
  $('#rangeValue')[0].innerText = `$${e.currentTarget.value}`;
});
