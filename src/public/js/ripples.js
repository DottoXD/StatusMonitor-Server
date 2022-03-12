let buttons = document.querySelectorAll("button, a");
buttons.forEach((button) => {
	button.addEventListener("click", function (btn) {
		let x = btn.clientX - btn.target.offsetLeft;
		let y = btn.clientY - btn.target.offsetTop;

		let ripples = document.createElement("span");
		ripples.style.left = x + "px";
		ripples.style.top = y + "px";
		btn.target.appendChild(ripples);

		setTimeout(function () {
			ripples.remove();
		}, 600);
	});
});
