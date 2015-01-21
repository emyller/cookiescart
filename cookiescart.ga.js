'use strict';
+function ($) {

	$(document).on('click', '.cookiescart-add', function () {
		ga('send', {
			hitType: 'event',
			eventCategory: 'cookiescart',
			eventAction: 'add',
			eventLabel: this.getAttribute('data-id')
		})
	});

	$(document).on('click', '.cookiescart-remove', function () {
		ga('send', {
			hitType: 'event',
			eventCategory: 'cookiescart',
			eventAction: 'remove',
			eventLabel: this.getAttribute('data-id')
		})
	});

	$(document).on('click', '.cookiescart-remove-all', function () {
		ga('send', {
			hitType: 'event',
			eventCategory: 'cookiescart',
			eventAction: 'remove-all',
			eventLabel: this.getAttribute('data-id')
		})
	});

}(jQuery)
