import axios from "axios";

import type {
  Order,
  OrderStatus,
} from "../types/order";


// API URL
const BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000/api";



const apiClient = axios.create({

  baseURL: BASE_URL,

  timeout: 10000,

  withCredentials: true,

});




// ===========================
// GET ALL ORDERS
// GET /api/orders
// ===========================

export async function getOrders(): Promise<{
  data: Order[];
}> {

  const response =
    await apiClient.get<{
      data: Order[];
    }>("/orders");


  return response.data;

}





// ===========================
// GET SINGLE ORDER
// GET /api/orders/:orderId
// ===========================

export async function getOrderById(
  orderId: string
): Promise<Order> {


  const response =
    await apiClient.get<{
      data: Order;
    }>(
      `/orders/${orderId}`
    );


  return response.data.data;

}






// ===========================
// UPDATE ORDER STATUS
// PATCH /api/orders/:orderId/status
// ===========================

export async function updateOrderStatus(

  orderId: string,

  status: OrderStatus

): Promise<Order> {


  const response =
    await apiClient.patch<{
      data: Order;
    }>(

      `/orders/${orderId}/status`,

      {
        status,
      }

    );


  return response.data.data;

}





export default apiClient;