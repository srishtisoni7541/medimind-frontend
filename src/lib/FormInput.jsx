import React from 'react';
import { useFormContext } from 'react-hook-form';
import { clsx } from 'clsx';

export function FormInput({ label, name, type = 'text', icon, min }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...register(name, type === 'number' ? { valueAsNumber: true } : {})}
          type={type}
          min={min}
          className={clsx(
            "w-full bg-gray-50 border-2 transition-all duration-200",
            "rounded-xl py-3 px-4 appearance-none",
            icon && "pl-10",
            "focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 hover:border-gray-300"
          )}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span> {error}
        </p>
      )}
    </div>
  );
}

export function FormSelect({ label, name, options, icon }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <select
          {...register(name)}
          className={clsx(
            "w-full bg-gray-50 border-2 transition-all duration-200",
            "rounded-xl py-3 px-4 appearance-none",
            icon && "pl-10",
            "focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <option value="">Select a type / 유형 선택</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span> {error}
        </p>
      )}
    </div>
  );
}

export function FormCheckboxGroup({ label, name, options }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label key={option} className="relative flex items-start p-3 rounded-lg border-2 border-gray-300 hover:border-gray-300 cursor-pointer transition-all duration-200">
            <input
              type="checkbox"
              value={option}
              {...register(name)}
              className="peer sr-only"
            />
            <span className="peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-indigo-500 absolute inset-0 rounded-lg pointer-events-none" />
            <span className="text-sm text-gray-700 peer-checked:text-blue-600 transition-colors duration-200">
              {option}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span> {error}
        </p>
      )}
    </div>
  );
}

export function FormToggle({ label, name }) {
  const { register } = useFormContext();

  return (
    <label className="relative inline-flex items-center mb-6 cursor-pointer">
      <input
        type="checkbox"
        {...register(name)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      <span className="ms-3 text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}