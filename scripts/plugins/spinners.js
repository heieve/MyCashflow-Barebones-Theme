/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var incrTmpl = ['<div class="SpinnerControl">',
		'<button class="SpinnerButton SpinnerButtonInc" type="button"></button>',
		'</div>'].join('');

	var decrTmpl = ['<div class="SpinnerControl">',
		'<button class="SpinnerButton SpinnerButtonDec" type="button"></button>',
		'</div>'].join('');

	var Spinners = {
		decimalSeparator: ',',

		init: function () {
			this.wrapInputs($(document.body));
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('click.spinner', '.SpinnerButton', $.proxy(this.handleClick, this));
			$(document).on('change', '.SpinnerInput input', $.proxy(this.handleChange, this));
		},

		unbindEvents: function () {
			$(document).off('.spinner');
		},

		wrapInputs: function ($root) {
			$('[type=number]', $root).each($.proxy(function (index, el) {
				this.wrapInput($(el));
			}, this));
		},

		wrapInput: function ($input) {
			var $newInput = $('<input type="text" name="' + $input.attr('name') + '"/>"');
			$input.replaceWith($newInput);
			$newInput.val($input.val())
				.wrap($('<div class="Spinner"></div>'))
				.before(decrTmpl)
				.after(incrTmpl)
				.wrap($('<div class="SpinnerInput"></div>'));

			if ($input.attr('max')) {
				$newInput.attr('data-max', $input.attr('max'));
			}

			if ($input.attr('min')) {
				$newInput.attr('data-min', $input.attr('min'));
			}

			if ($input.attr('step')) {
				$newInput.attr('data-step', $input.attr('step'));
			}
		},

		handleChange: function (evt) {
			var $input = $(evt.currentTarget);
			var $spinner = $input.closest('.Spinner');
			var $buttonInc = $spinner.find('button.SpinnerButtonInc');
			var $buttonDec = $spinner.find('button.SpinnerButtonDec');
			var value = this._parseValue($input.val());

			$buttonInc.prop('disabled', value >= $input.attr('data-max'));
			$buttonDec.prop('disabled', value <= $input.attr('data-min'));
		},

		handleClick: function (evt) {
			var $input = $(evt.currentTarget).closest('.Spinner').find('input');
			var max = parseFloat($input.attr('data-max')) || null;
			var min = parseFloat($input.attr('data-min')) || null;
			var step = parseFloat($input.attr('data-step') || 1);
			var value = this._parseValue($input.val() || 0);

			value = $(evt.currentTarget).is('.SpinnerButtonInc') ? value + step : value - step;
			value = !!min && value <= min ? min : value;
			value = !!max && value >= max ? max : value;

			$input.val(this._formatValue(value)).trigger('change');
		},

		_formatValue: function (amount) {
			return parseFloat(amount).toString().replace('.', this.decimalSeparator);
		},

		_parseValue: function (str) {
			return parseFloat(str.toString().replace(this.decimalSeparator, '.'));
		}
	};

	$.extend(true, window, { MCF: { Spinners: Spinners }});
})(jQuery);
