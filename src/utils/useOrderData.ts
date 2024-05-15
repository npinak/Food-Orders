import { OrderDataState, OrderMapType } from "../Types/OrderDataTypes";

import { useState, useRef, useEffect } from "react";

export function useOrderData(): [
  (order: OrderDataState[]) => void,
  (order: OrderDataState[]) => void,
  OrderDataState[]
] {
  const [orders, setOrders] = useState<OrderDataState[]>([]);
  const orderStateRef = useRef(orders);
  const orderMap = useRef(new Map<string, OrderMapType>());

  useEffect(() => {
    orderStateRef.current = orders;
  }, [orders]);

  useEffect(() => {
    console.log(orderStateRef.current, orders);
  }, [orderStateRef.current]);

  const addOrder = (order: OrderDataState[]) => {
    const newOrderArray: OrderDataState[] = [...orders, ...order];

    setOrders(newOrderArray);

    //todo add to Map

    order.forEach((orderEvent, index) => {
      orderMap.current.set(orderEvent.id, {
        index: index + orders.length,
        currentStatus: orderEvent.event_name,
      });
    });

    // if (orderPresent) return;

    // console.log(order);

    // orderMap.current?.set(order.id, {
    //   index: orders.length,
    //   currentStatus: order.event_name,
    // });

    // setOrders([...orders, order]);
  };

  const findOrder = (order: OrderDataState) => {
    if (orderMap.current?.has(order.id)) {
      return true;
    } else {
      return false;
    }
  };

  const updateOrderDeleteStatus = (order: OrderDataState[]) => {
    const newArray = structuredClone(orders);

    order.forEach((orderEvent) => {
      const deleteObj = orderMap.current?.get(orderEvent.id);

      const arrayObj = newArray[deleteObj!.index];

      if (arrayObj === undefined) {
        return;
      }

      arrayObj["delete_status"] = true;
      newArray[deleteObj!.index] = arrayObj;
    });

    setOrders(newArray);
  };

  const deleteOrder = (order: OrderDataState[]) => {
    // let orderPresent: boolean = false;

    // order.forEach((orderEvent) => {
    //   orderPresent = findOrder(orderEvent);

    //   //todo need to check if this returns out of the forEach or the entire function
    //   if (!orderPresent) return;
    // });

    updateOrderDeleteStatus(order);

    setTimeout(() => {
      // const previousState = structuredClone(orderStateRef.current);

      order.forEach((orderEvent) => {
        const temp = orderStateRef.current[orderStateRef.current.length - 1];

        if (temp === undefined) return;

        const deleteIndex = orderMap.current?.get(orderEvent.id)?.index;

        orderStateRef.current[deleteIndex!] = temp;

        // orderMap.current?.delete(orderEvent.id);

        const updateID = temp.id;

        const updateOBJ = orderMap.current?.get(updateID);

        updateOBJ!["index"] = deleteIndex as number;

        orderMap.current?.set(temp.id, updateOBJ!);
        orderStateRef.current.pop();
      });

      setOrders(orderStateRef.current);

      // setOrders((prevOrders) => {
      //   // console.log(orderStateRef.current, orders);

      //   order.forEach((orderEvent) => {
      //     const temp = orderStateRef.current[orderStateRef.current.length - 1];

      //     if (temp === undefined) return;

      //     const deleteIndex = orderMap.current?.get(orderEvent.id)?.index;

      //     orderStateRef.current[deleteIndex!] = temp;

      //     // orderMap.current?.delete(orderEvent.id);

      //     const updateID = temp.id;

      //     const updateOBJ = orderMap.current?.get(updateID);

      //     updateOBJ!["index"] = deleteIndex as number;

      //     orderMap.current?.set(temp.id, updateOBJ!);
      //     orderStateRef.current.pop();
      //   });
      //   return orderStateRef.current;
      // });
    }, 5000);

    // delete using setTimeout
    // setTimeout(() => {

    //   const newOrdersArray = [...orders];

    //   newOrdersArray[deleteIndex!] = temp;

    //   newOrdersArray.pop();

    //   setOrders(newOrdersArray);

    //   orderMap.current?.delete(order.id);
    //   //todo have to update index of moved element in map

    //   const updateID = temp.id;

    //   const updateOBJ = orderMap.current?.get(updateID);

    //   updateOBJ!.index = deleteIndex as number;

    //   orderMap.current?.set(temp.id, updateOBJ!);
    // }, 3);
  };

  return [addOrder, deleteOrder, orders];
}
