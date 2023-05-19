import React, { useState, useRef } from "react";
import { IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DragDropInput = ({ onChange, error }) => {
  const [file, setFile] = useState("");
  const inputRef = useRef(null);

  // Handle when file is being drag over
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle when a file is drop in the dropzone
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer.files[0].name);
    onChange(e.dataTransfer.files[0]);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0].name);
    }
  };

  // Handle when the button is clicked to select a file to upload
  const handleChange = function (e) {
    e.preventDefault();
    //console.log(e.target.files);
    onChange(e.target.files[0]);

    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0].name);
    }
  };

  // Trigger the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <>
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          height: "100px",
          border: error ? "dashed 1px red" : "dashed 1px #CCCCCC",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          hidden
          ref={inputRef}
          type="file"
          accept="application/pdf"
          id="input-file-upload"
          onChange={handleChange}
        />
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            flexWrap: "wrap",
            textAlign: "center",
            margin: 0,
          }}
        >
          <div style={{ width: "100%" }}>
            <IconButton color="secondary" onClick={onButtonClick}>
              <CloudUploadIcon />
            </IconButton>
            <p
              style={{
                margin: 0,
                padding: 0,
                color: "#667085",
                fontSize: "0.9rem",
              }}
            >
              <span>Click to upload</span> or drag and drop
            </p>
          </div>
          <div style={{ width: "100%" }}>
            <p
              style={{
                margin: 0,
                padding: 0,
                color: "#012B61",
                fontSize: "0.9rem",
              }}
            >
              {file && file}
            </p>
          </div>
        </div>
      </div>
      {error && (
        <p
          style={{
            width: "100%",
            fontSize: "12px",
            color: "#d32f2f",
            padding: 0,
            margin: "2px 0 0 0",
          }}
        >
          Please attached a transaction advice
        </p>
      )}
    </>
  );
};

export default DragDropInput;
