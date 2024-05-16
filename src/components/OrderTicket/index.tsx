import OrderTicketStyles from "./OrderTicket.module.css";
import { OrderTicketProps } from "./OrderTicket.types";

function OrderTicket({ orderData, grayed }: OrderTicketProps) {
  return (
    <div className={OrderTicketStyles.orderTicket}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "50%",
          height: "50%",
        }}
      >
        {orderData.customer}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "50%",
          height: "50%",
        }}
      >
        {orderData.item}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "50%",
          height: "50%",
        }}
      >
        {orderData.destination}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "50%",
          height: "50%",
        }}
      >
        {orderData.price}
      </div>
    </div>
  );
}

export default OrderTicket;
