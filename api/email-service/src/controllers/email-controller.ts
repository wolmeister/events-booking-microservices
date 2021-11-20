import { Controller, Post, BodyParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import { Description, Required, Returns } from '@tsed/schema';
import { connect } from 'node-mailjet';

import { EmailRequest, EmailResponse } from '../models/email';
import {
  mapEmailRequestToMailjetRequest,
  mapMailjetResponseToEmailResponse,
} from '../mappers/email-mapper';

const mailjet = connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

@Controller('/emails')
@Docs()
export class EmailController {
  @Post('/')
  @Description('Sends an email')
  @Returns(200, EmailResponse)
  public async sendEmail(
    @BodyParams() @Required() emailRequest: EmailRequest
  ): Promise<EmailResponse> {
    return mailjet
      .post('send', { version: 'v3.1' })
      .request(mapEmailRequestToMailjetRequest(emailRequest))
      .then(mapMailjetResponseToEmailResponse);
  }
}
