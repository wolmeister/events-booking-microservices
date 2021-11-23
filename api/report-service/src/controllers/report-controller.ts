import { Controller, Post, BodyParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import { Description, Required, Returns } from '@tsed/schema';

@Controller('/reports')
@Docs()
export class ReportController {
  // @Post('/')
  // @Description('Generates a pdf report')
  // @Returns(200, EmailResponse)
  // public async sendEmail(@BodyParams() @Required() body: any): Promise<any> {}
}
