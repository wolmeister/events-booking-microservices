import { Button, notification } from 'antd';
import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const onClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    if (offlineReady) {
      notification.open({
        key: 'offlineReady',
        message: 'Offline ready!',
        description: 'App ready to work offline.',
        duration: 0,
        placement: 'bottomRight',
        onClose,
      });
      return;
    }

    if (needRefresh) {
      const key = 'needRefresh';

      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            updateServiceWorker(true);
            notification.close(key);
          }}
        >
          Reload
        </Button>
      );

      notification.open({
        key: key,
        message: 'New version available',
        description: 'New content available, click on reload button to update.',
        duration: 0,
        placement: 'bottomRight',
        btn,
        onClose,
      });
    }
  }, [offlineReady, needRefresh]);

  return null;
}
