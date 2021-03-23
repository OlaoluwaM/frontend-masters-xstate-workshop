import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const assignPoint = assign({
  px: (context, event) => event.clientX,
  py: (context, event) => event.clientY,
});

const assignPosition = assign({
  x: (context, event) => {
    return context.x + context.dx;
  },
  y: (context, event) => {
    return context.y + context.dy;
  },
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const assignDelta = assign({
  dx: (context, event) => {
    return event.clientX - context.px;
  },
  dy: (context, event) => {
    return event.clientY - context.py;
  },
});

const assignDeltaX = assign({
  dx: (context, event) => {
    return event.clientX - context.px;
  },
});

const assignDeltaY = assign({
  dy: (context, event) => {
    return event.clientY - context.py;
  },
});

const resetPosition = assign({
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const dragDropMachine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          actions: assignPoint,
          target: 'dragging',
        },
      },
    },
    dragging: {
      // Add hierarchical (nested) states here.
      // We should have a state for normal operation
      // that transitions to a "locked" x-axis behavior
      // when the shift key is pressed.
      // ...
      initial: 'unlocked',
      states: {
        unlocked: {
          on: {
            LOCK_X: {
              target: 'xAxis',
            },

            LOCK_Y: {
              target: 'yAxis',
            },
          },
        },

        xAxis: {
          on: {
            mousemove: {
              actions: assignDeltaX,
            },

            'keyup.shift': {
              target: 'unlocked',
            },
          },
        },

        yAxis: {
          on: {
            mousemove: {
              actions: assignDeltaY,
            },

            'keyup.alt': {
              target: 'unlocked',
            },
          },
        },
      },

      on: {
        mousemove: {
          actions: assignDelta,
          internal: false,
        },

        mouseup: {
          actions: [assignPosition],
          target: 'idle',
        },

        'keyup.escape': {
          target: 'idle',
          actions: resetPosition,
        },
      },
    },
  },
});

const service = interpret(dragDropMachine);

service.onTransition(state => {
  elBox.dataset.state = state.toStrings().join(' ');

  if (state.changed) {
    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

elBox.addEventListener('mousedown', event => {
  service.send(event);
});

elBody.addEventListener('mousemove', event => {
  service.send(event);
});

elBody.addEventListener('mouseup', event => {
  service.send(event);
});

elBody.addEventListener('keyup', e => {
  switch (e.key) {
    case 'Escape':
      service.send('keyup.escape');
      break;

    case 'Shift':
      service.send('keyup.shift');
      break;

    case 'Alt':
      service.send('keyup.alt');
      break;

    default:
      break;
  }
});

// Add event listeners for keyup and keydown on the body
// to listen for the 'Shift' key.
elBody.addEventListener('keydown', e => {
  switch (e.key) {
    case 'Shift':
      service.send('LOCK_X');
      break;

    case 'Alt':
      service.send('LOCK_Y');
      break;

    default:
      break;
  }
});
