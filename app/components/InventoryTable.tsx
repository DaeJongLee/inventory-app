import React from 'react';
import { Item, ItemLocation } from '../types/types';
import { CheckSquare, Square, Edit, Trash2 } from 'lucide-react';

interface InventoryTableProps {
  items: Item[];
  onStatusChange: (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => void;
  onUpdateLocation: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  items, 
  onStatusChange, 
  onUpdateLocation, 
  onDeleteItem 
}) => {
  const getLocationName = (location: ItemLocation) => {
    return `${location.main}${location.sub ? ` > ${location.sub}` : ''}${location.final ? ` > ${location.final}` : ''}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">이름</th>
            <th className="py-2 px-4 text-left">위치</th>
            <th className="py-2 px-4 text-center">부족</th>
            <th className="py-2 px-4 text-center">주문완료</th>
            <th className="py-2 px-4 text-center">위치변경</th>
            <th className="py-2 px-4 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{getLocationName(item.location)}</td>
              <td className="py-2 px-4 text-center">
                <button onClick={() => onStatusChange(item.id, 'lowStock', !item.lowStock)}>
                  {item.lowStock ? <CheckSquare className="text-red-500" /> : <Square />}
                </button>
              </td>
              <td className="py-2 px-4 text-center">
                <button onClick={() => onStatusChange(item.id, 'orderPlaced', !item.orderPlaced)}>
                  {item.orderPlaced ? <CheckSquare className="text-green-500" /> : <Square />}
                </button>
              </td>
              <td className="py-2 px-4 text-center">
                <button onClick={() => onUpdateLocation(item)} className="text-blue-500 hover:text-blue-700">
                  <Edit size={18} />
                </button>
              </td>
              <td className="py-2 px-4 text-center">
                <button onClick={() => onDeleteItem(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;