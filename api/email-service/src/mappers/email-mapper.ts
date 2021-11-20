import { Email as MailjetEmail } from 'node-mailjet';
import { EmailRequest, EmailResponse } from '../models/email';

type MailjetRequest = MailjetEmail.SendParams;
type MailjetResponse = MailjetEmail.PostResponse;

export function mapEmailRequestToMailjetRequest(
  emailRequest: EmailRequest
): MailjetRequest {
  return {
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_FROM_EMAIL,
          Name: process.env.MAILJET_FROM_NAME,
        },
        To: emailRequest.to.map(to => ({ Email: to.email, Name: to.name })),
        Cc: emailRequest.cc?.map(to => ({ Email: to.email, Name: to.name })),
        Bcc: emailRequest.bcc?.map(to => ({ Email: to.email, Name: to.name })),
        Subject: emailRequest.subject,
        TextPart: emailRequest.text,
        HTMLPart: emailRequest.html,
        CustomID: emailRequest.customId,
      },
    ],
  };
}

export function mapMailjetResponseToEmailResponse(
  mailjetResponse: MailjetResponse
): EmailResponse {
  const [message] = mailjetResponse.body.Messages;

  return {
    status: message.Status,
    customID: message.CustomID,
    to: message.To.map(to => ({
      email: to.Email,
      messageHref: to.MessageHref,
      messageId: to.MessageID,
      messageUuid: to.MessageUUID,
    })),
    cc: message.Cc.map(cc => ({
      email: cc.Email,
      messageHref: cc.MessageHref,
      messageId: cc.MessageID,
      messageUuid: cc.MessageUUID,
    })),
    bcc: message.Bcc.map(bcc => ({
      email: bcc.Email,
      messageHref: bcc.MessageHref,
      messageId: bcc.MessageID,
      messageUuid: bcc.MessageUUID,
    })),
  };
}
