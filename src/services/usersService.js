import axios from "axios";
const endpoint = "https://api.remotebootcamp.dev/api/users";

const userLogin = (payload) => {
   payload.tenantId = "U03JAR4PEJE";
   const config = {
      method: "POST",
      url: endpoint + "/login",
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

const userRegister = (payload) => {
   payload.tenantId = "U03JAR4PEJE";
   const config = {
      method: "POST",
      url: endpoint + "/register",
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

const getCurrentUser = () => {
   const config = {
      method: "GET",
      url: endpoint + "/current",
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => {
      return response.data.item;
   });
};

const getById = (id) => {
   const config = {
      method: "GET",
      url: `${endpoint}/${id}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => {
      return response.data.item;
   });
};

const userLogout = () => {
   const config = {
      method: "GET",
      url: endpoint + "/logout",
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config);
};

const usersService = { userLogin, userRegister, getCurrentUser, getById, userLogout };

export default usersService;
