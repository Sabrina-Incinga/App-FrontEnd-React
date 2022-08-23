import React, { useState } from "react";
import toastr from "toastr";
import usersService from "../../services/usersService";

function Register() {
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      avatarUrl: "",
      tenantId: "U03JAR4PEJE",
   });

   const onFormFieldChange = (event) => {
      const target = event.target;

      const newUserValue = target.value;

      const nameOfField = target.name;

      setFormData((prevState) => {
         const updatedFormData = {
            ...prevState,
         };

         updatedFormData[nameOfField] = newUserValue;

         return updatedFormData;
      });
   };

   const onRegisterSuccess = (response) => {
      toastr.success("You have succesfully registered", "Registration success");
      console.log(response);
   };

   const onRegisterError = (error) => {
      toastr.error("Registration could not be completed", "Registration error");
      console.error(error);
   };

   const onLoginClicked = (e) => {
      e.preventDefault();
      usersService
         .userRegister(formData)
         .then(onRegisterSuccess)
         .catch(onRegisterError);
      console.log(formData);
   };

   return (
      <React.Fragment>
         <div className="containter d-flex flex-column">
            <div
               className="card m-3 shadow w-75  align-self-center"
               style={{ minHeight: "85vh" }}
            >
               <div className="row ms-5">
                  <div className="col ms-5">
                     <h1>Register</h1>
                  </div>
                  <div className="row d-flex justify-content-center">
                     <div className="col-3">
                        <form>
                           <div className="mb-3">
                              <label htmlFor="firstNameInput" className="form-label">
                                 First Name
                              </label>
                              <input
                                 name="firstName"
                                 type="text"
                                 className="form-control"
                                 id="firstNameInput"
                                 placeholder="Enter your first name"
                                 value={formData.firstName}
                                 onChange={onFormFieldChange}
                              />
                           </div>
                           <div className="mb-3">
                              <label htmlFor="lastNameInput" className="form-label">
                                 Last Name
                              </label>
                              <input
                                 name="lastName"
                                 type="text"
                                 className="form-control"
                                 id="lastNameInput"
                                 placeholder="Enter your last name"
                                 value={formData.lastName}
                                 onChange={onFormFieldChange}
                              />
                           </div>
                           <div className="mb-3">
                              <label htmlFor="emailInput" className="form-label">
                                 Email Address
                              </label>
                              <input
                                 name="email"
                                 type="email"
                                 className="form-control"
                                 id="emailInput"
                                 placeholder="Enter your email address"
                                 value={formData.email}
                                 onChange={onFormFieldChange}
                              />
                           </div>
                           <div className="mb-3">
                              <label htmlFor="passwordInput" className="form-label">
                                 Password
                              </label>
                              <input
                                 name="password"
                                 type="password"
                                 className="form-control"
                                 id="passwordInput"
                                 placeholder="Enter your password"
                                 value={formData.password}
                                 onChange={onFormFieldChange}
                              />
                           </div>
                           <div className="mb-3">
                              <label
                                 htmlFor="passwordConfirmInput"
                                 className="form-label"
                              >
                                 Confirm Password
                              </label>
                              <input
                                 name="passwordConfirm"
                                 type="password"
                                 className="form-control"
                                 id="passwordConfirmInput"
                                 placeholder="Confirm your password"
                                 value={formData.passwordConfirm}
                                 onChange={onFormFieldChange}
                              />
                           </div>
                           <div className="mb-3">
                              <label htmlFor="avatarUrlInput" className="form-label">
                                 Profile Url
                              </label>
                              <input
                                 name="avatarUrl"
                                 type="url"
                                 className="form-control"
                                 id="avatarUrlInput"
                                 placeholder="Provide a Url to an image"
                                 value={formData.avatarUrl}
                                 onChange={onFormFieldChange}
                              />
                           </div>
                           <button
                              type="submit"
                              id="submit"
                              className="btn btn-outline-dark"
                              onClick={onLoginClicked}
                           >
                              Register
                           </button>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
}

export default Register;
