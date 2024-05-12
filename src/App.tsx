import { useRef, useState } from "react";
import Tabs from "./components/TabButtons";
import { useOrderData } from "./utils/useOrderData";
import { OrderDataType, OrderMapType } from "./Types/OrderDataTypes";
import "./App.css";

function App() {
  const [selectedTab, setSelectedTab] = useState<string>("0");
  const [orderData, setOrderData] = useState<OrderDataType[]>([]);
  const orderMap = useRef(new Map<string, OrderMapType>());
  // const [cooked, setCooked] = useOrderData(null);

  console.log(orderMap);

  // @ts-expect-error -- socket is imported via CDN
  // socket.on("order_event", (order) => {
  //   // todo have to add type to order

  //   order.forEach((order: OrderDataType) => {

  //     if (order.event_name === "COOKED") {
  //       //add new to cooked

  //       //remove from created

  //     }
  //   });
  // });

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
      </main>
    </>
  );
}

export default App;
