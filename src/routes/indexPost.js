let { RedisClient } = require(global.HOME + "/src/StatusMonitorServer");

async function routes(fastify, options) {
	fastify.post("/", async (request, reply) => {
		let ServicesStats = [];
		fastify.config.ServicesSettings.Services.forEach(async (service) => {
			if (ServicesStats.length !== 0) ServicesStats = [];
			await RedisClient.get(service.Name).then(async (value) => {
				if (value) {
					ServicesStats.push(JSON.parse(value));
				}
				if (
					ServicesStats.length ===
					fastify.config.ServicesSettings.Services.length
				) {
					return ReplyToRequest(reply, ServicesStats, fastify);
				}
			});
		});
	});
}

async function ReplyToRequest(reply, ServicesStats, fastify) {
	await reply.view("index.ejs", {
		companyName: fastify.config.StatusPageConfiguration.CompanyName,
		companyLinks: fastify.config.StatusPageConfiguration.CompanyLinks,
		companyServices: fastify.config.ServicesSettings.Services,
		companyColour: fastify.config.StatusPageConfiguration.CompanyColour,
		servicesStats: ServicesStats,
	});
}
module.exports = routes;
