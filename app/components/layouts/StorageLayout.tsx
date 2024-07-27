import React from 'react';
import LocationButton from '../LocationButton';

interface StorageLayoutProps {
  handleSectionClick: (section: string) => void;
  highlightedLocation: string | null;
}

const StorageLayout: React.FC<StorageLayoutProps> = ({ handleSectionClick, highlightedLocation }) => (
  <div className="col-span-3">
    <h3 className="text-lg font-semibold mb-2">집하장</h3>
    <div className="grid grid-cols-3 gap-1">
      {['SL', 'SM', 'SR', 'SS'].map(id => (
        <LocationButton 
          key={id} 
          id={id} 
          onClick={handleSectionClick} 
          isHighlighted={highlightedLocation === id} 
        />
      ))}
    </div>
  </div>
);

export default StorageLayout;