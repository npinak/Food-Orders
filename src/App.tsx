import { useRef, useState } from "react";
import Tabs from "./components/TabButtons";
import OrderTicket from "./components/OrderTicket";
import { useOrderData } from "./utils/useOrderData";
import { OrderDataType } from "./Types/OrderDataTypes";
import "./App.css";
import ControlledInput from "./components/ControlledInput";

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
    _deleteCancelledOrders,
    cancelledOrders,
    grayedCancelledOrders,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _cancelledMap,
  ] = useOrderData();
  const [searchPrice, setSearchPrice] = useState("0");
  const [validInput, setValidInput] = useState(true);

  const searchMap = useRef(new Map());
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 70;
  const overScan = 10;
  const windowHeight = window.innerHeight * 0.9;
  const finalWindowHeight = windowHeight * 0.8;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const overScanStartIndex = Math.max(0, startIndex - overScan);

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
        const dollarsAndCents = searchPrice?.split(".");

        if (dollarsAndCents[1]?.length === 1) {
          dollarsAndCents[1] = dollarsAndCents[1] + "0";
        }

        if (dollarsAndCents[1]?.length > 2) {
          dollarsAndCents[1] = dollarsAndCents[1].slice(0, 2);
        }

        const finalAmount =
          parseFloat(dollarsAndCents[0]) * 100 +
          (Number.isNaN(parseFloat(dollarsAndCents[1]))
            ? 0
            : parseFloat(dollarsAndCents[1]));

        const searchResults = searchMap.current.get(finalAmount);

        return [searchResults || [], []];
      }
    }
  };

  function changeSearchPrice(e: React.ChangeEvent<HTMLInputElement>) {
    const regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

    if (regex.test(e.currentTarget.value) || e.currentTarget.value == "") {
      setValidInput(true);
    } else {
      setValidInput(false);
    }

    setSearchPrice(e.currentTarget.value);
  }

  let renderedNodeCount =
    Math.floor(finalWindowHeight / itemHeight) + 2 * overScan;
  renderedNodeCount = Math.min(
    switchOrderData()![0].length - startIndex,
    renderedNodeCount
  );

  function generateRows() {
    const items: JSX.Element[] = [];

    for (let i = 0; i <= renderedNodeCount; i++) {
      if (switchOrderData()![0][i] !== undefined) {
        items.push(
          <OrderTicket
            key={switchOrderData()![0][i].id}
            orderData={switchOrderData()![0][i]}
            grayed={false}
          />
        );
      }
    }
    return items;
  }

  return (
    <>
      <header className="mainHeader">
        <h1 id="mainTitle">City Storage Systems</h1>
      </header>
      <main className="mainTabsSection">
        <Tabs
          selectedTab={selectedTab}
          handleTabSelection={handleTabSelection}
        />
        <ul
          onScroll={(e) => {
            setScrollTop(e.currentTarget.scrollTop);
          }}
          className="tabPanelContainer"
        >
          {selectedTab == "5" && (
            <div className="currencyInputContainer">
              <label style={{ fontSize: "20px" }}></label>
              {`Search Price: $`}
              <ControlledInput
                value={searchPrice}
                onChange={changeSearchPrice}
                className={` currencyInput ${
                  validInput ? "" : "currencyInput_Invalid"
                }`}
              />
            </div>
          )}
          <div
            className="totalHeightContainer"
            style={{
              height: `${switchOrderData()![0].length * itemHeight}px`,
            }}
          >
            <div
              className="translateContainer"
              style={{
                transform: `translateY(${overScanStartIndex * itemHeight}px)`,
              }}
            >
              {selectedTab === "5" && (
                <p className="numberOfResults">
                  Number of results: {switchOrderData()![0].length}
                </p>
              )}
              {generateRows()}

              {selectedTab !== "5" &&
                switchOrderData()![1].map((order: OrderDataType) => {
                  return (
                    <OrderTicket key={order.id} orderData={order} grayed />
                  );
                })}
            </div>
          </div>
        </ul>
      </main>
    </>
  );
}

export default App;
