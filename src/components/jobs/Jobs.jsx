import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import jobsService from "../../services/jobsService";
import JobCard from "./JobCard";
import toastr from "toastr";

function Jobs() {
   const [pageContent, setPageContent] = useState({
      jobsArray: [],
      jobsComponents: [],
   });
   const [showJobs, setShowJobs] = useState(true);
   const [searchParam, setSearchParam] = useState({
      query: "",
   });
   const [paginationCtrl, setPaginationCtrl] = useState({
      current: 1,
      pageSize: 6,
      total: 0,
   });

   const mapJobs = (job) => {
      return (
         <JobCard
            job={job}
            key={"jobCard-" + job.id}
            onParentEditClicked={onEditClicked}
            onParentShowMoreClicked={onShowMoreClicked}
            onParentCloseClicked={onCloseClicked}
         ></JobCard>
      );
   };

   const onPageChange = (page) => {
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.current = page;
         return newPagination;
      });
   };

   const onEditClicked = useCallback((job, e) => {
      e.preventDefault();
      const stateToSend = { type: "JOB_EDIT", payload: job };
      navigate(
         {
            pathname: `/newJob/${job.id}`,
         },
         { state: stateToSend }
      );
   }, []);

   const onCloseClicked = useCallback(() => {
      return false;
   }, []);

   const onShowMoreClicked = useCallback(() => {
      return true;
   }, []);

   const onFormFieldChange = (event) => {
      const target = event.target;

      const newUserValue = target.value;

      const nameOfField = target.name;

      setSearchParam((prevState) => {
         const updatedFormData = {
            ...prevState,
         };
         updatedFormData[nameOfField] = newUserValue;

         return updatedFormData;
      });
   };

   const onShowClicked = () => {
      setShowJobs(!showJobs);
   };

   const navigate = useNavigate();
   const goToPage = (e) => {
      const targetPage = e.currentTarget.dataset.page;
      navigate(targetPage);
   };

   const onGetJobsByQuerySuccess = (response) => {
      let newJobsArray = response.pagedItems;
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.total = response.totalCount;
         return newPagination;
      });
      setPageContent((prevState) => {
         const prevStateCopy = { ...prevState };
         prevStateCopy.jobsArray = newJobsArray;
         prevStateCopy.jobsComponents = newJobsArray.map(mapJobs);

         return prevStateCopy;
      });
   };

   const onGetJobsdByQueryError = (error) => {
      toastr.warning("Job not found", "Search error");
      console.error(error);
   };

   const onSearchClicked = (e) => {
      e.preventDefault();
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.current = 1;
         return newPagination;
      });
      jobsService
         .getByQuery(paginationCtrl.current - 1, paginationCtrl.pageSize, searchParam.query)
         .then(onGetJobsByQuerySuccess)
         .catch(onGetJobsdByQueryError);
   };

   const onGetAllJobsSuccess = (response) => {
      let newJobsArray = response.pagedItems;
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState }; 
         newPagination.total = response.totalCount;
         return newPagination;
      });
      setPageContent((prevState) => {
         const prevStateCopy = { ...prevState };
         prevStateCopy.jobsArray = newJobsArray;
         prevStateCopy.jobsComponents = newJobsArray.map(mapJobs);

         return prevStateCopy;
      });
   };

   const onGetAllJobsError = (error) => {
      console.error(error);
   };

   useEffect(() => {
      if (!searchParam.query) {
         jobsService
            .getAll(paginationCtrl.current - 1, paginationCtrl.pageSize)
            .then(onGetAllJobsSuccess)
            .catch(onGetAllJobsError);
      }
   }, [paginationCtrl.current, searchParam]);

   useEffect(() => {
      if(searchParam.query){
         jobsService
         .getByQuery(paginationCtrl.current - 1, paginationCtrl.pageSize, searchParam.query)
         .then(onGetJobsByQuerySuccess)
         .catch(onGetJobsdByQueryError);
      }
   }, [paginationCtrl.current])

   return (
      <React.Fragment>
         <div className="card containter d-flex">
            <div className="row d-flex align-items-center">
               <div className="col-1 ms-5 d-flex">
                  <h1>Jobs</h1>
               </div>
               <div className="col-4 d-flex ">
                  <button
                     type="button"
                     id="showAndHide"
                     className="btn btn-outline-dark"
                     onClick={onShowClicked}
                  >
                     {!showJobs && "Show jobs"}
                     {showJobs && "Hide jobs"}
                  </button>
                  <button
                     type="button"
                     id="addJob"
                     className="btn btn-outline-dark ms-3"
                     data-page="/newJob"
                     onClick={goToPage}
                  >
                     Add new job
                  </button>
               </div>
               <div className="col">
                  <div className="row g-3 d-flex flex-column align-items-end">
                     <div className="col-5 d-flex">
                        <form>
                           <input
                              type="text"
                              className="form-control-sm"
                              placeholder="Search"
                              name="query"
                              value={searchParam.query}
                              onChange={onFormFieldChange}
                           />
                           <button
                              type="submit"
                              id="searchJob"
                              className="btn btn-outline-dark ms-3"
                              onClick={onSearchClicked}
                           >
                              Search job
                           </button>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
            <div className="row ms-5 my-2">
               <Pagination
                  onChange={onPageChange}
                  showQuickJumper
                  current={paginationCtrl.current}
                  pageSize={paginationCtrl.pageSize}
                  total={paginationCtrl.total}
                  locale={locale}
               ></Pagination>
            </div>
            <div className="row d-flex justify-content-center shadow w-75 align-self-center bg-shadow ">
               {showJobs && pageContent.jobsComponents}
            </div>
            <div className="row me-5 my-2 align-self-end">
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
      </React.Fragment>
   );
}

export default Jobs;
