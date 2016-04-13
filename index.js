'use strict';

const _ = require('lodash');

const client = require('rotonde-client/node/rotonde-client')('ws://rotonde:4224');

const gpio = require('pi-gpio');

client.addLocalDefinition('action', 'GPIO_OPEN', [
  {
    name: "pinNumber",
    type: "number",
    units: "Gpio number",
  },
  {
    name: "options",
    type: "string",
    units: "Should be a string, such as input or input pullup. You can specify whether the pin direction should be input or output (or in or out). You can additionally set the internal pullup / pulldown resistor by sepcifying pullup or pulldown (or up or down). If options isn't provided, it defaults to output. If a direction (input or output) is not specified (eg. only up), then the direction defaults to output.",
  },
]);

client.addLocalDefinition('action', 'GPIO_CLOSE', [
  {
    name: "pinNumber",
    type: "number",
    units: "Gpio number",
  },
]);

client.addLocalDefinition('action', 'GPIO_DIRECTION', [
  {
    name: "pinNumber",
    type: "number",
    units: "GPIO number",
  },
  {
    name: "direction",
    type: "string",
    units: "in or out",
  }
]);

client.addLocalDefinition('action', 'GPIO_WRITE', [
  {
    name: "pinNumber",
    type: "number",
    units: "GPIO number",
  },
  {
    name: "value",
    type: "boolean",
    units: "Desired value",
  }
]);

client.addLocalDefinition('event', 'GPIO_READ', [
  {
    name: "pinNumber",
    type: "number",
    units: "Gpio number",
  },
  {
    name: "value",
    type: "boolean",
    units: "Current value",
  }
]);

client.addLocalDefinition('event', 'GPIO_ERROR', [
  {
    name: "pinNumber",
    type: "number",
    units: "Gpio number",
  },
  {
    name: "value",
    type: "boolean",
    units: "Initial value",
  }
]);

client.addLocalDefinition('event', 'GPIO_SUCCESS', [
  {
    name: "pinNumber",
    type: "number",
    units: "Gpio number",
  },
]);

let readableGpios = [];

const respond = (pinNumber, err) => {
  client.sendEvent(err ? 'GPIO_ERROR' : 'GPIO_SUCCESS', {
    pinNumber: pinNumber,
    error: err,
  });
}

client.actionHandlers.attach('GPIO_OPEN', (a) => {
  gpio.open(a.data.pinNumber, a.data.options, (err) => {
    respond(a.data.pinNumber, err);
    if (!err) {
      client.actionHandlers.attach('GPIO_CLOSE', (ac) => {
        if (ac.data.pinNumber != a.data.pinNumber) {
          return;
        }
        gpio.close(a.data.pinNumber, (err) => {
          readableGpios = _.filter(readableGpios, (g) => g != a.data.pinNumber);
          respond(a.data.pinNumber, err);
        });
      });
    }
  });
});

client.actionHandlers.attach('GPIO_DIRECTION', (a) => {
  gpio.setDirection(a.data.pinNumber, a.data.direction, (err) => {
    respond(a.data.pinNumber, err);
    if (a.data.direction == 'in') {
      readableGpios.push(a.data.pinNumber);
    } else {
      readableGpios = _.filter(readableGpios, (g) => g != a.data.pinNumber);
    }
  });
});

client.actionHandlers.attach('GPIO_WRITE', (a) => {
  gpio.write(a.data.pinNumber, a.data.value, (err) => {
    respond(a.data.pinNumber, err);
  });
});

client.actionHandlers.attach('GPIO_READ', (a) => {
  gpio.setDirection(a.data.pinNumber, a.data.direction, (err) => {
    respond(a.data.pinNumber, err);
  });
});

client.onReady(() => {
  const currentValues = {};
  const interval = setInterval(() => {
    _.forEach(readableGpios, (g) => {
      gpio.read(g, (err, value) => {
        if (err) {
          respond(g, err);
        } else {
          if (currentValues[g] != value) {
            client.sendEvent('GPIO_READ', {
              pinNumber: g,
              value: value,
            });
            currentValues[g] = value;
          }
        }
      });
    });
  }, 10);
  console.log('Connected');
});

client.connect();
