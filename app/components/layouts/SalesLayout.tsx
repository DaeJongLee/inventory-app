import React from 'react';
import LocationButton from '../LocationButton';

interface SalesLayoutProps {
  handleSectionClick: (section: string) => void;
  highlightedLocation: string | null;
}

const SalesLayout: React.FC<SalesLayoutProps> = ({ handleSectionClick, highlightedLocation }) => (
  <div className="col-span-3">
    <h3 className="text-lg font-semibold mb-2">판매 구역</h3>
    <div className="grid grid-cols-1 gap-2">
      <div className="grid grid-cols-5 gap-1">
        <LocationButton id="Red-A" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Red-A'} />
        <LocationButton id="Red-B" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Red-B'} />
        <div></div>
        <LocationButton id="Blue-A" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Blue-A'} />
        <LocationButton id="Blue-B" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Blue-B'} />
      </div>
      <div className="grid grid-cols-3 gap-1">
        <LocationButton id="Red-1" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Red-1'} />
        <LocationButton id="Red-2" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Red-2'} />
        <LocationButton id="Blue-1" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Blue-1'} />
        <LocationButton id="Red-3" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Red-3'} />
        <LocationButton id="Red-4" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Red-4'} />
        <LocationButton id="Blue-2" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Blue-2'} />
        <LocationButton id="Red-5" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Red-5'} />
        <LocationButton id="Red-6" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Red-6'} />
        <LocationButton id="Blue-3" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Blue-3'} />
      </div>
      <LocationButton id="Green-" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'Green-'} />
      <div className="grid grid-cols-7 gap-1">
        {['DPA', 'DPB', 'DPC', 'DPD', 'DPE', 'DPF', 'DPG'].map(id => (
          <LocationButton 
            key={id} 
            id={id} 
            onClick={handleSectionClick} 
            isHighlighted={highlightedLocation === id} 
          />
        ))}
      </div>
    </div>
  </div>
);

export default SalesLayout;