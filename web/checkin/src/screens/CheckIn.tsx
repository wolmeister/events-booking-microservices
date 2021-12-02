import { Button, Card, Form, Select, Table, Tag, message, Space } from 'antd';
import { useCallback, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  FastSignupChecking,
  FastSignupCheckingValues,
} from '../components/FastSignupChecking';
import { useNetwork } from '../hooks/useNetwork';
import { ExtractNodeTypes } from '../types';

const { Option } = Select;

const EVENTS_QUERY = gql(/* GraphQL */ `
  query events {
    events {
      id
      name
      date
      location
    }
  }
`);

const INSCRIPTIONS_QUERY = gql(/* GraphQL */ `
  query inscriptions($eventId: String) {
    inscriptions(eventId: $eventId) {
      id
      checkintAt
      user {
        id
        name
        email
        cpf
      }
      event {
        id
        name
      }
    }
  }
`);

const CHECKIN_MUTATION = gql(/* GraphQL */ `
  mutation checkin($id: ID!) {
    checkin(id: $id) {
      id
    }
  }
`);

const SIGNUP_AND_CHECKIN_MUTATION = gql(/* GraphQL */ `
  mutation signupAndCheckin($cpf: String!, $email: String!, $eventId: ID!) {
    signupAndCheckin(cpf: $cpf, email: $email, eventId: $eventId) {
      id
    }
  }
`);

type EventsQueryTypes = ExtractNodeTypes<typeof EVENTS_QUERY>;
type EventsQueryResponse = EventsQueryTypes[0]['events'];
type Event = EventsQueryResponse[0];

type InscriptionsQueryTypes = ExtractNodeTypes<typeof INSCRIPTIONS_QUERY>;
type InscriptionsQueryResponse = InscriptionsQueryTypes[0]['inscriptions'];
type Inscription = InscriptionsQueryResponse[0];

export function CheckIn() {
  const { online } = useNetwork();
  const [eventId, setEventId] = useState('');
  const [fastSignupVisible, setFastSignupVisible] = useState(false);

  const [eventsQuery] = useQuery({ query: EVENTS_QUERY });
  const [inscriptionsQuery, refectInscriptionsQuery] = useQuery({
    query: INSCRIPTIONS_QUERY,
    pause: !eventId,
    variables: { eventId },
  });
  const [, checkinMutation] = useMutation(CHECKIN_MUTATION);
  const [, signupAndCheckinMutation] = useMutation(SIGNUP_AND_CHECKIN_MUTATION);

  const onSaveFastSignup = useCallback(
    async (values: FastSignupCheckingValues) => {
      try {
        await signupAndCheckinMutation({
          eventId: values.eventId,
          cpf: values.cpf,
          email: values.email,
        });
        message.success('User successfully created and checked in!');
        refectInscriptionsQuery();
        setFastSignupVisible(false);
      } catch (error) {
        console.log(error);
        message.error('Oops, error!');
      }
    },
    [signupAndCheckinMutation, refectInscriptionsQuery]
  );

  const checkin = useCallback(
    async (inscription: Inscription) => {
      try {
        await checkinMutation({
          id: inscription.id,
        });
        refectInscriptionsQuery();
        message.success('User successfully checked in!');
      } catch {
        message.error('Oops, error!');
      }
    },
    [checkinMutation, refectInscriptionsQuery]
  );

  return (
    <>
      <h2 style={{ margin: '24px 0' }}>Checkin</h2>
      <Card>
        <Form.Item label="Event">
          <Select<string>
            showSearch
            style={{ width: '100%' }}
            placeholder="Select an event"
            optionFilterProp="children"
            loading={eventsQuery.fetching}
            onChange={setEventId}
            allowClear
            clearIcon
          >
            {eventsQuery.data?.events.map(event => (
              <Option key={event.id} value={event.id}>
                {event.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tag
            color={online ? 'green' : 'red'}
            style={{ marginLeft: 'auto', marginBottom: '24px', display: 'block' }}
          >
            {online ? 'Online' : 'Offline'}
          </Tag>
          <Button
            type="primary"
            htmlType="button"
            style={{ marginLeft: '24px', marginBottom: '24px', display: 'block' }}
            onClick={() => setFastSignupVisible(true)}
          >
            Fast Signup/Checkin
          </Button>
        </div>

        <Table<Inscription>
          loading={inscriptionsQuery.fetching}
          dataSource={inscriptionsQuery.data?.inscriptions}
          rowKey={item => item.id}
          locale={{
            emptyText: eventId ? 'No inscriptions for this event' : 'Select an event',
          }}
        >
          <Table.Column<Inscription>
            title="Event"
            key="event.name"
            sorter
            render={(_, inscription) => inscription.event.name}
          />
          <Table.Column<Inscription>
            title="User"
            key="user.email"
            sorter
            render={(_, inscription) => inscription.user.name}
          />
          <Table.Column<Inscription>
            title="Email"
            key="user.email"
            sorter
            render={(_, inscription) => inscription.user.email}
          />
          <Table.Column<Inscription>
            title="CPF"
            key="user.cpf"
            sorter
            render={(_, inscription) => inscription.user.cpf}
          />
          <Table.Column<Inscription>
            title="Status"
            key="checkintAt"
            width="180px"
            align="center"
            sorter
            render={(_, inscription) => {
              return (
                <Tag color={inscription.checkintAt ? 'green' : 'red'}>
                  {inscription.checkintAt ? 'Checked in' : 'Not checked in'}
                </Tag>
              );
            }}
          />
          <Table.Column<Inscription>
            title="Actions"
            key="action"
            width="120px"
            align="center"
            render={(_, inscription) => (
              <Button
                type="link"
                disabled={inscription.checkintAt}
                onClick={() => checkin(inscription)}
              >
                Checkin
              </Button>
            )}
          />
        </Table>
      </Card>
      <FastSignupChecking
        visible={fastSignupVisible}
        onCancel={() => setFastSignupVisible(false)}
        onSave={onSaveFastSignup}
      />
    </>
  );
}
