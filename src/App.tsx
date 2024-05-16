import { useEffect, useRef, useState } from "react";
import Tabs from "./components/TabButtons";
import OrderTicket from "./components/OrderTicket";
import { useOrderData } from "./utils/useOrderData";
import {
  OrderDataState,
  OrderDataType,
  OrderMapType,
} from "./Types/OrderDataTypes";
import "./App.css";

//todo sort items using sent_at_second

function App() {
  const [selectedTab, setSelectedTab] = useState<string>("0");
  const [
    addCreatedOrders,
    deleteCreatedOrders,
    createdOrders,
    grayedCreatedOrders,
    createdMap,
  ] = useOrderData();

  const [
    addCookedOrders,
    deleteCookedOrders,
    cookedOrders,
    grayedCookedOrders,
    cookedMap,
  ] = useOrderData();
  const [
    addDriverOrders,
    deleteDriverOrders,
    driverOrders,
    grayedDriverOrders,
    driverMap,
  ] = useOrderData();
  const [
    addDeliveredOrders,
    deleteDeliveredOrders,
    deliveredOrders,
    grayedDeliveredOrders,
    deliveredMap,
  ] = useOrderData();
  const [
    addCancelledOrders,
    deleteCancelledOrders,
    cancelledOrders,
    grayedCancelledOrders,
    cancelledMap,
  ] = useOrderData();

  // @ts-expect-error -- socket is imported via CDN
  socket.on("order_event", (order) => {
    // todo have to add type to order

    const orderArray: OrderDataType[][] = [[], [], [], [], []];

    order.forEach((orderEvent: OrderDataType) => {
      if (orderEvent.event_name === "CREATED") {
        orderArray[0].push(orderEvent);
      } else if (orderEvent.event_name === "COOKED") {
        orderArray[1].push(orderEvent);
      } else if (orderEvent.event_name === "DRIVER_RECEIVED") {
        orderArray[2].push(orderEvent);
      } else if (orderEvent.event_name === "DELIVERED") {
        orderArray[3].push(orderEvent);
      } else {
        orderArray[4].push(orderEvent);
      }

      cancelledMap.current?.set(orderEvent.id, {
        currentStatus: orderEvent.event_name,
      });
    });

    if (orderArray[0].length > 0) {
      const createdArray = orderArray[0];

      addCreatedOrders(createdArray);
    }
    if (orderArray[1].length > 0) {
      const cookedArray = orderArray[1];
      addCookedOrders(cookedArray);

      deleteCreatedOrders(cookedArray);
    }

    // if (orderArray[2].length > 0) {
    //   const driverArray = orderArray[2];
    //   addDriverOrders(driverArray);
    //   deleteCookedOrders(driverArray);
    // }
    // if (orderArray[3].length > 0) {
    //   const deliveredArray = orderArray[3];
    //   addDeliveredOrders(deliveredArray);
    //   deleteDriverOrders(deliveredArray);
    // }
    // if (orderArray[4].length > 0) {
    //   const cancelledArray = orderArray[4];
    //   addCancelledOrders(cancelledArray);
    //   // for each item in the cancelled array, look in each HashMap for the order and cancel it
    //   // in the appropriate hook.

    //   orderArray[4].forEach((cancelledOrder) => {
    //     //check which hashMap it is in
    //     //call the remove function for that order state
    //     const orderCurrentStatus =cancelledMap.current?.get(cancelledOrder.id)?.currentStatus

    //      if (orderCurrentStatus === "CREATED") {
    //        deleteCreatedOrders([cancelledOrder]);
    //      } else if (orderCurrentStatus === "COOKED") {
    //        deleteCookedOrders([cancelledOrder]);
    //      } else if (orderCurrentStatus === "DRIVER_RECEIVED") {
    //        deleteDriverOrders([cancelledOrder])
    //      } else if (orderCurrentStatus === "DELIVERED") {
    //        deleteDeliveredOrders([cancelledOrder])
    //      }
    //     //  else {
    //     //    orderArray[4].push(orderEvent);
    //     //  }

    //   });
    // }
  });

  const handleTabSelection = (tab: string): void => {
    setSelectedTab(tab);
  };

  const switchOrderData = () => {
    switch (selectedTab) {
      case "0":
        return [createdOrders, grayedCreatedOrders];
      case "1":
        return [cookedOrders, grayedCookedOrders];
      case "2":
        return [driverOrders, grayedDriverOrders];
      case "3":
        return [deliveredOrders, grayedDeliveredOrders];
      case "4":
        return [cancelledOrders, grayedCancelledOrders];
    }
  };

  return (
    <>
      <header className="mainHeader">
        <h1 id="mainTitle">City Storage Systems</h1>
      </header>
      <main className="main-tabs-section">
        <Tabs
          selectedTab={selectedTab}
          handleTabSelection={handleTabSelection}
        />
        {/* send data to TabPanel according to the tab selected */}
        {/* <TabPanel orderData={getComponentData()} /> */}
        <section className="tabPanelContainer">
          {switchOrderData()![0].map((order) => {
            return (
              <OrderTicket key={order.id} orderData={order} grayed={false} />
            );
          })}
          {switchOrderData()![1].map((order) => {
            return <OrderTicket key={order.id} orderData={order} grayed />;
          })}
        </section>
      </main>
    </>
  );
}

export default App;
