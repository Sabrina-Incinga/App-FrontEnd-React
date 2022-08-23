import React, { useState, useEffect } from "react";
import companiesService from "../../services/companiesService";
import toastr from "toastr";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { TextField, FormControl, InputLabel, Select, MenuItem, Fab  } from "@material-ui/core";
import  { Formik, Form, FieldArray } from "formik";
import AddIcon from '@material-ui/icons/Add'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import * as Yup from "yup";
import jobsService from "../../services/jobsService";

function JobForm(props) {
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      summary: "",
      slug: "",
      statusId: "",
      pay: "",
      techCompanyId: "",
      skills: [],
   });
   const [companies, setCompanies] = useState({
      companiesArray: [],
   });
   
   const { jobId } = useParams();
   const { state } = useLocation();

   const validationSchema = Yup.object().shape({
      title: Yup.string().min(2).max(120).required("This field is required"),
      pay: Yup.string().min(2).max(120).required("This field is required"),
      description: Yup.string().min(2).required("This field is required"),
      summary: Yup.string().min(2).max(255).required("This field is required"),
      slug: Yup.string().min(2).max(100).required("This field is required"),
      statusId: Yup.string().min(2).max(10).required("This field is required"),
      techCompanyId: Yup.number().required("This field is required"),
      skills: Yup.array().of(
         Yup.string()
      ),
   })

   const onAddJobSuccess = (response) => {
      goToPage(response);
      toastr.success(
         "You have succesfully added a new job",
         "Job registration success"
      );
   };

   const onAddJobError = (error) => {
      toastr.error("Job could not be added", "Job registration error");
      console.error(error);
   };

   const onUpdateJobSuccess = (response) => {
      toastr.success("You have succesfully updated this job", "Job update success");
      console.log(response);
   };

   const onUpdateJobError = (error) => {
      toastr.error("Job could not be updated", "Job update error");
      console.error(error);
   };

   const onSubmitClicked = (values) => {
      if (jobId) {
         jobsService
            .update(jobId, values)
            .then(onUpdateJobSuccess)
            .catch(onUpdateJobError);
      } else {
         jobsService.add(values).then(onAddJobSuccess).catch(onAddJobError);
      }
   };

   const mapOptions = option => {
      return (<MenuItem value={option.name} key={`statusOp_${option.id}`}>{option.name}</MenuItem>)
     }

   const mapCompanies = company => {
      return (<MenuItem value={company.id} key={`statusOp_${company.id}`}>{company.name}</MenuItem>)
     }


   const onGetAllCompaniesSuccess = (response) => {
      setCompanies((prevState) => {
         const newTechCoArray = { ...prevState };
         newTechCoArray.companiesArray = response;

         return newTechCoArray;
      });
   };

   const onGetAllCompaniesError = (error) => {
      console.error(error);
   };

   const navigate = useNavigate();
   const goToPage = (id) => {
      navigate({
         pathname: `/newJob/${id}`,
      });
   };

   useEffect(() => {
      if (state?.type === "JOB_EDIT" && state.payload) {
         setFormData((prevState) => {
            const newForm = { ...prevState, ...state.payload };
            newForm.techCompanyId = state.payload.techCompany?.id;
            newForm.skills = state.payload.skills?.map((skill) => skill.name);

            return newForm;
         });
      }
      companiesService
         .getAll()
         .then(onGetAllCompaniesSuccess)
         .catch(onGetAllCompaniesError);
   }, [jobId, state]);

   /*    const onSelectedChange = (option) => {
      setSelectedOption(option);
      setFormData((prevState) => {
         const updatedFormData = {
            ...prevState,
         };
         updatedFormData.techCompanyId = option.value;

         return updatedFormData;
      });
   }; 
   const [selectedOption, setSelectedOption] = useState({
      value: "",
      label: "",
   });

   const [companies, setCompanies] = useState({
      companiesArray: [],
      companiesComponents: [],
   });

      const createSelectOpt = (company) => {
      return {
         value: company.id,
         label: company.name,
      };
   };

   const onGetAllCompaniesSuccess = (response) => {
      setCompanies((prevState) => {
         const newTechCoArray = { ...prevState };
         newTechCoArray.companiesArray = response;
         newTechCoArray.companiesComponents = response.map(createSelectOpt);

         return newTechCoArray;
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
         if (nameOfField === "skills") {
            const skillArray = newUserValue.split(",").map((skill) => skill.trim());
            updatedFormData.skills = skillArray;
         } else {
            updatedFormData[nameOfField] = newUserValue;
         }

         return updatedFormData;
      });
   }; 
   
      useEffect(() => {
      if (state?.type === "JOB_EDIT" && state.payload) {
         setFormData((prevState) => {
            const newForm = { ...prevState, ...state.payload };
            newForm.techCompanyId = state.payload.techCompany?.id;
            newForm.skills = state.payload.skills?.map((skill) => skill.name);

            return newForm;
         });
         setSelectedOption({
            value: state.payload.techCompany?.id,
            label: state.payload.techCompany?.name,
         });
      }
      companiesService
         .getAll()
         .then(onGetAllCompaniesSuccess)
         .catch(onGetAllCompaniesError);
   }, [jobId, state]);
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
                     {!jobId && <h1>Add new Job</h1>}
                     {jobId && <h1>Edit a Job</h1>}
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
                           {jobId && (
                              <div className="mb-3">
                                 <label htmlFor="idInput" className="form-label">
                                    Job Id: {jobId}
                                 </label>
                              </div>
                           )}
                           <div className="mb-3">
                           <TextField
                                 fullWidth
                                 name="title"
                                 label="Position"
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
                                 name="pay"
                                 label="Salary"
                                 classpay="form-control"
                                 id="pay"
                                 value={values.pay}
                                 onChange={handleChange}
                                 error={touched.pay && Boolean(errors.pay)}
                                 helperText={touched.pay && errors.pay}
                              />
                           </div>
                           <div className="mb-3">
                           <TextField
                                 fullWidth
                                 name="description"
                                 label="Description"
                                 className="form-control"
                                 id="description"
                                 value={values.description}
                                 onChange={handleChange}
                                 error={touched.description && Boolean(errors.description)}
                                 helperText={touched.description && errors.description}
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
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Company</InputLabel>
                              <Select
                                 name="techCompanyId"
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 value={values.techCompanyId}
                                 onChange={handleChange}
                                 error={touched.techCompanyId && Boolean(errors.techCompanyId)}
                                 helperText={touched.techCompanyId && errors.techCompanyId}
                              >
                                 {companies.companiesArray?.map(mapCompanies)}
                              </Select>
                           </FormControl>
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

export default JobForm;
