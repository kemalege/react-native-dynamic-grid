/* eslint-disable */
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_URL
})
export const fetchData = async ({currentPage = 1, pageSize = 20, sortBy="", sortDirection=""}) => {

  const token = process.env.TOKEN;
  const userToken = process.env.USER_TOKEN;
  const credentials = {"Token": token, "user_token": userToken}

    const response = await api.post(`/extractOfCustomersPaging?PageNumber=${currentPage}&PageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`, 
    credentials);
    return response.data;
  
};
