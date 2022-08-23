import React from "react";
import EventMap from "./EventMap";
import moment from 'moment';

function EventMainCard(props) {
   return (
      <React.Fragment>
         <div className="col shadow-sm">
            <div className="card">
               <img
                  src={props.anEvent?.summary}
                  className="card-img-top m-3 shadow"
                  alt="event-main-img"
                  style={{ height: "20rem", width: "25rem" }}
               />
               <div className="card-body">
                  <h5 className="card-title">{props.anEvent?.headline}</h5>
                  <p className="card-text">{props.anEvent?.description}</p>
               </div>
               <div className="card-body">
                  <h6 className="card-title">Location</h6>
                  <div className="d-flex">
                     <div className="col-6">
                        <EventMap anEvent={props.anEvent} />
                     </div>
                     <div className="col-3 ms-3">
                        <p className="card-text">
                        <strong>Address: </strong>{props.anEvent?.metadata?.location?.address}
                        </p>
                        <p className="card-text">
                        <strong>Zip Code: </strong>{props.anEvent?.metadata?.location?.zipCode}
                        </p>
                        <p className="card-text">
                        <strong>Date Start: </strong>{moment(props.anEvent?.metadata?.dateStart).format('MMMM Do YYYY, h:mm a')}-
                        </p>
                        <p>
                        <strong>Date End: </strong>{moment(props.anEvent?.metadata?.dateEnd).format('MMMM Do YYYY, h:mm a')}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
}

export default EventMainCard;
