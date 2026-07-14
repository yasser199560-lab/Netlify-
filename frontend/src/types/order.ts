export type OrderStatus =
  | "pending"
  | "preparing"
  | "delivered"
  | "cancelled";


export type PaymentMethod =
  | "COD"
  | "Card"
  | "Online";



export interface OrderItem {

  productId: string;

  title: string;

  price: number;

  quantity: number;

  imageUrl?: string;

}




export interface Order {

  _id: string;


  customerId: string;


  partnerId: string;


  items: OrderItem[];


  totalAmount: number;


  paymentMethod: PaymentMethod;


  deliveryAddress: string;


  orderStatus: OrderStatus;


  createdAt: string;


  updatedAt: string;

}




export interface GetOrdersResponse {

  data: Order[];

}