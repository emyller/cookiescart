'use strict';
+function ($) {

	// Class names
	var
	CC_ADD = 'cookiescart-add',
	CC_AMOUNT = 'cookiescart-item-amount',
	CC_CART = 'cookiescart-items',
	CC_QUANTITY = 'cookiescart-quantity',
	CC_REMOVE = 'cookiescart-remove',
	CC_REMOVE_ALL = 'cookiescart-remove-all',
	CC_ITEM_TOTAL = 'cookiescart-item-total',
	CC_REPR_ITEM = 'cookiescart-item',
	CC_TOTAL = 'cookiescart-total',
	CC_UNIQUE_ITEMS = 'cookiescart-uniqueitems';

	// Attribute names
	var
	CA_ITEM_ID = 'data-id',
	CA_ITEM_NAME = 'data-name',
	CA_ITEM_PRICE = 'data-price';

	function CartItem(element) {
		this.id = element.getAttribute(CA_ITEM_ID);
		this.name = element.getAttribute(CA_ITEM_NAME);
		this.price = element.getAttribute(CA_ITEM_PRICE);
	}

	// Static properties and methods
	_.extend(CartItem, {
		_prefix: 'cookiescart-',

		parseCookie: function (cookie) {
			var data = _.object(
				['quantity', 'price', 'name'], (cookie || ',,').split(','));
			data['quantity'] = Number(data['quantity']);
			data['price'] = Number(data['price']);
			return data;
		},

		updateCart: function () {
			/*
			Update an element with class `CC_CART` with clones of matching
			item representations (`CC_REPR_ITEM`). Note that they should exist
			hidden somewhere in your page.
			*/
			var cookie = $.cookie();
			var cart = $('.'+CC_CART);

			cart.empty();  // Reset

			_.chain(_.pairs($.cookie()))
				// Don't touch others' cookies!
				.filter(function (item) { return item[0].indexOf(CartItem._prefix) === 0 })

				// Loop through and render the cart
				.each(function (item) {
					var
					data = CartItem.parseCookie(item[1]),
					itemId = item[0].substring(CartItem._prefix.length),
					item = $('.'+CC_REPR_ITEM+'['+CA_ITEM_ID+'='+itemId+']').clone();
					cart.append(item);

					// Render amount and total of the item currently on the cart
					item.find('.'+CC_AMOUNT).text(data['quantity']);
					item.find('.'+CC_ITEM_TOTAL).text(
						(data['quantity'] * data['price']).toFixed(2));
				});
		},

		updateStrings: function () {
			var
			items = 0,
			total = 0;

			$.each($.cookie(), function (itemId, data) {
				if (itemId.indexOf(CartItem._prefix) !== 0)
					return;

				data = CartItem.parseCookie(data);
				items += 1;
				total += data['quantity'] * data['price'];
			});

			$('.'+CC_UNIQUE_ITEMS).text(items);
			$('.'+CC_TOTAL).text(total.toFixed(2));
		}
	});

	// Instance properties and methods
	_.extend(CartItem.prototype, {
		getCookieName: function () {
			return CartItem._prefix + this.id;
		},

		remove: function (amount) {
			var
			cookieName = this.getCookieName(),
			data = CartItem.parseCookie($.cookie(cookieName));

			data['quantity'] -= 1;

			// Delete the entry if there is no remaining item
			if (data['quantity'] === 0)
				return this.removeAll();

			// Update the cookie jar
			$.cookie(cookieName, [data['quantity'], data['price']].join(','));
		},

		removeAll: function () {
			$.removeCookie(this.getCookieName());
		},

		add: function (amount) {
			var
			cookieName = this.getCookieName(),
			data = CartItem.parseCookie($.cookie(cookieName)),
			quantity = +$('.'+CC_QUANTITY+'['+CA_ITEM_ID+'='+this.id+']').val() || 1;

			data['quantity'] += quantity;
			data['price'] = this.price;
			data['name'] = this.name;
			$.cookie(
				cookieName,
				[data['quantity'], data['price'], data['name']].join(','));
		}
	});

	function _clickWrap(callback) {
		var _handler = function (e) {
			var
			id = this.getAttribute(CA_ITEM_ID),
			reprElement = $('.'+CC_REPR_ITEM+'['+CA_ITEM_ID+'='+id+']')[0],
			item = new CartItem(reprElement);

			// Nothing weird will happen upon clicks!
			e.preventDefault();

			// Do the original dance (click)
			callback.call(this, item);

			// Update routines
			CartItem.updateCart();
			CartItem.updateStrings();
		}
		return _handler;
	}

	// Add item through add button
	$(document).on('click', '.'+CC_ADD, _clickWrap(function (item) {
		item.add(1);
	}));

	$(document).on('click', '.'+CC_REMOVE, _clickWrap(function (item) {
		item.remove(1);
	}));

	$(document).on('click', '.'+CC_REMOVE_ALL, _clickWrap(function (item) {
		item.removeAll();
	}));

	// Initialize the cart from previous cookies
	CartItem.updateCart();
	CartItem.updateStrings();

}(jQuery)
