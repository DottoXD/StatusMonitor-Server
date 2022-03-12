# !/bin/bash

if [ $UID !== 0 ]
 then
  printf "Please run this as root! \n"
  exit
fi
apt install sudo curl
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
apt install -y nodejs git

content=`wget https://raw.githubusercontent.com/DottoXD/statusmonitor-server/main/statusmonitorserver.service`


mv ./statusmonitorserver.service /lib/systemd/system/statusmonitorserver.service

mkdir /etc/statusmonitorserver && cd /etc/statusmonitorserver
git clone https://github.com/DottoXD/statusmonitor-server .

npm install

systemctl enable --now statusmonitorserver
printf "StatusMonitor - Server by DottoXD has been installed! Make sure to configure /etc/statusmonitorserver/src/config.json and then systemctl restart statusmonitorserver ! \n"