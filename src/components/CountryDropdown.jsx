import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Search,
  Loader2,
} from "lucide-react";


const CountryDropdown = ({
  countries,
  selectedCountry,
  selectedCountryId,
  onChange,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country) => {
    onChange(country.name, country.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 flex items-center justify-between hover:border-gray-400"
      >
        <span className={selectedCountry ? 'text-gray-900' : 'text-gray-400'}>
          {selectedCountry || 'Select a country'}
        </span>
        <div className="flex items-center gap-2">
  {selectedCountry && (
    <Check className="h-4 w-4 text-gray-400" />
  )}

  <ChevronDown
    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`}
  />
</div>

      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search countries..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />

                </div>
                <p className="mt-2 text-sm">Loading countries...</p>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                
                <Search className="h-8 w-8 mx-auto text-gray-300" />

                <p className="mt-2 text-sm">No countries found</p>
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-150 ${
                    selectedCountryId === country.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedCountryId === country.id
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                    />
                    <span
                      className={`${
                        selectedCountryId === country.id
                          ? 'text-primary-700 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {country.name}
                    </span>
                  </div>
                  
                  <Check className="h-4 w-4 text-gray-400" />

                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;