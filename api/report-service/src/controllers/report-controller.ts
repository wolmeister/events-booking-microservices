import { Controller, Post, BodyParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import { Description, Required, Returns } from '@tsed/schema';
import { compile } from 'ejs';
import puppeteer from 'puppeteer';

import { ReportRequest } from './models/report';

@Controller('/reports')
@Docs()
export class ReportController {
  @Post('/')
  @Description('Generates a pdf report')
  @(Returns(200, Buffer).ContentType('application/pdf'))
  public async generate(@BodyParams() @Required() body: ReportRequest): Promise<Buffer> {
    const template = compile(body.template);
    const compiledHtml = template(body.data);

    let browser: puppeteer.Browser | null = null;

    try {
      // Generate PDF
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(compiledHtml);
      const pdfBuffer = await page.pdf();

      return pdfBuffer;
    } finally {
      await browser?.close();
    }
  }
}
