import React from "react";

function EventCard(props) {
   const onLocalShowMoreClicked = () => {
      props.onParentShowMoreClicked(props.anEvent);
   };
   const onLocalEditClicked = (e) => {
      e.preventDefault();
      props.onParentEditClicked(props.anEvent);
   };
   return (
      <React.Fragment>
         <div
            className="card border-secondary mb-3 shadow-sm"
            style={{ maxWidth: "18rem" }}
         >
            <div className="card-header">
               <strong>{props.anEvent?.headline}</strong>
            </div>
            <div className="card-body text-secondary">
               <h5 className="card-title">{props.anEvent?.name}</h5>
               <p>
                  <strong>{props.anEvent?.metadata?.dateStart}</strong>
               </p>
            </div>
            <div className="d-flex my-2 justify-content-around">
               <button
                  type="button"
                  className="btn btn-outline-dark shadow-sm edit ms-1"
                  id={"shMoreButton-" + props.anEvent?.id}
                  onClick={onLocalShowMoreClicked}
               >
                  Show More
               </button>
               <button
                  type="button"
                  className="btn btn-outline-info shadow-sm edit ms-1"
                  id={"editButton-" + props.anEvent?.id}
                  onClick={onLocalEditClicked}
               >
                  Edit
               </button>
            </div>
         </div>
      </React.Fragment>
   );
}

export default EventCard;
