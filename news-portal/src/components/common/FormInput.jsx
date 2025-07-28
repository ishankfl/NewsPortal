import React from 'react';

const FormInput = ({ label, id, name, type = 'text', icon: Icon, value, onChange, error, placeholder }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="text-gray-400" />
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`pl-10 w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-indigo-500 focus:border-indigo-500`}
      />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default FormInput;
