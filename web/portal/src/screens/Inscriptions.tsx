import { useCallback } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Table, Space, message, Popover } from 'antd';
import { ExtractNodeTypes } from '../types';

const INSCRIPTIONS_QUERY = gql(/* GraphQL */ `
  query inscriptions {
    inscriptions {
      id
      certificateCode
      checkintAt
      createdAt
      event {
        id
        name
        location
        date
        cancelUntil
      }
    }
  }
`);

const GEMERATE_CERTIFICATE_MUTATION = gql(/* GraphQL */ `
  mutation generateCertificate($eventId: String!) {
    generateCertificate(eventId: $eventId) {
      code
      url
    }
  }
`);

const CAMCEL_MUTATION = gql(/* GraphQL */ `
  mutation cancel($eventId: String!) {
    cancel(eventId: $eventId)
  }
`);

type InscriptionsQueryTypes = ExtractNodeTypes<typeof INSCRIPTIONS_QUERY>;
type InscriptionsQueryResponse = InscriptionsQueryTypes[0]['inscriptions'];
type Inscription = InscriptionsQueryResponse[0];

export function Inscriptions() {
  const { data, loading, refetch } = useQuery(INSCRIPTIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  const [generateCertificateMutation] = useMutation(GEMERATE_CERTIFICATE_MUTATION);
  const [cancelMutation] = useMutation(CAMCEL_MUTATION);

  const generateCertificate = useCallback(
    async (inscription: Inscription) => {
      try {
        const certificate = await generateCertificateMutation({
          variables: { eventId: inscription.event.id },
        });
        if (!certificate.data?.generateCertificate) {
          message.error("There's no certification available for this event!");
          return;
        }
        message.success('Certification successfully generated!');
        window.open(certificate.data.generateCertificate.url, '_blank');
      } catch {
        message.error('Oops, error!');
      }
    },
    [generateCertificateMutation]
  );

  const cancel = useCallback(
    async (inscription: Inscription) => {
      try {
        await cancelMutation({
          variables: { eventId: inscription.event.id },
        });
        message.success('Registration successfully canceled!');
        refetch();
      } catch {
        message.error('The event can no longer be canceled!');
      }
    },
    [cancelMutation, refetch]
  );

  return (
    <>
      <h2 style={{ margin: '24px 0' }}>Inscriptions</h2>
      <Table<Inscription>
        loading={loading}
        dataSource={data?.inscriptions}
        rowKey={item => item.id}
      >
        <Table.Column<Inscription>
          title="Event"
          key="event.name"
          sorter
          render={(_, inscription) => inscription.event.name}
        />
        <Table.Column<Inscription>
          title="Location"
          key="location"
          sorter
          render={(_, inscription) => inscription.event.location}
        />
        <Table.Column<Inscription>
          title="Date"
          key="date"
          width="120px"
          align="center"
          sorter
          render={(_, inscription) =>
            new Date(inscription.event.date).toLocaleDateString()
          }
        />
        <Table.Column<Inscription>
          title="Cancel until"
          key="cancelUntil"
          width="140px"
          align="center"
          sorter
          render={(_, inscription) =>
            new Date(inscription.event.cancelUntil).toLocaleDateString()
          }
        />
        <Table.Column<Inscription>
          title="Certificate"
          key="certificate"
          width="150px"
          align="center"
          render={(_, inscription) => (
            <Button
              size="small"
              disabled={!inscription.checkintAt}
              onClick={() => generateCertificate(inscription)}
            >
              Generate
            </Button>
          )}
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
              onClick={() => cancel(inscription)}
            >
              Cancel
            </Button>
          )}
        />
      </Table>
    </>
  );
}
