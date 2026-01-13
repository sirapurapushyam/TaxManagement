import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaxTable from "./components/TaxTable";
import EditModal from "./components/EditModal";
import { useTaxes, useUpdateTax } from "./hooks/useTaxes";
import { useCountries } from "./hooks/useCountries";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  // Pencil,
  // Trash2,
  // Plus,
} from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <XCircle className="h-5 w-5" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [toast, setToast] = useState(null);

  const {
    data: taxes = [],
    isLoading: isLoadingTaxes,
    error: taxError,
  } = useTaxes();
  const { data: countries = [], isLoading: isLoadingCountries } =
    useCountries();
  const updateTaxMutation = useUpdateTax();

  const handleEdit = (tax) => {
    setSelectedTax(tax);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTax(null);
  };

  const handleSave = async (data) => {
    if (!selectedTax) return;

    try {
      await updateTaxMutation.mutateAsync({
        id: selectedTax.id,
        data: {
          ...selectedTax,
          name: data.name,
          country: data.country,
          countryId: data.countryId,
        },
      });
      handleCloseModal();
      setToast({ message: "Customer updated successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to update:", error);
      setToast({ message: "Failed to update customer", type: "error" });
    }
  };

  if (taxError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-red-400" />

          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Error Loading Data
          </h2>
          <p className="mt-2 text-gray-500">
            Unable to fetch tax data. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tax Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and edit customer tax information
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {taxes.length} Records
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaxTable data={taxes} isLoading={isLoadingTaxes} onEdit={handleEdit} />
      </main>

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        tax={selectedTax}
        countries={countries}
        isLoadingCountries={isLoadingCountries}
        isSaving={updateTaxMutation.isPending}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
