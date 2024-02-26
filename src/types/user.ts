type User = {
  user_id: string;
  datetime: string;
  display_name: string;
  picture_url: string;
};

type Pagination = {
  all_rows: number;
  all_pages: number;
  page_limit: number;
  page_number: number;
};

type ResponseData = {
  status: number;
  type: string;
  length: number;
  pagination: Pagination;
  data: User[];
};

type ResponseUser = {
  response_code: number;
  response_detail: string;
  response_data: ResponseData;
  response_time: string;
};

export type { User, Pagination, ResponseData, ResponseUser };
