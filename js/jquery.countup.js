/*!
* jquery.countup.js 1.0.3
*
* Copyright 2016, Adrián Guerra Marrero http://agmstudio.io @AGMStudio_io
* Released under the MIT License
*
* Date: Oct 27, 2016
*/
(function( $ ){
  "use strict";

  $.fn.countUp = function( options ) {

    // Defaults
    var settings = $.extend({
        'time': 2000,
        'delay': 10
    }, options);

    return this.each(function(){

        // Store the object
        var $this = $(this);
        var $settings = settings;

        var counterUpper = function() {
            if(!$this.data('counterupTo')) {
                $this.data('counterupTo',$this.text());
            }
            var time = parseInt($this.data("counter-time")) > 0 ? parseInt($this.data("counter-time")) : $settings.time;
            var delay = parseInt($this.data("counter-delay")) > 0 ? parseInt($this.data("counter-delay")) : $settings.delay;
            var divisions = time / delay;
            var num = $this.data('counterupTo');
            // Ensure num is a string
            if (num === null || num === undefined) {
                num = $this.text() || '0';
            }
            num = String(num);
            var isComma = /[0-9]+,[0-9]+/.test(num);
            num = num.replace(/,/g, '');
            var isInt = /^[0-9]+$/.test(num);
            var isFloat = /^[0-9]+\.[0-9]+$/.test(num);
            var decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0;
            
            // Validate that num is a valid number
            var numValue = isFloat ? parseFloat(num) : parseInt(num, 10);
            if (isNaN(numValue) || numValue < 0) {
                // Invalid number, don't proceed with animation
                return;
            }
            
            // Ensure divisions is valid
            if (isNaN(divisions) || divisions <= 0) {
                divisions = 50; // Default fallback
            }

            var nums = [];
            // Generate list of incremental numbers to display
            for (var i = divisions; i >= 1; i--) {

                // Preserve as int if input was int
                var newNum = parseInt(Math.round(num / divisions * i));

                // Preserve float if input was float
                if (isFloat) {
                    newNum = parseFloat(num / divisions * i).toFixed(decimalPlaces);
                }

                // Preserve commas if input had commas
                if (isComma) {
                    while (/(\d+)(\d{3})/.test(newNum.toString())) {
                        newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
                    }
                }

                nums.unshift(newNum);
            }
            
            // Ensure nums array has values
            if (!nums || nums.length === 0) {
                // If no numbers generated, just set the final value
                var finalValue = isComma ? numValue.toLocaleString() : String(numValue);
                $this.text(finalValue);
                return;
            }

            $this.data('counterup-nums', nums);
            $this.text('0');

            // Updates the number until we're done
            var f = function() {
                var counterNums = $this.data('counterup-nums');
                if (!counterNums || !Array.isArray(counterNums) || counterNums.length === 0) {
                    // If no numbers array, restore original value and exit
                    var originalValue = $this.data('counterupTo') || '0';
                    $this.text(originalValue);
                    $this.data('counterup-nums', null);
                    $this.data('counterup-func', null);
                    return;
                }
                $this.text(counterNums.shift());
                if (counterNums.length) {
                    setTimeout($this.data('counterup-func'),delay);
                } else {
                    delete $this.data('counterup-nums');
                    $this.data('counterup-nums', null);
                    $this.data('counterup-func', null);
                }
            };
            $this.data('counterup-func', f);

            // Start the count up
            setTimeout($this.data('counterup-func'),delay);
        };

        // Perform counts when the element gets into view
        $this.waypoint(counterUpper, { offset: '100%', triggerOnce: true });
    });

  };

})( jQuery );
