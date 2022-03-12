let stats = document.getElementById("stats");
stats.style.display = "none";

function serviceStats(
	serviceStatus,
	serviceName,
	serviceUrl,
	serviceCpu,
	serviceUsedMemory,
	serviceTotalMemory,
	serviceUsedDisk,
	serviceTotalDisk,
	serviceNetworkIn,
	serviceNetworkOut,
	serviceNetworkInSec,
	serviceNetworkOutSec,
	serviceLoad
) {
	let container = document.getElementById("container");
	container.style.display = "none";

	stats.style.display = "block";

	let serviceTextName = document.getElementById("service");
	serviceTextName.innerText = serviceName + " - " + serviceStatus;

	let serviceTextUrl = document.getElementById("url");
	serviceTextUrl.innerText = "URL: " + serviceUrl;

	let serviceTextCpu = document.getElementById("cpu");
	serviceTextCpu.innerText = "CPU: " + serviceCpu + "%";

	let serviceTextRam = document.getElementById("ram");
	serviceTextRam.innerText =
		"RAM: " +
		prettierBytes(serviceUsedMemory) +
		"/" +
		prettierBytes(serviceTotalMemory);

	let serviceTextDisk = document.getElementById("disk");
	serviceTextDisk.innerText =
		"Disk: " +
		prettierBytes(serviceUsedDisk) +
		"/" +
		prettierBytes(serviceTotalDisk);

	let serviceTextInOut = document.getElementById("networkinout");
	serviceTextInOut.innerText =
		"Incoming: " +
		prettierBytes(serviceNetworkIn) +
		", Outgoing: " +
		prettierBytes(serviceNetworkOut);

	let serviceTextInOutSec = document.getElementById("networkinoutsec");
	serviceTextInOutSec.innerText =
		"Incoming: " +
		prettierBytes(serviceNetworkInSec) +
		", Outgoing: " +
		prettierBytes(serviceNetworkOutSec);

	let serviceTextLoad = document.getElementById("load");
	serviceTextLoad.innerText = "Load: " + serviceLoad;

	serviceTextUrl.onclick = function () {
		window.location = serviceUrl;
	};
}

function closeStats() {
	let container = document.getElementById("container");
	container.style.display = "block";

	stats.style.display = "none";
}

function prettierBytes(amount) {
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	if (amount == 0) return "0B";
	const integer = parseInt(Math.floor(Math.log(amount) / Math.log(1024)));
	return (
		Math.round(amount / Math.pow(1024, integer), 2) + " " + sizes[integer]
	);
}
