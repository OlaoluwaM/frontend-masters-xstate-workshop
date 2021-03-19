import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

function assignPoint() {
  return assign({
    px: (context, event) => event.clientX,
    py: (context, event) => event.clientY,
  });
}

function assignDelta() {
  return assign({
    dx: (context, event) => event.clientX - context.px,
    dy: (context, event) => event.clientY - context.py,
  });
}

function assignPosition() {
  return assign({
    x: context => context.x + context.dx,
    y: context => context.y + context.dy,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  });
}

function resetPosition() {
  return assign({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  });
}

const machine = createMachine(
  {
    initial: 'idle',
    // Set the initial context
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
            // Assign the point
            actions: 'assignPoint',
            target: 'dragging',
          },
          keyup: {
            target: 'idle',
            actions: 'resetPosition',
          },
        },
      },

      dragging: {
        on: {
          mousemove: {
            // Assign the delta
            actions: 'assignDelta',
            // (no target!)
          },
          mouseup: {
            // Assign the position
            actions: 'assignPosition',
            target: 'idle',
          },
        },
      },
    },
  },
  {
    actions: {
      assignPoint: assignPoint(),
      assignDelta: assignDelta(),
      assignPosition: assignPosition(),
      resetPosition: resetPosition(),
    },
  }
);

const service = interpret(machine);

service.onTransition(state => {
  if (!state.changed) return;

  console.log(state.context);
  elBox.dataset.state = state.value;

  elBox.style.setProperty('--dx', state.context.dx);
  elBox.style.setProperty('--dy', state.context.dy);
  elBox.style.setProperty('--x', state.context.x);
  elBox.style.setProperty('--y', state.context.y);
});

service.start();

// Add event listeners for:
// - mousedown on elBox
elBox.addEventListener('mousedown', service.send);

// - mousemove on elBody
elBody.addEventListener('mousemove', service.send);

// - mouseup on elBody
elBox.addEventListener('mouseup', service.send);

elBody.addEventListener('keyup', e => {
  if (e.key !== 'Escape') return;
  service.send(e);
});
