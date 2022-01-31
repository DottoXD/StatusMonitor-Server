# statusmonitor-server
A free status page solution, used to show a machine's resources usage. Developed in NodeJS, this is an early version.
You can selfhost a [statusmonitor-client](https://github.com/DottoXD/statusmonitor-client) instance and connect those 2, you will get a beautiful status page that shows your machines stats.

# important note (credits)
The frontend UI included in this is a slightly modified version of [serverstatus-web](https://github.com/krwu/ServerStatus-web) by krwu. Credits to him for making it.

# update 0.0.6
+ (0.0.5) network usage per second, grafana (prometheus) support
+ status updates notifications on discord

# upcoming in 0.0.7
+ new custom ui by me
+ ping stats

# features
This project can currently clone another status page's data or just display your own, that you can fetch with [statusmonitor-client](https://github.com/DottoXD/statusmonitor-client)

# known issues
There are no known issues at the moment.

# simple setup guide
You can easily setup [statusmonitor-server](https://github.com/DottoXD/statusmonitor-server) in 3 steps!

**Step one: clone the repo:**
*make sure to do this in an empty directory!*
```
git clone https://github.com/DottoXD/statusmonitor-server .
```

**Step two: install every dependency!**
```
npm install
```

**Step three: start the server!**
```
node index.js
```
