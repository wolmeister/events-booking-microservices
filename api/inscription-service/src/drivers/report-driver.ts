import got from 'got';
import { Readable } from 'stream';

export type ReportRequest = {
  template: string;
  data?: Record<string, unknown>;
};

export async function generateReport(body: ReportRequest): Promise<Readable> {
  return got.stream.post('http://localhost:3002/api/reports', {
    json: body,
  });
}
