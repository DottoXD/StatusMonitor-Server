global.HOME = __dirname;

/* StatusMonitor v1.0.0 by DottoXD
https://github.com/DottoXD/statusmonitor-server/ released under the GNU General Public License v3.0 */

exports.fastify = require("fastify")({ logger: false });
exports.undici = require("undici");
exports.queue = require("bull");
exports.dayjs = require("dayjs");
exports.chalk = require("chalk");
exports.asyncRedis = require("ioredis");
exports.fs = require("fs");
exports.fastify.config = require(global.HOME + "/src/config.json");

let { StatusMonitorServer } = require(global.HOME + "/src/StatusMonitorServer");
StatusMonitorServer.Init();
StatusMonitorServer.LoadPlugins();
StatusMonitorServer.LoadRoutes();
StatusMonitorServer.UpdateChecker();
StatusMonitorServer.LoadUptimeChecker();
StatusMonitorServer.LoadPlainRoutes();
