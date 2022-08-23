import React from "react";
import Button from "react-bootstrap/Button";
import  { Formik, Form } from "formik";
import { TextField } from "@material-ui/core";
import * as Yup from "yup";

import sabioDebug from "sabio-debug";
const _logger = sabioDebug.extend("LocationInfoForm")

function LocationInfoForm(props) {

   const onLocalSubmitClicked = (values) => {
      _logger(values)
      // debugger;
        props.onNext(values);
   };



   const validationSchema = Yup.object().shape({
    metadata:Yup.object().shape({
        location: Yup.object().shape({
           latitude: Yup.number().typeError("The latitude should be a number").min(-90, 'The min value is -90').max(90, 'The max value is 90').required("This field is required"),
           longitude: Yup.number().typeError("The longitude should be a number").min(-180, 'The min value is -180').max(180, 'The max value is 180').required("This field is required"),
           zipCode: Yup.string().required("This field is required"),
           address: Yup.string().required("This field is required"),
        })
      },)
   })


   return (
      <div className="containter d-flex flex-column">
         <div
            className="card m-3 shadow w-75  align-self-center"
            style={{ minHeight: "85vh" }}
         >
            <div className="row ms-5 my-auto">
               <div className="row d-flex justify-content-center">
                  <Formik
                     enableReinitialize={true}
                     initialValues={props.formData}
                     validationSchema={validationSchema}
                     onSubmit={onLocalSubmitClicked}
                  >
                     {({values, handleChange, touched, errors}) => (
                        <Form >
                           <div className="mb-3">
                     <div>
                        <strong>Location:</strong>{" "}
                     </div>
                     <TextField
                        name="metadata.location.latitude"
                        label="Latitude"
                        onChange={handleChange}
                        className="form-control my-3"
                        value={values?.metadata.location.latitude}
                        error={touched.metadata?.location?.latitude && Boolean(errors.metadata?.location?.latitude)}
                        helpertext={touched.metadata?.location?.latitude && errors.metadata?.location?.latitude}
                     />
                     <TextField
                        name="metadata.location.longitude"
                        label="Longitude"
                        onChange={handleChange}
                        className="form-control my-3"
                        value={values?.metadata.location.longitude}
                        error={touched.metadata?.location?.longitude && Boolean(errors.metadata?.location?.longitude)}
                        helpertext={touched.metadata?.location?.longitude && errors.metadata?.location?.longitude}
                     />
                     <TextField
                        name="metadata.location.zipCode"
                        label="Zip Code"
                        onChange={handleChange}
                        className="form-control my-3"
                        value={values?.metadata.location.zipCode}
                        error={touched.metadata?.location?.zipCode && Boolean(errors.metadata?.location?.zipCode)}
                        helpertext={touched.metadata?.location?.zipCode && errors.metadata?.location?.zipCode}
                     />
                     <TextField
                        name="metadata.location.address"
                        label="address"
                        onChange={handleChange}
                        className="form-control my-3"
                        value={values?.metadata.location.address}
                        error={touched.metadata?.location?.address && Boolean(errors.metadata?.location?.address)}
                        helpertext={touched.metadata?.location?.address && errors.metadata?.location?.address}
                     /> 
                  </div>  
                        <Button
                           onClick={props.onBack}
                           disabled={props.cantBack}
                           type="button"
                           variant="dark"
                           className="my-3 me-1"
                        >
                           {props.backLabel}
                        </Button>
                        <Button
                           type="submit"
                           variant="warning"
                           className="my-3 ms-1"
                        >
                           {props.nextLabel}
                        </Button>
                        </Form>
                     )}
                     
                  </Formik>
                  </div>
            </div>
         </div>
      </div>
   );
}

export default LocationInfoForm; 

