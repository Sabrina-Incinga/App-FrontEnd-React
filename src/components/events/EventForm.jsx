import React, {useState, useEffect} from "react";
import Loki from 'react-loki';
import { useParams, useLocation } from "react-router-dom";
import BasicInfoForm from "./EventFormSections/BasicInfoForm";
import DateInfoForm from "./EventFormSections/DateInfoForm";
import FormConfirmation from "./EventFormSections/FormConfirmation";
import LocationInfoForm from "./EventFormSections/LocationInfoForm";
import eventsService from "../../services/eventsService";
import "../../../src/loki.css"

import sabioDebug from "sabio-debug";
const _logger = sabioDebug.extend("EventForm")


function EventForm(props) {
     const { eventId } = useParams();
     const { state } = useLocation();
     const defaultPayloadValue = {
      metadata: {
         dateStart: "",
         dateEnd: "",
         location: {
            latitude: "",
            longitude: "",
            zipCode: "",
            address: "",
         },
      },
      name: "",
      headline: "",
      description: "",
      summary: "",
      slug: "",
      statusId: "",
   };
     const [data, setData] = useState(defaultPayloadValue);
     _logger("¨Data: ", data, "Props: ", props) 
     const formSteps = [
      {
          label: 'Step 1',

          component: <BasicInfoForm formData={data} statusOpt={props.statusOpt}/>,
      },
      {
          label: 'Step 2',

          component: <DateInfoForm formData={data} />,
      },
     {
          label: 'Step 3',

          component: <LocationInfoForm formData={data} />,
      }, 
      {
         label: 'Step 4',

         component: <FormConfirmation formData={data} />,
     }, 
  ];

const _mergeValues =(values) => {
   setData({...data, ...values});
}

const goBack = (values) =>{
   console.log(values);
}

const onLocalAddEventSuccess = (response) => {
   props.onParentAddEventSuccess(response);
}

const onLocalAddEventError = () => {
   props.onParentAddEventError();
}

const onLocalEditEventSuccess = () =>{
   props.onParentEditEventSuccess();
}

const onLocalEditEventError = () =>{
   props.onParentEditEventError();
}

const onSubmitClicked = () => {
   const formattedStartDate = new Date(data.metadata?.dateStart).toISOString(); // if it is a string you can do this
   const formattedEndDate = new Date(data.metadata?.dateEnd).toISOString();

   data.metadata.dateEnd = formattedEndDate;
   data.metadata.dateStart = formattedStartDate;

   if (!eventId) {
      _logger("post firing")
      eventsService
         .add(data)
         .then(onLocalAddEventSuccess)
         .catch(onLocalAddEventError);
   } else if (eventId) {
      _logger("update firing")
      eventsService
         .update(eventId, data)
         .then(onLocalEditEventSuccess)
         .catch(onLocalEditEventError);
   }
};

useEffect(() => {
   if (state?.type === "EVENT_EDIT" && state.payload) {
      setData((prevState) => {
         const newForm = { ...prevState, ...state.payload };

         return newForm;
      });     
   }
}, []);
  
     return (
      <div className="containter d-flex flex-column">
            <div className="col">
            {/* <Formik
               enableReinitialize={true}
               initialValues={props.formData}
               onSubmit={onLocalSubmitClicked}
               validationSchema={validationSchema}
            >
               {({values, handleChange, touched, errors}) => (
                  <Form>
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
                        helperText={touched.name && errors.name}
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
                        helperText={touched.headline && errors.headline}
                     />
                  </div>
                  <div className="mb-3">
                     <TextField
                        name="description"
                        label="Description"
                        onChange={handleChange}
                        className="form-control"
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                     />
                  </div>
                  <div className="mb-3">
                     <TextField
                        name="summary"
                        label="Image url"
                        onChange={handleChange}
                        className="form-control"
                        error={touched.summary && Boolean(errors.summary)}
                        helperText={touched.summary && errors.summary}
                     />
                  </div> 
                  <div className="mb-3">
                     <TextField
                        name="slug"
                        label="Slug"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Event slug should be unique"
                        error={touched.slug && Boolean(errors.slug)}
                        helperText={touched.slug && errors.slug}
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
                           value={values.statusId}
                           error={touched.statusId && Boolean(errors.statusId)}
                           helperText={touched.statusId && errors.statusId}
                        >
                           {props.statusOpt?.map(mapOptions)}
                        </Select>
                     </FormControl>
                  </div> 
                  <div className="mb-3">
                     <TextField
                        name="metadata.dateStart"
                        label="Date Start"
                        type="datetime-local"
                        defaultValue="2017-05-24T10:30"
                        onChange={handleChange}
                        className="form-control"
                        error={touched.metadata?.dateStart && Boolean(errors.metadata?.dateStart)}
                        helperText={touched.metadata?.dateStart && errors.metadata?.dateStart}
                     />
                     <TextField
                        name="metadata.dateEnd"
                        label="Date End"
                        type="datetime-local"
                        defaultValue="2017-05-24T10:30"
                        onChange={handleChange}
                        className="form-control"
                        error={touched.metadata?.dateEnd && Boolean(errors.metadata?.dateEnd)}
                        helperText={touched.metadata?.dateEnd && errors.metadata?.dateEnd}
                     />
                  </div> 
                  <div className="mb-3">
                     <div>
                        <strong>Location:</strong>{" "}
                     </div>
                     <TextField
                        name="metadata.location.latitude"
                        label="Latitude"
                        onChange={handleChange}
                        className="form-control"
                        error={touched.metadata?.location?.latitude && Boolean(errors.metadata?.location?.latitude)}
                        helperText={touched.metadata?.location?.latitude && errors.metadata?.location?.latitude}
                     />
                     <TextField
                        name="metadata.location.longitude"
                        label="Longitude"
                        onChange={handleChange}
                        className="form-control"
                        error={touched.metadata?.location?.longitude && Boolean(errors.metadata?.location?.longitude)}
                        helperText={touched.metadata?.location?.longitude && errors.metadata?.location?.longitude}
                     />
                     <TextField
                        name="metadata.location.zipCode"
                        label="Zip Code"
                        onChange={handleChange}
                        className="form-control"
                        error={touched.metadata?.location?.zipCode && Boolean(errors.metadata?.location?.zipCode)}
                        helperText={touched.metadata?.location?.zipCode && errors.metadata?.location?.zipCode}
                     />
                     <TextField
                        name="metadata.location.address"
                        label="address"
                        onChange={handleChange}
                        className="form-control"
                        error={touched.metadata?.location?.address && Boolean(errors.metadata?.location?.address)}
                        helperText={touched.metadata?.location?.address && errors.metadata?.location?.address}
                     /> 
                  </div>
                  <Button
                     type="submit"
                     variant="warning"
                     className="my-3"
                  >
                     Submit
                  </Button>
                  </Form>
               )}
               
            </Formik> */}
            </div>
            <div className="col">
               <Loki
                  steps={formSteps}
                  onNext={_mergeValues}
                  onBack={goBack}
                  onFinish={onSubmitClicked}
                  finishLabel="submit"
                  noActions
               />
            </div>
      </div>
   );
}

export default EventForm;


/* const _finishWizard = (values) => {
   _mergeValues(values)
   console.log(data);
   props.onParentSubmitClicked(data);
} */

 /*  

 //import swal from "@sweetalert/with-react";
//import Button from "react-bootstrap/Button";
//import  { Formik } from "formik";
//import { TextField, FormControl, InputLabel, Select, MenuItem  } from "@material-ui/core";
//import * as Yup from "yup";

   const onLocalSubmitClicked = (values) => {
      console.log("eventForm"+ values);
      props.onParentSubmitClicked(values);
   };

const validationSchema = Yup.object().shape({
   name: Yup.string().min(2).max(25).required("This field is required"),
   headline: Yup.string().min(2).max(120).required("This field is required"),
   description: Yup.string().min(2).required("This field is required"),
   summary: Yup.string().min(2).max(255).required("This field is required"),
   slug: Yup.string().min(2).max(100).required("This field is required"),
   statusId: Yup.string().required("This field is required"),
   metadata:Yup.object().shape({
      dateStart: Yup.date().required("This field is required"),
      dateEnd: Yup.date().required("This field is required"),
      location: Yup.object().shape({
         latitude: Yup.number().typeError("The latitude should be a number").min(-90, 'The min value is -90').max(90, 'The max value is 90').required("This field is required"),
         longitude: Yup.number().typeError("The longitude should be a number").min(-180, 'The min value is -180').max(180, 'The max value is 180').required("This field is required"),
         zipCode: Yup.string().required("This field is required"),
         address: Yup.string().required("This field is required"),
      })
    },)
})


   const mapOptions = option => {
      return (<MenuItem value={option.name} key={`statusOp_${option.id}`}>{option.name}</MenuItem>)
     } */
