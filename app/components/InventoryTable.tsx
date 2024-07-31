import React from 'react';
import { Item, ItemLocation, Location } from '../types/types';
import { Edit, Trash2, CheckSquare, Square } from 'lucide-react';

interface InventoryTableProps {
  items: Item[];
  onUpdateLocation: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  onStatusChange: (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => void;
  locations: Location[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  items, 
  onUpdateLocation,
  onDeleteItem,
  onStatusChange,
  locations
}) => {
  const getLocationName = (location: ItemLocation) => {
    const findLocationName = (locations: Location[], id: string): string | undefined => {
      for (const loc of locations) {
        if (loc.id === id) return loc.name;
        if (loc.children) {
          const childResult = findLocationName(loc.children, id);
          if (childResult) return childResult;
        }
      }
      return undefined;
    };
  
    const mainName = findLocationName(locations, location.main) || location.main;
    const subName = location.sub ? findLocationName(locations, location.sub) || location.sub : '';
    const finalName = location.final ? findLocationName(locations, location.final) || location.final : '';
  
    return `${mainName}${subName ? ` / ${subName}` : ''}${finalName ? ` / ${finalName}` : ''}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">이름</th>
            <th className="py-2 px-4 text-left">위치</th>
            <th className="py-2 px-4 text-center">위치변경</th>
            <th className="py-2 px-4 text-center">재고부족</th>
            <th className="py-2 px-4 text-center">주문완료</th>
            <th className="py-2 px-4 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{getLocationName(item.location)}</td>
              <td className="py-2 px-4 text-center">
                <button onClick={() => onUpdateLocation(item)} className="text-blue-500 hover:text-blue-700">
                  <Edit size={18} />
                </button>
              </td>
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