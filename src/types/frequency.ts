type FrequencyItem = {
  uuid: string;
  name: string;
  description: string;
  frequency: number;
};

type FrequencyResponse = {
  status: number;
  type: string;
  data: FrequencyItem[];
};

type ResponseFrequency = {
  response_code: number;
  response_detail: string;
  response_data: FrequencyResponse;
  response_time: string;
};

export type { ResponseFrequency, FrequencyItem, FrequencyResponse };
