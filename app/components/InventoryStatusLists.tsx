import React from 'react';
import { Item } from '../types/types';

interface InventoryStatusListsProps {
  items: Item[];
}

const InventoryStatusLists: React.FC<InventoryStatusListsProps> = ({ items }) => {
  const lowStockItems = items.filter(item => item.lowStock);
  const orderedItems = items.filter(item => item.orderPlaced);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="flex space-x-4 mb-4">
      <div className="w-1/2">
        <h3 className="text-lg font-semibold mb-2">부족 재고 리스트</h3>
        <ul className="bg-red-100 p-2 rounded">
          {lowStockItems.map(item => (
            <li key={item.id} className="mb-1">
              <span className="font-medium">{item.name}</span> -&gt; {item.location.final}
              <span className="text-xs text-gray-600 ml-2">
                {formatDate(item.lowStockTime)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2">
        <h3 className="text-lg font-semibold mb-2">주문 완료 리스트</h3>
        <ul className="bg-green-100 p-2 rounded">
          {orderedItems.map(item => (
            <li key={item.id} className="mb-1">
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