'use client';

import React, { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Search, PlusCircle } from 'lucide-react';
import { Item, ItemLocation } from '../types/types';
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

  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    const sectionItems = items.filter((item) => {
      const location = item.location;
      return (
        location.main?.toLowerCase() === section.toLowerCase() ||
        location.sub?.toLowerCase() === section.toLowerCase() ||
        location.final?.toLowerCase() === section.toLowerCase()
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
      return searchTerms.every((term) => itemName.includes(term));
    });
    setDisplayedItems(results);
    setSelectedSection(null);
    if (results.length > 0) {
      setHighlightedLocation(
        results[0].location.final || results[0].location.sub || results[0].location.main
      );
    }
  };

  const handleUpdateLocation = (item: Item) => {
    setSelectedItem(item);
    setIsLocationModalOpen(true);
  };

  const handleLocationChange = async (itemId: string, newLocation: ItemLocation) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, location: newLocation } : item
    );
    await updateItems(updatedItems);
    setIsLocationModalOpen(false);
    setSelectedItem(null);
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
      await updateItems([...items, newItem]);
      setIsAddItemModalOpen(false);  // 모달을 닫습니다.
    } catch (error) {
      console.error("Error adding new item:", error);
      // 오류 메시지를 사용자에게 표시할 수 있습니다.
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">재고 관리 보고서</h1>
      
      {/* 재고 위치 */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">재고 위치</h2>
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
  
      {/* 2열 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽 열: 재고 부족 리스트와 주문 완료 리스트 */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">재고 부족 리스트</h2>
            <InventoryTable 
              items={items.filter(item => item.lowStock)}
              onStatusChange={updateItemStatus}
              onUpdateLocation={handleUpdateLocation}
              onDeleteItem={handleDeleteItem}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">주문 완료 리스트</h2>
            <InventoryTable 
              items={items.filter(item => item.orderPlaced)}
              onStatusChange={updateItemStatus}
              onUpdateLocation={handleUpdateLocation}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </div>
  
        {/* 오른쪽 열: 검색 결과 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">검색 결과</h2>
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
          <InventoryTable 
            items={displayedItems}
            onStatusChange={updateItemStatus}
            onUpdateLocation={handleUpdateLocation}
            onDeleteItem={handleDeleteItem}
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
      {isAddItemModalOpen && (
        <AddItemModal 
          isOpen={isAddItemModalOpen} 
          onClose={() => setIsAddItemModalOpen(false)}
          onAddItem={handleAddItem}
          existingItems={items}
          locations={locations}
        />
      )}
    </div>
  );
}
export default InventoryLayout;