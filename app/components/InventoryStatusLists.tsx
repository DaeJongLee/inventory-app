import React from 'react';
import { Item } from '../types/types';

interface InventoryStatusListsProps {
  items: Item[];
}

const InventoryStatusLists: React.FC<InventoryStatusListsProps> = ({ items }) => {
  const lowStockItems = items.filter(item => item.lowStock);
  const orderedItems = items.filter(item => item.orderPlaced);

  return (
    <div className="flex space-x-4">
      <div className="w-1/2">
        <h3 className="text-lg font-semibold mb-2">부족 재고 리스트</h3>
        <ul className="bg-red-100 p-2 rounded">
          {lowStockItems.map(item => (
            <li key={item.id} className="mb-1">
              {item.name} - {item.location.main} &gt; {item.location.sub} &gt; {item.location.final}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2">
        <h3 className="text-lg font-semibold mb-2">주문 완료 리스트</h3>
        <ul className="bg-green-100 p-2 rounded">
          {orderedItems.map(item => (
            <li key={item.id} className="mb-1">
              {item.name} - {item.location.main} &gt; {item.location.sub} &gt; {item.location.final}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryStatusLists;