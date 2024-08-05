// InventoryTable.tsx

import React, { useState } from 'react';
import { Item, ItemLocation, StorageLocation, Location } from '../types/types';
import { Edit, Trash2, CheckSquare, Square, Repeat, MessageSquare } from 'lucide-react';

interface InventoryTableProps {
  items: Item[];
  onUpdateLocation: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onStatusChange: (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => void;
  onSwapLocations: (itemId: string) => void;
  onUpdateMemo: (itemId: string, memo: string) => void;
  locations: Location[];
}

const InventoryTable: React.FC<InventoryTableProps> = React.memo(({ 
  items, 
  onUpdateLocation,
  onDeleteItem,
  onStatusChange,
  onSwapLocations,
  onUpdateMemo,
  locations
}) => {
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState("");

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
      const { storageMain, storageSub, storageFinal } = location;
      const mainName = findLocationName(locations, storageMain) || storageMain;
      const subName = storageSub ? findLocationName(locations, storageSub) || storageSub : '';
      const finalName = storageFinal ? findLocationName(locations, storageFinal) || storageFinal : '';
      return `${mainName}${subName ? ` / ${subName}` : ''}${finalName ? ` / ${finalName}` : ''}`;
    } else {
      const { main, sub, final } = location;
      const mainName = findLocationName(locations, main) || main;
      const subName = sub ? findLocationName(locations, sub) || sub : '';
      const finalName = final ? findLocationName(locations, final) || final : '';
      return `${mainName}${subName ? ` / ${subName}` : ''}${finalName ? ` / ${finalName}` : ''}`;
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getFullYear()).slice(-2)}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleMemoClick = (itemId: string, currentMemo: string) => {
    setEditingMemo(itemId);
    setMemoText(currentMemo);
  };

  const handleMemoSave = (itemId: string) => {
    onUpdateMemo(itemId, memoText);
    setEditingMemo(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs sm:text-sm md:text-base">
            <th className="py-2 px-1 sm:px-2 md:px-4 text-center">메모</th>
            <th className="py-2 px-1 sm:px-2 md:px-4 text-left">이름</th>
            <th className="py-2 px-1 sm:px-2 md:px-4 text-left">판매 위치</th>
            <th className="py-2 px-1 sm:px-2 md:px-4 text-left">보관 위치</th>
            <th className="py-2 px-1 sm:px-2 md:px-4 text-center">위치 변경</th>
            <th className="py-2 px-1 sm:px-2 md:px-4 text-center">위치 교환</th>
            <th className="py-2 px-1 sm:px-2 md:px-4 text-center">재고 부족</th>
            <th className="py-2 px-1 sm:px-2 md:px-4 text-center">주문 완료</th>
            <th className="py-2 px-1 sm:px-2 md:px-4 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b text-xs sm:text-sm md:text-base">
              <td className="py-2 px-1 sm:px-2 md:px-4">{item.name}</td>
              <td className="py-2 px-1 sm:px-2 md:px-4">{getLocationName(item.location)}</td>
              <td className="py-2 px-1 sm:px-2 md:px-4">{getLocationName(item.storageLocation)}</td>
              <td className="py-2 px-1 sm:px-2 md:px-4 text-center">
                <button 
                  onClick={() => onUpdateLocation(item.id)} 
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>
              </td>
              <td className="py-2 px-1 sm:px-2 md:px-4 text-center">
                <button 
                  onClick={() => onSwapLocations(item.id)} 
                  className="text-green-500 hover:text-green-700"
                >
                  <Repeat size={16} />
                </button>
              </td>
              <td className="py-2 px-1 sm:px-2 md:px-4 text-center">
                <button 
                  onClick={() => onStatusChange(item.id, 'lowStock', !item.lowStock)}
                  className="focus:outline-none"
                >
                  {item.lowStock ? <CheckSquare className="text-red-500" size={16} /> : <Square size={16} />}
                </button>
                {item.lowStockTime && (
                  <div className="text-xs text-gray-500">{formatDate(item.lowStockTime)}</div>
                )}
              </td>
              <td className="py-2 px-1 sm:px-2 md:px-4 text-center">
                <button 
                  onClick={() => onStatusChange(item.id, 'orderPlaced', !item.orderPlaced)}
                  className="focus:outline-none"
                >
                  {item.orderPlaced ? <CheckSquare className="text-green-500" size={16} /> : <Square size={16} />}
                </button>
                {item.orderPlacedTime && (
                  <div className="text-xs text-gray-500">{formatDate(item.orderPlacedTime)}</div>
                )}
              </td>
              <td className="py-2 px-1 sm:px-2 md:px-4 text-center">
                <button 
                  onClick={() => onDeleteItem(item.id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </td>
              <td className="py-2 px-1 sm:px-2 md:px-4 text-center">
                {editingMemo === item.id ? (
                  <div>
                    <input 
                      type="text" 
                      value={memoText} 
                      onChange={(e) => setMemoText(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                    <button 
                      onClick={() => handleMemoSave(item.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
                    >
                      저장
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleMemoClick(item.id, item.memo)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <MessageSquare size={16} />
                    {item.memo && <span className="ml-1">{item.memo.substring(0, 10)}...</span>}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

InventoryTable.displayName = 'InventoryTable';

export default InventoryTable;