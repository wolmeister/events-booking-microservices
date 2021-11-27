import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Button, Card, Form, Select, Table, Tag, message, Space } from 'antd';
import { useCallback, useState, useEffect } from 'react';
import {
  FastSignupChecking,
  FastSignupCheckingValues,
} from '../components/FastSignupChecking';
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
  mutation checkin($eventId: String!, $userId: String!) {
    checkIn(eventId: $eventId, userId: $userId) {
      id
    }
  }
`);

const FAST_SIGNUP_MUTATION = gql(/* GraphQL */ `
  mutation fastSignup2($cpf: String!, $email: String!) {
    fastSignup(cpf: $cpf, email: $email) {
      id
    }
  }
`);

const REGISTER_MUTATION = gql(/* GraphQL */ `
  mutation register($eventId: String!, $userId: String) {
    register(eventId: $eventId, userId: $userId) {
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
  const eventsQuery = useQuery(EVENTS_QUERY);
  const [runInscriptionsQuery, inscriptionsQuery] = useLazyQuery(INSCRIPTIONS_QUERY);
  const [checkinMutation] = useMutation(CHECKIN_MUTATION);
  const [fastSignupMutation] = useMutation(FAST_SIGNUP_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const [eventId, setEventId] = useState('');
  const [fastSignupVisible, setFastSignupVisible] = useState(false);

  const [online, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const listener = () => {
      setOnline(window.navigator.onLine);
    };
    window.addEventListener('online', listener);
    window.addEventListener('offline', listener);

    return () => {
      window.removeEventListener('online', listener);
      window.removeEventListener('offline', listener);
    };
  }, []);

  const onSaveFastSignup = useCallback(async (values: FastSignupCheckingValues) => {
    try {
      const fastSignupResponse = await fastSignupMutation({
        variables: { cpf: values.cpf, email: values.email },
      });

      await registerMutation({
        variables: {
          eventId: values.eventId,
          userId: fastSignupResponse.data!.fastSignup.id,
        },
      });
      await checkinMutation({
        variables: {
          eventId: values.eventId,
          userId: fastSignupResponse.data!.fastSignup.id,
        },
      });
      message.success('User successfully created and checked in!');
      inscriptionsQuery.refetch();
      setFastSignupVisible(false);
    } catch (error) {
      console.log(error);
      message.error('Oops, error!');
    }
  }, []);

  useEffect(() => {
    runInscriptionsQuery({ variables: { eventId } });
  }, [eventId]);

  const checkin = useCallback(
    async (inscription: Inscription) => {
      try {
        await checkinMutation({
          variables: { eventId: inscription.event.id, userId: inscription.user.id },
        });
        inscriptionsQuery.refetch();
        message.success('User successfully checked in!');
      } catch {
        message.error('Oops, error!');
      }
    },
    [checkinMutation, eventId]
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
            loading={eventsQuery.loading}
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
          loading={inscriptionsQuery.loading}
          dataSource={inscriptionsQuery.data?.inscriptions}
          rowKey={item => item.id}
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
