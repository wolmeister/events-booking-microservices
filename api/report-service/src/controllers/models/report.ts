import { Property, Required } from '@tsed/schema';

export class ReportRequest {
  @Property()
  @Required()
  bucket: string;

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  template: string;

  @Property()
  data?: Record<string, unknown>;
}
