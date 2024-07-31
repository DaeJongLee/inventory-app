import React from 'react';
import { Item, ItemLocation, StorageLocation, Location } from '../types/types';
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
  const getLocationName = (location: ItemLocation | StorageLocation) => {
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
  
    if ('storageMain' in location) {
      // This is a StorageLocation
      const { storageMain, storageSub, storageFinal } = location;
      const mainName = findLocationName(locations, storageMain) || storageMain;
      const subName = storageSub ? findLocationName(locations, storageSub) || storageSub : '';
      const finalName = storageFinal ? findLocationName(locations, storageFinal) || storageFinal : '';
      return `${mainName}${subName ? ` / ${subName}` : ''}${finalName ? ` / ${finalName}` : ''}`;
    } else {
      // This is an ItemLocation
      const { main, sub, final } = location;
      const mainName = findLocationName(locations, main) || main;
      const subName = sub ? findLocationName(locations, sub) || sub : '';
      const finalName = final ? findLocationName(locations, final) || final : '';
      return `${mainName}${subName ? ` / ${subName}` : ''}${finalName ? ` / ${finalName}` : ''}`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">이름</th>
            <th className="py-2 px-4 text-left">판매 위치</th>
            <th className="py-2 px-4 text-left">보관 위치</th>
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
              <td className="py-2 px-4">{getLocationName(item.storageLocation)}</td>
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