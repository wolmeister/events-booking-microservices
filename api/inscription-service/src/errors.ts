import { UserInputError } from 'apollo-server';

export class InvalidEventIdError extends UserInputError {
  constructor() {
    super('Invalid event id');
  }
}

export class UserAlreadyRegisteredError extends UserInputError {
  constructor() {
    super('User already registered in the event');
  }
}

export class UserNotRegisteredError extends UserInputError {
  constructor() {
    super('User is not registered in the event or the event id is invalid');
  }
}

export class UserAlreadyCheckedInError extends UserInputError {
  constructor() {
    super('User has already checked in');
  }
}
