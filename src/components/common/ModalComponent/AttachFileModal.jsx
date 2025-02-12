import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import React, { useRef } from "react";

import "./AttachFileModal.css";
import AddIcon from "@/icons/AddIcon";

const AttachFileModal = ({
  show,
  handleClose,
  handleImageChange,
  selectedImages,
  setSelectedImages,
}) => {
  const imageRef = useRef(null);

  const handleRemoveImage = (index) => {
    const images = [...selectedImages];
    images.splice(index, 1);
    setSelectedImages(images);
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Images</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className={`image-preview-grid ${
            selectedImages.length > 0 ? "has-images" : ""
          }`}
        >
          {selectedImages.map((image, index) => (
            <div key={index} className="image-preview">
              <CloseButton
                className="remove-image"
                onClick={() => handleRemoveImage(index)}
              />
              <img
                src={image}
                alt={`preview-${index}`}
                width={100}
                height={100}
              />
            </div>
          ))}
          <div
            className="add-image"
            onClick={() => {
              imageRef.current.click();
            }}
          >
            <AddIcon />
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Attach
        </Button>
      </Modal.Footer> */}
      <input
        name="file"
        id="file"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        hidden
        ref={imageRef}
      />
    </Modal>
  );
};
export default AttachFileModal;
