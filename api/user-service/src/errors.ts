import { UserInputError } from 'apollo-server';

export class InvalidEmailError extends UserInputError {
  constructor() {
    super('Invalid email');
  }
}
