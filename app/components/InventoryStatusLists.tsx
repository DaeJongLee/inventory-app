import React, { useState } from 'react';
import { Item } from '../types/types';
import InventoryItemStatus from './InventoryItemStatus';
import { Trash2 } from 'lucide-react';

interface InventoryStatusListsProps {
  items: Item[];
  listType: 'lowStock' | 'orderPlaced';
  onStatusChange: (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => void;
  onDeleteItems: (itemIds: string[]) => void;
}

const InventoryStatusLists: React.FC<InventoryStatusListsProps> = ({ items, listType, onStatusChange, onDeleteItems }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const filteredItems = items.filter(item => 
    listType === 'lowStock' ? item.lowStock : item.orderPlaced
  );

  const handleCheckItem = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleDeleteCheckedItems = () => {
    onDeleteItems(checkedItems);
    setCheckedItems([]);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      {checkedItems.length > 0 && (
        <button 
          onClick={handleDeleteCheckedItems}
          className="mb-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 flex items-center"
        >
          <Trash2 size={18} className="mr-2" />
          체크한 품목 삭제 ({checkedItems.length})
        </button>
      )}
      <ul className={`p-2 rounded ${listType === 'lowStock' ? 'bg-red-100' : 'bg-green-100'}`}>
        {filteredItems.map(item => (
          <li key={item.id} className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={checkedItems.includes(item.id)}
                onChange={() => handleCheckItem(item.id)}
                className="mr-2"
              />
              <span className="font-medium">{item.name}</span> -&gt; {item.location.final || item.location.sub || item.location.main}
              <span className="text-xs text-gray-600 ml-2">
                {formatDate(listType === 'lowStock' ? item.lowStockTime : item.orderPlacedTime)}
              </span>
            </div>
            <InventoryItemStatus 
              itemId={item.id}
              lowStock={item.lowStock}
              orderPlaced={item.orderPlaced}
              lowStockTime={item.lowStockTime}
              orderPlacedTime={item.orderPlacedTime}
              onStatusChange={onStatusChange}
            />
          </li>
        ))}
        {filteredItems.length === 0 && (
          <li className="text-gray-500 italic">목록이 비어 있습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default InventoryStatusLists;