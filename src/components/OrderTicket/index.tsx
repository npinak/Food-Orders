import { memo } from "react";
import OrderTicketStyles from "./OrderTicket.module.css";
import { OrderTicketProps } from "./OrderTicket.types";

const OrderTicket = memo(({ orderData, grayed }: OrderTicketProps) => {
  return (
    <li
      className={`${
        grayed
          ? OrderTicketStyles.orderTicket_grayed
          : OrderTicketStyles.orderTicket
      }`}
    >
      <div className={OrderTicketStyles.orderTicketSection}>
        <p className={OrderTicketStyles.orderTicketSection_Left}>
          {orderData.customer}
        </p>
      </div>
      <div className={OrderTicketStyles.orderTicketSection}>
        {orderData.item}
      </div>
      <div className={OrderTicketStyles.orderTicketSection}>
        <p className={OrderTicketStyles.orderTicketSection_Left}>
          {orderData.destination}
        </p>
      </div>
      <div className={OrderTicketStyles.orderTicketSection}>
        {orderData.price}
      </div>
    </li>
  );
});

export default OrderTicket;
