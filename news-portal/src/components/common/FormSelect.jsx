import React from 'react';

const FormSelect = ({ label, id, name, icon: Icon, value, onChange, error, options }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="text-gray-400" />
        </div>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`pl-10 w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-indigo-500 focus:border-indigo-500`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default FormSelect;
