import { useCallback } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Table, message } from 'antd';
import { ExtractNodeTypes } from '../types';

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

const INSCRIPTION_MUTATION = gql(/* GraphQL */ `
  mutation register($eventId: ID!) {
    register(eventId: $eventId) {
      id
    }
  }
`);

type EventsQueryTypes = ExtractNodeTypes<typeof EVENTS_QUERY>;
type EventsQueryResponse = EventsQueryTypes[0]['events'];
type Event = EventsQueryResponse[0];

export function Events() {
  const { data, loading } = useQuery(EVENTS_QUERY);
  const [registerMutation] = useMutation(INSCRIPTION_MUTATION);

  const register = useCallback(
    async (event: Event) => {
      try {
        await registerMutation({ variables: { eventId: event.id } });
        message.success('You were successfully registered for the event!');
      } catch {
        message.error('You are already registered in the event!');
      }
    },
    [registerMutation]
  );

  return (
    <>
      <h2 style={{ margin: '24px 0' }}>Events</h2>
      <Table<Event> loading={loading} dataSource={data?.events} rowKey={item => item.id}>
        <Table.Column<Event> title="Name" dataIndex="name" key="name" sorter />
        <Table.Column<Event>
          title="Location"
          dataIndex="location"
          key="location"
          sorter
        />
        <Table.Column<Event>
          title="Date"
          dataIndex="date"
          key="date"
          width="120px"
          align="center"
          sorter
          render={(_, event) => new Date(event.date).toLocaleDateString()}
        />
        <Table.Column<Event>
          title="Actions"
          key="action"
          width="120px"
          align="center"
          render={(_, event) => (
            <Button type="link" onClick={() => register(event)}>
              Register
            </Button>
          )}
        />
      </Table>
    </>
  );
}
