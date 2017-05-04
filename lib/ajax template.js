$.ajax({
  type: 'GET',
  url: 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords',
  dataType:'jsonp',
  data: {
    "SECURITY-APPNAME": "PaulEng-GlobeBay-PRD-608f655c9-1423e662",
    "keywords": "harry potter phoenix",
  },
  success: function(e) {
    console.log(e.findItemsByKeywordsResponse[0].searchResult[0].item);
  }
});
