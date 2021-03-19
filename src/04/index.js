import { createMachine, interpret } from 'xstate';

const elBox = document.querySelector('#box');

elBox.setAttribute('data-point', JSON.stringify({}, null, 2));

const setPoint = (context, event) => {
  // Set the data-point attribute of `elBox`
  const mousePositionObject = { x: event.clientX, y: event.clientY };
  elBox.setAttribute('data-point', JSON.stringify(mousePositionObject, null, 2));
};

const machine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        mousedown: {
          // Add your action here
          actions: setPoint,
          target: 'dragging',
        },
      },
    },
    dragging: {
      on: {
        mouseup: {
          target: 'idle',
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition(state => {
  console.log(state);

  elBox.dataset.state = state.value;
});

service.start();

elBox.addEventListener('mousedown', event => {
  service.send(event);
});

elBox.addEventListener('mouseup', event => {
  service.send(event);
});
