const { fastify, chalk, fs, undici, asyncRedis } = require(global.HOME +
	"/index");

let LoadedRoutes = 0;
let RedisClient = asyncRedis.createClient(
	fastify.config.AuthenticationConfiguration.RedisURL
);

class StatusMonitorServer {
	static Init() {
		if (fastify.config.WebServerConfiguration.ProductionMode) {
			fastify.listen(
				fastify.config.WebServerConfiguration.WebPort,
				"0.0.0.0",
				(err, address) => {
					console.log(
						chalk.bold.blueBright("[StatusMonitor] ") +
							chalk.bold.whiteBright(
								"Started the production server on " + address
							)
					);
				}
			);
		} else {
			fastify.listen(
				fastify.config.WebServerConfiguration.WebPort,
				(err, address) => {
					console.log(
						chalk.bold.blueBright("[StatusMonitor] ") +
							chalk.bold.whiteBright(
								"Started the development server on " + address
							)
					);
				}
			);
		}
		console.log(
			chalk.bold.redBright("[StatusMonitor] ") +
				chalk.bold.whiteBright(
					"You will most likely get an ExperimentalWarning in the console. This is normal and is not an error!"
				)
		);
	}

	static LoadPlugins() {
		fastify.register(require("fastify-static"), {
			root: global.HOME + "/src/public",
		});

		fastify.register(require("point-of-view"), {
			engine: {
				ejs: require("ejs"),
			},
			templates: global.HOME + "/src/views",
		});

		fastify.register(require("fastify-helmet"), {
			global: true,
			contentSecurityPolicy: false,
			crossOriginEmbedderPolicy: false,
		});

		fastify.register(require("fastify-rate-limit"), {
			global: true,
			max: fastify.config.WebServerConfiguration.RateLimit.MaxRequests,
			timeWindow: fastify.config.WebServerConfiguration.RateLimit.Period,
		});
	}

	static LoadRoutes() {
		fs.readdirSync(global.HOME + "/src/routes").forEach((file) => {
			if (file.endsWith(".js") || file.endsWith(".ts")) {
				let route = require(global.HOME + "/src/routes/" + file);
				fastify.register(route);
				LoadedRoutes += 1;
				console.log(
					chalk.bold.blueBright("[StatusMonitor] ") +
						chalk.bold.whiteBright("Loaded route " + file)
				);
			}
		});
		console.log(
			chalk.bold.blueBright("[StatusMonitor] ") +
				chalk.bold.whiteBright("Loaded " + LoadedRoutes + " routes")
		);
	}

	static UpdateChecker() {
		undici
			.fetch(
				"https://raw.githubusercontent.com/DottoXD/statusmonitor-server/main/package.json"
			)
			.then((body) => body.json())
			.then((data) => {
				if (
					data.version !== require(global.HOME + "/package.json").version
				) {
					console.log(
						chalk.bold.greenBright("[StatusMonitor] ") +
							chalk.bold.whiteBright(
								"New version available: " + data.version
							)
					);
				}
			});
	}

	static LoadUptimeChecker() {
		require("./UptimeChecker");
	}

	static LoadPlainRoutes() {
		fastify.config.ServicesSettings.Services.forEach((service) => {
			let FixedName = service.Name.replace(/\s+/g, "").toLowerCase();
			fastify.get("/" + FixedName + "/metrics", async (request, reply) => {
				RedisClient.get(service.Name).then((data) => {
					let Parse = JSON.parse(data);
					if (Parse.Online === true) {
						reply.send(
							`#cpu usage\ncpu ${Parse.Cpu}\n#ram usage\nmemory_used ${Parse.Ram_Used}\n#total ram\nmemory_total ${Parse.Ram_Total}\n#used didk\ndisk_used ${Parse.Disk_Used}\n#total disk\ndisk_total ${Parse.Disk_Total}\n#total swap\nswap_total ${Parse.Swap_Total}\n#used swap\nswap_used ${Parse.Swap_Used}\n#network incoming total\nnetwork_rx ${Parse.Network_Rx}\n#outgoing data total\nnetwork_tx ${Parse.Network_Tx}\n#incoming data per second\nnetwork_rx_sec ${Parse.Network_Rx_Second}\n#outgoing data per second\nnetwork_tx_sec ${Parse.Network_Tx_Second}`
						);
					} else {
						reply.send(`#server status\nstatus offline`);
					}
				});
			});
		});
	}
}

module.exports = {
	StatusMonitorServer,
	RedisClient,
};
