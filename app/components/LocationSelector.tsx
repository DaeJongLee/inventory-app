'use client'

import React, { useState } from 'react';
import { Location } from '../types/types';
import { locations } from '../data/locations';

interface LocationSelectorProps {
  onSelect: (locationId: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelect }) => {
  const [selectedMainLocation, setSelectedMainLocation] = useState<string>('');
  const [selectedSubLocation, setSelectedSubLocation] = useState<string>('');
  const [selectedFinalLocation, setSelectedFinalLocation] = useState<string>('');

  const handleMainLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMainLocation(e.target.value);
    setSelectedSubLocation('');
    setSelectedFinalLocation('');
  };

  const handleSubLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubLocation(e.target.value);
    setSelectedFinalLocation('');
  };

  const handleFinalLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFinalLocation(e.target.value);
    onSelect(e.target.value);
  };

  const getSubLocations = () => {
    const mainLocation = locations.find(loc => loc.id === selectedMainLocation);
    return mainLocation?.children || [];
  };

  const getFinalLocations = () => {
    const subLocations = getSubLocations();
    const subLocation = subLocations.find(loc => loc.id === selectedSubLocation);
    return subLocation?.children || [];
  };

  return (
    <div className="space-y-2">
      <select
        value={selectedMainLocation}
        onChange={handleMainLocationChange}
        className="w-full p-2 border rounded"
      >
        <option value="">주요 위치 선택</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>

      {selectedMainLocation && (
        <select
          value={selectedSubLocation}
          onChange={handleSubLocationChange}
          className="w-full p-2 border rounded"
        >
          <option value="">세부 위치 선택</option>
          {getSubLocations().map((subLocation) => (
            <option key={subLocation.id} value={subLocation.id}>
              {subLocation.name}
            </option>
          ))}
        </select>
      )}

      {selectedSubLocation && getFinalLocations().length > 0 && (
        <select
          value={selectedFinalLocation}
          onChange={handleFinalLocationChange}
          className="w-full p-2 border rounded"
        >
          <option value="">최종 위치 선택</option>
          {getFinalLocations().map((finalLocation) => (
            <option key={finalLocation.id} value={finalLocation.id}>
              {finalLocation.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default LocationSelector;