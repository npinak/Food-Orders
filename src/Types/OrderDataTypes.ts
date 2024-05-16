export interface OrderDataType {
  customer: string;
  destination: string;
  event_name: string;
  id: string;
  item: string;
  price: number;
  sent_at_second: number;
}

export interface OrderDataState {
  customer: string;
  destination: string;
  event_name: string;
  id: string;
  item: string;
  price: number;
  sent_at_second: number;
  delete_status: boolean;
}

export interface OrderMapType {
  currentStatus: string;
  index?: number;
}
