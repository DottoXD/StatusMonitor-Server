# !/bin/bash

if [ $UID !== 0 ]
 then
  printf "Please run the SMS install tool as root! \n"
  exit
fi
apt install sudo curl
curl -sL https://deb.nodesource.com/setup_18.x | sudo bash -
apt install -y nodejs git

content=`wget https://raw.githubusercontent.com/DottoXD/StatusMonitor-Server/main/StatusMonitorServer.service`

mv ./StatusMonitorServer.service /lib/systemd/system/StatusMonitorServer.service

mkdir /etc/StatusMonitorServer && cd /etc/StatusMonitorServer
git clone https://github.com/DottoXD/StatusMonitor-Server .

npm install
npm run build

systemctl enable --now StatusMonitorServer
printf "@ SMServer has been installed! Make sure to configure /etc/StatusMonitorServer/config.json and then run systemctl restart StatusMonitorServer! \n"
