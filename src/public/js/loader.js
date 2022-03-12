const container = document.getElementById("container");
container.style.display = "none";

const navbar = document.getElementById("navbar");
navbar.style.display = "none";

const footer = document.getElementById("footer");
footer.style.display = "none";

const loader = document.getElementById("loader");
window.addEventListener("load", () => {
	loader.style.display = "none";
	container.style.display = "block";
	navbar.style.display = "block";
	footer.style.display = "block";
});
