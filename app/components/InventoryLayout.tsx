'use client';

import React, { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Search, PlusCircle } from 'lucide-react';
import { Item, ItemLocation, StorageLocation } from '../types/types';
import LocationChangeModal from './LocationChangeModal';
import AddItemModal from './AddItemModal';
import InventoryLayoutMain from './layouts/InventoryLayoutMain';
import InventoryTable from './InventoryTable';
import { locations } from '../data/locations';

const InventoryLayout: React.FC = () => {
  const { items, isLoading, updateItems } = useInventory();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [highlightedLocation, setHighlightedLocation] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    preparation: true,
    sales: true,
    storage: true,
  });
  const [showLowStockItems, setShowLowStockItems] = useState(false);
  const [showOrderPlacedItems, setShowOrderPlacedItems] = useState(false);

  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    const sectionItems = items.filter((item) => {
      const location = item.location;
      const storageLocation = item.storageLocation;
      return (
        location.main?.toLowerCase() === section.toLowerCase() ||
        location.sub?.toLowerCase() === section.toLowerCase() ||
        location.final?.toLowerCase() === section.toLowerCase() ||
        storageLocation.storageMain?.toLowerCase() === section.toLowerCase() ||
        storageLocation.storageSub?.toLowerCase() === section.toLowerCase() ||
        storageLocation.storageFinal?.toLowerCase() === section.toLowerCase()
      );
    });
    setDisplayedItems(sectionItems);
    setHighlightedLocation(section);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const results = items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const locationString = `${item.location.main} ${item.location.sub} ${item.location.final}`.toLowerCase();
      const storageLocationString = `${item.storageLocation.storageMain} ${item.storageLocation.storageSub} ${item.storageLocation.storageFinal}`.toLowerCase();
      return searchTerms.every((term) => 
        itemName.includes(term) || 
        locationString.includes(term) || 
        storageLocationString.includes(term)
      );
    });
    setDisplayedItems(results);
    setSelectedSection(null);
    if (results.length > 0) {
      setHighlightedLocation(
        results[0].location.final || results[0].location.sub || results[0].location.main ||
        results[0].storageLocation.storageFinal || results[0].storageLocation.storageSub || results[0].storageLocation.storageMain
      );
    }
  };

  const handleUpdateLocation = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      setSelectedItem(item);
      setIsLocationModalOpen(true);
    }
  };

  const handleLocationChange = async (itemId: string, newLocation: ItemLocation, newStorageLocation: StorageLocation) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, location: newLocation, storageLocation: newStorageLocation } : item
    );
    await updateItems(updatedItems);
    setIsLocationModalOpen(false);
    setSelectedItem(null);
  };

  const convertToItemLocation = (location: StorageLocation): ItemLocation => {
    return {
      main: location.storageMain,
      sub: location.storageSub || undefined,
      final: location.storageFinal || undefined
    };
  };

  const convertToStorageLocation = (location: ItemLocation): StorageLocation => {
    return {
      storageMain: location.main,
      storageSub: location.sub || '',
      storageFinal: location.final || ''
    };
  };

  const handleSwapLocations = async (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      const updatedItem = {
        ...item,
        location: convertToItemLocation(item.storageLocation),
        storageLocation: convertToStorageLocation(item.location)
      };
      const updatedItems = items.map(i => i.id === itemId ? updatedItem : i);
      await updateItems(updatedItems);
    }
  };

  const updateItemStatus = async (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? { ...item, [status]: value, [`${status}Time`]: value ? new Date().toISOString() : null }
        : item
    );
    await updateItems(updatedItems);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      const updatedItems = items.filter((item) => item.id !== itemId);
      await updateItems(updatedItems);
    }
  };

  const handleAddItem = async (newItem: Item) => {
    try {
      const updatedItems = [...items, newItem];
      await updateItems(updatedItems);
      setDisplayedItems(updatedItems);
      setIsAddItemModalOpen(false);
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  const filteredItems = displayedItems.filter(item => 
    (!showLowStockItems || item.lowStock) &&
    (!showOrderPlacedItems || item.orderPlaced)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">재고 관리 보고서</h1>
      <div className="grid grid-cols-[3.5fr,6.5fr] gap-2">
      
      {/* 재고 위치 */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700"></h2>
        <div className="flex space-x-2 mb-4">
          {['preparation', 'sales', 'storage'].map((key) => (
            <button 
              key={key}
              onClick={() => setVisibleSections(prev => ({ ...prev, [key]: !prev[key] }))} 
              className={`px-3 py-1 rounded ${visibleSections[key] ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
            >
              {visibleSections[key] ? `${key} 숨기기` : `${key} 보기`}
            </button>
          ))}
        </div>
        <InventoryLayoutMain 
          visibleSections={visibleSections}
          handleSectionClick={handleSectionClick}
          highlightedLocation={highlightedLocation}
        />
      </div>
  
      {/* 검색 및 아이템 목록 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">아이템 목록</h2>
          <button 
            onClick={() => setIsAddItemModalOpen(true)} 
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600 transition duration-200"
          >
            <PlusCircle size={20} className="mr-2" />
            아이템 추가
          </button>
        </div>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="아이템 검색..."
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition duration-200" disabled={isLoading}>
              {isLoading ? '로딩 중...' : <Search size={20} />}
            </button>
          </div>
        </form>
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => setShowLowStockItems(!showLowStockItems)}
            className={`px-3 py-1 rounded ${showLowStockItems ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
          >
            재고 부족 항목 {showLowStockItems ? '숨기기' : '보기'}
          </button>
          <button
            onClick={() => setShowOrderPlacedItems(!showOrderPlacedItems)}
            className={`px-3 py-1 rounded ${showOrderPlacedItems ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
          >
            주문 완료 항목 {showOrderPlacedItems ? '숨기기' : '보기'}
          </button>
        </div>
        <InventoryTable 
          items={filteredItems}
          onStatusChange={updateItemStatus}
          onUpdateLocation={handleUpdateLocation}
          onDeleteItem={handleDeleteItem}
          onSwapLocations={handleSwapLocations}
          locations={locations}
        />
      </div>
    </div>
    
    {selectedItem && (
      <LocationChangeModal 
        isOpen={isLocationModalOpen} 
        item={selectedItem} 
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleLocationChange}
        locations={locations}
      />
    )}
    <AddItemModal 
      isOpen={isAddItemModalOpen} 
      onClose={() => setIsAddItemModalOpen(false)}
      onAddItem={handleAddItem}
      existingItems={items}
      locations={locations}
    />
  </div>
  );
}

export default InventoryLayout;