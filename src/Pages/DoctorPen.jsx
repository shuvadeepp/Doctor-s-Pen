import React, { useState, useRef } from "react";
import './style.css';
import { DESEASES } from '../Constant/Desease';
import axios from "axios";


export default function DoctorPen(){

    const inputRef = useRef();
    const [show, setShow] = useState(false);
    const [srcPhone, setSrcPhone] = useState(''); 
    const btnToggle = () => { 
        setShow(!show);
    }
 
    const [formData, setFormData] = useState({
        Date: new Date().toLocaleDateString("en-US"), 
        intPhoneNo: "",
        SelDisease: "",
        txtPrescription: "",
    });
    // console.log("formData :::: ",formData.intPhoneNo)

    const handleChange = (e) => {   
        const { name, value } = e.target; 
        // setFormData((prev) => ({ ...prev, [name]: value }));
        setFormData({...formData, [name]: value});
    }

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};
        if (!formData.intPhoneNo) newErrors.intPhoneNo = "Phone No is required.";
        if (!formData.SelDisease) newErrors.SelDisease = "Disease is required.";
        if (!formData.txtPrescription) newErrors.txtPrescription = "Prescription is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => { 
        e.preventDefault();
        if(!validateForm()) return; 
        // console.log("Backend response:", formData);  
        // console.log("srcPhone:", srcPhone);  
        // return false;
        
        try {
            const response = await axios.get(`http://localhost:3000/patient-data?PhoneNo=${formData.intPhoneNo}`);
            // console.log("API response:", response);
            if(response.data.length == 0){
                alert(`Patient with Phone No ${formData.intPhoneNo} not found.`);
                return;
            }
            const patient = response.data[0];
            const patientId = patient.id; 
            // console.log(patient);return false;
            if (!patientId) {
                alert("Cannot update: patient record doesn't have an 'id' field.");
                return;
            }
            
            const newEntry = {
                Date: formData.Date,
                DiseaseName: DESEASES.find(d => d.id === parseInt(formData.SelDisease))?.deseaseType || "Unknown",
                PrescriptionDetails: formData.txtPrescription
            };
    
          
            const updatedHistory = [...(patient.PatientMedicalHistory || []), newEntry];
            // console.log(patient.PhoneNo);return false;
            
            // await axios.post(`http://localhost:3000/patient-data/PatientMedicalHistory`, {
            await axios.patch(`http://localhost:3000/patient-data/${patientId}`, { 
                // ...patient,
                PatientMedicalHistory: updatedHistory
            });
    
            alert("Prescription submitted successfully!");
            window.location.reload();

        } catch (error) {
            console.error("Network error:", error);
            alert("Something went wrong!");
        }
 
    }
    
    const [patientData, setPatientData] = useState(null);
    

    const handleSearch = async (e) => {
        e.preventDefault(); 

        if (!srcPhone.trim()) {
            alert(`Oops!!! You forgot to search number!`);
            return;
        } 
        
        try{
            const response = await axios.get(`http://localhost:3000/patient-data?PhoneNo=${srcPhone}`)
            // console.log(response.data) 
            if(response.status == 200){
                // console.log(response.data[0].PatientName)
                if(response.data.length > 0){ 
                    setPatientData(response.data[0]);
                }else{
                    alert(`Sorry, The Mobile no. ${srcPhone} is invalid!`);
                    setPatientData(null)
                    setSrcPhone("")
                }
            } else{
                alert("Something went wrong with the request!!!");
            }
            
        }catch(err){
            console.error("Err Fething Data ::~~::", err);
        }
    }

    const handleReset = () =>{
        setSrcPhone("");
        // setPatientData(null);
        setShow(false);
        inputRef.current.focus();
    }

    const getGenderText = (gender) => {
        return gender === 1 ? "Male" : "Female";
    }

    const getAgenumb = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date(); 
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate(); 
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        } 
        return age;
    } 

    return (
<div className="d-flex justify-content-center w-100">
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-11">
            <h2 className="text-center text-primary mb-4 fw-bold">Doctor's Pen</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch}>
            <div className="search-bar d-flex align-items-center justify-content-center mb-4 gap-2">
                <label htmlFor="phone" className="form-label mb-0 fw-semibold">
                Patient's Phone No:
                </label>
                <input
                    type="text"
                    id="phone"
                    placeholder="Search Phone No."
                    maxLength={10}
                    className="form-control w-auto"
                    value={srcPhone}
                    onChange={(e) => setSrcPhone(e.target.value)}
                    ref={inputRef}
                />
                <button className="btn btn-secondary search-btn" title="Search"> 🔍 </button>
                <button type="reset" className="btn btn-secondary search-btn" title="Reset" onClick={handleReset}> 🔄 </button>
            </div>
            </form>
            {/* Patient Details Section */}
            {
                patientData && (
                    <div className="section">
                        <div className="section-title">Patient Details</div>
                        <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <tbody>
                            <tr>
                                <td className="fw-bold">Patient Name:</td>
                                    <td>{patientData.PatientName}</td>
                                <td className="fw-bold">Phone No:</td>
                                    <td>{patientData.PhoneNo}</td>
                                <td className="fw-bold">Gender:</td>
                                    <td>{getGenderText(patientData.Gender)}</td>
                                <td className="fw-bold">Date of Birth:</td>
                                    <td>{patientData.Dob}</td>
                                <td className="fw-bold">Patient History:</td>
                                <td>
                                    <button className="btn btn-link p-0 fw-semibold viewBtn" onClick={btnToggle} title={!show ? "View" : "Hide"}> {!show ? "View" : "Hide"} </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                )
            }
            

            {/* txtPrescription Form */}
            {!show && (
            <div className="section">
                <div className="section-title">Add Prescription Details</div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="intPhoneNo" className="form-label fw-semibold">
                            Patient's Phone No <span className="text-danger">*</span>
                        </label>
                        <input 
                            type="number" 
                            className="form-control" 
                            name="intPhoneNo" 
                            id="intPhoneNo" 
                            placeholder="+91-"
                            onChange={handleChange}
                            value={formData.intPhoneNo} 
                        />
                        {errors.intPhoneNo && <small className="text-danger">{errors.intPhoneNo}</small>}
                    </div>
                    <div className="mb-3">
                    <label htmlFor="SelDisease" className="form-label fw-semibold">
                        Disease Name <span className="text-danger">*</span>
                    </label>
                    <select id="SelDisease" name="SelDisease" className="form-select" onChange={handleChange} value={formData.SelDisease}>
                    <option value="">Select</option>
                        {DESEASES.map((desease)=> (
                            <option key={desease.id} value={desease.id}>{desease.deseaseType}</option>
                        ))} 
                    </select>
                    {errors.SelDisease && <small className="text-danger">{errors.SelDisease}</small>}
                    </div>

                    <div className="mb-3">
                    <label htmlFor="txtPrescription" className="form-label fw-semibold">
                        Prescription Details <span className="text-danger">*</span>
                    </label>
                    <textarea
                        id="txtPrescription"
                        name="txtPrescription"
                        className="form-control"
                        placeholder="Rx."
                        value={formData.txtPrescription}
                        onChange={handleChange}
                    ></textarea>
                    {errors.txtPrescription && <small className="text-danger">{errors.txtPrescription}</small>}
                    </div>

                    <button type="submit" className="btn btn-primary save-btn">Save</button>
                    <p className="note text-danger fw-semibold mt-2">* mandatory fields</p>
                </form>
            </div>
            )}
            {/* Medical History Section */}
            {show && (
            <div className="section history-box">
                <div className="section-title">Patient's Medical History</div>
                    <p className="fw-semibold">
                        <strong>NAME</strong>: {patientData.PatientName} &nbsp;&nbsp;
                        <strong>AGE</strong>: {getAgenumb(patientData.Dob)} years &nbsp;&nbsp;
                        <strong>GENDER</strong>: {getGenderText(patientData.Gender)}
                    </p>
                    {
                        patientData.PatientMedicalHistory && patientData.PatientMedicalHistory.length > 0 ? (
                            patientData.PatientMedicalHistory.map((patientDetails, index) => (
                            <div className="history-entry" key={index}>
                                <p><strong>{patientDetails.Date}</strong></p>
                                <p><strong>Disease Name:</strong> {patientDetails.DiseaseName}</p>
                                <p><strong>Prescription Details:</strong> {patientDetails.PrescriptionDetails}</p>
                            </div>
                            ))
                        ) : (
                            <p className="text-danger text-center mt-3">No medical history found.</p>
                        )
                    }

        
                    <p className="footer-text text-center mt-3">(**) END OF REPORT </p>
            </div>
            )} 
    </div>
  </div>
</div>
</div> 
    );
}