import { useState, useEffect } from "react";
import CountryDropdown from "./CountryDropdown";
import Spinner from "./Spinner";
import { X, AlertCircle } from "lucide-react";

const EditModal = ({
  isOpen,
  onClose,
  onSave,
  tax,
  countries,
  isLoadingCountries,
  isSaving,
}) => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tax) {
      setName(tax.name || "");
      setCountry(tax.country || "");
      setCountryId(tax.countryId || "");
      setErrors({});
    }
  }, [tax]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCountryChange = (newCountry, newCountryId) => {
    setCountry(newCountry);
    setCountryId(newCountryId);
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSave({
      name: name.trim(),
      country,
      countryId,
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-visible rounded-2xl bg-white shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Customer
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({});
                  }}
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                    transition-all duration-200
                    ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Country Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <CountryDropdown
                  countries={countries}
                  selectedCountry={country}
                  selectedCountryId={countryId}
                  onChange={handleCountryChange}
                  isLoading={isLoadingCountries}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Spinner
                      size="sm"
                      className="border-white border-t-transparent"
                    />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
