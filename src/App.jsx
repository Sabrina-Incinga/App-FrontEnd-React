import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Friends from "./components/friends/Friends";
import Jobs from "./components/jobs/Jobs";
import Companies from "./components/techCompanies/TechCompanies";
import Events from "./components/events/Events";
import TestAndAjax from "./components/TestAndAjax";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Footer from "./components/Footer";
import FriendForm from "./components/friends/FriendForm";
import JobForm from "./components/jobs/JobForm";
import CompanyForm from "./components/techCompanies/CompanyForm";
import ContactForm from "./components/user/ContactForm";
import usersService from "./services/usersService";
import toastr from "toastr";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
   const [currentUser, setCurrentUser] = useState({
      id: "",
      firstName: "Unknown",
      lastName: "user",
      email: "",
      avatar:
         "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      isLoggedIn: false,
   });

   const defaultStatusOpt= [{id:1,
                           name:"Active"},
                           {id:2,
                              name:"NotSet"},
                           {id:3,
                              name:"Deleted"},
                           {id:4,
                              name:"Flagged"},];

   const [statusIdOptions] = useState(defaultStatusOpt);

   
   const onLoginSuccess = () => {
      setCurrentUser((prevUser) => {
         const updatedUser = { ...prevUser };
         updatedUser.isLoggedIn = true;

         return updatedUser;
      });
   };

   const onLogoutClicked = () => {
      usersService.userLogout().then(onLogoutSuccess).catch(onLogoutError);
   };

   const onLogoutSuccess = () => {
      setCurrentUser((prevUser) => {
         const updatedUser = { ...prevUser };
         updatedUser.id = "";
         updatedUser.firstName = "Unknown";
         updatedUser.lastName = "user";
         updatedUser.email = "";
         updatedUser.avatar =
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
         updatedUser.isLoggedIn = false;

         return updatedUser;
      });
      toastr.success("You have succesfully logged out", "Log out success");
   };

   const onLogoutError = (error) => {
      toastr.error("Log out could not be completed", "Log out error");
      console.error(error);
   };

   const onGetCurrentUserSuccess = (response) => {
      usersService
         .getById(response.id)
         .then(onGetUserByIdSuccess)
         .catch(onGetUserByIdError);
   };

   const onGetCurrentUserError = (error) => {
      console.error(error);
   };

   const onGetUserByIdSuccess = (response) => {
      setCurrentUser((prevUser) => {
         const updatedUser = { ...prevUser };
         updatedUser.firstName = response.firstName;
         updatedUser.id = response.id;
         updatedUser.lastName = response.lastName;
         updatedUser.email = response.email;
         updatedUser.avatar = response.avatarUrl;
         updatedUser.isLoggedIn = true;

         return updatedUser;
      });
   };

   const onGetUserByIdError = (error) => {
      console.error(error);
   };

   useEffect(() => {
      usersService
         .getCurrentUser()
         .then(onGetCurrentUserSuccess)
         .catch(onGetCurrentUserError);
   }, [currentUser.isLoggedIn]);



   return (
      <React.Fragment>
         <Nav user={currentUser} onParentLogoutClicked={onLogoutClicked}></Nav>
         <main role="main" style={{ minHeight: "89vh" }}>
            <Routes>
               <Route path="/" element={<Home user={currentUser} />}></Route>
               <Route path="/friends" element={<Friends />}></Route>
               <Route path="/newFriend" element={<FriendForm statusOpt= {statusIdOptions}/>}>
                  <Route path=":friendId" element={<FriendForm statusOpt= {statusIdOptions}/>}></Route>
               </Route>
               <Route path="/jobs" element={<Jobs />}></Route>
               <Route path="/companies" element={<Companies />}></Route>
               <Route path="/events" element={<Events statusOpt = {statusIdOptions}/>}>
                  <Route path=":eventId" element={<JobForm statusOpt= {statusIdOptions}/>}></Route>
               </Route>
               <Route path="/testandajax" element={<TestAndAjax />}></Route>
               <Route
                  path="/login"
                  element={<Login onParentLoginSuccess={onLoginSuccess} />}
               ></Route>
               <Route path="/register" element={<Register />}></Route>
               <Route path="/newJob" element={<JobForm statusOpt= {statusIdOptions}/>}>
                  <Route path=":jobId" element={<JobForm statusOpt= {statusIdOptions}/>}></Route>
               </Route>
               <Route path="/newCompany" element={<CompanyForm statusOpt= {statusIdOptions}/>}>
                  <Route path=":companyId" element={<CompanyForm statusOpt= {statusIdOptions}/>}></Route>
               </Route>
               <Route path="/contactUs" element={<ContactForm />}></Route>            
            </Routes>
            
         </main>

         <Footer></Footer>
      </React.Fragment>
   );
}

export default App;
