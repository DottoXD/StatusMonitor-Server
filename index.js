const fastify = require("fastify")({ logger: false });
const path = require("path");
const fetch = require("node-fetch");
const { serverSettings, servers, notificationSettings } = require("./config.json");
const fs = require("fs");
const moment = require("moment");
const glob = require("glob");

let dataArray = [];
let notificationArray = [];

glob.path = __dirname;

fastify.register(require("fastify-formbody"));
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "build"),
});

fastify.register(require("./routes/index.js"));

if (serverSettings.grafanaSupport === true) {
  servers.forEach((server) => {
    let fixedName = server.name.replace(/\s+/g, "").toLowerCase();
    fastify.get("/" + fixedName + "/metrics", async (request, reply) => {
      let data = fs.readFileSync(glob.path + "/build/json/stats.json", "utf8");
      let parsedData = JSON.parse(data);
      parsedData.servers.forEach((serverData) => {
        if (serverData.name === server.name) {
          if (serverData.online4 === false) {
            reply.send(`#server status\nstatus offline`);
          }
          reply.send(
            `#cpu usage\ncpu ${serverData.cpu}\n#ram usage\nmemory_used ${serverData.memory_used}\n#total ram\nmemory_total ${serverData.memory_total}\n#used didk\ndisk_used ${serverData.hdd_used}\n#total disk\ndisk_total ${serverData.hdd_total}\n#total swap\nswap_total ${serverData.swap_total}\n#used swap\nswap_used ${serverData.swap_used}\n#network incoming total\nnetwork_rx ${serverData.network_rx}\n#outgoing data total\nnetwork_tx ${serverData.network_tx}\n#incoming data per second\nnetwork_rx_sec ${serverData.network_rx_sec}\n#outgoing data per second\nnetwork_tx_sec ${serverData.network_tx_sec}`
          );
        }
      });
    });
  });
}

fastify.listen(serverSettings.port, "0.0.0.0", function (err, address) {
  if (err) {
    fastify.log.error(err);
  }
});

const fetchAndSaveData = async function () {
  if (serverSettings.monitorFromUrlFile === true)
    return fetch(url)
      .then((res) => res.json())
      .then((stringify) => JSON.stringify(stringify))
      .then((data) =>
        fs.writeFile(glob.path + "/build/json/stats.json", data, (err) => {})
      );

  servers.forEach((server) => {
    let requestHeaders = {
      password: server.password,
    };
    let data = fetch(server.url, { method: "GET", headers: requestHeaders })
      .then((res) => res.json())
      .then((inf) => {
        dataArray.push(inf);
        if (notificationArray.find((entry) => entry === inf.name)) {
          if (notificationSettings.enabled === true) {
            let requestBody = JSON.stringify({
              embeds: [
                {
                  title:
                    notificationSettings.embedName +
                    server.name +
                    " is back online!",
                  description: notificationSettings.onlineDescription,
                  color: notificationSettings.onlineColorCode,
                },
              ],
            });

            let requestHeaders = {
              "Content-type": "application/json",
            };

            let req = fetch(notificationSettings.discordWebhookURL, {
              method: "POST",
              body: requestBody,
              headers: requestHeaders,
            });
          }
          let serviceIndex = notificationArray.indexOf(inf.name);
          notificationArray.splice(serviceIndex);
        }
      })
      .catch((err) => {
        let error = {
          name: server.name,
          type: server.type,
          host: server.name,
          location: server.location,
          online4: false,
          online6: false,
        };

        dataArray.push(error);
        if (notificationArray.find((entry) => entry === server.name)) {
          return;
        } else {
          notificationArray.push(server.name);
          if (notificationSettings.enabled === true) {
            let requestBody = JSON.stringify({
              embeds: [
                {
                  title:
                    notificationSettings.embedName +
                    server.name +
                    " is offline!",
                  description: notificationSettings.offlineDescription,
                  color: notificationSettings.offlineColorCode,
                },
              ],
            });

            let requestHeaders = {
              "Content-type": "application/json",
            };

            let req = fetch(notificationSettings.discordWebhookURL, {
              method: "POST",
              body: requestBody,
              headers: requestHeaders,
            });
          }
        }
      });
  });

  let date = moment();
  let updateTimestamp = moment(date).format("X");
  let fileContent = {
    servers: dataArray,
    updated: updateTimestamp,
  };

  let stringifiedContent = JSON.stringify(fileContent);
  await fs.writeFile(
    glob.path + "/build/json/stats.json",
    stringifiedContent,
    (err) => {}
  );

  dataArray = [];
};

setInterval(fetchAndSaveData, serverSettings.fetchInterval);
