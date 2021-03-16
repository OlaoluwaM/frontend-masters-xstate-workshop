import { createMachine, interpret } from 'xstate';

const feedbackMachine = createMachine({
  initial: 'question',
  states: {
    question: {
      on: {
        CLICK_GOOD: 'thanks',
        CLICK_BAD: {
          target: 'form',
        },
      },
    },
    form: {
      on: {
        SUBMIT: 'thanks',
      },
    },
    thanks: {
      on: {
        CLOSE: { target: 'closed' },
      },
    },
    closed: {},
  },
});

const feedbackService = interpret(feedbackMachine);

feedbackService.onTransition(state => {
  console.log(state.value);
});

feedbackService.start();

window.send = feedbackService.send;
