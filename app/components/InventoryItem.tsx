import React from 'react';
import { Item, ItemLocation, StorageLocation } from '../types/types';
import InventoryItemStatus from './InventoryItemStatus';

interface InventoryItemProps {
  item: Item;
  onStatusChange: (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => void;
  onUpdateLocation: (itemId: string) => void;
}

// eslint-disable-next-line react/display-name
const InventoryItem: React.FC<InventoryItemProps> = React.memo(({ item, onStatusChange, onUpdateLocation }) => {
  const getLocationString = (location: ItemLocation | StorageLocation) => {
    if ('main' in location) {
      // This is an ItemLocation
      return `${location.main}${location.sub ? ` / ${location.sub}` : ''}${location.final ? ` / ${location.final}` : ''}`;
    } else {
      // This is a StorageLocation
      return `${location.storageMain}${location.storageSub ? ` / ${location.storageSub}` : ''}${location.storageFinal ? ` / ${location.storageFinal}` : ''}`;
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-bold">{item.name}</h3>
      <p>위치: {getLocationString(item.location)}</p>
      <p>보관 위치: {getLocationString(item.storageLocation)}</p>
      <InventoryItemStatus 
        itemId={item.id}
        lowStock={item.lowStock}
        orderPlaced={item.orderPlaced}
        lowStockTime={item.lowStockTime}
        orderPlacedTime={item.orderPlacedTime}
        onStatusChange={onStatusChange}
      />
      <button 
        onClick={() => onUpdateLocation(item.id)}
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200"
      >
        위치 변경
      </button>
    </div>
  );
});

export default InventoryItem;