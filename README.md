# Description

Rotonde module for controlling the GPIO of a RaspberryPI.

Wraps [pi-gpio](https://github.com/rakeshpai/pi-gpio).

# Device compatibility

- original Raspberry Pi (A and B)
- model B revision 2 boards
- Raspberry Pi Model A+
- Raspberry Pi Model B+

# Installation

```sh

rotonde install rotonde-gpio

```

[what is rotonde ?] (https://github.com/HackerLoop/rotonde)

# API

## Events

List of events, each events as:

### GPIO_READ

Event sent when a gpio changes state.

| *field name* | *type* | *units/example*           |
|--------------|--------|---------------------------|
| pinNumber    | number | Gpio number               |
| value        | boolean | Current value            |

### GPIO_ERROR

Event sent when a gpio encouters an error.

| *field name* | *type* | *units/example*           |
|--------------|--------|---------------------------|
| pinNumber    | number | Gpio number               |
| error        | string | The error as reported by pi-gpio            |

### GPIO_SUCCESS

Event sent when a gpio encouters an error.

| *field name* | *type* | *units/example*           |
|--------------|--------|---------------------------|
| pinNumber    | number | Gpio number               |

## Actions

List of actions, each actions as:

### GPIO_OPEN

Opens a GPIO, required before working with a GPIO.
One openned, a GPIO can emit GPIO_READ events, whenever its state changes.

| *field name* | *type* | *units/example*           |
|--------------|--------|---------------------------|
| pinNumber    | number | Gpio number               |
| options      | string | Should be a string, such as input or input pullup. You can specify whether the pin direction should be input or output (or in or out). You can additionally set the internal pullup / pulldown resistor by sepcifying pullup or pulldown (or up or down). If options isn't provided, it defaults to output. If a direction (input or output) is not specified (eg. only up), then the direction defaults to output.      |

### GPIO_CLOSE

Closes a GPIO.

| *field name* | *type* | *units/example*           |
|--------------|--------|---------------------------|
| pinNumber    | number | Gpio number               |

### GPIO_DIRECTION

Changes the direction of a GPIO.

| *field name* | *type* | *units/example*           |
|--------------|--------|---------------------------|
| pinNumber    | number | Gpio number               |
| direction    | string | in or out                 |

### GPIO_WRITE

Sets the state of a GPIO.
Only works when the GPIO's direction is set to `out`

| *field name* | *type* | *units/example*           |
|--------------|--------|---------------------------|
| pinNumber    | number | Gpio number               |
| value        | boolean| Desired value             |

### ACTION_NAME

Action description

| *field name* | *type* | *units/example*           |
|--------------|--------|---------------------------|
| name         | type   |      units/example        |
