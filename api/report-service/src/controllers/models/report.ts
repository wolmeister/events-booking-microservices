import { Property, Required } from '@tsed/schema';

export class ReportRequest {
  @Property()
  @Required()
  template: string;

  @Property()
  data?: Record<string, unknown>;
}
