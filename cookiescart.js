+function ($) {

	function _parseData(data) {
		return _.object(
			['quantity', 'price'],
			_.map((data || ',').split(','), Number));
	}

	function updateCartItems() {
		/*
		Update an element `.cookiescart-items` with clones of matching
		item representations (`.cookiescart-item`). Note that they should exist
		hidden somewhere in your page.
		*/
		var cookie = $.cookie();
		var cart = $('.cookiescart-items');

		cart.empty();  // Reset

		$.each(cookie, function (itemId, data) {
			var item = $('.cookiescart-item[data-id='+itemId+']').clone();
			cart.append(item);
		});
	}

	function updateStrings(add) {
		var cookie = $.cookie();

		// Count unique items
		$('.cookiescart-uniqueitems').text(_.size(cookie));

		// Calculate total
		var total = 0;
		$.each(cookie, function (itemId, data) {
			data = _parseData(data);
			total += data['quantity'] * data['price'];
		});
		$('.cookiescart-total').text(total.toFixed(2));
	}

	$(document).on('click', '.cookiescart-add', function (e) {
		// Nothing weird will happen!
		e.preventDefault();

		// Gather item info
		var itemId = this.getAttribute('data-id');
		var itemPrice = this.getAttribute('data-price');
		var data = _parseData($.cookie(itemId));

		// Update the cookie jar
		var quantity = +$('.cookiescart-quantity[data-id='+itemId+']').val() || 1;
		data['quantity'] += quantity;
		data['price'] = itemPrice;
		$.cookie(itemId, [data['quantity'], data['price']].join(','));

		// Update routines
		updateCartItems();
		updateStrings();
	});

	updateCartItems();
	updateStrings();

}(jQuery)
