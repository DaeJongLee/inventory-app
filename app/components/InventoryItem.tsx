import React, { useState, useEffect } from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface InventoryItemStatusProps {
  itemId: string;
  initialLowStock?: boolean;
  initialOrderPlaced?: boolean;
}

const InventoryItemStatus: React.FC<InventoryItemStatusProps> = ({ itemId, initialLowStock = false, initialOrderPlaced = false }) => {
  const [lowStock, setLowStock] = useState(initialLowStock);
  const [orderPlaced, setOrderPlaced] = useState(initialOrderPlaced);
  const [lowStockTime, setLowStockTime] = useState<string | null>(null);
  const [orderPlacedTime, setOrderPlacedTime] = useState<string | null>(null);

  useEffect(() => {
    // Here you would typically fetch the initial state from a database
    // For now, we'll just use the props
    if (initialLowStock) setLowStockTime(getCurrentTime());
    if (initialOrderPlaced) setOrderPlacedTime(getCurrentTime());
  }, [initialLowStock, initialOrderPlaced]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getFullYear().toString().substr(-2)}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleLowStockChange = () => {
    const newLowStock = !lowStock;
    setLowStock(newLowStock);
    setLowStockTime(newLowStock ? getCurrentTime() : null);
    // Here you would typically update the database
  };

  const handleOrderPlacedChange = () => {
    const newOrderPlaced = !orderPlaced;
    setOrderPlaced(newOrderPlaced);
    setOrderPlacedTime(newOrderPlaced ? getCurrentTime() : null);
    // Here you would typically update the database
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <button onClick={handleLowStockChange} className="flex items-center">
          {lowStock ? <CheckSquare className="text-red-500" /> : <Square />}
          <span className="ml-1">부족</span>
        </button>
        {lowStockTime && <span className="text-xs text-gray-500">{lowStockTime}</span>}
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={handleOrderPlacedChange} className="flex items-center">
          {orderPlaced ? <CheckSquare className="text-green-500" /> : <Square />}
          <span className="ml-1">주문완료</span>
        </button>
        {orderPlacedTime && <span className="text-xs text-gray-500">{orderPlacedTime}</span>}
      </div>
    </div>
  );
};

export default InventoryItemStatus;