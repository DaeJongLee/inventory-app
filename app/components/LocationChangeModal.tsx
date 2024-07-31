import React, { useState, useEffect } from 'react';
import { Item, Location, ItemLocation, StorageLocation } from '../types/types';

interface LocationChangeModalProps {
  isOpen: boolean;
  item: Item;
  onClose: () => void;
  onSave: (itemId: string, newLocation: ItemLocation, newStorageLocation: StorageLocation) => void;
  locations: Location[];
}

const LocationChangeModal: React.FC<LocationChangeModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
  locations
}) => {
  const [newLocation, setNewLocation] = useState<ItemLocation>(item.location);
  const [newStorageLocation, setNewStorageLocation] = useState<StorageLocation>(item.storageLocation);

  useEffect(() => {
    setNewLocation(item.location);
    setNewStorageLocation(item.storageLocation);
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, newLocation, newStorageLocation);
    onClose();
  };

  const getLocationName = (location: ItemLocation | StorageLocation) => {
    const findLocationName = (locations: Location[], id: string): string | undefined => {
      for (const loc of locations) {
        if (loc.id === id) return loc.name;
        if (loc.children) {
          const childName = findLocationName(loc.children, id);
          if (childName) return childName;
        }
      }
      return undefined;
    };

    if ('storageMain' in location) {
      const { storageMain, storageSub, storageFinal } = location;
      const mainName = findLocationName(locations, storageMain) || storageMain;
      const subName = storageSub ? findLocationName(locations, storageSub) || storageSub : '';
      const finalName = storageFinal ? findLocationName(locations, storageFinal) || storageFinal : '';
      return `${mainName}${subName ? ` > ${subName}` : ''}${finalName ? ` > ${finalName}` : ''}`;
    } else {
      const { main, sub, final } = location;
      const mainName = findLocationName(locations, main) || main;
      const subName = sub ? findLocationName(locations, sub) || sub : '';
      const finalName = final ? findLocationName(locations, final) || final : '';
      return `${mainName}${subName ? ` > ${subName}` : ''}${finalName ? ` > ${finalName}` : ''}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">위치 변경: {item.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">현재 위치</h3>
            <p>{getLocationName(item.location)}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">새 위치</h3>
            <select
              value={newLocation.main}
              onChange={(e) => setNewLocation({...newLocation, main: e.target.value, sub: '', final: ''})}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">주 위치 선택</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
            {newLocation.main && locations.find(loc => loc.id === newLocation.main)?.children && (
              <select
                value={newLocation.sub}
                onChange={(e) => setNewLocation({...newLocation, sub: e.target.value, final: ''})}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">세부 위치 선택</option>
                {locations.find(loc => loc.id === newLocation.main)?.children?.map(subLoc => (
                  <option key={subLoc.id} value={subLoc.id}>{subLoc.name}</option>
                ))}
              </select>
            )}
            {newLocation.sub && locations.find(loc => loc.id === newLocation.main)?.children?.find(subLoc => subLoc.id === newLocation.sub)?.children && (
              <select
                value={newLocation.final}
                onChange={(e) => setNewLocation({...newLocation, final: e.target.value})}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">최종 위치 선택</option>
                {locations.find(loc => loc.id === newLocation.main)?.children?.find(subLoc => subLoc.id === newLocation.sub)?.children?.map(finalLoc => (
                  <option key={finalLoc.id} value={finalLoc.id}>{finalLoc.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">현재 보관 위치</h3>
            <p>{getLocationName(item.storageLocation)}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">새 보관 위치</h3>
            <select
              value={newStorageLocation.storageMain}
              onChange={(e) => setNewStorageLocation({...newStorageLocation, storageMain: e.target.value, storageSub: '', storageFinal: ''})}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">주 보관 위치 선택</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
            {newStorageLocation.storageMain && locations.find(loc => loc.id === newStorageLocation.storageMain)?.children && (
              <select
                value={newStorageLocation.storageSub}
                onChange={(e) => setNewStorageLocation({...newStorageLocation, storageSub: e.target.value, storageFinal: ''})}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">세부 보관 위치 선택</option>
                {locations.find(loc => loc.id === newStorageLocation.storageMain)?.children?.map(subLoc => (
                  <option key={subLoc.id} value={subLoc.id}>{subLoc.name}</option>
                ))}
              </select>
            )}
            {newStorageLocation.storageSub && locations.find(loc => loc.id === newStorageLocation.storageMain)?.children?.find(subLoc => subLoc.id === newStorageLocation.storageSub)?.children && (
              <select
                value={newStorageLocation.storageFinal}
                onChange={(e) => setNewStorageLocation({...newStorageLocation, storageFinal: e.target.value})}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">최종 보관 위치 선택</option>
                {locations.find(loc => loc.id === newStorageLocation.storageMain)?.children?.find(subLoc => subLoc.id === newStorageLocation.storageSub)?.children?.map(finalLoc => (
                  <option key={finalLoc.id} value={finalLoc.id}>{finalLoc.name}</option>
                ))}
              </select>
            )}
          </div>
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