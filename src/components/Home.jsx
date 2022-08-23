import React from "react";

function Home(props) {
   return (
      <React.Fragment>
         <div className="card containter d-flex flex-column">
            <div className="row ms-5">
               <div className="col ms-5">
                  <h1>
                     Welcome {props.user.firstName} {props.user.lastName}
                  </h1>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
}

export default Home;
