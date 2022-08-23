import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";

function CompanyCard(props) {
   const [show, setShow] = useState(false);
   const onLocalShowMoreClicked = (e) => {
      e.preventDefault();
      setShow(props.onParentShowMoreClicked(e));
   };
   const onLocalEditClicked = (e) => {
      e.preventDefault();
      props.onParentEditClicked(props.company, e);
   };
   const handleClose = () => {
      setShow(props.onParentCloseClicked());
   };
   const imageObj = props.company?.images?.filter((image) => {
      return image.imageTypeId === "Logo";
   });

   const mapCarouselCards = (image) => {
      return (
         <Carousel.Item key={"carouselItem-" + image.id}>
            <img
               className="d-block w-100"
               src={image.imageUrl}
               alt={"slide-" + image.id}
            />
         </Carousel.Item>
      );
   };

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
               alt="company-main-profile-pic"
            />
            <div className="card-body">
               <h4 className="card-title text-center">{props.company?.name}</h4>
               <h6 className="card-title text-center">{props.company?.headline}</h6>
               <p className="card-text summary">{props.company?.summary}</p>
            </div>
            <div className="col-12 text-center p-1 mb-2">
               <Button
                  type="button"
                  className="btn shadow-sm delete mx-3"
                  variant="outline-dark"
                  id={"ShMButton-" + props.company.id}
                  onClick={onLocalShowMoreClicked}
               >
                  Show more
               </Button>
               <button
                  type="button"
                  className="btn btn-outline-info shadow-sm edit mx-3"
                  id={"editButton-" + props.company?.id}
                  onClick={onLocalEditClicked}
               >
                  Edit
               </button>
            </div>
         </div>
         <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
               <Carousel className="shadow mx-auto" variant="dark">
                  {props.company?.images?.map(mapCarouselCards)}
               </Carousel>

               <Modal.Title className="ms-3"></Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <h4>Company: {props.company?.name}</h4>
               <h5>{props.company?.headline}</h5>
               <p>Description: {props.company?.profile}</p>
               <p>Contact us: {props.company?.contactInformation}</p>
               <ul>
                  <strong>Important urls:</strong>{" "}
                  {props.company?.urls?.map((url) => (
                     <li key={url.id}>{url.url}</li>
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

export default React.memo(CompanyCard);
