'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Search, PlusCircle, Menu } from 'lucide-react';
import { Item, ItemLocation, StorageLocation } from '../types/types';
import LocationChangeModal from './LocationChangeModal';
import AddItemModal from './AddItemModal';
import InventoryLayoutMain from './layouts/InventoryLayoutMain';
import InventoryTable from './InventoryTable';
import { locations } from '../data/locations';

const convertToItemLocation = (storageLocation: StorageLocation): ItemLocation => {
  return {
    main: storageLocation.storageMain,
    sub: storageLocation.storageSub || undefined,
    final: storageLocation.storageFinal || undefined
  };
};

const convertToStorageLocation = (location: ItemLocation): StorageLocation => {
  return {
    storageMain: location.main,
    storageSub: location.sub || '',
    storageFinal: location.final || ''
  };
};

const InventoryLayout: React.FC = () => {
  const { items: initialItems, isLoading, updateItems } = useInventory();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [highlightedLocation, setHighlightedLocation] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [showInventoryLayout, setShowInventoryLayout] = useState(false);
  const [showLowStockItems, setShowLowStockItems] = useState(false);
  const [showOrderPlacedItems, setShowOrderPlacedItems] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    setItems(initialItems);
    setDisplayedItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectionClick = useCallback((section: string) => {
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
  }, [items]);

  const handleSearch = useCallback((e: React.FormEvent) => {
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
  }, [items, searchTerm]);

  const handleUpdateLocation = useCallback((itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      setSelectedItem(item);
      setIsLocationModalOpen(true);
    }
  }, [items]);

  const handleLocationChange = useCallback(async (itemId: string, newLocation: ItemLocation, newStorageLocation: StorageLocation) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, location: newLocation, storageLocation: newStorageLocation } : item
    );
    setItems(updatedItems);
    setDisplayedItems(updatedItems);
    setIsLocationModalOpen(false);
    setSelectedItem(null);
    try {
      await updateItems(updatedItems);
    } catch (error) {
      console.error('Error updating item location:', error);
      alert('위치 변경 중 오류가 발생했습니다.');
    }
  }, [items, updateItems]);

  const handleSwapLocations = useCallback(async (itemId: string) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          location: convertToItemLocation(item.storageLocation),
          storageLocation: convertToStorageLocation(item.location)
        };
      }
      return item;
    });
    setItems(updatedItems);
    setDisplayedItems(updatedItems);
    try {
      await updateItems(updatedItems);
    } catch (error) {
      console.error('Error swapping locations:', error);
      alert('위치 교환 중 오류가 발생했습니다.');
    }
  }, [items, updateItems]);

  const updateItemStatus = useCallback(async (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          [status]: value,
          [`${status}Time`]: value ? new Date().toISOString() : null
        };
      }
      return item;
    });
    setItems(updatedItems);
    setDisplayedItems(updatedItems);
    try {
      await updateItems(updatedItems);
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('상태 업데이트 중 오류가 발생했습니다.');
    }
  }, [items, updateItems]);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      const updatedItems = items.filter((item) => item.id !== itemId);
      setItems(updatedItems);
      setDisplayedItems(updatedItems);
      try {
        await updateItems(updatedItems);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('항목 삭제 중 오류가 발생했습니다.');
      }
    }
  }, [items, updateItems]);

  const handleAddItem = useCallback(async (newItem: Item) => {
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setDisplayedItems(updatedItems);
    setIsAddItemModalOpen(false);
    try {
      await updateItems(updatedItems);
    } catch (error) {
      console.error('Error adding new item:', error);
      alert('새 항목 추가 중 오류가 발생했습니다.');
    }
  }, [items, updateItems]);

  const filteredItems = displayedItems.filter(item => 
    (!showLowStockItems || item.lowStock) &&
    (!showOrderPlacedItems || item.orderPlaced)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 relative">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">재고 관리 보고서</h1>
      
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowInventoryLayout(!showInventoryLayout)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 flex items-center"
        >
          <Menu className="mr-2" size={20} />
          {showInventoryLayout ? '재고 위치 숨기기' : '재고 위치 보기'}
        </button>
      </div>
  
      {showInventoryLayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowInventoryLayout(false)}></div>
      )}
  
      <div className={`fixed top-0 left-0 h-full w-1/3 bg-white shadow-lg transition-all duration-300 ease-in-out z-50 overflow-y-auto ${
        showInventoryLayout ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">재고 위치</h2>
          <InventoryLayoutMain 
            visibleSections={{
              preparation: true,
              sales: true,
              storage: true
            }}
            handleSectionClick={handleSectionClick}
            highlightedLocation={highlightedLocation}
          />
        </div>
      </div>
  
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
        <div className="overflow-x-auto">
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