import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types"

import sabioDebug from "sabio-debug";
const _logger = sabioDebug.extend("JobCard")

function JobCard(props) {
   const [show, setShow] = useState(false);
   const onLocalShowMoreClicked = (e) => {
      e.preventDefault();
      setShow(props.onParentShowMoreClicked(e));
   };
   const onLocalEditClicked = (e) => {
      e.preventDefault();
      props.onParentEditClicked(props.job, e);
   };
   const handleClose = () => {
      setShow(props.onParentCloseClicked());
   };
   const imageObj = props.job?.techCompany?.images?.filter((image) => {
      return image.entityTypeId === 0;
   });

   return (
      <React.Fragment>
         <div className="card m-3 shadow-sm" style={{ width: "22rem" }}>
            <img
               src={
                  imageObj?.length > 0
                     ? imageObj[0].imageUrl
                     : "https://via.placeholder.com/150"
               }
               className="card-img-top rounded-circle m-1 shadow"
               alt="job-main-profile-pic"
            />
            <div className="card-body">
               <h4 className="card-title text-center">{props.job?.title}</h4>
               <h6 className="card-title text-center">
                  {props.job?.techCompany?.name}
                  {_logger("name", props.job?.techCompany?.name)}
               </h6>
               <p className="card-text summary">{props.job?.summary}</p>
            </div>
            <div className="col-12 text-center p-1 mb-2">
               <Button
                  type="button"
                  className="btn shadow-sm delete mx-3"
                  variant="outline-dark"
                  id={"ShMButton-" + props.job.id}
                  onClick={onLocalShowMoreClicked}
               >
                  Show more
               </Button>
               <button
                  type="button"
                  className="btn btn-outline-info shadow-sm edit mx-3"
                  id={"editButton-" + props.job?.id}
                  onClick={onLocalEditClicked}
               >
                  Edit
               </button>
            </div>
         </div>
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <div style={{ width: "15rem" }}>
                  <img
                     src={
                        imageObj?.length > 0
                           ? imageObj[0].imageUrl
                           : "https://via.placeholder.com/150"
                     }
                     className="card-img-top rounded-circle m-1"
                     alt="job-main-profile-pic"
                  />
               </div>
               <Modal.Title className="ms-3">Position: {props.job?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <h5>Company: {props.job?.techCompany?.name}</h5>
               <h6>Salary: {props.job?.pay}</h6>
               <p>Description: {props.job?.description}</p>
               <ul>
                  <strong>Required Skills:</strong>{" "}
                  {props.job?.skills.map((skill) => (
                     <li key={skill.id}>{skill.name}</li>
                  ))}
               </ul>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>
      </React.Fragment>
   );
}

JobCard.propTypes = {
   job: PropTypes.shape ({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      pay: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      skills: PropTypes.shape({
         id: PropTypes.number.isRequired,
         name: PropTypes.string.isRequired,
      })
   })
}

export default React.memo(JobCard);
