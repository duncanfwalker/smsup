[![Build Status](https://travis-ci.com/duncanfwalker/smsup.svg?token=W2ujExLVSotXeD6rfBnv&branch=master)](https://travis-ci.com/duncanfwalker/smsup)

Local Development
=================

1. Install Node `brew install node`
1. Install Mongo DB `brew install mongodb`
1. Setup Environment variables `cp .env.dist .env`

```
mongod --dbpath ./data
npm start
```

You might find https://ngrok.com/ is useful for manually testing integration with SMS Gateways.


```
npm test
```

Creating a new deployment environment
=====================================

 1. Create Heroku app with NodeJs buildpack
 1. Add MongoLab Hobby Add On
 1. Set environment variables from .env.dist
 1. Set up callback url on SMS Gateway


Deployment
==========

 - development: Travis builds on merge/push to master
 - staging: developer promotes through Heroku pipeline
 - production: admin promotes through Heroku pipeline


Development - Nexmo UK
Staging - Nexmo Local
Production - Local operator