import { TabsProps } from "./TabButtons.types";
import ButtonStyles from "./TabButtons.module.css";

function TabButtons({ selectedTab, handleTabSelection }: TabsProps) {
  return (
    <menu className={ButtonStyles.tabButtons}>
      <button
        id={ButtonStyles.createdButton}
        className={`${ButtonStyles.button} ${
          selectedTab === "0" ? ButtonStyles.buttonCreated : ""
        }`}
        onClick={(e) => {
          handleTabSelection(e.currentTarget.value);
        }}
        value={0}
      >
        <p>Created</p>
      </button>

      <button
        className={`${ButtonStyles.button} ${
          selectedTab === "1" ? ButtonStyles.buttonCooked : ""
        }`}
        onClick={(e) => {
          handleTabSelection(e.currentTarget.value);
        }}
        value={1}
      >
        <p>Cooked</p>
      </button>

      <button
        className={`${ButtonStyles.button} ${
          selectedTab === "2" ? ButtonStyles.buttonDriver : ""
        }`}
        onClick={(e) => {
          handleTabSelection(e.currentTarget.value);
        }}
        value={2}
      >
        <p>Driver</p>
      </button>

      <button
        className={`${ButtonStyles.button} ${
          selectedTab === "3" ? ButtonStyles.buttonDelivered : ""
        }`}
        onClick={(e) => {
          handleTabSelection(e.currentTarget.value);
        }}
        value={3}
      >
        <p>Delivered</p>
      </button>

      <button
        className={`${ButtonStyles.button} ${
          selectedTab === "4" ? ButtonStyles.buttonCancelled : ""
        }`}
        onClick={(e) => {
          handleTabSelection(e.currentTarget.value);
        }}
        value={4}
      >
        <p>Cancelled</p>
      </button>
      <button
        className={`${ButtonStyles.button} ${
          selectedTab === "5" ? ButtonStyles.buttonSearch : ""
        }`}
        id={ButtonStyles.searchButton}
        onClick={(e) => {
          handleTabSelection(e.currentTarget.value);
        }}
        value={5}
      >
        <p>Search</p>
      </button>
    </menu>
  );
}

export default TabButtons;
