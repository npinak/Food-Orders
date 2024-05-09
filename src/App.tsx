import { useState } from "react";
import Tabs from "./components/TabButtons";

import "./App.css";

function App() {
  const [selectedTab, setSelectedTab] = useState<string>("0");

  // @ts-expect-error -- socket is imported via CDN
  socket.on("order_event", (order) => {
    // todo have to add type to order
    console.log(order);
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
      </main>
    </>
  );
}

export default App;
