import React, { useState } from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface ClassroomNavBarProps {
  name: string;
  menuItems: MenuItem[];
}

const ClassroomNavBar: React.FC<ClassroomNavBarProps> = ({ name, menuItems }) => {
  const [selected, setSelected] = useState<string>(menuItems[0]?.label || '');

  return (
    <div className="navbar bg-base-300 rounded-box p-4 flex justify-between items-center">
      <span className="text-lg font-bold text-blue-500">{name}</span>
      <div className="flex gap-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setSelected(item.label);
              item.onClick();
            }}
            className={`btn ${selected === item.label ? 'btn-primary' : 'btn-neutral'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClassroomNavBar;
