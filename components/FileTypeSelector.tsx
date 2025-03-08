import React, { useEffect, useState } from 'react';

interface FileTypeSelectorProps {
  index: number;
  selectedTypes: string;
  onChange: (types: string) => void;
}

const FileTypeSelector: React.FC<FileTypeSelectorProps> = ({ index, selectedTypes, onChange }) => {
  const fileTypes = ['.py', '.ipynb', '.sql', '.js', '.ts', '.md', '.txt', '.pdf'];
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

  // Initialize state when `selectedTypes` prop changes
  useEffect(() => {
    setSelectedFileTypes(selectedTypes ? selectedTypes.split(',') : []);
  }, [selectedTypes]);

  function handleCheckboxChange(fileType: string, isChecked: boolean) {
    const updatedFileTypes = isChecked
      ? [...selectedFileTypes, fileType]
      : selectedFileTypes.filter(type => type !== fileType);

    setSelectedFileTypes(updatedFileTypes);
    onChange(updatedFileTypes.join(',')); // Pass as comma-separated string
  }

  return (
    <div>
      <div className="flex flex-wrap">
        {fileTypes.map(fileType => (
          <label key={fileType} className="mr-4 flex items-center">
            <input
              type="checkbox"
              checked={selectedFileTypes.includes(fileType)}
              onChange={e => handleCheckboxChange(fileType, e.target.checked)}
              className="mr-2"
            />
            {fileType.toUpperCase()}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FileTypeSelector;
