import axios from "axios";

const endpoint = "https://localhost:50001/api/events";

const add = (payload) => {
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

const getAllYetToStart = (pageIndex, pageSize) => {
   const config = {
      method: "GET",
      url: `${endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => response.data.item);
};

const getAllUpcoming = () => {
   const config = {
      method: "GET",
      url: `${endpoint}/feeds`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config).then((response) => response.data.items);
};

const getAllByDates = (pageIndex, pageSize, startDate, endDate) => {
   const config = {
      method: "GET",
      url: `${endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&dateStart=${startDate}&dateEnd=${endDate}`,
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

   return axios(config).then(() => {
      payload.id = id;
      return payload;
   });
};

const eventsService = {
   add,
   update,
   getAllYetToStart,
   getAllUpcoming,
   getAllByDates,
};

export default eventsService;
