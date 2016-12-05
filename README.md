```
mongod --dbpath /tmp/mongodb
export MONGODBURI=mongodb://localhost:27017/smsup
npm start
```

```
npm test
```


```
curl -XPOST http://localhost:3001/api/receive -d '{"msisdn": "441632960960", "to": "441632960961", "messageId": "02000000E68951D8", "text": "somegroup content of the message", "message-timestamp": "2016-07-05 21:46:15"}' -H 'Content-Type: application/json'
```