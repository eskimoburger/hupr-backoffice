export interface ResponseContent {
  response_code: number;
  response_detail: string;
  response_data: ResponseData;
  response_time: string;
}

export interface ResponseData {
  status: number;
  type: string;
  data: Data;
}

export interface Data {
  uuid: string;
  campaign_name: string;
  message: Message[];
  message_type_uuid: string;
  user_uuid: string;
  message_config_uuid: string;
  message_config: MessageConfig;
}

export interface Message {
  type: "text" | "image" | "video" | "template";
  text?: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
  altText?: string;
  template?: {
    type: string;
    columns: {
      imageUrl: string;
      action: {
        type: string;
        uri: string;
      };
    }[];
  };
}

export interface MessageConfig {
  uuid: string;
  start_datetime: string;
  end_datetime: string;
  cron: unknown;
  beacon_action: string;
  device_uuid: string[];
  recieving_freq_uuid: string;
  status: unknown;
}
