import React from "react";
import { useNavigate } from "react-router-dom";

function Nav(props) {
   const navigate = useNavigate();
   const goToPage = (e) => {
      const targetPage = e.currentTarget.dataset.page;
      if (targetPage === "/login" && props.user.isLoggedIn) {
         props.onParentLogoutClicked();
         navigate("/");
      } else {
         navigate(targetPage);
      }
   };

   return (
      <React.Fragment>
         <nav
            className="navbar navbar-expand-md navbar-dark bg-dark"
            aria-label="Fourth navbar example"
         >
            <div className="container">
               <a className="navbar-brand" href="/">
                  <img
                     src="https://pw.sabio.la/images/Sabio.png"
                     width="30"
                     height="30"
                     className="d-inline-block align-top"
                     alt="Sabio"
                  />
               </a>
               <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarsExample04"
                  aria-controls="navbarsExample04"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
               >
                  <span className="navbar-toggler-icon"></span>
               </button>

               <div className="collapse navbar-collapse" id="navbarsExample04">
                  <ul className="navbar-nav me-auto mb-2 mb-md-0">
                     <li className="nav-item">
                        <button
                           className="nav-link px-2 text-white link-button"
                           id="homeButton"
                           data-page="/"
                           onClick={goToPage}
                        >
                           Home
                        </button>
                     </li>
                     <li className="nav-item">
                        <button
                           className="nav-link px-2 text-white link-button"
                           id="friends"
                           data-page="/friends"
                           onClick={goToPage}
                        >
                           Friends
                        </button>
                     </li>
                     <li className="nav-item">
                        <button
                           href="#"
                           className="nav-link px-2 text-white link-button"
                           id="jobs"
                           data-page="/jobs"
                           onClick={goToPage}
                        >
                           Jobs
                        </button>
                     </li>
                     <li className="nav-item">
                        <button
                           href="#"
                           className="nav-link px-2 text-white link-button"
                           id="companies"
                           data-page="/companies"
                           onClick={goToPage}
                        >
                           Tech Companies
                        </button>
                     </li>
                     <li className="nav-item">
                        <button
                           href="#"
                           className="nav-link px-2 text-white link-button"
                           id="events"
                           data-page="/events"
                           onClick={goToPage}
                        >
                           Events
                        </button>
                     </li>
                     <li className="nav-item">
                        <button
                           href="#"
                           className="nav-link px-2 text-white link-button"
                           id="testandajax"
                           data-page="/testandajax"
                           onClick={goToPage}
                        >
                           Test and Ajax Call
                        </button>
                     </li>
                  </ul>
                  <div className="text-end">
                     <a
                        href="/"
                        className="align-items-center mb-2 me-2 mb-lg-0 text-white text-decoration-none"
                     >
                        {props.user.firstName} {props.user.lastName}
                     </a>
                     <button
                        type="button"
                        className="btn btn-outline-light me-2"
                        id="login"
                        data-page="/login"
                        onClick={goToPage}
                     >
                        {props.user.isLoggedIn && "Log out"}
                        {!props.user.isLoggedIn && "Log in"}
                     </button>
                     <button
                        type="button"
                        className="btn btn-warning"
                        id="register"
                        data-page="/register"
                        onClick={goToPage}
                     >
                        Register
                     </button>
                     <img
                        src={props.user.avatar}
                        alt="user avatar"
                        className="rounded-circle ms-3"
                        style={{ width: "2.7rem" }}
                     />
                  </div>
               </div>
            </div>
         </nav>
      </React.Fragment>
   );
}

export default Nav;
