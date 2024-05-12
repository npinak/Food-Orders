import { useRef, useState } from "react";
import Tabs from "./components/TabButtons";
import TabPanel from "./components/TabPanel";
import { useOrderData } from "./utils/useOrderData";
import { OrderDataType, OrderMapType } from "./Types/OrderDataTypes";
import "./App.css";

//todo sort items using sent_at_second

function App() {
  const [selectedTab, setSelectedTab] = useState<string>("0");
  const orderMap = useRef(new Map<string, OrderMapType>());
  const [addCreatedOrder, deleteCreatedOrder, createdOrders] =
    useOrderData(orderMap);
  const [addCookedOrders, deleteCookedOrder, cookedOrders] =
    useOrderData(orderMap);
  const [addDriverOrder, deleteDriverOrder, driverOrders] =
    useOrderData(orderMap);
  const [addDeliveredOrder, deleteDeliveredOrder, deliveredOrders] =
    useOrderData(orderMap);
  const [addCancelledOrder, deleteCancelledOrder, cancelledOrders] =
    useOrderData(orderMap);

  console.log(createdOrders);

  // @ts-expect-error -- socket is imported via CDN
  socket.on("order_event", (order) => {
    // todo have to add type to order

    order.forEach((orderEvent: OrderDataType) => {
      const newOrder = { ...orderEvent, delete_status: false };

      switch (orderEvent.event_name) {
        case "CREATED":
          //add to created
          addCreatedOrder(newOrder);
          break;
        case "COOKED":
          //add to cooked
          //remove from created
          break;
        case "DRIVER_RECEIVED":
          //add to Driver
          //remove from cooked
          break;
        case "DELIVERED":
          //add to delivered
          //remove from driver receveived
          break;
        case "CANCELLED":
        // search map for where the current delivery is

        // use if else statement to remove from the right orderState

        //add to cancelled order state
      }

      if (orderEvent.event_name === "COOKED") {
        //add new to cooked

        addCookedOrders(newOrder);
        //remove from created
      }
    });
  });

  const handleTabSelection = (tab: string): void => {
    setSelectedTab(tab);
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
        <TabPanel />
      </main>
    </>
  );
}

export default App;
