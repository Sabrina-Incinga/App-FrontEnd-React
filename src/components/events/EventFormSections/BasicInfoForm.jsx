import React from "react";
import Button from "react-bootstrap/Button";
import  { Formik, Form } from "formik";
import { TextField, FormControl, InputLabel, Select, MenuItem  } from "@material-ui/core";
import * as Yup from "yup";

function BasicInfoForm(props) {

   const onLocalSubmitClicked = (values) => {
        props.onNext(values);
   };

   const validationSchema = Yup.object().shape({
      name: Yup.string().min(2).max(25).required("This field is required"),
      headline: Yup.string().min(2).max(120).required("This field is required"),
      description: Yup.string().min(2).required("This field is required"),
      summary: Yup.string().min(2).max(255).required("This field is required"),
      slug: Yup.string().min(2).max(100).required("This field is required"),
      statusId: Yup.string().required("This field is required"),
   })


   const mapOptions = option => {
      return (<MenuItem value={option.name} key={`statusOp_${option.id}`}>{option.name}</MenuItem>)
     }

   return (
      <div className="containter d-flex flex-column">
         <div
            className="card m-3 shadow w-75  align-self-center"
            style={{ minHeight: "85vh" }}
         >
            <div className="row mx-5 my-auto">
               <div className="row d-flex justify-content-center">
                  <Formik
                     enableReinitialize={true}
                     initialValues={props.formData}
                     validationSchema={validationSchema}
                     onSubmit={onLocalSubmitClicked}
                  >
                     {({values, handleChange, touched, errors}) => (
                        <Form >
                           {values?.id && (
                           <div className="my-3">
                              <label htmlFor="id" className="form-label">
                                 Job Id : {values?.id}
                              </label>
                           </div>
                        )}
                        <div className="my-3">
                           <TextField
                              name="name"
                              label="Event name"
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter event name"
                              value={values?.name}
                              error={touched.name && Boolean(errors.name)}
                              helpertext={touched.name && errors.name}
                           />
                        </div>
                        <div className="mb-3">
                           <TextField
                              name="headline"
                              label = "Event headline"
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter event headline"
                              value={values?.headline}
                              error={touched.headline && Boolean(errors.headline)}
                              helpertext={touched.headline && errors.headline}
                           />
                        </div>
                        <div className="mb-3">
                           <TextField
                              name="description"
                              label="Description"
                              onChange={handleChange}
                              className="form-control"
                              value={values?.description}
                              error={touched.description && Boolean(errors.description)}
                              helpertext={touched.description && errors.description}
                           />
                        </div>
                        <div className="mb-3">
                           <TextField
                              name="summary"
                              label="Image url"
                              onChange={handleChange}
                              className="form-control"
                              value={values?.summary}
                              error={touched.summary && Boolean(errors.summary)}
                              helpertext={touched.summary && errors.summary}
                           />
                        </div> 
                        <div className="mb-3">
                           <TextField
                              name="slug"
                              label="Slug"
                              onChange={handleChange}
                              className="form-control"
                              value={values?.slug}
                              placeholder="Event slug should be unique"
                              error={touched.slug && Boolean(errors.slug)}
                              helpertext={touched.slug && errors.slug}
                           />
                        </div> 
                        <div className="mb-3">
                        <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Status</InputLabel>
                              <Select
                                 name="statusId"
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 onChange={handleChange}
                                 value={values?.statusId}
                                 error={touched.statusId && Boolean(errors.statusId)}
                                 helpertext={touched.statusId && errors.statusId}
                              >
                                 {props.statusOpt?.map(mapOptions)}
                              </Select>
                           </FormControl>
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

export default BasicInfoForm; 