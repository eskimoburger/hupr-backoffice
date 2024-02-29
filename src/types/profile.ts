type UserData = {
  uuid: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  department_uuid: string;
  line: boolean;
  line_userId: null | string;
  picture: string;
  active: boolean;
};

type ResponseData = {
  status: number;
  type: string;
  data: UserData;
};

type ProfileResponse = {
  response_code: number;
  response_detail: string;
  response_data: ResponseData;
  response_time: string;
};

export type { UserData, ResponseData, ProfileResponse };
