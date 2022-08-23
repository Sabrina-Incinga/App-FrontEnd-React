import React, { useState, useEffect, useCallback } from "react";
import EventCard from "./EventCard";
import EventMainCard from "./EventMainCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import toastr from "toastr";
import eventsService from "../../services/eventsService";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EventForm from "./EventForm";
import EventMap from "./EventMap";
import { LoadScript } from "@react-google-maps/api";
import  { Formik, Form, Field } from "formik";
import { useParams, useNavigate } from "react-router-dom";

//import filesService from "../../services/filesService";

function Events(props) {
   //states
   const [pageContent, setPageContent] = useState({
      eventsArray: [],
      eventsComponents: [],
      eventsMarkers: [],
      eventAdded: false,
   });
   const [mainEvent, setMainEvent] = useState({});
   const [searchParam, setSearchParam] = useState({
      startDate: "",
      endDate: "",
   });
   const [paginationCtrl, setPaginationCtrl] = useState({
      current: 1,
      pageSize: 3,
      total: 0,
   });
   const [showForm, setShowForm] = useState(false);
   const [showFullMap, setShowFullMap] = useState(false);
   const { eventId } = useParams();

   const navigate = useNavigate();
   const goToPage = (id) => {
      navigate({
         pathname: `/events/${id}`,
      });
   };
   
   //click handlers
   const onAddEventClicked = () => {
      setShowForm(true);
   };

   const onviewAllEvOnMapClicked = () => {
      setShowFullMap(true);
   };

   const handleClose = () => {
      setShowForm(false);
      setShowFullMap(false);
      navigate({
         pathname: `/events`,
      });
   };

   const onShowMoreClicked = useCallback((anEvent) => {
      setMainEvent(anEvent);
   }, []);

   const onEditClicked = useCallback((anEvent) => {
      const stateToSend = { type: "EVENT_EDIT", payload: anEvent };
      navigate(
         {
            pathname: `/events/${anEvent.id}`,
         },
         { state: stateToSend }
      );
      setShowForm(true);
   }, []);

   const onClearClicked = () => {
      setPaginationCtrl((prevState) => {
         const updatedState = { ...prevState };
         updatedState.current = 1;
         return updatedState;
      });
      setSearchParam((prevState) => {
         const newState = {...prevState};
         newState.startDate = "";
         newState.endDate = "";
         return newState;
      })
   }

   const onSearchClicked = (values) => {
      setPaginationCtrl((prevState) => {
         const updatedState = { ...prevState };
         updatedState.current = 1;
         return updatedState;
      });
      setSearchParam(values);
      eventsService
         .getAllByDates(
            paginationCtrl.current - 1,
            paginationCtrl.pageSize,
            values.startDate,
            values.endDate
         )
         .then(onGetEventsByDateSuccess)
         .catch(onGetEventsByDateError);
   }; 

   //change the page on the pagination controller
   const onPageChange = (page) => {
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.current = page;
         return newPagination;
      });
   };

   //mappers
   const mapEventCard = (anEvent) => {
      return (
         <EventCard
            key={"SmEventCard" + anEvent.id}
            anEvent={anEvent}
            onParentShowMoreClicked={onShowMoreClicked}
            onParentEditClicked={onEditClicked}
         ></EventCard>
      );
   };

   const mapEventMarker = (anEvent) => {
      return {
         lat: anEvent?.metadata?.location.latitude,
         lng: anEvent?.metadata?.location.longitude,
      };
   };

   //add/edit events
   const onAddEventSuccess = useCallback((response) => {
      setPageContent((prevState) => {
         const updatedState = { ...prevState };
         updatedState.eventAdded = !prevState.eventAdded;
         return updatedState;
      });
      goToPage(response.id)
      toastr.success("Event successfully added", "Add event success");
   }, []);

   const onAddEventError = useCallback((error) => {
      toastr.error("Event couldn't be added", "Add event error");
      console.error(error);
   },[]);

   const onEditEventSuccess = useCallback(() => {
      setPageContent((prevState) => {
         const updatedState = { ...prevState };
         updatedState.eventAdded = !prevState.eventAdded;
         return updatedState;
      });
      toastr.success("Event successfully Edited", "Edit event success");
   }, []);

   const onEditEventError = useCallback((error) => {
      toastr.error("Event couldn't be edited", "Edit event error");
      console.error(error);
   }, []);

   //data for the small cards
   const onGetEventsByDateSuccess = (response) => {
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.total = response.totalCount;
         return newPagination;
      });
      setPageContent((prevState) => {
         const updatedState = { ...prevState };
         updatedState.eventsArray = response.pagedItems;
         updatedState.eventsComponents = response.pagedItems.map(mapEventCard);
         return updatedState;
      });
   };

   const onGetEventsByDateError = (error) => {
      toastr.warning("No events found between the specified dates", "Search error");
      console.error(error);
   };

   //data for first render
   const onGetAllUpcomingEventsSuccess = (response) => {
      setMainEvent(response[0]);
      setPageContent((prevState) => {
         const updatedState = { ...prevState };
         updatedState.eventsMarkers = response.map(mapEventMarker);
         return updatedState;
      });
   };

   const onGetAllUpcomingEventsError = (error) => {
      console.error(error);
   };

   //this useEffect triggers every time I do a search or change the page or add/edit an event
   useEffect(() => {
      if (!(searchParam.startDate && searchParam.endDate)) {
         eventsService
            .getAllYetToStart(paginationCtrl.current - 1, paginationCtrl.pageSize)
            .then(onGetEventsByDateSuccess)
            .catch(onGetEventsByDateError);
      }
      
   }, [searchParam, paginationCtrl.current, pageContent.eventAdded]);

   useEffect(() => {
      if (searchParam.startDate && searchParam.endDate) {
         eventsService
            .getAllByDates(
               paginationCtrl.current - 1,
               paginationCtrl.pageSize,
               searchParam.startDate,
               searchParam.endDate
            )
            .then(onGetEventsByDateSuccess)
            .catch(onGetEventsByDateError);
      }
   }, [paginationCtrl.current]);

   useEffect(() => {
      eventsService
         .getAllUpcoming()
         .then(onGetAllUpcomingEventsSuccess)
         .catch(onGetAllUpcomingEventsError);
   }, []);

  

   /*    const getAllEventsError = (err) => {
      console.log("getAllEventsError err", err);
   };

   const getAllEventsSuccess = (response) => {
      console.log("getAllEventsSuccess response", response);
      // inside of response
           
            1. All of the events
            2. currentPage
            3. totalCount
            4. pageIndex
            and some extra data

            we care about 2 things, totalCount and the events

            on success, go ahead and re-set the state that you have for totalCount


      
   };
 */

      //get forms data
 /*  const onFormFieldChange = (event) => {
      const target = event.target;

      const newUserValue = target.value;

      const nameOfField = target.name;

      setFormData((prevState) => {
         const updatedFormData = {
            ...prevState,
         };
         if (nameOfField === "dateStart") {
            updatedFormData.payload.metadata.dateStart = newUserValue;
         } else if (nameOfField === "dateEnd") {
            updatedFormData.payload.metadata.dateEnd = newUserValue;
         } else if (nameOfField === "latitude") {
            updatedFormData.payload.metadata.location.latitude = newUserValue * 1;
         } else if (nameOfField === "longitude") {
            updatedFormData.payload.metadata.location.longitude = parseFloat(
               newUserValue,
               10
            );
         } else if (nameOfField === "zipCode") {
            updatedFormData.payload.metadata.location.zipCode = newUserValue;
         } else if (nameOfField === "address") {
            updatedFormData.payload.metadata.location.address = newUserValue;
         } else if (nameOfField === "summary") {
            updatedFormData.fileInput = newUserValue;
            console.log(target.files[0]);
            let fileFormData = new FormData();
            fileFormData.append("file", target.files[0]);
            filesService
               .add(fileFormData)
               .then((response) => (updatedFormData.payload.summary = response[0]))
               .catch((error) => console.error(error));
         } else {
            updatedFormData.payload[nameOfField] = newUserValue;
         }

         return updatedFormData;
      });
   };*/

   /*const onSearchFormFieldChange = (event) => {
      const target = event.target;

      const newUserValue = target.value;

      const nameOfField = target.name;

      setSearchParam((prevState) => {
         const updatedSearchFormData = {
            ...prevState,
         };
         updatedSearchFormData[nameOfField] = newUserValue;

         return updatedSearchFormData;
      });
   };*/
   return (
      <LoadScript googleMapsApiKey="API-KEY">
         <div className="card containter d-flex">
            <div className="row d-flex align-items-center">
               <div className="col-1 mx-5 d-flex">
                  <h1>Events</h1>
               </div>
               <div className="col-4 d-flex">
                  <Button
                     type="button"
                     className="btn btn-outline-light btn-dark shadow-sm me-1"
                     id="addEvent"
                     onClick={onAddEventClicked}
                  >
                     Add new event
                  </Button>
               </div>
               <div className="col"></div>
            </div>
            <div className="row d-flex justify-content-center shadow-lg w-75 align-self-center bg-shadow ">
               <div className="col shadow my-5">
                  {mainEvent && <EventMainCard anEvent={mainEvent}></EventMainCard>}
               </div>
               <div className="col-3 d-flex flex-column align-items-center shadow">
                  <div className="row g-3 my-2">
                     <div className="col-6 d-flex">
                        <Formik
                           enableReinitialize={true}
                           initialValues={searchParam}
                           onSubmit={onSearchClicked}
                        >
                           <Form>
                              <label>
                                 <strong>Search an event</strong>
                              </label>
                              <div className="d-flex">
                                 <Field
                                    type="date"
                                    className="form-control-sm me-2"
                                    name="startDate"
                                 />
                                 <Field
                                    type="date"
                                    className="form-control-sm"
                                    name="endDate"
                                 />
                              </div>
                              <div className="mt-2">
                                 <button
                                 type="submit"
                                 className="btn btn-outline-dark ms-3"
                                 >
                                 
                                 Search event
                                 </button>
                                 <button
                                 type="button"
                                 className="btn btn-outline-warning ms-3"
                                 onClick={onClearClicked}
                                 >Clear</button>
                              </div>
                           </Form>
                        </Formik>
                        <form>
                           
                           
                        </form>
                     </div>
                  </div>
                  <div>
                     <Button
                        type="button"
                        className="btn btn-outline-light btn-dark shadow-sm me-1 my-3"
                        id="viewAllEvOnMap"
                        onClick={onviewAllEvOnMapClicked}
                     >
                        View All On Map
                     </Button>
                  </div>
                  <div className="row d-flex justify-content-center">
                     {pageContent.eventsComponents}
                  </div>
                  <div className="row mx-1 my-2 align-self-end">
                     <Pagination
                        onChange={onPageChange}
                        showQuickJumper
                        current={paginationCtrl.current}
                        pageSize={paginationCtrl.pageSize}
                        total={paginationCtrl.total}
                        locale={locale}
                     ></Pagination>
                  </div>
               </div>
            </div>
         </div>
         <Modal show={showFullMap} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
               <Modal.Title className="ms-3"></Modal.Title>
            </Modal.Header>
            <Modal.Body className="mx-auto">
               <EventMap arrayOfMarkers={pageContent.eventsMarkers}></EventMap>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showForm} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
               <Modal.Title className="ms-3">
                  {eventId && "Edit event"}
                  {eventId && "Add event"}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <EventForm
                  onParentAddEventError={onAddEventError}
                  onParentAddEventSuccess={onAddEventSuccess}
                  onParentEditEventSuccess={onEditEventSuccess}
                  onParentEditEventError={onEditEventError}
                  statusOpt= {props.statusOpt}
               ></EventForm>
            </Modal.Body>
            <Modal.Footer>

               <Button variant="secondary" onClick={handleClose}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>
      </LoadScript>
   );
}

export default Events;
