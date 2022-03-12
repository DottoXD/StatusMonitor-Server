let { fastify, undici } = require(global.HOME + "/index");

async function DeliverStatus(Service, Status) {
	if (
		fastify.config.AuthenticationConfiguration.EnableDiscordNotifications ===
		false
	)
		return;
	let RequestBody = {
		embeds: [
			{
				title: `${fastify.config.StatusPageConfiguration.CompanyName} Status - ${Service} is ${Status}!`,
			},
		],
	};

	if (Status === "Online") {
		RequestBody.embeds[0].description =
			"This service is back online, and should now be running smoothly.";
		RequestBody.embeds[0].color = 65443;
	} else if (Status === "Offline") {
		RequestBody.embeds[0].description =
			"This service is currently offline, we are looking into the outage and will update you soon.";
		RequestBody.embeds[0].color = 16711680;
	}

	let RequestHeaders = {
		"Content-type": "application/json",
	};

	undici
		.fetch(
			"https://discord.com/api/webhooks/" +
				fastify.config.AuthenticationConfiguration.DiscordWebhook.Id +
				"/" +
				fastify.config.AuthenticationConfiguration.DiscordWebhook.Token,
			{
				body: JSON.stringify(RequestBody),
				headers: RequestHeaders,
				method: "POST",
			}
		)
		.catch();
}

module.exports = DeliverStatus;
