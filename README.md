# statusmonitor-server

A free NodeJS status page solution, used to show a machine's resources usage.
You can use this status page to show any machine's or NodeJS process' stats (as long as it's monitored with either [statusmonitor-client](https://github.com/DottoXD/statusmonitor-client) or [statusmonitor-process](https://github.com/DottoXD/statusmonitor-process)

# update 1.0.2

+  first stable release
+  full project rewrite
+  custom made, high quality frontend
+ (1.0.2) fixed a critical bug

# known issues

There are no known issues at the moment.

# simple setup guide

You can easily setup [statusmonitor-server](https://github.com/DottoXD/statusmonitor-server) in 3 steps!

**Step one: clone the repo:**
_make sure to do this in an empty directory!_

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

Or use the install script!

```
wget -O - https://raw.githubusercontent.com/DottoXD/statusmonitor-server/main/install.sh | sh
```

# uninstall guide

You can simply use the uninstall script!

```
wget -O - https://raw.githubusercontent.com/DottoXD/statusmonitor-server/main/uninstall.sh | sh
```
