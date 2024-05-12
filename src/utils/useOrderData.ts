import { OrderData } from "../Types/OrderDataTypes";
import { useState } from "react";

export function useOrderData(
  data: OrderData | null
): [OrderData[], React.Dispatch<React.SetStateAction<OrderData[]>>] {
  const [orders, setOrders] = useState<OrderData[]>([]);

  const addOrder = () => {};

  const updateOrder = () => {};

  const findOrder = () => {};

  const deleteOrder = () => {};

  return [orders, setOrders];
}
