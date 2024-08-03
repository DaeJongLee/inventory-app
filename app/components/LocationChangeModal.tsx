import React, { useState, useEffect } from 'react';
import { Item, Location, ItemLocation, StorageLocation } from '../types/types';
import { X, Save } from 'lucide-react';

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
    if (isOpen) {
      setNewLocation(item.location);
      setNewStorageLocation(item.storageLocation);
    }
  }, [isOpen, item]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, newLocation, newStorageLocation);
  };

  const handleLocationSelect = (locationType: keyof ItemLocation, value: string) => {
    setNewLocation(prev => {
      const updated = { ...prev, [locationType]: value };
      if (locationType === 'main') {
        updated.sub = '';
        updated.final = '';
      } else if (locationType === 'sub') {
        updated.final = '';
      }
      return updated;
    });
  };

  const handleStorageLocationSelect = (locationType: keyof StorageLocation, value: string) => {
    setNewStorageLocation(prev => {
      const updated = { ...prev, [locationType]: value };
      if (locationType === 'storageMain') {
        updated.storageSub = '';
        updated.storageFinal = '';
      } else if (locationType === 'storageSub') {
        updated.storageFinal = '';
      }
      return updated;
    });
  };

  const renderLocationButtons = (
    locationType: keyof ItemLocation | keyof StorageLocation,
    options: Location[],
    currentValue: string,
    onSelect: (value: string) => void
  ) => {
    return options.map(option => (
      <button
        key={option.id}
        onClick={(e) => {
          e.preventDefault();
          onSelect(option.id);
        }}
        className={`px-3 py-1 m-1 rounded ${
          currentValue === option.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        {option.name}
      </button>
    ));
  };

  const getSubLocations = (mainLocationId: string) => {
    const mainLocation = locations.find(loc => loc.id === mainLocationId);
    return mainLocation?.children || [];
  };

  const getFinalLocations = (mainLocationId: string, subLocationId: string) => {
    const mainLocation = locations.find(loc => loc.id === mainLocationId);
    const subLocation = mainLocation?.children?.find(loc => loc.id === subLocationId);
    return subLocation?.children || [];
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-96 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">위치 변경: {item.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">판매 위치</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">메인 위치:</p>
                {renderLocationButtons('main', locations, newLocation.main, (value) => handleLocationSelect('main', value))}
              </div>
              {newLocation.main && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">서브 위치:</p>
                  {renderLocationButtons('sub', getSubLocations(newLocation.main), newLocation.sub || '', (value) => handleLocationSelect('sub', value))}
                </div>
              )}
              {newLocation.sub && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">파이널 위치:</p>
                  {renderLocationButtons('final', getFinalLocations(newLocation.main, newLocation.sub), newLocation.final || '', (value) => handleLocationSelect('final', value))}
                </div>
              )}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">보관 위치</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">메인 보관 위치:</p>
                {renderLocationButtons('storageMain', locations, newStorageLocation.storageMain, (value) => handleStorageLocationSelect('storageMain', value))}
              </div>
              {newStorageLocation.storageMain && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">서브 보관 위치:</p>
                  {renderLocationButtons('storageSub', getSubLocations(newStorageLocation.storageMain), newStorageLocation.storageSub || '', (value) => handleStorageLocationSelect('storageSub', value))}
                </div>
              )}
              {newStorageLocation.storageSub && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">파이널 보관 위치:</p>
                  {renderLocationButtons('storageFinal', getFinalLocations(newStorageLocation.storageMain, newStorageLocation.storageSub), newStorageLocation.storageFinal || '', (value) => handleStorageLocationSelect('storageFinal', value))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <Save size={18} className="mr-2" />
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LocationChangeModal;
