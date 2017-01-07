const { createReceiveRoute } = require( './gatewayMiddleware');
const nexmo = require( './gateways/nexmo');

function receiveRoute(setup) {
  return createReceiveRoute(nexmo.routeSetup,setup(send));
}

function send(recipient, text) {
  return nexmo.send(recipient, text);
}

module.exports = { receiveRoute, send };
