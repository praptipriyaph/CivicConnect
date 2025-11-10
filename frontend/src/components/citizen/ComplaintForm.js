import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { useApiService } from "../../services/api";
import LocationPicker from "../common/LocationPicker";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  issueCategory: "",
  title: "",
  description: "",
  latitude: null,
  longitude: null,
  evidence: [],
};

const ComplaintForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiService = useApiService();
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setFormData((prev) => ({
        ...prev,
        email: user.primaryEmailAddress.emailAddress,
      }));
    }
  }, [user]);

  const validateField = (name, value) => {
    let message = "";
    switch (name) {
      case "issueCategory":
        if (!value) message = "Please select a category.";
        break;
      case "description":
        if (!value.trim()) message = "Please provide a description.";
        break;
      case "evidence":
        if (!value || value.length === 0)
          message = "Please upload at least one image.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
    return !message;
  };

  const validateAll = () => {
    const required = ["issueCategory", "description", "evidence"];
    let valid = true;
    required.forEach((f) => {
      if (!validateField(f, formData[f])) valid = false;
    });
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "evidence") {
      const newFiles = Array.from(files);
      if (formData.evidence.length + newFiles.length > 3) {
        toast.error("You can upload a maximum of 3 images only.");
        return;
      }
      const mapped = newFiles.map((f) => ({
        key : `${f.name}-${f.lastModified}`,
        file: f,
        preview: URL.createObjectURL(f),
      }));
      setFormData((prev) => ({
        ...prev,
        evidence: [...prev.evidence, ...mapped],
      }));
      toast.success("Image(s) added successfully!");
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updated = [...prev.evidence];
      const [removed] = updated.splice(index, 1);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return { ...prev, evidence: updated };
    });
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    if (lat && lng) setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    if (!formData.issueCategory) {
      toast.error("Please select a category before submitting.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (formData.evidence.length > 0) {
        toast.loading("Uploading image...");
        const upload = await apiService.uploadImage(formData.evidence[0].file);
        imageUrl = upload.url;
        toast.dismiss();
        toast.success("Image uploaded successfully!");
      }

      const complaintData = {
        title: formData.title || formData.issueCategory, // fallback title
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        image: imageUrl,
        tag: formData.issueCategory, // ✅ guaranteed non-null
      };

      console.log("Submitting complaint payload:", complaintData);

      const complaint = await apiService.raiseComplaint(complaintData);
      toast.success("Complaint submitted successfully!");

      // Cleanup
      formData.evidence.forEach((e) => e.preview && URL.revokeObjectURL(e.preview));
      setFormData(initialFormState);
      navigate("/track-complaint", {
        state: { complaintId: complaint.complaint_id },
      });
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center bg-gradient-to-br from-slate-50 to-slate-200 py-10 px-6">
      <Toaster position="top-center" />
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Citizen Complaint Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title of Complaint"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Issue Category <span className="text-red-500">*</span>
            </label>
              <select
                name="issueCategory"
                value={formData.issueCategory}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="">Select category</option>
                <option value="Roads">Road Damage</option>
                <option value="Waste">Waste Management Issue</option>
                <option value="Water">Water Leakage</option>
                <option value="Electricity">Electricity Problem</option>
                <option value="Health">Health and Sanitation Issue</option>
              </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the issue clearly..."
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Location */}
          <LocationPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationChange={handleLocationChange}
            error={errors.location}
          />

          {/* Evidence */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Image Evidence <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="evidence"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
            <div className="flex flex-wrap gap-3 mt-3">
              {formData.evidence.map((img, idx) => (
                <div key={img.file.name + idx} className="relative group">
                  <img
                    src={img.preview}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-lg border cursor-pointer"
                    onClick={() => setSelectedImage(img.preview)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

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
              alt="Full Preview"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;
