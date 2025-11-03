// ComplaintForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  issueCategory: "",
  otherCategory: "",
  description: "",
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  evidence: [],
};

const ComplaintForm = ({ onSubmitComplaint }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Updated: single popup, success toast for added images
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "evidence") {
      const newFiles = Array.from(files);

      setFormData((prev) => {
        const totalFiles = prev.evidence.length + newFiles.length;

        if (totalFiles > 3) {
          toast.error("You can upload a maximum of 3 images only.", {
            id: "max-image-limit", // prevent duplicate toasts
          });
          return prev;
        }

        const combined = [...prev.evidence, ...newFiles];
        validateField(name, combined);

        // success toast on image add
        toast.success("Image(s) added successfully!", {
          id: "image-added",
        });

        return { ...prev, evidence: combined };
      });

      e.target.value = null; // allow reselecting same image later
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updated = [...prev.evidence];
      updated.splice(index, 1);
      return { ...prev, evidence: updated };
    });
    toast("Image removed", {
      id: "image-removed",
    });
  };

  const validateField = (name, value) => {
    let message = "";
    switch (name) {
      case "evidence":
        if (!value || value.length === 0)
          message = "Please upload at least one image (max 3).";
        break;
      case "name":
        if (!value || value.trim().length < 3 || !/^[A-Za-z\s]+$/.test(value))
          message = "Name must have at least 3 letters and only alphabets.";
        break;
      case "email":
        if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(value || ""))
          message = "Email must be a valid @gmail.com address.";
        break;
      case "phone":
        if (!/^\d{10}$/.test(value || ""))
          message = "Phone number must be 10 digits.";
        break;
      case "addressLine1":
      case "addressLine2":
        if (!value || !value.trim())
          message = "This address line is required.";
        break;
      case "issueCategory":
        if (!value) message = "Please select a category.";
        break;
      case "description":
        if (!value || !value.trim())
          message = "Please provide a description.";
        break;
      case "otherCategory":
        if (formData.issueCategory === "other" && (!value || !value.trim()))
          message = "Please specify your issue.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const validateAll = () => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "addressLine1",
      "addressLine2",
      "issueCategory",
      "description",
      "evidence",
    ];
    if (formData.issueCategory === "other") requiredFields.push("otherCategory");

    let valid = true;
    requiredFields.forEach((f) => {
      if (!validateField(f, formData[f])) valid = false;
    });
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Please fix errors before submitting.", {
        id: "form-error",
      });
      return;
    }

    const complaintId = Date.now();
    const title =
      formData.issueCategory === "other"
        ? formData.otherCategory
        : formData.issueCategory;
    const location = `${formData.addressLine1}, ${formData.addressLine2}${
      formData.addressLine3 ? ", " + formData.addressLine3 : ""
    }`;
    const submittedDate = new Date().toLocaleString("en-IN");
    const imagePreviews = formData.evidence.map((file) =>
      URL.createObjectURL(file)
    );

    const newComplaint = {
      id: complaintId,
      title,
      description: formData.description,
      location,
      submittedDate,
      status: "SUBMITTED",
      citizen: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      images: imagePreviews,
    };

    if (typeof onSubmitComplaint === "function") {
      onSubmitComplaint(newComplaint);
    } else {
      console.log("Complaint submitted:", newComplaint);
    }

    setFormData(initialFormState);
    setErrors({});
    toast.success("Complaint submitted successfully!", {
      id: "submit-success",
    });
    navigate("/track-complaint", { state: { complaintId } });
  };

  return (
    <div className="relative min-h-screen flex justify-center bg-gradient-to-br from-slate-50 to-slate-200 py-10 px-6">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="relative w-full max-w-2xl flex items-start gap-3">
        {/* Back Arrow */}
        <button
          onClick={() => navigate("/")}
          className="sticky top-24 self-start bg-white shadow-md rounded-full p-2 hover:bg-blue-50 transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/*Complaint Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Citizen Complaint Form
          </h2>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full rounded-lg border p-3 ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:outline-none`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@gmail.com"
              className={`w-full rounded-lg border p-3 ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:outline-none`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit number"
              className={`w-full rounded-lg border p-3 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:outline-none`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Address Line 1"
              className={`w-full rounded-lg border p-3 ${
                errors.addressLine1 ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Address Line 2"
              className={`w-full rounded-lg border p-3 ${
                errors.addressLine2 ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              name="addressLine3"
              value={formData.addressLine3}
              onChange={handleChange}
              placeholder="Address Line 3 (Optional)"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Issue Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Category <span className="text-red-500">*</span>
            </label>
            <select
              name="issueCategory"
              value={formData.issueCategory}
              onChange={handleChange}
              className={`w-full rounded-lg border p-3 bg-white ${
                errors.issueCategory ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select category</option>
              <option value="road">Road Damage</option>
              <option value="garbage">Garbage Issue</option>
              <option value="water">Water Leakage</option>
              <option value="electricity">Electricity Problem</option>
              <option value="other">Other</option>
            </select>

            {formData.issueCategory === "other" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Please specify your issue{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="otherCategory"
                  value={formData.otherCategory}
                  onChange={handleChange}
                  placeholder="Mention your issue"
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the issue clearly..."
              className={`w-full rounded-lg border p-3 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image Evidence <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="evidence"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="block w-full text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />

            {/* Preview */}
            {formData.evidence.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {formData.evidence.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        setSelectedImage(URL.createObjectURL(file))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>

      {/* Full Image Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-2"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full View"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;
