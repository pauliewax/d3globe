import './globe';

$('#searchForm').submit(function(e){
  e.preventDefault();
  let searchQuery = $('#searchQuery').val();
  let priceRange = $('#priceRange').val();
  console.log(searchQuery, priceRange);
});

$('#priceRange').change(function(e){
  $('#rangeValue')[0].innerText = e.currentTarget.value;
});
