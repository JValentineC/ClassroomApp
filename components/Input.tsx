import React, { Dispatch, SetStateAction } from 'react';

const Input = ({
  type = 'text',
  disabled = false,
  placeholder = '',
  value,
  setStateChange,
  className = '',
}: {
  type?: string;
  disabled?: boolean;
  setStateChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  className?: string;
}) => {
  return (
    <div>
      <input
        className={`input input-bordered w-full mt-2 ${className}`}
        type={type}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={e => setStateChange(e.target.value)}
      />
    </div>
  );
};

export default Input;
