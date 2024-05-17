import { useEffect, useRef, useState } from "react";
import Tabs from "./components/TabButtons";
import ControlledInput from "./components/ControlledInput";
import OrderTicket from "./components/OrderTicket";
import { useOrderData } from "./utils/useOrderData";
import { OrderDataType } from "./Types/OrderDataTypes";
import "./App.css";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteCancelledOrders,
    cancelledOrders,
    grayedCancelledOrders,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cancelledMap,
  ] = useOrderData();
  const [dollars, setDollars] = useState(0);
  const [cents, setCents] = useState(0);
  const searchMap = useRef(new Map());

  // @ts-expect-error -- socket is imported via CDN
  socket.on("order_event", (order: OrderDataType[]) => {
    const orderArray: OrderDataType[][] = [[], [], [], [], []];

    order.forEach((orderEvent: OrderDataType) => {
      if (orderEvent.event_name === "CREATED") {
        orderArray[0].push(orderEvent);

        if (searchMap.current.has(orderEvent.price)) {
          const searchArray = searchMap.current.get(orderEvent.price);

          if (
            searchArray.some(
              (createdOrder: OrderDataType) => createdOrder.id === orderEvent.id
            )
          ) {
            return;
          }

          searchArray.push(orderEvent);

          searchMap.current.set(orderEvent.price, searchArray);
        } else {
          const searchArray = [];
          searchArray.push(orderEvent);
          searchMap.current.set(orderEvent.price, searchArray);
        }
      } else if (orderEvent.event_name === "COOKED") {
        orderArray[1].push(orderEvent);
      } else if (orderEvent.event_name === "DRIVER_RECEIVED") {
        orderArray[2].push(orderEvent);
      } else if (orderEvent.event_name === "DELIVERED") {
        orderArray[3].push(orderEvent);
      } else {
        orderArray[4].push(orderEvent);
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
    if (orderArray[2].length > 0) {
      const driverArray = orderArray[2];
      addDriverOrders(driverArray);

      deleteCookedOrders(driverArray);
    }
    if (orderArray[3].length > 0) {
      const deliveredArray = orderArray[3];
      addDeliveredOrders(deliveredArray);

      deleteDriverOrders(deliveredArray);
    }
    if (orderArray[4].length > 0) {
      const cancelledArray = orderArray[4];
      addCancelledOrders(cancelledArray);

      const removeArray: OrderDataType[][] = [[], [], [], []];

      cancelledArray.forEach((cancelledOrder) => {
        if (createdMap.current.has(cancelledOrder.id)) {
          removeArray[0].push(cancelledOrder);
        }
        if (cookedMap.current.has(cancelledOrder.id)) {
          removeArray[1].push(cancelledOrder);
        }
        if (driverMap.current.has(cancelledOrder.id)) {
          removeArray[2].push(cancelledOrder);
        }
        if (deliveredMap.current.has(cancelledOrder.id)) {
          removeArray[3].push(cancelledOrder);
        }
      });

      if (removeArray[0].length > 0) {
        deleteCreatedOrders(removeArray[0]);
      }
      if (removeArray[1].length > 0) {
        deleteCookedOrders(removeArray[1]);
      }
      if (removeArray[2].length > 0) {
        deleteDriverOrders(removeArray[2]);
      }
      if (removeArray[3].length > 0) {
        deleteDeliveredOrders(removeArray[3]);
      }
    }
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
      case "5": {
        //get input value and convert to cents
        // const dollarsAndCents = searchPrice?.split(".");

        const finalAmout = dollars * 100 + cents;

        //get input value from map
        const searchResults = searchMap.current.get(finalAmout);
        //return
        return [searchResults || [], []];
      }
    }
  };

  // function changeSearchPrice(e: React.ChangeEvent<HTMLInputElement>) {
  //   console.log(e.currentTarget.value);
  //   const searchValue = parseFloat(e.currentTarget.value);

  //   if (Number.isNaN(searchValue)) {
  //     setSearchPrice("0");
  //   } else {
  //     setSearchPrice(searchValue.toFixed(2));
  //   }
  // }

  function handleCentsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = parseFloat(e.currentTarget.value);

    if (Number.isNaN(searchValue)) {
      setCents(0);
    } else {
      if (searchValue > 99) {
        setCents(99);
      } else if (searchValue < 0) {
        setCents(0);
      } else {
        setCents(searchValue);
      }
    }
  }

  function handleDollarsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = parseFloat(e.currentTarget.value);

    if (Number.isNaN(searchValue)) {
      setDollars(0);
    } else {
      setDollars(searchValue);
    }
  }

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
        <section className="tabPanelContainer">
          {selectedTab == "5" && (
            <div className="currencyInputContainer">
              <label style={{ fontSize: "20px" }}></label>
              {`Search Price: `}
              {/* <ControlledInput
                  // type="tel"
                  value={searchPrice}
                  onChange={changeSearchPrice}
                /> */}
              <input
                type="number"
                min="0"
                style={{ width: "40px", textAlign: "right" }}
                value={dollars}
                onChange={handleDollarsChange}
              />
              <p>.</p>
              <input
                type="number"
                step="01"
                min="0"
                style={{ width: "40px", textAlign: "left" }}
                value={cents}
                onChange={handleCentsChange}
              />
            </div>
          )}
          {switchOrderData()![0].map((order: OrderDataType) => {
            return (
              <OrderTicket key={order.id} orderData={order} grayed={false} />
            );
          })}
          {selectedTab !== "5" &&
            switchOrderData()![1].map((order: OrderDataType) => {
              return <OrderTicket key={order.id} orderData={order} grayed />;
            })}
        </section>
      </main>
    </>
  );
}

export default App;
