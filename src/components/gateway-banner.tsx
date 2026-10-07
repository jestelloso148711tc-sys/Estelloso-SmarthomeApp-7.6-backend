import { StatusBanner } from '@/components/status-banner';
import { useIoT } from '@/context/IoTContext';

export function GatewayBanner() {
  const { gatewayConnected, gatewayConnecting, gatewayError, connectGateway } = useIoT();

  if (gatewayConnected) {
    return null;
  }

  return (
    <StatusBanner
      tone={gatewayError ? 'error' : 'warning'}
      message={gatewayError ?? 'IoT Gateway is disconnected.'}
      actionLabel={gatewayError ? 'Retry' : 'Connect'}
      busyLabel="Connecting..."
      busy={gatewayConnecting}
      onAction={connectGateway}
    />
  );
}
