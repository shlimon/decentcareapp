import { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, onClose }) => {
  const rootModal = document.getElementById("root-modal");
  const modalContainer = document.createElement("div");
  const childEl = document.createElement("div");

  // Root modal overlay style
  modalContainer.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  // Modal container style
  childEl.style = `
    background-color: white;
    border-radius: 7px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    position: relative;
    z-index: 1001;
  `;

  useEffect(() => {
    // Add click event listener to close modal when clicking outside
    const handleOutsideClick = (e) => {
      if (e.target === modalContainer) {
        onClose && onClose();
      }
    };

    modalContainer.addEventListener("click", handleOutsideClick);

    // Append elements to the DOM
    modalContainer.appendChild(childEl);
    rootModal.appendChild(modalContainer);

    return () => {
      modalContainer.removeEventListener("click", handleOutsideClick);
      rootModal.removeChild(modalContainer);
    };
  }, [childEl, modalContainer, rootModal, onClose]);

  return createPortal(children, childEl);
};

export default Modal;
