import React, { useState, useEffect } from "react";
import toastr from "toastr";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { TextField, FormControl, InputLabel, Select, MenuItem, Fab  } from "@material-ui/core";
import  { Formik, Form, FieldArray } from "formik";
import AddIcon from '@material-ui/icons/Add'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import friendsService from "../../services/friendsService";
import * as Yup from "yup";

function FriendForm(props) {
   const [formData, setFormData] = useState({
      title: "",
      headline: "",
      bio: "",
      summary: "",
      statusId: "",
      slug: "",
      skills: [],
      imageTypeId: "",
      imageUrl: "",
   });

   const { state } = useLocation();

   const { friendId } = useParams();

   const validationSchema = Yup.object().shape({
      title: Yup.string().min(2).max(120).required("This field is required"),
      headline: Yup.string().min(2).max(80).required("This field is required"),
      bio: Yup.string().min(2).max(700).required("This field is required"),
      summary: Yup.string().min(2).max(255).required("This field is required"),
      slug: Yup.string().min(2).max(100).required("This field is required"),
      statusId: Yup.number().required("This field is required"),
      imageTypeId: Yup.number().required("This field is required"),
      imageUrl: Yup.string().required("This field is required"),
      skills: Yup.array().of(
         Yup.string()
      ),
   })

   const mapOptions = option => {
      return (<MenuItem value={option.id} key={`statusOp_${option.id}`}>{option.name}</MenuItem>)
     }


   const navigate = useNavigate();
   const goToPage = (id) => {
      navigate({
         pathname: `/newFriend/${id}`,
      });
   };

   const onAddFriendSuccess = (response) => {
      goToPage(response.id);
      toastr.success(
         "You have succesfully added a new friend",
         "Friend registration success"
      );
   };

   const onAddFriendError = (error) => {
      toastr.error("Friend could not be added", "Friend registration error");
      console.error(error);
   };

   const onUpdateFriendSuccess = (response) => {
      toastr.success(
         "You have succesfully updated this friend",
         "Friend update success"
      );
      console.log(response);
   };

   const onUpdateFriendError = (error) => {
      toastr.error("Friend could not be updated", "Friend update error");
      console.error(error);
   };

   const onSubmitClicked = (values) => {
      if (friendId) {
         friendsService
            .updateFriend(friendId, values)
            .then(onUpdateFriendSuccess)
            .catch(onUpdateFriendError);
      } else {
         friendsService
            .addFriend(values)
            .then(onAddFriendSuccess)
            .catch(onAddFriendError);
      }
   };

   useEffect(() => {
      if (state?.type === "FRIEND_EDIT" && state.payload) {
         setFormData((prevState) => {
            const newState = { ...prevState, ...state.payload };
            newState.imageUrl = state.payload.primaryImage?.url;
            newState.imageTypeId = state.payload.primaryImage?.typeId;
            newState.skills = state.payload.skills?.map(skill => skill.name);

            return newState;
         });
      }
   }, [friendId, state]);

   /*    
   import {
   useParams,
   createSearchParams,
   useSearchParams, 
} from "react-router-dom";

   const onGetFriendByIdSuccess = (response) => {
      setFormData((prevState) => {
         const friendToUpdate = {
            ...prevState,
         };
         friendToUpdate.id = response.id;
         friendToUpdate.bio = response.bio;
         friendToUpdate.summary = response.summary;
         friendToUpdate.headline = response.headline;
         friendToUpdate.skills = response.skills;
         friendToUpdate.primaryImage = response.primaryImage.imageUrl;
         friendToUpdate.title = response.title;
         friendToUpdate.statusId = response.statusId;
         friendToUpdate.slug = response.slug;

         return friendToUpdate;
      });
   };

   const onGetFriendByIdError = (error) => {
      console.error(error);
   }; 
   
   const [searchParams] = useSearchParams() --> this hook returns two parameters imitating the behavior of useState() hook, which for this case is unnecesary since we're not manipulating the id that's beeing passed.
   console.log(searchParams.get("friendId"), state);

      const goToPage = (id) => {
      //const param = { friendId: id };
      navigate({
         pathname: `/newFriend/${id}`,
         search: `?${createSearchParams(param)}`, 
      });
   };

      const onFormFieldChange = (event) => {
      const target = event.target;

      const newUserValue = target.value;

      const nameOfField = target.name;

      setFormData((prevState) => {
         const updatedFormData = {
            ...prevState,
         };

         if (nameOfField === "skills") {
            const skillArray = newUserValue.split(",").map((skill) => skill.trim());
            updatedFormData.skills = skillArray;
         } else {
            updatedFormData[nameOfField] = newUserValue;
         }

         return updatedFormData;
      });
   };
   */

   return (
      <React.Fragment>
         <div className="containter d-flex flex-column">
            <div
               className="card m-3 shadow w-75  align-self-center"
               style={{ minHeight: "85vh" }}
            >
               <div className="row ms-5">
                  <div className="col ms-5">
                     {!friendId && <h1>Add new friend</h1>}
                     {friendId && <h1>Edit a friend</h1>}
                  </div>
                  <div className="row d-flex justify-content-center">
                     <div className="col-5">
                     <Formik
                           enableReinitialize={true}
                           initialValues={formData}
                           onSubmit={onSubmitClicked}
                           validationSchema={validationSchema}
                        >
                           {({values, handleChange, touched, errors}) =>
                        (<Form>
                           {friendId && (
                              <div className="mb-3">
                                 <label htmlFor="idInput" className="form-label">
                                    Friend Id : {friendId}
                                 </label>
                              </div>
                           )}
                           <div className="mb-3">
                           <TextField
                                 fullWidth
                                 name="title"
                                 label="First Name"
                                 classtitle="form-control"
                                 id="title"
                                 value={values.title}
                                 onChange={handleChange}
                                 error={touched.title && Boolean(errors.title)}
                                 helperText={touched.title && errors.title}
                              />
                           </div>
                           <div className="mb-3">
                              <TextField
                                 fullWidth
                                 name="headline"
                                 label="Last Name"
                                 className="form-control"
                                 id="headline"
                                 value={values.headline}
                                 onChange={handleChange}
                                 error={touched.headline && Boolean(errors.headline)}
                                 helperText={touched.headline && errors.headline}
                              />
                           </div>
                           <div className="mb-3">
                           <TextField
                                 fullWidth
                                 name="bio"
                                 label="Biography"
                                 className="form-control"
                                 id="bio"
                                 value={values.bio}
                                 onChange={handleChange}
                                 error={touched.bio && Boolean(errors.bio)}
                                 helperText={touched.bio && errors.bio}
                              />
                           </div>
                           <div className="mb-3">
                           <TextField
                                 fullWidth
                                 name="summary"
                                 label="Summary"
                                 className="form-control"
                                 id="summary"
                                 value={values.summary}
                                 onChange={handleChange}
                                 error={touched.summary && Boolean(errors.summary)}
                                 helperText={touched.summary && errors.summary}
                              />
                           </div>
                           <div className="mb-3">
                              <TextField
                                 fullWidth
                                 name="slug"
                                 label="Slug"
                                 className="form-control"
                                 id="slug"
                                 value={values.slug}
                                 onChange={handleChange}
                                 error={touched.slug && Boolean(errors.slug)}
                                 helperText={touched.slug && errors.slug}
                              />
                           </div>
                           <div className="mb-3">
                           <FieldArray name="skills">
                            {({push, remove}) => (
                                 <div>
                                    <label className="me-2">Add skill</label>
                                    <Fab size="small" color="primary" aria-label="add" >
                                       <AddIcon  onClick={() => push("")}/>
                                    </Fab>
                                    {values.skills && values.skills?.map((skill, index) => (
                                       <div>
                                       <div className="row mb-3">
                                          <div className="col-12">
                                          <TextField
                                                fullWidth
                                                name={`skills.${index}`}
                                                label="Important skills"
                                                className="form-control"
                                                id="skills"
                                                value={skill}
                                                onChange={handleChange}
                                                error={touched.skills && Boolean(errors.skills)}
                                                helperText={touched.skills?.[index] && errors.skills}
                                             />
                                          </div>
                                       </div>
                                       <Fab size="small" color="secondary" aria-label="add" >
                                          <HighlightOffIcon  onClick={() => remove(index)}/>
                                       </Fab>
                                       </div>
                                       
                                    ))}
                                 </div>
                              )}
                            </FieldArray>
                           </div>
                           <div className="mb-3">
                              <TextField
                                 fullWidth
                                 name="imageTypeId"
                                 label="Image Type Id"
                                 className="form-control"
                                 id="imageTypeId"
                                 value={values.imageTypeId}
                                 onChange={handleChange}
                                 error={touched.imageTypeId && Boolean(errors.imageTypeId)}
                                 helperText={touched.imageTypeId && errors.imageTypeId}
                              />
                           </div>
                           <div className="mb-3">
                              <TextField
                                 fullWidth
                                 name="imageUrl"
                                 label="Profile Image Url"
                                 className="form-control"
                                 id="imageUrl"
                                 value={values.imageUrl}
                                 onChange={handleChange}
                                 error={touched.imageUrl && Boolean(errors.imageUrl)}
                                 helperText={touched.imageUrl && errors.imageUrl}
                              />
                           </div>
                           <div className="mb-3">
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Status</InputLabel>
                              <Select
                                 name="statusId"
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 value={values.statusId}
                                 onChange={handleChange}
                                 error={touched.statusId && Boolean(errors.statusId)}
                                 helperText={touched.statusId && errors.statusId}
                              >
                                 {props.statusOpt?.map(mapOptions)}
                              </Select>
                           </FormControl>
                           </div>
                           <button
                              type="submit"
                              id="submit"
                              className="btn btn-outline-dark my-3"
                           >
                              Submit
                           </button>
                        </Form>)}
                     </Formik>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
}

export default FriendForm;
