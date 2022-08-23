import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import usersService from "../../services/usersService";
import  { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login(props) {
   const navigate = useNavigate();

   const [formData] = useState({
      email: "",
      password: "",
      tenantId: "U03JAR4PEJE",
      showPassword: false,
   });

   const validationSchema = Yup.object().shape({
      email: Yup.string().email("Invalid email").min(2).required("This field is required"),
      password: Yup.string().min(8).required("This field is required"),
   })

   const onLoginSuccess = (response) => {
      toastr.success("You have succesfully logged in", "Log in success");
      navigate("/");
      props.onParentLoginSuccess();
      console.log(response);
   };

   const onLoginError = (error) => {
      toastr.error("Log in could not be completed", "Log in error");
      console.error(error);
   };

   const onLoginClicked = (values) => {
      usersService.userLogin(values).then(onLoginSuccess).catch(onLoginError);

      console.log(values);
   };

   
   /*const onFormFieldChange = (event) => {
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
   };*/

   return (
      <React.Fragment>
         <div className="containter  d-flex flex-column">
            <div
               className="card m-3 shadow w-75  align-self-center"
               style={{ minHeight: "70vh" }}
            >
               <div className="row ms-5">
                  <div className="col ms-5">
                     <h1>Login</h1>
                  </div>
               </div>
               <div className="row d-flex justify-content-center">
                  <div className="col-3">
                     <Formik
                        enableReinitialize={true}
                        initialValues={formData}
                        onSubmit={onLoginClicked}
                        validationSchema={validationSchema}>
                        {({values}) => (
                           <Form>
                              <div className="mb-3">
                                 <label htmlFor="email" className="form-label">
                                    Email address
                                 </label>
                                 <ErrorMessage name="email" component="div" className="text-danger mb-1" style={{fontSize: "0.9rem"}}/>
                                 <Field
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email address"
                                 />
                                 
                              </div>
                              <div className="mb-3">
                                 <label htmlFor="password" className="form-label">
                                    Password
                                 </label>
                                 <ErrorMessage name="password" component="div" className="text-danger mb-1" style={{fontSize: "0.9rem"}}/>
                                 <Field
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                 />
                                 <div>
                                    {values.showPassword && values.password}
                                 </div>
                                 <Field
                                    name="showPassword"
                                    type="checkbox"
                                    className="form-check-input my-1"
                                 />
                                 <label htmlFor="showPassword" className="form-label ms-1">
                                    Show Password
                                 </label>
                                 
                              </div>
                              <button
                                 type="submit"
                                 className="btn btn-outline-dark my-2">
                                 Sign in
                              </button>
                           </Form>
                        )}
                     </Formik>
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
}

export default Login;
