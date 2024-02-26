type MemberType = {
    uuid : string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    department_uuid: string;
    line: string;
    line_userId: string;
    picture: string;
    active: boolean;
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
    data: Member[];
  };
  
  type ResponseMember = {
    response_code: number;
    response_detail: string;
    response_data: ResponseData;
    response_time: string;
  };
  
  export type { MemberType, Pagination, ResponseData, ResponseMember };
  