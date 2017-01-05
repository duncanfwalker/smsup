import {receive} from './receiver';
import { createReceiveRoute } from './gatewayMiddleware';
import * as nexmo from './gateways/nexmo';

export function receiveRoute() {
  return createReceiveRoute(nexmo.routeSetup,receive)
}

export function send(recipient, text) {
  return nexmo.send(recipient, text)
}

