import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  // @ts-expect-error -- socket is imported via CDN
  socket.on("order_event", (order) => {
    // have to add type to order
    console.log(order);
  });

  return <></>;
}

export default App;
