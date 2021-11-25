import got from 'got';
import { Stream, pipeline as cbPipeline } from 'stream';
import { promisify } from 'util';

export type ReportRequest = {
  bucket: string;
  name: string;
  template: string;
  data?: Record<string, unknown>;
};

export type ReportResponse = {
  url: string;
};

const pipeline = promisify(cbPipeline);

export async function generateReport(body: ReportRequest): Promise<Stream> {
  const buffer = Buffer.concat([]);

  // @TODO: add .env
  // const res = await pipeline(
  //   got.stream.post('http://localhost:3002/api/reports', {
  //     json: body,
  //   }),
  //   buffer
  // );

  return got.stream.post('http://localhost:3002/api/reports', {
    json: body,
  });
}
