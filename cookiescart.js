'use strict';
+function ($) {

	function CartItem(element) {
		this.id = element.getAttribute(CartItem.CA_ITEM_ID);
		this.name = element.getAttribute(CartItem.CA_ITEM_NAME);
		this.price = element.getAttribute(CartItem.CA_ITEM_PRICE);
	}

	// Static properties and methods
	_.extend(CartItem, {
		_prefix: 'cookiescart-',

		// Class names
		CC_ADD: 'cookiescart-add',
		CC_AMOUNT: 'cookiescart-item-amount',
		CC_CART: 'cookiescart-items',
		CC_QUANTITY: 'cookiescart-quantity',
		CC_REMOVE: 'cookiescart-remove',
		CC_REMOVE_ALL: 'cookiescart-remove-all',
		CC_ITEM_TOTAL: 'cookiescart-item-total',
		CC_REPR_ITEM: 'cookiescart-item',
		CC_TOTAL: 'cookiescart-total',
		CC_TOTAL_ITEMS: 'cookiescart-totalitems',
		CC_UNIQUE_ITEMS: 'cookiescart-uniqueitems',

		// Attribute names
		CA_ITEM_ID: 'data-id',
		CA_ITEM_NAME: 'data-name',
		CA_ITEM_PRICE: 'data-price',

		parseCookie: function (cookie) {
			var data = _.object(
				['quantity', 'price', 'name'], (cookie || ',,').split(','));
			data['quantity'] = Number(data['quantity']);
			data['price'] = Number(data['price']);
			return data;
		},

		getById: function (id) {
			var reprElement = $('.'+CartItem.CC_REPR_ITEM+'['+CartItem.CA_ITEM_ID+'='+id+']')[0];
			return new CartItem(reprElement);
		},

		updateCart: function () {
			/*
			Update an element with class `CartItem.CC_CART` with clones of
			matching item representations (`CartItem.CC_REPR_ITEM`). Note that
			they should exist hidden somewhere in your page.
			*/
			var cookie = $.cookie();
			var cart = $('.'+CartItem.CC_CART);

			cart.empty();  // Reset

			_.chain(_.pairs($.cookie()))
				// Don't touch others' cookies!
				.filter(function (item) { return item[0].indexOf(CartItem._prefix) === 0 })

				// Sort items by cookie name
				.sortBy(function (item) { return item[0] })

				// Loop through and render the cart
				.each(function (item) {
					var
					data = CartItem.parseCookie(item[1]),
					itemId = item[0].substring(CartItem._prefix.length),
					item = CartItem.getById(itemId),
					itemElement = $('.'+CartItem.CC_REPR_ITEM+'['+CartItem.CA_ITEM_ID+'='+itemId+']').clone();
					cart.append(itemElement);

					// Render amount and total of the item currently on the cart
					itemElement.find('.'+CartItem.CC_AMOUNT).text(data['quantity']);
					itemElement.find('.'+CartItem.CC_ITEM_TOTAL).text(
						(data['quantity'] * item.price).toFixed(2));
				});
		},

		updateStrings: function () {
			var
			items = 0,
			total = 0,
			total_items = 0;

			$.each($.cookie(), function (itemId, data) {
				if (itemId.indexOf(CartItem._prefix) !== 0)
					return;

				itemId = itemId.substring(CartItem._prefix.length);
				var item = CartItem.getById(itemId);

				data = CartItem.parseCookie(data);
				items += 1;
				total += data['quantity'] * item.price;
				total_items += data['quantity'];
			});

			$('.'+CartItem.CC_UNIQUE_ITEMS).text(items);
			$('.'+CartItem.CC_TOTAL_ITEMS).text(total_items);
			$('.'+CartItem.CC_TOTAL).text(total.toFixed(2));
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
			$.cookie(
				cookieName,
				[data['quantity'], data['price'], data['name']].join(','));
		},

		removeAll: function () {
			$.removeCookie(this.getCookieName());
		},

		add: function (amount) {
			var
			cookieName = this.getCookieName(),
			data = CartItem.parseCookie($.cookie(cookieName)),
			quantity = +$('.'+CartItem.CC_QUANTITY+'['+CartItem.CA_ITEM_ID+'='+this.id+']').val() || 1;

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
			var item = CartItem.getById(this.getAttribute(CartItem.CA_ITEM_ID));

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
	$(document).on('click', '.'+CartItem.CC_ADD, _clickWrap(function (item) {
		item.add(1);
	}));

	$(document).on('click', '.'+CartItem.CC_REMOVE, _clickWrap(function (item) {
		item.remove(1);
	}));

	$(document).on('click', '.'+CartItem.CC_REMOVE_ALL, _clickWrap(function (item) {
		item.removeAll();
	}));

	// Initialize the cart from previous cookies
	CartItem.updateCart();
	CartItem.updateStrings();

	// Expose CartItem
	window.CartItem = CartItem;

}(jQuery)
