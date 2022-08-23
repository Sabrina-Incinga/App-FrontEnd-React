import axios from "axios";

const endpoint = "https://api.remotebootcamp.dev/api/emails";

const add = (payload) => {
   const config = {
      method: "POST",
      url: endpoint,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
   };

   return axios(config);
};

const emailService = { add };

export default emailService;
