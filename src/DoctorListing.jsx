import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Autocomplete,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const DoctorListing = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [doctorNames, setDoctorNames] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    axios.get("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json").then((res) => {
      setDoctors(res.data);
      setFilteredDoctors(res.data);
      setDoctorNames([...new Set(res.data.map((doc) => doc.name))]);
      setSpecialties([...new Set(res.data.map((doc) => doc.specialty))]);
    });
  }, []);

  useEffect(() => {
    let result = [...doctors];

    if (searchName)
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(searchName.toLowerCase())
      );

    if (consultationType)
      result = result.filter((doc) => doc.consultationType === consultationType);

    if (selectedSpecialties.length > 0)
      result = result.filter((doc) => selectedSpecialties.includes(doc.specialty));

    if (sortBy === "fees") result.sort((a, b) => a.fees - b.fees);
    else if (sortBy === "experience") result.sort((a, b) => b.experience - a.experience);

    setFilteredDoctors(result);
  }, [searchName, consultationType, selectedSpecialties, sortBy, doctors]);

  const theme = {
    background: "#f6f8fa",
    card: "#ffffff",
    text: "#1c1c1c",
    shadow: "rgba(0, 0, 0, 0.1)",
    primary: "#0077cc",
  };

  const softButtonStyle = {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    background: theme.card,
    boxShadow: "4px 4px 10px #d1d9e6, -4px -4px 10px #ffffff",
    fontWeight: "500",
    color: theme.text,
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  };

  const softButtonHover = {
    boxShadow: "inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff",
  };

  return (
    <div
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: theme.primary, marginBottom: "2rem" }}>
        🩺 Doctor Finder
      </h2>

      {/* Filter Panel */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <Autocomplete
          freeSolo
          options={doctorNames}
          onInputChange={(e, value) => setSearchName(value)}
          renderInput={(params) => <TextField {...params} label="Search Doctor" />}
          style={{ width: "250px" }}
        />

        <FormControl style={{ width: "180px" }}>
          <InputLabel>Consultation</InputLabel>
          <Select
            value={consultationType}
            onChange={(e) => setConsultationType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="In-person">In-person</MenuItem>
          </Select>
        </FormControl>

        <FormControl style={{ width: "180px" }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="fees">Fees</MenuItem>
            <MenuItem value="experience">Experience</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Specialty Filter */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {specialties.map((spec) => (
          <label key={spec} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={selectedSpecialties.includes(spec)}
              onChange={() => {
                setSelectedSpecialties((prev) =>
                  prev.includes(spec)
                    ? prev.filter((s) => s !== spec)
                    : [...prev, spec]
                );
              }}
            />
            {spec}
          </label>
        ))}
      </div>

      {/* Doctor List */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {filteredDoctors.length === 0 ? (
          <p style={{ textAlign: "center", color: "gray" }}>No doctors found.</p>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              style={{
                background: theme.card,
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: `0 2px 8px ${theme.shadow}`,
                color: theme.text,
              }}
            >
              <h3 style={{ marginBottom: "0.5rem", color: theme.primary }}>{doc.name}</h3>
              <p><strong>Specialty:</strong> {doc.specialty}</p>
              <p><strong>Consultation:</strong> {doc.consultationType}</p>
              <p><strong>Experience:</strong> {doc.experience} yrs</p>
              <p><strong>Fees:</strong> ₹{doc.fees}</p>

              <button
                style={softButtonStyle}
                onMouseOver={(e) => Object.assign(e.currentTarget.style, softButtonHover)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, softButtonStyle)}
              >
                Book Appointment
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorListing;
