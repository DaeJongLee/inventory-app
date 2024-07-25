import React from 'react';

interface SubLocationModalProps {
  mainLocation: string | null;
  onSelect: (subLocation: string) => void;
  onClose: () => void;
}

const SubLocationModal: React.FC<SubLocationModalProps> = ({ mainLocation, onSelect, onClose }) => {
  const subLocations = mainLocation === 'red-' 
    ? ['1', '2', '3', '4', '5']
    : ['1', '2'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">{mainLocation === 'red-' ? 'Red' : 'Blue'} 세부 위치</h2>
        <div className="grid grid-cols-3 gap-2">
          {subLocations.map(subLocation => (
            <button
              key={subLocation}
              onClick={() => onSelect(subLocation)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {subLocation}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 bg-gray-300 p-2 rounded hover:bg-gray-400">
          닫기
        </button>
      </div>
    </div>
  );
};

export default SubLocationModal;