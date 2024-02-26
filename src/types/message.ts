interface BeaconResponse {
  response_code: number;
  response_detail: string;
  response_data: {
    status: number;
    type: string;
    data: BeaconData[];
  };
}

interface BeaconData {
  uuid: string;
  campaign_name: string;
  message: BeaconMessage[];
  message_type_uuid: string;
  user_uuid: string;
  message_config_uuid: string;
  message_config: BeaconMessageConfig;
}

interface BeaconMessage {
  type: string;
  text?: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
  trackingId?: number;
}

interface BeaconMessageConfig {
  uuid: string;
  start_datetime: string;
  end_datetime: string;
  cron: string | null;
  beacon_action: string;
  device_uuid: string[];
  recieving_freq_uuid: string;
  status: string;
}

export type { BeaconResponse, BeaconData, BeaconMessage, BeaconMessageConfig };
