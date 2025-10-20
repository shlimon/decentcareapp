import axiosInstance from '@api/axiosInstance';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

function SearchableSelect({
   label,
   endpoint = '/participants', // default API endpoint
   value,
   onChange,
   placeholder,
   required,
   error,
}) {
   const [searchTerm, setSearchTerm] = useState('');
   const [isOpen, setIsOpen] = useState(false);
   const [displayValue, setDisplayValue] = useState('');
   const [options, setOptions] = useState([]);
   const [loading, setLoading] = useState(true);
   const wrapperRef = useRef(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axiosInstance.get(endpoint);
            const result = response.data;

            if (result.success) {
               const formatted = result.data.map((item) => ({
                  id: item._id,
                  name: item.name,
                  extra: item.community,
               }));
               setOptions(formatted);
            } else {
               toast.error('Failed to load data.');
            }
         } catch (err) {
            console.error(err);
            toast.error('Network error while fetching data.');
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [endpoint]);

   // ✅ Close dropdown when clicking outside
   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpen(false);
            setSearchTerm('');
         }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // ✅ Update display value when external value changes
   useEffect(() => {
      const selected = options.find((opt) => opt.id === value);
      setDisplayValue(selected ? selected.name : '');
   }, [value, options]);

   // ✅ Only show dropdown when exact match is found
   const filteredOptions = useMemo(() => {
      if (!searchTerm.trim()) return [];
      return options.filter(
         (opt) => opt.name.toLowerCase() === searchTerm.toLowerCase()
      );
   }, [searchTerm, options]);

   const handleSelect = (option) => {
      onChange(option.id);
      setDisplayValue(option.name);
      setSearchTerm('');
      setIsOpen(false);
   };

   const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      setIsOpen(true);

      if (displayValue && value !== displayValue) {
         onChange('');
         setDisplayValue('');
      }
   };

   return (
      <div className="mb-6">
         <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
         </label>

         <div className="relative" ref={wrapperRef}>
            <input
               type="text"
               className={`w-full px-4 py-2 border ${
                  error ? 'border-red-500' : 'border-gray-300'
               } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
               value={isOpen ? searchTerm : displayValue}
               onChange={handleInputChange}
               onFocus={() => setIsOpen(true)}
               placeholder={placeholder || 'Search...'}
               disabled={loading}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            {/* ✅ Dropdown only shows when exact match exists */}
            {isOpen && filteredOptions.length > 0 && (
               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredOptions.map((option) => (
                     <div
                        key={option.id}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSelect(option)}
                     >
                        <div className="font-medium text-gray-900">
                           {option.name}
                        </div>
                        {option.extra && (
                           <div className="text-xs text-gray-500 mt-1">
                              {option.extra}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}

export default SearchableSelect;
