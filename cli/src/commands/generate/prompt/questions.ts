const questions = {
  initial: {
    name: 'initial',
    message: 'Select an option',
    type: 'list',
    choices: {
      generate_all: {
        name: 'Generate all available flows and fields.'
      },
      generate_custom: {
        name: 'Select flows and their fields to generate.'
      }
    },
    confirm: {
      generate_all: {
        name: 'confirm_generate_all',
        message:
          'Are you sure you want to generate all available flows and fields?',
        type: 'confirm'
      }
    }
  },

  flows: {
    name: 'flows',
    message: 'Select flows to generate',
    type: 'list',
    choices: {
      availableFlows: [],
      exit: {
        name: 'Exit'
      }
    }
  },

  fields: {
    name: 'fields',
    message: 'Select all fields you would like to generate for this flow.',
    type: 'checkbox',
    choices: {
      availableFields: [],
      exit: {
        name: 'Exit'
      }
    }
  }
};

export default questions;
