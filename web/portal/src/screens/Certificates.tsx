import { useCallback } from 'react';
import { Alert, Button, Card, Form, Input, message, Space } from 'antd';
import { BarcodeOutlined } from '@ant-design/icons';
import { gql, useLazyQuery } from '@apollo/client';

const CERTIFICATE_QUERY = gql(/* GraphQL */ `
  query certificate($code: String!) {
    certificate(code: $code) {
      code
      url
    }
  }
`);

export function Certificates() {
  const [getCertificate, { called, loading, data }] = useLazyQuery(CERTIFICATE_QUERY);

  const onFinish = useCallback(async data => {
    try {
      await getCertificate({ variables: data });
    } catch (err) {
      message.error('Oops, error!');
    }
  }, []);

  const downloadCertificate = useCallback(() => {
    if (data?.certificate) {
      window.open(data.certificate.url, '_blank');
    }
  }, [data]);

  return (
    <>
      <h2 style={{ margin: '24px 0' }}>Certificates</h2>
      <Card>
        <Form layout="vertical" requiredMark={false} onFinish={onFinish}>
          <Form.Item
            name="code"
            label="Certificate code"
            rules={[{ required: true, message: 'Please input the certificate code!' }]}
          >
            <Input
              prefix={<BarcodeOutlined />}
              placeholder="1caad87b-975b-4454-8b9b-80d78352b2b5"
            />
          </Form.Item>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
                loading={loading}
              >
                Validate
              </Button>
              {called && !loading && (
                <Alert
                  type={data?.certificate ? 'info' : 'warning'}
                  message={
                    data?.certificate
                      ? 'The certificate code is valid!'
                      : 'The certificate code is invalid!'
                  }
                  action={
                    data?.certificate && (
                      <Button
                        size="small"
                        type="text"
                        style={{ position: 'absolute', top: '8px', right: '12px' }}
                        onClick={downloadCertificate}
                      >
                        Download
                      </Button>
                    )
                  }
                ></Alert>
              )}
            </Space>
          </div>
        </Form>
      </Card>
    </>
  );
}
