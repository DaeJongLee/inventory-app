import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemLocation, Location } from '../types/types';

interface AddItemModalProps {
  onClose: () => void;
  onAddItem: (newItem: Item) => void;
  existingItems: Item[];
  locations: Location[];
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAddItem, existingItems, locations }) => {
  const [itemName, setItemName] = useState('');
  const [similarItems, setSimilarItems] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ItemLocation>({ main: '', sub: '', final: '' });
  const [mainLocations, setMainLocations] = useState<string[]>(['판매구역', '조제실', '집하장']);
  const [subLocations, setSubLocations] = useState<string[]>([]);
  const [finalLocations, setFinalLocations] = useState<string[]>([]);

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

  const handleMainLocationSelect = (main: string) => {
    setSelectedLocation({ main, sub: '', final: '' });
    const subLocs = locations.find(loc => loc.name === main)?.children?.map(child => child.name) || [];
    setSubLocations(subLocs);
    setFinalLocations([]);
  };

  const handleSubLocationSelect = (sub: string) => {
    setSelectedLocation({ ...selectedLocation, sub, final: '' });
    const mainLoc = locations.find(loc => loc.name === selectedLocation.main);
    const finalLocs = mainLoc?.children?.find(child => child.name === sub)?.children?.map(child => child.name) || [];
    setFinalLocations(finalLocs);
  };

  const handleFinalLocationSelect = (final: string) => {
    setSelectedLocation({ ...selectedLocation, final });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
              <div className="flex space-x-2">
                {mainLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleMainLocationSelect(loc)}
                    className={`px-3 py-1 rounded ${
                      selectedLocation.main === loc ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              {subLocations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {subLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleSubLocationSelect(loc)}
                      className={`px-3 py-1 rounded ${
                        selectedLocation.sub === loc ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
              {finalLocations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {finalLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleFinalLocationSelect(loc)}
                      className={`px-3 py-1 rounded ${
                        selectedLocation.final === loc ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
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
};

export default AddItemModal;