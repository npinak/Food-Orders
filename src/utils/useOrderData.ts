import { OrderMapType, OrderDataType } from "../Types/OrderDataTypes";

import { useState, useRef, MutableRefObject } from "react";

export function useOrderData(): [
  (order: OrderDataType[]) => void,
  (order: OrderDataType[]) => void,
  OrderDataType[],
  OrderDataType[],
  MutableRefObject<Map<string, OrderMapType>>
] {
  const [orders, setOrders] = useState<OrderDataType[]>([]);
  const [grayedOrders, setGrayedOrders] = useState<OrderDataType[]>([]);
  const orderMap = useRef(new Map<string, OrderMapType>());

  const addOrder = (order: OrderDataType[]) => {
    const newOrderArray: OrderDataType[] = [...orders, ...order];

    order.forEach((orderEvent, index) => {
      orderMap.current.set(orderEvent.id, {
        index: index + orders.length,
        currentStatus: orderEvent.event_name,
      });
    });

    setOrders(() => {
      return newOrderArray;
    });
  };

  const deleteOrder = (order: OrderDataType[]) => {
    order.sort((a, b) => {
      return Number(b.sent_at_second) - Number(a.sent_at_second);
    });

    const newGrayedOrders = [...grayedOrders, ...order];

    if (newGrayedOrders.length > 10) {
      const newGrayedOrdersSlice = newGrayedOrders.slice(
        grayedOrders.length - 10,
        grayedOrders.length
      );

      setGrayedOrders(newGrayedOrdersSlice);
    } else {
      setGrayedOrders(newGrayedOrders);
    }

    const newOrderArray = structuredClone(orders);

    order.forEach((orderEvent) => {
      const deleteIndex = orderMap.current.get(orderEvent.id)?.index;

      newOrderArray.splice(deleteIndex!, 1);

      orderMap.current.delete(orderEvent.id);
    });

    setOrders(newOrderArray);
  };

  return [addOrder, deleteOrder, orders, grayedOrders, orderMap];
}
