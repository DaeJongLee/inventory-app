import React from 'react';
import PreparationLayout from './PreparationLayout';
import SalesLayout from './SalesLayout';
import StorageLayout from './StorageLayout';

interface InventoryLayoutMainProps {
  visibleSections: {
    preparation: boolean;
    sales: boolean;
    storage: boolean;
  };
  handleSectionClick: (section: string) => void;
  highlightedLocation: string | null;
}

const InventoryLayoutMain: React.FC<InventoryLayoutMainProps> = ({ 
  visibleSections, 
  handleSectionClick, 
  highlightedLocation 
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {visibleSections.preparation && (
        <PreparationLayout 
          handleSectionClick={handleSectionClick} 
          highlightedLocation={highlightedLocation} 
        />
      )}
      {visibleSections.sales && (
        <SalesLayout 
          handleSectionClick={handleSectionClick} 
          highlightedLocation={highlightedLocation} 
        />
      )}
      {visibleSections.storage && (
        <StorageLayout 
          handleSectionClick={handleSectionClick} 
          highlightedLocation={highlightedLocation} 
        />
      )}
    </div>
  );
};

export default InventoryLayoutMain;
