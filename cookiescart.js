+function ($) {

	function _parseData(data) {
		data = _.object(
			['quantity', 'price', 'name'], (data || ',,').split(','));
		data['quantity'] = Number(data['quantity']);
		data['price'] = Number(data['price']);
		return data;
	}

	function _clickWrap(callback) {
		var _handler = function (e) {
			e.preventDefault();  // Nothing weird will happen upon clicks!
			callback.call(this, e);  // Do the original dance (click)

			// Update routines
			updateCartItems();
			updateStrings();
		}
		return _handler;
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

			// Render amount and total of the item currently on the cart
			data = _parseData(data);
			item.find('.cookiescart-item-amount').text(data['quantity']);
			item.find('.cookiescart-item-total').text(
				(data['quantity'] * data['price']).toFixed(2));
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

	$(document).on('click', '.cookiescart-add', _clickWrap(function (e) {
		// Gather item info
		var itemId = this.getAttribute('data-id');
		var itemRepr = $('.cookiescart-item[data-id='+itemId+']');
		var itemPrice = itemRepr.attr('data-price');
		var itemName = itemRepr.attr('data-name');
		var data = _parseData($.cookie(itemId));

		// Update the cookie jar
		var quantity = +$('.cookiescart-quantity[data-id='+itemId+']').val() || 1;
		data['quantity'] += quantity;
		data['price'] = itemPrice;
		data['name'] = itemName;
		$.cookie(itemId, [data['quantity'], data['price'], data['name']].join(','));
	}));

	$(document).on('click', '.cookiescart-remove', _clickWrap(function (e) {
		// Gather item info
		var itemId = this.getAttribute('data-id');
		var data = _parseData($.cookie(itemId));

		data['quantity'] -= 1;

		// Delete the entry if there is no remaining item
		if (data['quantity'] === 0) {
			$.removeCookie(this.getAttribute('data-id'));
			return;
		}

		// Update the cookie jar
		$.cookie(itemId, [data['quantity'], data['price']].join(','));
	}));

	$(document).on('click', '.cookiescart-remove-all', _clickWrap(function (e) {
		// Delete the item from the cookie jar
		$.removeCookie(this.getAttribute('data-id'));
	}));

	updateCartItems();
	updateStrings();

}(jQuery)
