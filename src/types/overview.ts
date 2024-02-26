type Card = {
  message_count: number;
  user_count: number;
  visit_count: number;
};

type Graph = {
  date: string;
  message_count: number;
  user_count: number;
  visit_count: number;
};

type ResponseData = {
  status: number;
  type: string;
  data: {
    card: Card;
    graph: Graph[];
  };
};

type ResponseOverview = {
  response_code: number;
  response_detail: string;
  response_data: ResponseData;
  response_time: string;
};

export type { Card, Graph, ResponseData, ResponseOverview };
