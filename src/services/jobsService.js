import axios from "axios";
const endpoint = "https://localhost:50001/api/jobs";

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

const getAll = (pageIndex, pageSize) => {
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

const getByQuery = (pageIndex, pageSize, query) => {
   const config = {
      method: "GET",
      url: `${endpoint}/search/?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => {
      return response.data.item;
   });
};

const jobsService = { add, update, getAll, getByQuery };

export default jobsService;
