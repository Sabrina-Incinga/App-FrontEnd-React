import React, { useState, useEffect, useCallback } from "react";
import Pagination from "rc-pagination";
import companiesService from "../../services/companiesService";
import CompanyCard from "./CompanyCard";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";

function TechCompanies() {
   const [pageContent, setPageContent] = useState({
      companiesArray: [],
      companiesComponents: [],
   });
   const [showCompanies, setShowCompanies] = useState(true);
   const [searchParam, setSearchParam] = useState({
      query: "",
   });
   const [paginationCtrl, setPaginationCtrl] = useState({
      current: 1,
      pageSize: 6,
      total: 0,
   });

   const mapCompanies = (company) => {
      return (
         <CompanyCard
            company={company}
            key={"companyCard-" + company.id}
            onParentEditClicked={onEditClicked}
            onParentShowMoreClicked={onShowMoreClicked}
            onParentCloseClicked={onCloseClicked}
         ></CompanyCard>
      );
   };

   const onCloseClicked = useCallback(() => {
      return false;
   }, []);

   const onShowMoreClicked = useCallback(() => {
      return true;
   }, []);

   const onEditClicked = useCallback((company, e) => {
      e.preventDefault();
      const stateToSend = { type: "COMPANY_EDIT", payload: company };
      navigate(
         {
            pathname: `/newCompany/${company.id}`,
         },
         { state: stateToSend }
      );
   }, []);

   const navigate = useNavigate();
   const goToPage = (e) => {
      const targetPage = e.currentTarget.dataset.page;
      navigate(targetPage);
   };

   const onShowClicked = () => {
      setShowCompanies(!showCompanies);
   };

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

   const onPageChange = (page) => {
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.current = page;
         return newPagination;
      });
   };

   const onGetCompaniesByQuerySuccess = (response) => {
      let newCompaniesArray = response.pagedItems;
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.total = response.totalCount;
         return newPagination;
      });
      setPageContent((prevState) => {
         const prevStateCopy = { ...prevState };
         prevStateCopy.companiesArray = newCompaniesArray;
         prevStateCopy.companiesComponents = newCompaniesArray.map(mapCompanies);

         return prevStateCopy;
      });
   };

   const onGetCompaniesdByQueryError = (error) => {
      toastr.warning("Company not found", "Search error");
      console.error(error);
   };

   const onSearchClicked = (e) => {
      e.preventDefault();
      setPaginationCtrl((prevState) => {
         const updatedState = { ...prevState };
         updatedState.current = 1;
         return updatedState;
      });
      companiesService
         .getByQuery(
            paginationCtrl.current - 1,
            paginationCtrl.pageSize,
            searchParam.query
         )
         .then(onGetCompaniesByQuerySuccess)
         .catch(onGetCompaniesdByQueryError);
   };

   const onGetAllCompaniesSuccess = (response) => {
      let newCompaniesArray = response.pagedItems;
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.total = response.totalCount;
         return newPagination;
      });
      setPageContent((prevState) => {
         const prevStateCopy = { ...prevState };
         prevStateCopy.companiesArray = newCompaniesArray;
         prevStateCopy.companiesComponents = newCompaniesArray.map(mapCompanies);

         return prevStateCopy;
      });
   };

   const onGetAllCompaniesError = (error) => {
      console.error(error);
   };

   useEffect(() => {
      if (!searchParam.query) {
         companiesService
            .getAllPaginated(paginationCtrl.current - 1, paginationCtrl.pageSize)
            .then(onGetAllCompaniesSuccess)
            .catch(onGetAllCompaniesError);
      } 
   }, [paginationCtrl.current, searchParam]);

   useEffect(() => {
      if (searchParam.query) {
         companiesService
            .getByQuery(
               paginationCtrl.current - 1,
               paginationCtrl.pageSize,
               searchParam.query
            )
            .then(onGetCompaniesByQuerySuccess)
            .catch(onGetCompaniesdByQueryError);
      }
   }, [paginationCtrl.current]);

   return (
      <React.Fragment>
         <div className="card containter d-flex">
            <div className="row d-flex align-items-center">
               <div className="col-1 mx-5 d-flex">
                  <h1>Companies</h1>
               </div>
               <div className="col-4 d-flex">
                  <button
                     type="button"
                     id="showAndHide"
                     className="btn btn-outline-dark"
                     onClick={onShowClicked}
                  >
                     {!showCompanies && "Show companies"}
                     {showCompanies && "Hide companies"}
                  </button>
                  <button
                     type="button"
                     id="addCompany"
                     className="btn btn-outline-dark ms-3"
                     data-page="/newCompany"
                     onClick={goToPage}
                  >
                     Add new company
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
                              id="searchCompany"
                              className="btn btn-outline-dark ms-3"
                              onClick={onSearchClicked}
                           >
                              Search company
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
               {showCompanies && pageContent.companiesComponents}
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

export default TechCompanies;
