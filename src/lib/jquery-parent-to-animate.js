// from https://gist.github.com/MadLittleMods/7257ee631210215e368e#file-jquery-parent-to-animate-js
//This solution jumps when element is added or removed.
// could be better
// some ideas at https://stackoverflow.com/questions/907279/jquery-animate-moving-dom-element-to-new-parent
// Usage:
// $('.box').parentToAnimate($('.new-parent'), 200);
// $('.box').parentToAnimate($('.new-parent'), 'slow');
// $('.box').parentToAnimate('.new-parent', 'slow');

jQuery.fn.extend({
	// Modified and Updated by MLM
	// Origin: Davy8 (http://stackoverflow.com/a/5212193/796832)
	parentToAnimate: function (newParent, duration) {
		duration = duration || "slow";

		let $element = $(this);
		newParent = $(newParent); // Allow passing in either a JQuery object or selector
		let oldOffset = $element.offset();
		let oldRotate = $element.css("rotate");
		$(this).appendTo(newParent);
		let newOffset = $element.offset();
		let temp = $element.clone().appendTo("body");

		temp.css({
			position: "absolute",
			// @ts-ignore
			left: oldOffset.left,
			// @ts-ignore
			top: oldOffset.top,
			rotate: oldRotate,
			zIndex: 1000,
		});

		$element.hide();

		temp.animate(
			{
				// @ts-ignore
				top: newOffset.top,
				// @ts-ignore
				left: newOffset.left,
				rotate: "0deg",
			},
			duration,
			function () {
				$element.show();
				temp.remove();
			}
		);
	},
});
