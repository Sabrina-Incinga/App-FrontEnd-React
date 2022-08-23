import React from "react";
import moment from 'moment';
import  { Formik, Form } from "formik";
import Button from "react-bootstrap/Button";

function FormConfirmation(props){
    const onLocalSubmitClicked = (values) => {
        props.onNext(values);
   };


    return(
        <div className="containter d-flex flex-column">
        <div
           className="card m-3 shadow w-75  align-self-center"
           style={{ minHeight: "85vh" }}
        >
           <div className="row ms-5 my-auto">
              <div className="row d-flex justify-content-center">
              <div className="card me-4 mt-3" >
                    <div className="card-header">
                        <h3>Check your data:</h3>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><strong>Name: </strong>{props.formData?.name}</li>
                        <li className="list-group-item"><strong>Headline: </strong>{props.formData?.headline}</li>
                        <li className="list-group-item"><strong>Description: </strong>{props.formData?.description}</li>
                        <li className="list-group-item"><strong>Summary: </strong>{props.formData?.summary}</li>
                        <li className="list-group-item"><strong>Slug: </strong>{props.formData?.slug}</li>
                        <li className="list-group-item"><strong>Status Id: </strong>{props.formData?.statusId}</li>
                        <li className="list-group-item"><strong>Date Start: </strong>{moment(props.formData?.metadata?.dateStart).format('MMMM Do YYYY, h:mm:ss a')}</li>
                        <li className="list-group-item"><strong>Date End: </strong>{moment(props.formData?.metadata?.dateEnd).format('MMMM Do YYYY, h:mm:ss a')}</li>
                        <li className="list-group-item"><strong>Latitude: </strong>{props.formData?.metadata?.location.latitude}</li>
                        <li className="list-group-item"><strong>Longitude: </strong>{props.formData?.metadata?.location.longitude}</li>
                        <li className="list-group-item"><strong>Zip Code: </strong>{props.formData?.metadata?.location.zipCode}</li>
                        <li className="list-group-item"><strong>Address: </strong>{props.formData?.metadata?.location.address}</li>
                    </ul>
                </div>
                 <Formik
                    enableReinitialize={true}
                    initialValues={props.formData}
                    onSubmit={onLocalSubmitClicked}
                 >
                    {() => (
                       <Form >
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
    )

}

export default FormConfirmation; 