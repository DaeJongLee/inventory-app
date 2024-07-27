import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface InventoryItemStatusProps {
  itemId: string;  // 'id'를 'itemId'로 변경
  lowStock: boolean;
  orderPlaced: boolean;
  lowStockTime: string | null;
  orderPlacedTime: string | null;
  onStatusChange: (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => void;
}

const InventoryItemStatus: React.FC<InventoryItemStatusProps> = ({ 
  itemId,  // 'id'를 'itemId'로 변경
  lowStock, 
  orderPlaced,
  lowStockTime,
  orderPlacedTime,
  onStatusChange
}) => {
  const formatTime = (time: string | null) => {
    if (!time) return null;
    const date = new Date(time);
    return `${date.getFullYear().toString().substr(-2)}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <button onClick={() => onStatusChange(itemId, 'lowStock', !lowStock)} className="flex items-center">
          {lowStock ? <CheckSquare className="text-red-500" /> : <Square />}
          <span className="ml-1">부족</span>
        </button>
        {lowStockTime && <span className="text-xs text-gray-500">{formatTime(lowStockTime)}</span>}
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => onStatusChange(itemId, 'orderPlaced', !orderPlaced)} className="flex items-center">
          {orderPlaced ? <CheckSquare className="text-green-500" /> : <Square />}
          <span className="ml-1">주문완료</span>
        </button>
        {orderPlacedTime && <span className="text-xs text-gray-500">{formatTime(orderPlacedTime)}</span>}
      </div>
    </div>
  );
};

export default InventoryItemStatus;