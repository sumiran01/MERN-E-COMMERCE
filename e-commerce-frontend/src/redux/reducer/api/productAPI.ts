import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { CategoriesResponse,
     MessageResponse, 
     NewProductrequest, 
     ProductDetailResponse, 
     ProductsResponse, 
     SeacrhRequest,
      SearchResponse, 
      UpdateProductrequest,
      deleteProductrequest} from "../../../types/api-types";

export const productAPI= createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/product/`,
    }),
    tagTypes:["product"],
    endpoints:(builder)=>({
        latestProducts: builder.query<ProductsResponse,string>({
            query:()=>"latest",
            providesTags:["product"],
        }),
        allProducts: builder.query<ProductsResponse,string>({
            query:(id)=>`admin-products?id=${id}`,
            providesTags:["product"],
        }),
        categories: builder.query<CategoriesResponse,string>({
            query:()=>`categories`,
            providesTags:["product"],
        }),
        searchProducts: builder.query<SearchResponse,SeacrhRequest>({
            query:({price,search,sort,category,page})=>{
          let  base=`all?search=${search}&page=${page}`;
          if(price) base+=`&price=${price}`;
          if(sort) base+=`&sort=${sort}`;
          if(category) base+=`&category=${category}`;
          return base;
        },
        providesTags:["product"],
        }),
        Productdetails: builder.query<ProductDetailResponse,string>({
            query:(id)=> id,
            providesTags:["product"],
        }),
        createProducts: builder.mutation<MessageResponse,NewProductrequest>({
            query:({formData,id})=>({
            url: `new?id=${id}`,
            method:"POST",
            body: formData,
        }),
        invalidatesTags:["product"],
    }),
        updateProducts: builder.mutation<MessageResponse,UpdateProductrequest>({
            query:({formData,Userid,Productid})=>({
            url: `${Productid}?id=${Userid}`,
            method:"PUT",
            body: formData,
        }),
        invalidatesTags:["product"],
    }),
        deleteProducts: builder.mutation<MessageResponse,deleteProductrequest>({
            query:({Userid,Productid})=>({
            url: `${Productid}?id=${Userid}`,
            method:"DELETE",
        }),
        invalidatesTags:["product"],
    }),
    }),
});

export const{useLatestProductsQuery,
    useAllProductsQuery,
    useCategoriesQuery,
    useSearchProductsQuery,
    useCreateProductsMutation,
    useProductdetailsQuery,
    useDeleteProductsMutation,useUpdateProductsMutation}= productAPI