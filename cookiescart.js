+function ($) {

	$(document).on('click', '.cookiescart-add', function (e) {
		// Nothing weird will happen!
		e.preventDefault();

		// Gather item info
		var itemId = this.getAttribute('data-id');
		var itemPrice = this.getAttribute('data-price');
		var data = _.object(
			['quantity', 'price'],
			_.map($.cookie(itemId).split(','), Number));

		// Update the cookie jar
		data['quantity'] += 1;
		data['price'] = itemPrice;
		$.cookie(itemId, [data['quantity'], data['price']].join(','));
	});

}(jQuery)
