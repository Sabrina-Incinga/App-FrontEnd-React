import React from "react";

function FriendCard(props) {
   const onLocalDeleteClicked = (e) => {
      e.preventDefault();
      props.onParentDeleteClicked(props.friend, e);
   };

   const onLocalEditClicked = (e) => {
      e.preventDefault();
      props.onParentEditClicked(props.friend, e);
   };

   return (
      <React.Fragment>
         <div className="card m-3 shadow-sm" style={{ width: "22rem" }}>
            <img
               src={props.friend?.primaryImage?.url}
               className="card-img-top rounded-circle m-1 shadow"
               alt="friend-main-profile-pic"
            />
            <div className="card-body">
               <h4 className="card-title text-center">{props.friend?.title}</h4>
               <p className="card-text summary">{props.friend?.summary}</p>
            </div>
            <div className="col-12 text-center p-1 mb-2">
               <button
                  type="button"
                  className="btn btn-outline-danger shadow-sm delete mx-3"
                  id={"delButton-" + props.friend?.id}
                  onClick={onLocalDeleteClicked}
               >
                  Delete
               </button>
               <button
                  type="button"
                  className="btn btn-outline-info shadow-sm edit mx-3"
                  id={"editButton-" + props.friend?.id}
                  onClick={onLocalEditClicked}
               >
                  Edit
               </button>
            </div>
         </div>
      </React.Fragment>
   );
}

export default React.memo(FriendCard);
