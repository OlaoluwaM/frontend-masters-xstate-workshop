const elBox = document.querySelector('#box');

export const machine = {
  initial: 'active',
  states: {
    active: {
      on: {
        CLICK: 'disabled',
      },
    },

    disabled: {
      on: {
        CLICK: 'active',
      },
    },
  },
};

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
  return machine.states[state]?.on[event] ?? state;
}

// Keep track of your current state
let currentState = machine.initial;

function send(event) {
  const nextState = transition(currentState, event);
  currentState = nextState;
  // Determine the next value of `currentState`
  elBox.dataset.state = currentState;
}

elBox.addEventListener('click', () => {
  send('CLICK');
});
