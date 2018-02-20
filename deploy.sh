#!/bin/sh
aws s3 cp index.html s3://laundry-monitoring-service-website-prod --acl public-read
aws s3 cp default.jpg s3://laundry-monitoring-service-website-prod --acl public-read
aws s3 cp index.css s3://laundry-monitoring-service-website-prod --acl public-read
aws s3 cp index.js s3://laundry-monitoring-service-website-prod --acl public-read
aws s3 cp icon/favicon.ico s3://laundry-monitoring-service-website-prod/icon/ --acl public-read
aws s3 cp icon/logo.jpg s3://laundry-monitoring-service-website-prod/icon/ --acl public-read
