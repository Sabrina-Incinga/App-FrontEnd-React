import React, { useState } from "react";
import emailService from "../../services/emailService";
import toastr from "toastr";

function ContactForm() {
   const defaultEmailDataValue = {
      to: [],
      bcc: "",
      body: "",
      name: "",
   };
   const [emailFormData, setEmailFormData] = useState(defaultEmailDataValue);

   const onEmailFormFieldChange = (event) => {
      const target = event.target;

      const newUserValue = target.value;

      const nameOfField = target.name;

      setEmailFormData((prevState) => {
         const updatedSearchFormData = {
            ...prevState,
         };

         if (nameOfField === "to") {
            const emailArray = newUserValue.split(",").map((email) => email.trim());
            updatedSearchFormData.to = emailArray;
         } else {
            updatedSearchFormData[nameOfField] = newUserValue;
         }
         return updatedSearchFormData;
      });
   };

   const onEmailSentSuccess = () => {
      toastr.success(
         "We will contact you as soon as possible, thanks for contacting us!",
         "Email sent"
      );
   };

   const onEmailSentError = (error) => {
      toastr.error("We couldn't send your email", "Email send error");
      console.error(error);
   };

   const onSubmitClicked = (e) => {
      e.preventDefault();
      if (emailFormData.body.length < 10) {
         toastr.warning(
            "The content of your email should have at least 10 characters",
            "Couldn't sent email"
         );
      } else if (!(emailFormData.to && emailFormData.name && emailFormData.bcc)) {
         toastr.warning(
            "The recipient, name and sender fields should not be empty",
            "Couldn't sent email"
         );
      } else {
         emailService
            .add(emailFormData)
            .then(onEmailSentSuccess)
            .catch(onEmailSentError);
      }
   };

   /* const onSetRecipientClicked = () => {
      setEmailFormData((prevState) => {
         const updatedSearchFormData = {
            ...prevState,
         };

         updatedSearchFormData.to = [];

         return updatedSearchFormData;
      });
   }; */
   return (
      <React.Fragment>
         <div className="containter d-flex flex-column">
            <div
               className="card m-3 shadow w-75  align-self-center bg-shadow"
               style={{ minHeight: "85vh" }}
            >
               <div className="row ms-5 ">
                  <div className="col ms-5">
                     <h1>Send us your thoughts</h1>
                  </div>
                  <div className="row d-flex justify-content-center my-5">
                     <div className="col-5 shadow card">
                        <form>
                           <div className="mb-3">
                              <label htmlFor="toInput" className="form-label">
                                 Recipient
                              </label>

                              <input
                                 name="to"
                                 type="email"
                                 className="form-control"
                                 id="toInput"
                                 placeholder="Enter recipients email addresses separated by a coma"
                                 value={emailFormData.to}
                                 onChange={onEmailFormFieldChange}
                              />

                              {/* {emailFormData.to.length > 0 && (
                                 <button
                                    type="button"
                                    className="btn btn-outline-secondary my-3 ms-3"
                                    onClick={onSetRecipientClicked}
                                 >
                                    Set recipient email
                                 </button>
                              )} */}
                           </div>

                           <div className="mb-3">
                              <label htmlFor="bccInput" className="form-label">
                                 Sender
                              </label>
                              <input
                                 name="bcc"
                                 type="email"
                                 className="form-control"
                                 id="bccInput"
                                 placeholder="Enter a contact email"
                                 value={emailFormData.bcc}
                                 onChange={onEmailFormFieldChange}
                              />
                           </div>
                           <div className="mb-3">
                              <label htmlFor="bodyInput" className="form-label">
                                 Content
                              </label>
                              <textarea
                                 name="body"
                                 rows={5}
                                 cols={5}
                                 className="form-control"
                                 id="bodyInput"
                                 placeholder="Write your email here"
                                 value={emailFormData.body}
                                 onChange={onEmailFormFieldChange}
                              />
                           </div>
                           <div className="mb-3">
                              <label htmlFor="nameInput" className="form-label">
                                 Name
                              </label>
                              <input
                                 name="name"
                                 type="text"
                                 className="form-control"
                                 id="nameInput"
                                 placeholder="Enter your name"
                                 value={emailFormData.name}
                                 onChange={onEmailFormFieldChange}
                              />
                           </div>
                           <button
                              type="submit"
                              id="submit"
                              className="btn btn-outline-dark my-3"
                              onClick={onSubmitClicked}
                           >
                              Submit
                           </button>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
}

export default ContactForm;
