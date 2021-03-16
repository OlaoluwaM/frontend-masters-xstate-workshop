import { createMachine, interpret } from 'xstate';

const elBox = document.querySelector('#box');

const machine = createMachine({
  initial: 'inactive',
  states: {
    active: {
      on: {
        mouseup: 'inactive',
      },
    },

    inactive: {
      on: {
        mousedown: 'active',
      },
    },
  },
});

// Create a service using interpret(...)
const service = interpret(machine);

// Listen to state transitions and set
// `elBox.dataset.state` to the state value as before.
service.onTransition(state => {
  console.log(state);
  elBox.dataset.state = state.value;
});

service.onStop(() => {
  alert('Service has stopped');
});

elBox.addEventListener('mousedown', event => {
  service.send(event);
});

elBox.addEventListener('mouseup', event => {
  service.send(event);
});

// Start the service.
service.start();

setTimeout(() => {
  service.stop();
}, 10000);
