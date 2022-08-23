import React, { useState, useEffect, useCallback } from "react";
import FriendCard from "./FriendCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import swal from "@sweetalert/with-react";
import friendsService from "../../services/friendsService";

function Friends() {
   const [pageContent, setPageContent] = useState({
      friendsArray: [],
      friendsComponents: [],
   });
   const [showFriends, setShowFriends] = useState(true);
   const [searchParam, setSearchParam] = useState({
      query: "",
   });
   const [paginationCtrl, setPaginationCtrl] = useState({
      current: 1,
      pageSize: 6,
      total: 0,
   });

   const onPageChange = (page) => {
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.current = page;
         return newPagination;
      });
   };

   const mapFriends = (friend) => {
      return (
         <FriendCard
            friend={friend}
            key={"friendCard-" + friend.id}
            onParentDeleteClicked={onDeleteClicked}
            onParentEditClicked={onEditClicked}
         ></FriendCard>
      );
   };

   const onEditClicked = useCallback((friend, e) => {
      e.preventDefault();
      const stateToSend = { type: "FRIEND_EDIT", payload: friend };
      navigate(
         {
            pathname: `/newFriend/${friend.id}`,
         },
         { state: stateToSend }
      );
   }, []);

   const onDeleteClicked = useCallback((friend, e) => {
      e.preventDefault();

      swal({
         title: "Are you sure?",
         text: "Once deleted, you will not be able to recover this friend!",
         icon: "warning",
         buttons: true,
         dangerMode: true,
      }).then((willDelete) => {
         if (willDelete) {
            const successHandler = getDeleteSuccessHandler(friend.id);
            friendsService
               .deleteById(friend.id)
               .then(successHandler)
               .catch(onDeleteError);

            swal("Done! Your friend has been deleted!", {
               icon: "success",
            });
         } else {
            swal("Your friend is safe!");
         }
      });
   }, []);

   const getDeleteSuccessHandler = (idToDelete) => {
      return () => {
         toastr.success("You have succesfully deleted this friend", "Delete success");
         setPageContent((prevState) => {
            const newState = { ...prevState };
            newState.friendsArray = [...prevState.friendsArray];

            const indexElemToDelete = newState.friendsArray.findIndex((friend) => {
               let result = false;

               if (friend.id === idToDelete) {
                  result = true;
               }

               return result;
            });

            if (indexElemToDelete >= 0) {
               newState.friendsArray.splice(indexElemToDelete, 1);
               newState.friendsComponents = newState.friendsArray.map(mapFriends);
            }
            return newState;
         });
      };
   };

   const onDeleteError = (error) => {
      toastr.error("This friend could not be deleted", "Delete error");
      console.error(error);
   };

   const onGetAllFriendsSuccess = (response) => {
      let newFriendsArray = response.pagedItems;
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.total = response.totalCount;
         return newPagination;
      });
      setPageContent((prevState) => {
         const prevStateCopy = { ...prevState };
         prevStateCopy.friendsArray = newFriendsArray;
         prevStateCopy.friendsComponents = newFriendsArray.map(mapFriends);
         return prevStateCopy;
      });
   };

   const onGetAllFriendError = (error) => {
      console.error(error);
   };

   const onShowClicked = () => {
      setShowFriends(!showFriends);
   };

   const onGetFriendByQuerySuccess = (response) => {
      let newFriendsArray = response.pagedItems;
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.total = response.totalCount;
         return newPagination;
      });
      setPageContent((prevState) => {
         const prevStateCopy = { ...prevState };
         prevStateCopy.friendsArray = newFriendsArray;
         prevStateCopy.friendsComponents = newFriendsArray.map(mapFriends);
         return prevStateCopy;
      });
   };

   const onGetFriendByQueryError = (error) => {
      toastr.warning("Friend not found", "Search error");
      console.error(error);
   };

   const onSearchClicked = (e) => {
      e.preventDefault();
      setPaginationCtrl((prevState) => {
         const newPagination = { ...prevState };
         newPagination.current = 1;
         return newPagination;
      });
      friendsService
         .getByQuery(paginationCtrl.current - 1, paginationCtrl.pageSize, searchParam.query)
         .then(onGetFriendByQuerySuccess)
         .catch(onGetFriendByQueryError);
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

   useEffect(() => {
      if (!searchParam.query) {
         friendsService
            .getAllPaginated(paginationCtrl.current - 1, paginationCtrl.pageSize)
            .then(onGetAllFriendsSuccess)
            .catch(onGetAllFriendError);
      }
   }, [paginationCtrl.current, searchParam]);

   useEffect(() => {
      if(searchParam.query){
         friendsService
         .getByQuery(paginationCtrl.current - 1, paginationCtrl.pageSize, searchParam.query)
         .then(onGetFriendByQuerySuccess)
         .catch(onGetFriendByQueryError);
      }
   }, [paginationCtrl.current])

   const navigate = useNavigate();
   const goToPage = (e) => {
      const targetPage = e.currentTarget.dataset.page;
      navigate(targetPage);
   };

   /* 
   import {  createSearchParams } from "react-router-dom";
      const onEditClicked = useCallback((friend, e) => {
      e.preventDefault();
      //const param = { friendId: friend.id };
      const stateToSend = { type: "FRIEND_EDIT", payload: friend };
      navigate(
         {
            pathname: `/newFriend/${friend.id}`,
            search: `?${createSearchParams(param)}` 
         },
         { state: stateToSend }
      );
   }, []);
   
      const onShowClicked = () => {
      setShowFriends(!showFriends);
      // setPageContent((prevState) => {
      //    const newState = { ...prevState };

      //    newState.showFriends = !prevState.showFriends;

      //    return newState;
      // });
   };*/

   return (
      <React.Fragment>
         <div className="card containter d-flex">
            <div className="row d-flex align-items-center">
               <div className="col-1 ms-5 d-flex">
                  <h1>Friends</h1>
               </div>
               <div className="col-4 d-flex ">
                  <button
                     type="button"
                     id="showAndHide"
                     className="btn btn-outline-dark"
                     onClick={onShowClicked}
                  >
                     {!showFriends && "Show friends"}
                     {showFriends && "Hide friends"}
                  </button>
                  <button
                     type="button"
                     id="addFriend"
                     className="btn btn-outline-dark ms-3"
                     data-page="/newFriend"
                     onClick={goToPage}
                  >
                     Add new friend
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
                              id="searchFriend"
                              className="btn btn-outline-dark ms-3"
                              onClick={onSearchClicked}
                           >
                              Search friend
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
               {showFriends && pageContent.friendsComponents}
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

export default Friends;
