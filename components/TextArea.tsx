import React, { Dispatch, SetStateAction } from 'react';

const TextArea = ({
  value,
  setStateChange,
  placeholder,
  disabled = false,
}: {
  value: string;
  setStateChange: Dispatch<SetStateAction<string>>;
  placeholder: string;
  disabled?: boolean;
}) => {
  return (
    <textarea
      className="textarea textarea-bordered w-full mt-2"
      disabled={disabled}
      placeholder={placeholder}
      value={value} // Add this line to make it a controlled component
      onChange={e => setStateChange(e.target.value)}
    />
  );
};

export default TextArea;
