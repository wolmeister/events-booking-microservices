import { Controller, Post, BodyParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import { Description, Required, Returns } from '@tsed/schema';
import { compile } from 'ejs';
import puppeteer from 'puppeteer';
import { Client } from 'minio';

import { ReportRequest, ReportResponse } from './models/report';

// TODO: add .env
const minioClient = new Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minio_access_key',
  secretKey: 'minio_secret_key',
});

@Controller('/reports')
@Docs()
export class ReportController {
  @Post('/')
  @Description('Generates a pdf report')
  @Returns(200, ReportResponse)
  public async generate(
    @BodyParams() @Required() body: ReportRequest
  ): Promise<ReportResponse> {
    const template = compile(body.template);
    const compiledHtml = template(body.data);

    let browser: puppeteer.Browser | null = null;

    try {
      // Generate PDF
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(compiledHtml);
      const pdfBuffer = await page.pdf();

      // Upload to MinIO
      await minioClient.putObject(body.bucket, body.name, pdfBuffer, {
        'Content-Type': 'application/pdf',
      });
      const url = await minioClient.presignedGetObject(body.bucket, body.name);
      return {
        url,
      };
    } finally {
      await browser?.close();
    }
  }
}
