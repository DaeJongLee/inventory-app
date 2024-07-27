import React from 'react';
import LocationButton from '../LocationButton';

interface PreparationLayoutProps {
  handleSectionClick: (section: string) => void;
  highlightedLocation: string | null;
}

const PreparationLayout: React.FC<PreparationLayoutProps> = ({ handleSectionClick, highlightedLocation }) => (
  <div className="col-span-3">
    <h3 className="text-lg font-semibold mb-2">조제실</h3>
    <div className="grid grid-cols-4 gap-1">
      <div></div>
      <LocationButton id="MA" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'MA'} />
      <LocationButton id="MB" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'MB'} />
      <div></div>
      <LocationButton id="LC" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'LC'} />
      <div></div>
      <div></div>
      <LocationButton id="RA" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'RA'} />
      <LocationButton id="LB" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'LB'} />
      <LocationButton id="INS" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'INS'} />
      <div></div>
      <LocationButton id="RB" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'RB'} />
      <LocationButton id="LA" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'LA'} />
      <LocationButton id="N (0-9)" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'N (0-9)'} />
      <div></div>
      <LocationButton id="RC" onClick={handleSectionClick} isHighlighted={highlightedLocation === 'RC'} />
    </div>
  </div>
);

export default PreparationLayout;