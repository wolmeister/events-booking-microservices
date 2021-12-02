import { genSalt, hash } from 'bcryptjs';
import { validate as validateEmail } from 'email-validator';
import { v4 as uuid } from 'uuid';

import { sendEmail } from './drivers/email-driver';
import { InvalidEmailError } from './errors';
import { prisma } from './prisma';

type FastSignupData = {
  email: string;
  cpf: string;
};

export async function fastSignup(data: FastSignupData) {
  if (!validateEmail(data.email)) {
    throw new InvalidEmailError();
  }

  const generatedPassword = uuid();
  const salt = await genSalt();
  const password = await hash(generatedPassword, salt);
  const user = await prisma.user.create({
    data: {
      ...data,
      password,
      name: data.email.split('@')[0],
    },
  });

  await sendEmail({
    subject: 'New account at events',
    to: [
      {
        name: data.email.split('@')[0],
        email: data.email,
      },
    ],
    text: `Use the password ${generatedPassword} to login`,
  });

  return user;
}
