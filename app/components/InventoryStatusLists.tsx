import React, { useState } from 'react';
import { Item } from '../types/types';

interface InventoryStatusListsProps {
  items: Item[];
  onUpdateStatus: (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => void;
}

const InventoryStatusLists: React.FC<InventoryStatusListsProps> = ({ items, onUpdateStatus }) => {
  const [checkedLowStockItems, setCheckedLowStockItems] = useState<string[]>([]);
  const [checkedOrderedItems, setCheckedOrderedItems] = useState<string[]>([]);

  const lowStockItems = items.filter(item => item.lowStock);
  const orderedItems = items.filter(item => item.orderPlaced);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleCheckItem = (itemId: string, listType: 'lowStock' | 'orderPlaced') => {
    if (listType === 'lowStock') {
      setCheckedLowStockItems(prev => 
        prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
    } else {
      setCheckedOrderedItems(prev => 
        prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
    }
  };

  const handleRemoveCheckedItems = (listType: 'lowStock' | 'orderPlaced') => {
    const itemsToRemove = listType === 'lowStock' ? checkedLowStockItems : checkedOrderedItems;
    itemsToRemove.forEach(itemId => {
      onUpdateStatus(itemId, listType, false);
    });
    if (listType === 'lowStock') {
      setCheckedLowStockItems([]);
    } else {
      setCheckedOrderedItems([]);
    }
  };

  return (
    <div className="flex space-x-4 mb-4">
      <div className="w-1/2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">부족 재고 리스트</h3>
          <button 
            onClick={() => handleRemoveCheckedItems('lowStock')}
            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
          >
            체크한 품목 삭제
          </button>
        </div>
        <ul className="bg-red-100 p-2 rounded">
          {lowStockItems.map(item => (
            <li key={item.id} className="mb-1 flex items-center">
              <input
                type="checkbox"
                checked={checkedLowStockItems.includes(item.id)}
                onChange={() => handleCheckItem(item.id, 'lowStock')}
                className="mr-2"
              />
              <span className="font-medium">{item.name}</span> -&gt; {item.location.final}
              <span className="text-xs text-gray-600 ml-2">
                {formatDate(item.lowStockTime)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">주문 완료 리스트</h3>
          <button 
            onClick={() => handleRemoveCheckedItems('orderPlaced')}
            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
          >
            체크한 품목 삭제
          </button>
        </div>
        <ul className="bg-green-100 p-2 rounded">
          {orderedItems.map(item => (
            <li key={item.id} className="mb-1 flex items-center">
              <input
                type="checkbox"
                checked={checkedOrderedItems.includes(item.id)}
                onChange={() => handleCheckItem(item.id, 'orderPlaced')}
                className="mr-2"
              />
              <span className="font-medium">{item.name}</span> -&gt; {item.location.final}
              <span className="text-xs text-gray-600 ml-2">
                {formatDate(item.orderPlacedTime)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryStatusLists;