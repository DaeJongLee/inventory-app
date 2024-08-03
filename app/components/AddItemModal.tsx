'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemLocation, StorageLocation, Location } from '../types/types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (newItem: Item) => void;
  existingItems: Item[];
  locations: Location[];
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  existingItems,
  locations
}) => {
  const [itemName, setItemName] = useState('');
  const [similarItems, setSimilarItems] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ItemLocation>({ main: '', sub: '', final: '' });
  const [selectedStorageLocation, setSelectedStorageLocation] = useState<StorageLocation>({ storageMain: '', storageSub: '', storageFinal: '' });

  useEffect(() => {
    if (itemName.length > 1) {
      const similar = existingItems
        .filter(item => item.name.toLowerCase().includes(itemName.toLowerCase()))
        .map(item => item.name);
      setSimilarItems(similar);
    } else {
      setSimilarItems([]);
    }
  }, [itemName, existingItems]);

  const handleLocationSelect = (locationType: keyof ItemLocation, value: string) => {
    setSelectedLocation(prev => {
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
    setSelectedStorageLocation(prev => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !selectedLocation.main) {
      alert('아이템 이름과 위치를 모두 입력해주세요.');
      return;
    }

    try {
      const newItem: Item = {
        id: '', // 이 부분은 Firebase에서 자동 생성됩니다.
        name: itemName,
        location: selectedLocation,
        storageLocation: selectedStorageLocation,
        lowStock: false,
        orderPlaced: false,
        lowStockTime: null,
        orderPlacedTime: null,
      };

      const docRef = await addDoc(collection(db, 'items'), newItem);
      newItem.id = docRef.id; // Firebase에서 생성된 ID를 할당
      onAddItem(newItem);
      onClose();
    } catch (error) {
      console.error('Error adding new item:', error);
      alert('아이템 추가 중 오류가 발생했습니다.');
    }
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
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">새 아이템 추가</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">아이템 이름</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="아이템 이름 입력"
            />
            {similarItems.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">유사한 아이템:</p>
                <ul className="list-disc list-inside">
                  {similarItems.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">판매 위치</h3>
            <div>
              <p>메인 위치:</p>
              {renderLocationButtons('main', locations, selectedLocation.main, (value) => handleLocationSelect('main', value))}
            </div>
            {selectedLocation.main && (
              <div>
                <p>서브 위치:</p>
                {renderLocationButtons('sub', getSubLocations(selectedLocation.main), selectedLocation.sub || '', (value) => handleLocationSelect('sub', value))}
              </div>
            )}
            {selectedLocation.sub && (
              <div>
                <p>파이널 위치:</p>
                {renderLocationButtons('final', getFinalLocations(selectedLocation.main, selectedLocation.sub), selectedLocation.final || '', (value) => handleLocationSelect('final', value))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">보관 위치</h3>
            <div>
              <p>메인 보관 위치:</p>
              {renderLocationButtons('storageMain', locations, selectedStorageLocation.storageMain, (value) => handleStorageLocationSelect('storageMain', value))}
            </div>
            {selectedStorageLocation.storageMain && (
              <div>
                <p>서브 보관 위치:</p>
                {renderLocationButtons('storageSub', getSubLocations(selectedStorageLocation.storageMain), selectedStorageLocation.storageSub, (value) => handleStorageLocationSelect('storageSub', value))}
              </div>
            )}
            {selectedStorageLocation.storageSub && (
              <div>
                <p>파이널 보관 위치:</p>
                {renderLocationButtons('storageFinal', getFinalLocations(selectedStorageLocation.storageMain, selectedStorageLocation.storageSub), selectedStorageLocation.storageFinal, (value) => handleStorageLocationSelect('storageFinal', value))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;