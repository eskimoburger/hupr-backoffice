type Device = {
  uuid: string;
  name: string;
  hw_id: string;
  datetime: string;
  location: null;
  status: null;
  description: string | null;
};

type ResponseDevice = {
  response_code: number;
  response_detail: string;
  response_data: {
    status: number;
    type: string;
    pagination: {
      all_rows: number;
      all_pages: number;
      page_limit: number;
      page_number: number;
    };
    length: number;
    data: Device[];
  };
  response_time: string;
};

export type { ResponseDevice, Device };
