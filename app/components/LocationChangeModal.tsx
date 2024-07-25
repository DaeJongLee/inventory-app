import React, { useState } from 'react';
import { Item, Location, ItemLocation } from '../types/types';

interface LocationChangeModalProps {
  item: Item;
  onClose: () => void;
  onLocationChange: (itemId: string, newLocation: ItemLocation) => void;
  locations: Location[];
}

const LocationChangeModal: React.FC<LocationChangeModalProps> = ({ item, onClose, onLocationChange, locations }) => {
  const [newLocation, setNewLocation] = useState<ItemLocation>({
    main: item.location.main || '',
    sub: item.location.sub || '',
    final: item.location.final || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationChange(item.id, newLocation);
  };

  const getLocationName = (location: ItemLocation) => {
    const mainName = locations.find(loc => loc.id === location.main)?.name || location.main;
    const subName = location.sub ? ` > ${locations.find(loc => loc.id === location.sub)?.name || location.sub}` : '';
    const finalName = location.final ? ` > ${locations.find(loc => loc.id === location.final)?.name || location.final}` : '';
    return `${mainName}${subName}${finalName}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">위치 변경: {item.name}</h2>
        <p className="mb-4">현재 위치: {getLocationName(item.location)}</p>
        <form onSubmit={handleSubmit}>
          <select
            value={newLocation.main}
            onChange={(e) => setNewLocation({...newLocation, main: e.target.value, sub: '', final: ''})}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">주 위치 선택</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
          {newLocation.main && (
            <select
              value={newLocation.sub}
              onChange={(e) => setNewLocation({...newLocation, sub: e.target.value, final: ''})}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">하위 위치 선택 (선택사항)</option>
              {locations.find(loc => loc.id === newLocation.main)?.children?.map(subLoc => (
                <option key={subLoc.id} value={subLoc.id}>{subLoc.name}</option>
              ))}
            </select>
          )}
          {newLocation.sub && (
            <select
              value={newLocation.final}
              onChange={(e) => setNewLocation({...newLocation, final: e.target.value})}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">최종 위치 선택 (선택사항)</option>
              {locations.find(loc => loc.id === newLocation.main)?.children?.find(subLoc => subLoc.id === newLocation.sub)?.children?.map(finalLoc => (
                <option key={finalLoc.id} value={finalLoc.id}>{finalLoc.name}</option>
              ))}
            </select>
          )}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
              취소
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              변경
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationChangeModal;