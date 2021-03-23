import { createMachine, interpret } from 'xstate';

const elApp = document.querySelector('#app');
const elOffButton = document.querySelector('#offButton');
const elOnButton = document.querySelector('#onButton');
const elModeButton = document.querySelector('#modeButton');
const elDisplay = document.getElementById('display');

const displayMachine = createMachine({
  initial: 'hidden',
  states: {
    hidden: {
      on: {
        TURN_ON: 'visible.preferences',
      },
    },

    visible: {
      initial: 'light',
      // Add hierarchical states for light/dark mode.
      states: {
        light: {
          on: {
            SWITCH: 'dark',
          },
        },

        dark: {
          initial: 'lighter',

          states: {
            lighter: {},
            darker: {},
          },

          on: {
            SWITCH: 'light',
            INCREASE: '.darker',
            DECREASE: '.lighter',
          },
        },

        preferences: {
          type: 'history',
          history: 'deep',
          target: 'light',
        },
      },
      // Then, add a history state that remembers which mode we used.
      // ...
      on: {
        TURN_OFF: 'hidden',
      },
    },
  },
});

const displayService = interpret(displayMachine)
  .onTransition(state => {
    elApp.dataset.state = state.toStrings().join(' ');
  })
  .start();

// Add event listeners for:
// - clicking elOnButton (TURN_ON)
// - clicking elOffButton (TURN_OFF)
// - clicking elModeButton (SWITCH)

elOnButton.addEventListener('click', () => {
  displayService.send('TURN_ON');
});

elOffButton.addEventListener('click', () => {
  displayService.send('TURN_OFF');
});

elModeButton.addEventListener('click', () => {
  displayService.send('SWITCH');
});

elDisplay.addEventListener('click', e => {
  displayService.send('decrease'.toUpperCase());
});

elDisplay.addEventListener('dblclick', e => {
  displayService.send('increase'.toUpperCase());
});
