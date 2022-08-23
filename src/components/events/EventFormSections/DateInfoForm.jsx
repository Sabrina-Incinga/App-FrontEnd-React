import React from "react";
import Button from "react-bootstrap/Button";
import  { Formik, Form } from "formik";
import { TextField } from "@material-ui/core";
import * as Yup from "yup";

function DateInfoForm(props) {

   const onLocalSubmitClicked = (values) => {
        props.onNext(values);
   };

   const defaultDate = new Date();

   const validationSchema = Yup.object().shape({
    metadata:Yup.object().shape({
        dateStart: Yup.date().required("This field is required"),
        dateEnd: Yup.date().required("This field is required"),
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
                     {({ handleChange, touched, errors}) => (
                        <Form >
                           <div className="mb-3">
                     <div>
                        <strong>Date of event:</strong>{" "}
                     </div>
                     <TextField
                        name="metadata.dateStart"
                        label="Date Start"
                        type="datetime-local"
                        defaultValue={`${defaultDate.toISOString()}`}
                        onChange={handleChange}
                        className="form-control my-3"
                        error={touched.metadata?.dateStart && Boolean(errors.metadata?.dateStart)}
                        helpertext={touched.metadata?.dateStart && errors.metadata?.dateStart}
                     />
                     <TextField
                        name="metadata.dateEnd"
                        label="Date End"
                        type="datetime-local"
                        defaultValue={`${defaultDate.toDateString()}`}
                        onChange={handleChange}
                        className="form-control my-3"
                        error={touched.metadata?.dateEnd && Boolean(errors.metadata?.dateEnd)}
                        helpertext={touched.metadata?.dateEnd && errors.metadata?.dateEnd}
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

export default DateInfoForm; 