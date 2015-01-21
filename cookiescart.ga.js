'use strict';
+function ($) {

	function ga_send(action, label) {
		return ga('send', {
			hitType: 'event',
			eventCategory: 'cookiescart',
			eventAction: action,
			eventLabel: label
		});
	}

	$(document).on('click', '.'+CartItem.CC_ADD, function () {
		ga_send('add', this.getAttribute(CartItem.CA_ITEM_ID));
	});

	$(document).on('click', '.'+CartItem.CC_REMOVE, function () {
		ga_send('remove', this.getAttribute(CartItem.CA_ITEM_ID));
	});

	$(document).on('click', '.'+CartItem.CC_REMOVE_ALL, function () {
		ga_send('remove-all', this.getAttribute(CartItem.CA_ITEM_ID));
	});

}(jQuery)
