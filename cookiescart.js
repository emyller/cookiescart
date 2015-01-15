+function ($) {

	$(document).on('click', '.cookiescart-add', function (e) {
		// Nothing weird will happen!
		e.preventDefault();

		// Gather item info
		var itemId = this.getAttribute('data-id');
		var itemPrice = this.getAttribute('data-price');

		// Update the cookie jar
		$.cookie(itemId, ($.cookie(itemId, Number) || 0) + 1);
	});

}(jQuery)
