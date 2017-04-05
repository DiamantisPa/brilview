(sleep 20; echo 'create database telegraf with duration 2d' | influx) &
(sleep 21; echo 'CREATE RETENTION POLICY telegraf_rp ON telegraf DURATION 2d REPLICATION 1 DEFAULT' | influx) &
influxd run
