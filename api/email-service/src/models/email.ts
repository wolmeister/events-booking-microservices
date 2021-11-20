import {
  Property,
  Required,
  Email,
  CollectionOf,
  MinItems,
  UniqueItems,
} from '@tsed/schema';

export class EmailToRequest {
  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  @Email()
  email: string;
}

export class EmailRequest {
  @Property()
  @Required()
  subject: string;

  @Property()
  text?: string;

  @Property()
  html?: string;

  @Property()
  customId?: string;

  @Property()
  @CollectionOf(EmailToRequest)
  @Required()
  @UniqueItems()
  @MinItems(0)
  to: EmailToRequest[];

  @Property()
  @CollectionOf(EmailToRequest)
  @UniqueItems()
  cc?: EmailToRequest[];

  @Property()
  @CollectionOf(EmailToRequest)
  @UniqueItems()
  bcc?: EmailToRequest[];
}

export class EmailToResponse {
  @Property()
  readonly email: string;

  @Property()
  readonly messageUuid: string;

  @Property()
  readonly messageId: number;

  @Property()
  readonly messageHref: string;
}

export class EmailResponse {
  @Property()
  readonly status: string;

  @Property()
  readonly customID: string;

  @Property()
  @CollectionOf(EmailToResponse)
  readonly to: ReadonlyArray<EmailToResponse>;

  @Property()
  @CollectionOf(EmailToResponse)
  readonly cc: ReadonlyArray<EmailToResponse>;

  @Property()
  @CollectionOf(EmailToResponse)
  readonly bcc: ReadonlyArray<EmailToResponse>;
}
