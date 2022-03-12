const DeliverStatus = require(global.HOME + "/src/DeliverStatus");

let { queue, fastify, undici } = require(global.HOME + "/index");
let { RedisClient } = require(global.HOME + "/src/StatusMonitorServer");

let RedisScan = RedisClient.scanStream({
	match: `bull:StatusMonitorQueue:*`,
});

RedisScan.on("data", (keys) => {
	if (keys.length) {
		keys.forEach((key) => {
			if (
				key === "bull:StatusMonitorQueue:delayed" ||
				key === "bull:StatusMonitorQueue:id" ||
				key === "bull:StatusMonitorQueue:stalled-check"
			)
				return;
			RedisClient.del(key);
		});
	}
});

let StatusMonitor = new queue(
	"StatusMonitorQueue",
	fastify.config.AuthenticationConfiguration.RedisURL
);
StatusMonitor.add({ data: "StatusMonitorQueue" }, { delay: 5000 });

StatusMonitor.process(async function (job, done) {
	fastify.config.ServicesSettings.Services.forEach((service) => {
		let OfflineObject = JSON.stringify({
			Name: service.Name,
			Online: false,
		});
		undici
			.fetch(service.Url)
			.then(async (res) => {
				let Json = await res.json();
				if (!Json) {
					let RedisData = await RedisClient.get(service.Name);
					let Parse = await JSON.parse(RedisData);
					if(Parse) {
						if (Parse.Online === true) DeliverStatus(service.Name, "Offline");
					}
					return RedisClient.set(service.Name, OfflineObject);
				}
				let OnlineObject = JSON.stringify({
					Name: service.Name,
					Online: true,
					Cpu: Json.cpu,
					Ram_Used: Json.memory_used,
					Ram_Total: Json.memory_total,
					Disk_Used: Json.disk_used,
					Disk_Total: Json.disk_total,
					Uptime: Json.uptime,
					Swap_Used: Json.swap_used,
					Swap_Total: Json.swap_total,
					Network_Rx: Json.network_rx,
					Network_Tx: Json.network_tx,
					Network_Rx_Second: Json.network_rx_sec,
					Network_Tx_Second: Json.network_tx_sec,
					Load: Json.load,
					Type: service.Type,
				});
				let RedisData = await RedisClient.get(service.Name);
				let Parse = await JSON.parse(RedisData);
				if(Parse) {
					if (Parse.Online === false) DeliverStatus(service.Name, "Online");
				}
				return RedisClient.set(service.Name, OnlineObject);
			})
			.catch((error) => {
				RedisClient.get(service.Name).then(async (data) => {
					let Parse = await JSON.parse(data);
					if(Parse) {
						if (Parse.Online === true)
						DeliverStatus(service.Name, "Offline");
					}
					return RedisClient.set(service.Name, OfflineObject);
				});
			});
	});
	StatusMonitor.add(
		{ data: "StatusMonitorQueue" },
		{ delay: fastify.config.StatusPageConfiguration.FetchIntervalMs }
	);
	done();
});
