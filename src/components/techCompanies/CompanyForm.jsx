import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toastr from "toastr";
import friendsService from "../../services/friendsService";
import companiesService from "../../services/companiesService";
import  { Formik, Form, FieldArray } from "formik";
import { TextField, FormControl, InputLabel, Select, MenuItem, Fab  } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import * as Yup from "yup";

function CompanyForm(props) {
   const [formData, setFormData] = useState({
      name: "",
      profile: "",
      summary: "",
      headline: "",
      contactInformation: "",
      slug: "",
      statusId: "",
      images: [],
      urls: [],
      tags: [],
      friendIds: [],
   });
   const [friendsArray, setFriendsArray] = useState([]);
   const { companyId } = useParams();
   const { state } = useLocation();

   const validationSchema = Yup.object().shape({
      name: Yup.string().min(2).max(120).required("This field is required"),
      headline: Yup.string().min(2).max(120).required("This field is required"),
      profile: Yup.string().min(2).required("This field is required"),
      summary: Yup.string().min(2).max(255).required("This field is required"),
      slug: Yup.string().min(2).max(100).required("This field is required"),
      statusId: Yup.string().min(2).max(10).required("This field is required"),
      contactInformation: Yup.string().min(2).max(1000).required("This field is required"),
      images: Yup.array().of(Yup.object().shape({
         entityTypeId: Yup.number().required("This field is required"),
         imageUrl: Yup.string().min(2).max(255).required("This field is required"), 
      })),
      urls: Yup.array().of(
         Yup.string()
      ),
      friendIds: Yup.array().of(
         Yup.number()
      )
   })

   const imageTypes = [
      {
         id:1,
         name: "SEO",
      },
      {
         id:2,
         name: "Cover",
      },
      {
         id:3,
         name: "Main",
      },
      {
         id:4,
         name: "Other",
      },
      {
         id:5,
         name: "Logo",
      },
   ]

   const mapImageTypes = option => {
      return (<MenuItem value={option.id} key={`statusOp_${option.id}`}>{option.name}</MenuItem>)
     }

   const mapOptions = option => {
     return (<MenuItem value={option.name} key={`statusOp_${option.id}`}>{option.name}</MenuItem>)
    }

    const mapFriends = friend => {
      return (<MenuItem value={friend.id} key={`statusOp_${friend.id}`}>{friend.title}</MenuItem>)
     }

   const navigate = useNavigate();
   const goToPage = (id) => {
      navigate({
         pathname: `/newCompany/${id}`,
      });
   };

   const onAddCompanySuccess = (response) => {
      goToPage(response);
      toastr.success(
         "You have succesfully added a new company",
         "Company registration success"
      );
   };

   const onAddCompanyError = (error) => {
      toastr.error("Company could not be added", "Company registration error");
      console.error(error);
   };

   const onUpdateCompanySuccess = (response) => {
      toastr.success(
         "You have succesfully updated this company",
         "Company update success"
      );
      console.log(response);
   };

   const onUpdateCompanyError = (error) => {
      toastr.error("Company could not be updated", "Company update error");
      console.error(error);
   };

   const onGetAllFriendsSuccess = (response) => {
      setFriendsArray(() => {
         return response;
      })
   }

   const onGetAllFriendsError = (error) => {
      console.error(error);
   }

   const onSubmitClicked = (values) => {
      if (companyId) {
         companiesService
            .update(companyId, values)
            .then(onUpdateCompanySuccess)
            .catch(onUpdateCompanyError);
      } else {
         companiesService
            .add(values)
            .then(onAddCompanySuccess)
            .catch(onAddCompanyError);
      }
   };

   useEffect(() => {
      if (state?.type === "COMPANY_EDIT" && state.payload) {
         setFormData((prevState) => {
            const newForm = { ...prevState, ...state.payload };
            newForm.contactInformation = state.payload.contactInformation;
            newForm.urls = state.payload.urls?.map((url) => url.url);
            newForm.tags = state.payload.tags?.map((tag) => tag.tagName);
            newForm.friendIds = state.payload.friends?.map((friend) => friend.id);
            newForm.images = state.payload.images?.map((image) => {
               return { entityTypeId: image.entityTypeId, imageUrl: image.imageUrl };
            });

            return newForm;
         });     
      }
   }, [companyId, state]);

   useEffect(() => {
      friendsService
         .getAll()
         .then(onGetAllFriendsSuccess)
         .catch(onGetAllFriendsError)
   }, []);

   /* 
   const [formImageValues, setFormImageValues] = useState([]);
   {formImageValues?.map(mapformImageValues)}
      <button
         type="button"
         id="addImg"
         className="btn btn-sm btn-outline-secondary"
         onClick={addFormFields}
      >
         Add image
      </button> 
const onImageFieldsChange = (event, index) => {
      const target = event.target;
      const nameOfField = target.name;
      const newUserValue = target.value;

      const updatedImageFormData = [...formImageValues];

      updatedImageFormData[index][nameOfField] = newUserValue;

      setFormImageValues(updatedImageFormData);
      setFormData((prevState) => {
         const updatedState = { ...prevState };
         updatedState.images = updatedImageFormData;
         return updatedState;
      });
   }; 
const onFormFieldChange = (event) => {
      const target = event.target;
      const nameOfField = target.name;
      const newUserValue = target.value;

      setFormData((prevState) => {
         const updatedFormData = {
            ...prevState,
         };

         if (nameOfField === "urls") {
            const urlsArray = newUserValue.split(",").map((url) => url.trim());
            updatedFormData.urls = urlsArray;
         } else if (nameOfField === "tags") {
            const tagsArray = newUserValue.split(",").map((tag) => tag.trim());
            updatedFormData.tags = tagsArray;
         } else if (nameOfField === "friendIds") {
            const friendIdsArray = Array.from(newUserValue.split(","), Number);
            updatedFormData.friendIds = friendIdsArray;
         } else {
            updatedFormData[nameOfField] = newUserValue;
         }
         updatedFormData.images = formImageValues;

         return updatedFormData;
      });
   };

const addFormFields = () => {
      setFormImageValues((prevState) => {
         const newState = [...prevState, { entityTypeId: "", imageUrl: "" }];

         return newState;
      });
   };

   const removeFields = (index) => {
      const updatedImageFormData = [...formImageValues];
      updatedImageFormData.splice(index, 1);
      setFormImageValues(updatedImageFormData);
      setFormData((prevState) => {
         const updatedState = { ...prevState };
         updatedState.images = updatedImageFormData;
         return updatedState;
      });
   }; 
   
const mapformImageValues = (element, index) => {
      return (
         <div className="row" key={"imgInput" + index}>
            <div className="mb-3 col" key={"companyImage-" + index}>
            <TextField
               fullWidth
               name="imageUrl"
               label="Images"
               className="form-control"
               id="imageUrl"
               value={element.imageUrl}

            />
               <label htmlFor="imagesInput" className="form-label">
                  Images
               </label>
               <input
                  key={"companyImageInput-" + index}
                  name="imageUrl"
                  type="url"
                  className="form-control mb-3"
                  placeholder="Add images url"
                  value={element.imageUrl}
                  onChange={(event) => onImageFieldsChange(event, index)}
               />
               <label htmlFor="imageTypeInput" className="form-label">
                  Image type
               </label>
               <select
                  key={"companyImageType-" + index}
                  name="entityTypeId"
                  className="form-select"
                  aria-label="Default select example"
                  value={element.entityTypeId}
                  onChange={(event) => onImageFieldsChange(event, index)}
               >
                  <option defaultValue>Select an image type</option>
                  <option value={1}>SEO</option>
                  <option value={2}>Cover</option>
                  <option value={3}>Main</option>
                  <option value={4}>Other</option>
                  <option value={5}>Logo</option>
               </select>
            </div>
            <div className="col-1 my-auto">
               <button
                  className="mt-1 btn btn-outline-danger btn-sm"
                  onClick={() => removeFields(index)}
               >
                  Remove
               </button>
            </div>
         </div>
      );
   }; */

   /* setFormImageValues(() => {
            return state.payload.images?.map((image) => {
               return { entityTypeId: image.entityTypeId, imageUrl: image.imageUrl };
            });
         }); */
   return (
      <React.Fragment>
         <div className="containter d-flex flex-column">
            <div
               className="card m-3 shadow w-75  align-self-center"
               style={{ minHeight: "85vh" }}
            >
               <div className="row ms-5">
                  <div className="col ms-5">
                     {!companyId && <h1>Add new company</h1>}
                     {companyId && <h1>Edit a company</h1>}
                  </div>
                  <div className="row d-flex justify-content-center">
                     <div className="col-5">
                        <Formik
                           enableReinitialize={true}
                           initialValues={formData}
                           onSubmit={onSubmitClicked}
                           validationSchema={validationSchema}
                        >
                           {({values, handleChange, touched, errors}) => (<Form>
                           {companyId && (
                              <div className="mb-3">
                                 <label htmlFor="idInput" className="form-label">
                                    Company Id : {companyId}
                                 </label>
                              </div>
                           )}
                           <div className="mb-3">
                              <TextField
                                 fullWidth
                                 name="name"
                                 label="Company name"
                                 className="form-control"
                                 id="name"
                                 value={values.name}
                                 onChange={handleChange}
                                 error={touched.name && Boolean(errors.name)}
                                 helperText={touched.name && errors.name}
                              />
                           </div>

                           <div className="mb-3">
                              <TextField
                                 fullWidth
                                 name="profile"
                                 label="Profile"
                                 className="form-control"
                                 id="profile"
                                 value={values.profile}
                                 onChange={handleChange}
                                 error={touched.profile && Boolean(errors.profile)}
                                 helperText={touched.profile && errors.profile}
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
                                 name="headline"
                                 label="Headline"
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
                            <FieldArray name="urls">
                            {({push, remove}) => (
                                 <div>
                                    <label className="me-2">Add url</label>
                                    <Fab size="small" color="primary" aria-label="add" >
                                       <AddIcon  onClick={() => push("")}/>
                                    </Fab>
                                    {values.urls && values.urls?.map((url, index) => (
                                       <div key={`urls.${index}`}>
                                       <div className="row mb-3">
                                          <div className="col-12">
                                          <TextField
                                                fullWidth

                                                name={`urls.${index}`}
                                                label="Important urls"
                                                className="form-control"
                                                id="urls"
                                                value={url}
                                                onChange={handleChange}
                                                error={touched.urls && Boolean(errors.urls)}
                                                helperText={touched.urls?.[index] && errors.urls}
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
                           <FieldArray name="friendIds">
                            {({push, remove}) => (
                                 <div>
                                    <label className="me-2">Add a friend Id</label>
                                    <Fab size="small" color="primary" aria-label="add" >
                                       <AddIcon  onClick={() => push("")}/>
                                    </Fab>
                                    {values.friendIds && values.friendIds?.map((friendId, index) => (
                                       <div key={`friendIds.${index}`}>
                                       <div className="row mb-3">
                                          <div className="col-12">
                                          <FormControl fullWidth>
                                             <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                             <Select
                                                name={`friendIds.${index}`}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={friendId}
                                                onChange={handleChange}
                                                error={touched.friendId && Boolean(errors.friendId)}
                                                helperText={touched.friendId && errors.friendId}
                                             >
                                                {friendsArray.map(mapFriends)}
                                             </Select>
                                          </FormControl>
                                          </div>
                                       </div>
                                       <Fab size="small" color="secondary" aria-label="add"  key={`remove-friendIds.${index}`}>
                                          <HighlightOffIcon  onClick={() => remove(index)}/>
                                       </Fab>
                                       </div>
                                    ))}
                                 </div>
                              )}
                            </FieldArray>
                              
                           </div>
                           <div className="mb-3">
                           <FieldArray name="tags">
                            {({push, remove}) => (
                                 <div>
                                    <label className="me-2">Add a tag</label>
                                    <Fab size="small" color="primary" aria-label="add" >
                                       <AddIcon  onClick={() => push("")}/>
                                    </Fab>
                                    {values.tags && values.tags?.map((tag, index) => (
                                       <div key={`tags.${index}`}>
                                       <div className="row mb-3">
                                          <div className="col-12">
                                          <TextField
                                             fullWidth
                                             name={`tags.${index}`}
                                             label="Tags"
                                             className="form-control"
                                             id="tags"
                                             value={tag}
                                             onChange={handleChange}
                                             error={touched.tags && Boolean(errors.tags)}
                                             helperText={touched.tags && errors.tags}
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
                           <FieldArray name="images">
                              {({push, remove}) => (
                                 <div>
                                    <label className="me-2">Add image</label>
                                    <Fab size="small" color="primary" aria-label="add" >
                                       <AddIcon  onClick={() => push({ entityTypeId: "", imageUrl: ""})}/>
                                    </Fab>
                                    {values.images && values.images?.map((image, index) => (
                                       <div key={`images.${index}.imageUrl`}>
                                       <div className="row mb-3">
                                          <div className="col-12">
                                             <TextField
                                             fullWidth
                                             label="Image url"
                                             value={image.imageUrl}
                                             onChange={handleChange}
                                             name={`images.${index}.imageUrl`}
                                             error={touched.images?.imageUrl && Boolean(errors.images?.imageUrl)}
                                             helperText={touched.images?.imageUrl && errors.images?.imageUrl}
                                             />
                                          </div>
                                       </div>
                                       <div className="row mb-3">
                                          <div className="col-12">
                                          <FormControl fullWidth>
                                             <InputLabel id="demo-simple-select-label">Image type</InputLabel>
                                             <Select
                                                name={`images.${index}.entityTypeId`}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={image.entityTypeId}
                                                onChange={handleChange}
                                                error={touched.images?.entityTypeId && Boolean(errors.images?.entityTypeId)}
                                                helperText={touched.images?.entityTypeId && errors.images?.entityTypeId}
                                             >
                                                {imageTypes.map(mapImageTypes)}
                                             </Select>
                                          </FormControl>
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
                                 name="contactInformation"
                                 label="Contact info"
                                 className="form-control"
                                 id="contactInformation"
                                 value={values.contactInformation}
                                 onChange={handleChange}
                                 error={touched.contactInformation && Boolean(errors.contactInformation)}
                                 helperText={touched.contactInformation && errors.contactInformation}
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

export default CompanyForm;
