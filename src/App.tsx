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
  const [addCreatedOrders, deleteCreatedOrders, createdOrders] = useOrderData();

  const [addCookedOrders, deleteCookedOrders, cookedOrders] = useOrderData();
  const [addDriverOrders, deleteDriverOrders, driverOrders] = useOrderData();
  const [addDeliveredOrders, deleteDeliveredOrders, deliveredOrders] =
    useOrderData();
  const [addCancelledOrders, deleteCancelledOrders, cancelledOrders] =
    useOrderData();

  // @ts-expect-error -- socket is imported via CDN
  socket.on("order_event", (order) => {
    // todo have to add type to order

    const orderArray: OrderDataState[][] = [[], [], [], [], []];

    order.forEach((order: OrderDataType) => {
      if (order.event_name === "CREATED") {
        orderArray[0].push({ ...order, delete_status: false });
      } else if (order.event_name === "COOKED") {
        orderArray[1].push({ ...order, delete_status: false });
      } else if (order.event_name === "DRIVER_RECEIVED") {
        orderArray[2].push({ ...order, delete_status: false });
      } else if (order.event_name === "DELIVERED") {
        orderArray[3].push({ ...order, delete_status: false });
      } else {
        orderArray[4].push({ ...order, delete_status: false });
      }
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
    // }
    // if (orderArray[3].length > 0) {
    //   const deliveredArray = orderArray[3];
    //   addDeliveredOrders(deliveredArray);
    // }
    // if (orderArray[4].length > 0) {
    //   const cancelledArray = orderArray[4];
    //   addCancelledOrders(cancelledArray);
    // }

    // setCreatedOrders([...createdOrders, ...order]);

    //create an array for each order type

    // console.log(order);

    // order.forEach((orderEvent: OrderDataType) => {
    //   console.log(orderEvent);

    //   const newOrder = { ...orderEvent, delete_status: false };

    //   if (orderEvent.event_name === "CREATED") {
    //     // addCreatedOrder(newOrder);
    //     console.log("CREATED");
    //     setCreatedOrders([...createdOrders, newOrder]);
    //   } else if (orderEvent.event_name === "COOKED") {
    //     // deleteCreatedOrder(newOrder);
    //     // //add to cooked
    //     // addCookedOrders(newOrder);
    //   }

    //   // switch (orderEvent.event_name) {
    //   //   case "CREATED":
    //   //     console.log("calling created");
    //   //     //add to created
    //   //     addCreatedOrder(newOrder);
    //   //     return;
    //   //   case "COOKED":
    //   //     console.log("calling cooked");
    //   //     //remove from created
    //   //     deleteCreatedOrder(newOrder);
    //   //     //add to cooked
    //   //     addCookedOrders(newOrder);

    //   //     return;
    //   //   case "DRIVER_RECEIVED":
    //   //     //add to Driver
    //   //     // addDriverOrder(newOrder);
    //   //     //remove from cooked
    //   //     // deleteCookedOrder(newOrder);
    //   //     return;
    //   //   case "DELIVERED":
    //   //     //add to delivered
    //   //     // addDeliveredOrder(newOrder);
    //   //     //remove from driver receveived
    //   //     // deleteDriverOrder(newOrder);
    //   //     return;
    //   //   case "CANCELLED":
    //   //     // search map for where the current delivery is

    //   //     // use if else statement to remove from the right orderState

    //   //     //add to cancelled order state
    //   //     return;
    //   // }
    // });
  });

  const handleTabSelection = (tab: string): void => {
    setSelectedTab(tab);
  };

  const switchOrderData = () => {
    switch (selectedTab) {
      case "0":
        return createdOrders;
      case "1":
        return cookedOrders;
      case "2":
        return driverOrders;
      case "3":
        return deliveredOrders;
      case "4":
        return cancelledOrders;
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
          {switchOrderData()!.map((order) => {
            return <OrderTicket key={order.id} orderData={order} />;
          })}
        </section>
      </main>
    </>
  );
}

export default App;
