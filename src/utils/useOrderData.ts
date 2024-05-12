import { OrderDataState, OrderMapType } from "../Types/OrderDataTypes";

import { useState } from "react";

// [OrderDataState[], React.Dispatch<React.SetStateAction<OrderDataState[]>>]

export function useOrderData(
  orderMap: React.RefObject<Map<string, OrderMapType>>
): [
  (order: OrderDataState) => void,
  // findOrder: (order: OrderDataState) => boolean;
  // updateOrderDeleteStatus: (order: OrderDataState) => void;
  (order: OrderDataState) => void,
  OrderDataState[]
] {
  const [orders, setOrders] = useState<OrderDataState[]>([]);

  const addOrder = (order: OrderDataState) => {
    //todo check if we can implement this in another way because orders will always be present from previous statuses
    // don't have to implement
    // const orderPresent = findOrder(order);

    // if (orderPresent) return;

    orderMap.current?.set(order.id, {
      index: orders.length - 1,
      currentStatus: order.event_name,
    });

    setOrders([...orders, order]);
  };

  const findOrder = (order: OrderDataState) => {
    if (orderMap.current?.has(order.id)) {
      return true;
    } else {
      return false;
    }
  };

  const updateOrderDeleteStatus = (order: OrderDataState) => {
    // get info from map
    const deleteObj = orderMap.current?.get(order.id);

    //change data in array
    const arrayObj = orders[deleteObj!.index];

    arrayObj.delete_status = true;

    const newArray = [...orders];

    newArray[deleteObj!.index] = arrayObj;

    setOrders(newArray);
  };

  const deleteOrder = (order: OrderDataState) => {
    const orderPresent = findOrder(order);

    if (!orderPresent) return;

    updateOrderDeleteStatus(order);

    const deleteIndex = orderMap.current?.get(order.id)?.index;

    // delete using setTimeout
    setTimeout(() => {
      const temp = orders[orders.length - 1];
      orders[deleteIndex!] = temp;
      orders.pop();
      orderMap.current?.delete(order.id);
      //todo have to update index of moved element in map

      const updateID = temp.id;

      const updateOBJ = orderMap.current?.get(updateID);

      updateOBJ!.index = deleteIndex as number;

      orderMap.current?.set(temp.id, updateOBJ!);
    }, 30000);
  };

  return [addOrder, deleteOrder, orders];
}
