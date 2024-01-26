# !/bin/bash

if [ $UID !== 0 ]
 then
  printf "Please run the SMS uninstall tool as root! \n"
  exit
fi

systemctl disable --now StatusMonitorServer
apt remove -y nodejs git
rm -r /etc/StatusMonitorServer
rm /lib/systemd/system/StatusMonitorServer.service

printf "@ SMServer has been uninstalled! \n"
