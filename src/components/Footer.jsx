import React from "react";
import { Link } from "react-router-dom";

function Footer() {
   return (
      <React.Fragment>
         <footer className="container d-flex flex-column justify-content-center align-items-center mt-2">
            <div>
               <Link to={{ pathname: "contactUs" }}>Contact Us</Link>
            </div>
            <div>
               <p>&copy; Sabio 2019-2020</p>
            </div>
         </footer>
      </React.Fragment>
   );
}

export default Footer;
