const fastify = require("fastify")({ logger: false });
const path = require("path");
const fetch = require("node-fetch");
const { servers, port, fetchInterval, monitorFromUrlFile, url } = require("./config.json");
const fs = require("fs");
const moment = require("moment");
const glob = require("glob")

let dataArray = [];

glob.path = __dirname;

fastify.register(require("fastify-formbody"));
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "build"),
});

fastify.register(require("./routes/index.js"));

fastify.listen(port, "0.0.0.0", function (err, address) {
  if (err) {
    fastify.log.error(err);
  }
});

const fetchAndSaveData = async function () {
  if (monitorFromUrlFile === true)
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

setInterval(fetchAndSaveData, fetchInterval);