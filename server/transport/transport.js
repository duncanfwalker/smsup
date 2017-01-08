const { createReceiveRoute } = require('./gatewayMiddleware');
const nexmo = require('./gateways/nexmo');


function send(recipient, text) {
  return nexmo.send(recipient, text);
}

function receiveRoute(setup) {
  return createReceiveRoute(nexmo.routeSetup, setup(send));
}

module.exports = { receiveRoute, send };
