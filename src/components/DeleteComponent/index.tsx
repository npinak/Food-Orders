import { TabPanelProps } from "./TabPanel.types";
import PanelStyles from "./TabPanel.module.css";

//todo delete this component

function TabPanel({ orderData }: TabPanelProps) {
  return (
    <section className={PanelStyles.mainContainer}>
      <div className={PanelStyles.orderTicket}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "50%",
            height: "50%",
          }}
        >
          Customer
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "50%",
            height: "50%",
          }}
        >
          Item
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "50%",
            height: "50%",
          }}
        >
          Destination
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "50%",
            height: "50%",
          }}
        >
          Price
        </div>
      </div>
    </section>
  );
}

export default TabPanel;
