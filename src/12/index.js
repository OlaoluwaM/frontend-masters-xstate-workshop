import { createMachine, assign, interpret, send } from 'xstate';

const elBox = document.querySelector('#box');

const randomFetch = () => {
  console.log('Fetching!!');
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        rej('Fetch failed!');
      } else {
        res('Fetch succeeded!');
      }
    }, 2000);
  });
};

const machine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'pending',
      },
    },
    pending: {
      on: {
        I_AM_DONE: 'resolved',
        SEND_IT_ALREADY: {
          actions: send('SEND_IT_ALREADY', {
            to: 'callbacky',
          }),
        },
        CANCEL: 'idle',
      },

      invoke: {
        id: 'callbacky',
        src: () => (sendBack, receive) => {
          receive(event => {
            console.log(event.type);
            if (event.type === 'SEND_IT_ALREADY') {
              sendBack({ type: 'I_AM_DONE' });
            }
          });
        },
        // Invoke your promise here.
        // The `src` should be a function that returns the source.
      },
    },
    resolved: {
      // Add a transition to fetch again
      on: {
        FETCH: 'idle',
      },
    },

    rejected: {
      // Add a transition to fetch again
      on: {
        FETCH: 'idle',
      },
    },
  },
});

const service = interpret(machine);

service.onTransition(state => {
  elBox.dataset.state = state.toStrings().join(' ');

  console.log(state);
});

service.start();

elBox.addEventListener('click', event => {
  service.send('FETCH');
});

const elCancel = document.getElementById('cancel');

elCancel.addEventListener('click', event => {
  service.send('SEND_IT_ALREADY');
});
