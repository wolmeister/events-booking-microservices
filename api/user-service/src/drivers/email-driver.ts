import got from 'got';
import { Readable } from 'stream';

export type EmailToRequest = {
  name: string;
  email: string;
};

export type EmailRequest = {
  subject: string;
  text?: string;
  html?: string;
  customId?: string;
  to: EmailToRequest[];
  cc?: EmailToRequest[];
  bcc?: EmailToRequest[];
};

export type EmailToResponse = {
  readonly email: string;
  readonly messageUuid: string;
  readonly messageId: number;
  readonly messageHref: string;
};

export type EmailResponse = {
  readonly status: string;
  readonly customID: string;
  readonly to: ReadonlyArray<EmailToResponse>;
  readonly cc: ReadonlyArray<EmailToResponse>;
  readonly bcc: ReadonlyArray<EmailToResponse>;
};

export async function sendEmail(body: EmailRequest): Promise<EmailResponse> {
  const res = await got.post<EmailResponse>('http://localhost:3001/api/emails', {
    json: body,
    responseType: 'json',
  });
  return res.body;
}
