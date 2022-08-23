import axios from "axios";
const endpoint = "https://localhost:50001/api/v3/friends";

const getAllPaginated = (pageIndex, pageSize) => {
   const config = {
      method: "GET",
      url: `${endpoint}/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize} `,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => response.data.item);
};

const getAll = () => {
   const config = {
      method: "GET",
      url: endpoint,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => response.data.items);
};

const getById = (id) => {
   const config = {
      method: "GET",
      url: `${endpoint}/${id} `,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => response.data.item);
};

const getByQuery = (pageIndex, pageSize, query) => {
   const config = {
      method: "GET",
      url: `${endpoint}/search/?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => response.data.item);
};

const addFriend = (payload) => {
   const config = {
      method: "POST",
      url: endpoint,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => {
      payload.id = response.data.item;
      return payload;
   });
};

const deleteById = (id) => {
   const config = {
      method: "DELETE",
      url: `${endpoint}/${id} `,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config);
};

const updateFriend = (id, payload) => {
   const config = {
      method: "PUT",
      url: `${endpoint}/${id} `,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then(() => {
      payload.id = id;
      return payload;
   });
};

const friendsService = {
   getAll,
   getById,
   getByQuery,
   addFriend,
   deleteById,
   updateFriend,
   getAllPaginated,
};

export default friendsService;
