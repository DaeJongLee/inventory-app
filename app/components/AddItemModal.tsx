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

  const handleLocationSelect = (locationType: 'main' | 'sub' | 'final', value: string) => {
    setSelectedLocation(prev => {
      const newLocation = { ...prev, [locationType]: value };
      if (locationType === 'main') {
        newLocation.sub = '';
        newLocation.final = '';
      } else if (locationType === 'sub') {
        newLocation.final = '';
      }
      return newLocation;
    });
  };

  const handleStorageLocationSelect = (locationType: 'storageMain' | 'storageSub' | 'storageFinal', value: string) => {
    setSelectedStorageLocation(prev => {
      const newLocation = { ...prev, [locationType]: value };
      if (locationType === 'storageMain') {
        newLocation.storageSub = '';
        newLocation.storageFinal = '';
      } else if (locationType === 'storageSub') {
        newLocation.storageFinal = '';
      }
      return newLocation;
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

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
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
            <label className="block text-sm font-medium text-gray-700">위치 선택</label>
            <div className="mt-2 space-y-2">
              <select
                value={selectedLocation.main}
                onChange={(e) => handleLocationSelect('main', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">주 위치 선택</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              {selectedLocation.main && (
                <select
                  value={selectedLocation.sub}
                  onChange={(e) => handleLocationSelect('sub', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">세부 위치 선택</option>
                  {locations.find(loc => loc.id === selectedLocation.main)?.children?.map((subLoc) => (
                    <option key={subLoc.id} value={subLoc.id}>{subLoc.name}</option>
                  ))}
                </select>
              )}
              {selectedLocation.sub && (
                <select
                  value={selectedLocation.final}
                  onChange={(e) => handleLocationSelect('final', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                 <option value="">최종 위치 선택</option>
                {locations.find(loc => loc.id === selectedLocation.main)?.children
                  ?.find(subLoc => subLoc.id === selectedLocation.sub)?.children?.map((finalLoc) => (
                    <option key={finalLoc.id} value={finalLoc.id}>{finalLoc.name}</option>
                  ))}
              </select>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">보관 위치 선택</label>
          <div className="mt-2 space-y-2">
            <select
              value={selectedStorageLocation.storageMain}
              onChange={(e) => handleStorageLocationSelect('storageMain', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">주 보관 위치 선택</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
            {selectedStorageLocation.storageMain && (
              <select
                value={selectedStorageLocation.storageSub}
                onChange={(e) => handleStorageLocationSelect('storageSub', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">세부 보관 위치 선택</option>
                {locations.find(loc => loc.id === selectedStorageLocation.storageMain)?.children?.map((subLoc) => (
                  <option key={subLoc.id} value={subLoc.id}>{subLoc.name}</option>
                ))}
              </select>
            )}
            {selectedStorageLocation.storageSub && (
              <select
                value={selectedStorageLocation.storageFinal}
                onChange={(e) => handleStorageLocationSelect('storageFinal', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">최종 보관 위치 선택</option>
                {locations.find(loc => loc.id === selectedStorageLocation.storageMain)?.children
                  ?.find(subLoc => subLoc.id === selectedStorageLocation.storageSub)?.children?.map((finalLoc) => (
                    <option key={finalLoc.id} value={finalLoc.id}>{finalLoc.name}</option>
                  ))}
              </select>
            )}
          </div>
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
}

export default AddItemModal;