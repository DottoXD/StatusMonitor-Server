# !/bin/bash

if [ $UID !== 0 ]
 then
  printf "Please run this as root! \n"
  exit
fi

systemctl disable --now statusmonitorserver
rm -r /etc/statusmonitorserver
rm /lib/systemd/system/statusmonitorserver.service

printf "StatusMonitor - Server by DottoXD has been uninstalled! \n"