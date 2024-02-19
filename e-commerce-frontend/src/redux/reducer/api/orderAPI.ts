import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, NewOrderrequest, OrderDetailResponse, OrdersResponse, UpdateorderRequest } from "../../../types/api-types";

export const orderApi= createApi({
    reducerPath:"orderApi",
    baseQuery: fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/order/`
}),
    tagTypes:["orders"],
    endpoints:(builder)=>({
  newOrder:builder.mutation<MessageResponse,NewOrderrequest>({
    query:(order)=>({url:"new",method:"POST",body:order}),
    invalidatesTags:["orders"],
  }),
  updateOrder:builder.mutation<MessageResponse,UpdateorderRequest>({
    query:({userid,orderId})=>(
        {
            url:`${orderId}?id=${userid}`,
            method:"PUT",
        }),
    invalidatesTags:["orders"],
  }),
  deleteOrder:builder.mutation<MessageResponse,UpdateorderRequest>({
    query:({userid,orderId})=>(
        {
            url:`${orderId}?id=${userid}`,
            method:"DELETE",
        }),
    invalidatesTags:["orders"],
  }),
  myOrders:builder.query<OrdersResponse,string>({
      query:(_id)=>(`my?id=${_id}`),
      providesTags:["orders"],
}),
  allOrders:builder.query<OrdersResponse,string>({
      query:(_id)=>(`all?id=${_id}`),
      providesTags:["orders"],
}),
  OrderDetails:builder.query<OrderDetailResponse,string>({
      query:(_id)=>_id,
      providesTags:["orders"],
}),
}),
});

export const{useNewOrderMutation,
  useDeleteOrderMutation,useUpdateOrderMutation,useAllOrdersQuery,useMyOrdersQuery,useOrderDetailsQuery}=orderApi
