import axios from "axios";

const endpoint = "https://localhost:50001/api/companies";

const add = (payload) => {
   const config = {
      method: "POST",
      url: endpoint,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => response.data.item);
};

const update = (id, payload) => {
   const config = {
      method: "PUT",
      url: `${endpoint}/${id}`,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config);
};

const getAllPaginated = (pageIndex, pageSize) => {
   const config = {
      method: "GET",
      url: `${endpoint}/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => {
      return response.data.item;
   });
};

const getAll = () => {
   const config = {
      method: "GET",
      url: endpoint,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => {
      return response.data.items;
   });
};

const getByQuery = (pageIndex, pageSize, query) => {
   const config = {
      method: "GET",
      url: `${endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => {
      return response.data.item;
   });
};

const companiesService = {
   add,
   update,
   getAll,
   getByQuery,
   getAllPaginated,
};

export default companiesService;
