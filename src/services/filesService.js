import axios from "axios";

const endpoint = "https://api.remotebootcamp.dev/api/files";

const add = (payload) => {
   const config = {
      method: "POST",
      url: endpoint,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "multipart/form-data" },
   };

   return axios(config).then((response) => response.data.items);
};

const filesService = { add };

export default filesService;
