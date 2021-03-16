import { createMachine } from 'xstate';
import { machine as exerciseOneMachine } from '../01/index';

const elBox = document.querySelector('#box');

const machine = createMachine(exerciseOneMachine);

// Change this to the initial state
let currentState = machine.initialState;

function send(event) {
  currentState = machine.transition(currentState, event);
  // Determine and update the `currentState`
  console.log(currentState);
  elBox.dataset.state = currentState.value;
}

elBox.addEventListener('click', () => {
  send({ type: 'CLICK', hello: 'world' });
});
