'use client'

import React, { useState, useEffect } from 'react';
import { Search, Info, MapPin, PlusCircle } from 'lucide-react';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemLocation } from '../types/types';
import { locations } from '../data/locations';
import LocationChangeModal from './LocationChangeModal';
import InventoryItemStatus from './InventoryItemStatus';
import InventoryStatusLists from './InventoryStatusLists';
import AddItemModal from './AddItemModal';
import InventoryLayoutMain from './layouts/InventoryLayoutMain';

const InventoryLayout = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [highlightedLocation, setHighlightedLocation] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    preparation: true,
    sales: true,
    storage: true
  });
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const newItems = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lowStock: data.lowStock || false,
          orderPlaced: data.orderPlaced || false,
          lowStockTime: data.lowStockTime || null,
          orderPlacedTime: data.orderPlacedTime || null
        };
      }) as Item[];
      setItems(newItems);
      setDisplayedItems(newItems);
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const matchedItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(matchedItems.map(item => item.name));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, items]);

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    const sectionItems = items.filter(item => {
      const location = item.location;
      if (typeof location === 'object') {
        return (
          location.main?.toLowerCase() === section.toLowerCase() ||
          location.sub?.toLowerCase() === section.toLowerCase() ||
          location.final?.toLowerCase() === section.toLowerCase() ||
          Object.values(location).some(value => 
            typeof value === 'string' && value.toLowerCase() === section.toLowerCase()
          )
        );
      }
      return false;
    });
    setDisplayedItems(sectionItems);
    setHighlightedLocation(section);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const results = items.filter(item => {
      if (item && typeof item.name === 'string') {
        const itemName = item.name.toLowerCase();
        return searchTerms.every(term => itemName.includes(term));
      }
      return false;
    });
    setDisplayedItems(results);
    setSelectedSection(null);
    if (results.length > 0) {
      setHighlightedLocation(results[0].location.final || results[0].location.sub || results[0].location.main);
    }
  };

  const handleUpdateLocation = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleLocationChange = async (itemId: string, newLocation: ItemLocation) => {
    try {
      await updateDoc(doc(db, 'items', itemId), { location: newLocation });
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error updating item location:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('정말로 이 아이템을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'items', itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const getLocationName = (location: ItemLocation) => {
    const mainName = locations.find(loc => loc.id === location.main)?.name || location.main;
    const subName = location.sub ? ` > ${locations.find(loc => loc.id === location.main)?.children?.find(subLoc => subLoc.id === location.sub)?.name || location.sub}` : '';
    const finalName = location.final ? ` > ${locations.find(loc => loc.id === location.main)?.children?.find(subLoc => subLoc.id === location.sub)?.children?.find(finalLoc => finalLoc.id === location.final)?.name || location.final}` : '';
    return `${mainName}${subName}${finalName}`;
  };

  const updateItemStatus = async (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => {
    try {
      const itemRef = doc(db, 'items', itemId);
      
      await updateDoc(itemRef, { 
        [status]: value,
        [`${status}Time`]: value ? new Date().toISOString() : null
      });
  
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, [status]: value, [`${status}Time`]: value ? new Date().toISOString() : null } : item
        )
      );
  
      console.log(`Item ${itemId} ${status} updated to ${value}`);
    } catch (error) {
      console.error(`Error updating item ${itemId} ${status}:`, error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">재고 관리 보고서</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">재고 레이아웃</h2>
          
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

          <div className="flex space-x-2 mb-4">
            {[
              { key: 'preparation', label: '조제실' },
              { key: 'sales', label: '판매 구역' },
              { key: 'storage', label: '집하장' }
            ].map(({ key, label }) => (
              <button 
                key={key}
                onClick={() => setVisibleSections(prev => ({ ...prev, [key]: !prev[key] }))} 
                className={`px-3 py-1 rounded ${visibleSections[key] ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
              >
                {visibleSections[key] ? `${label} 숨기기` : `${label} 보기`}
              </button>
            ))}
          </div>

          <InventoryLayoutMain 
            visibleSections={visibleSections}
            handleSectionClick={handleSectionClick}
            highlightedLocation={highlightedLocation}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              {selectedSection ? `${selectedSection} 아이템 목록` : '검색 결과'}
            </h2>
            <button 
              onClick={() => setIsAddItemModalOpen(true)} 
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600 transition duration-200"
            >
              <PlusCircle size={20} className="mr-2" />
              아이템 추가
            </button>
          </div>
          
          <InventoryStatusLists 
            items={items} 
            onUpdateStatus={updateItemStatus}
          />
          
          <ul className="space-y-4 mt-4">
            {displayedItems.map((item) => (
              <li key={item.id} className="border p-4 rounded-lg hover:shadow-md transition duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-lg">{item.name}</span>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin size={16} className="mr-1" />
                      <span>{getLocationName(item.location)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <InventoryItemStatus 
                      itemId={item.id}
                      lowStock={item.lowStock}
                      orderPlaced={item.orderPlaced}
                      lowStockTime={item.lowStockTime}
                      orderPlacedTime={item.orderPlacedTime}
                      onStatusChange={(itemId, status, value) => updateItemStatus(itemId, status as 'lowStock' | 'orderPlaced', value)}
                    />
                    <div>
                      <button 
                        onClick={() => handleUpdateLocation(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition duration-200"
                      >
                        위치 변경
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {selectedSection && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold flex items-center text-gray-700">
                <Info className="mr-2" />
                {selectedSection} 정보
              </h3>
              <p className="mt-2 text-gray-600">
                {locations.find(loc => loc.id.toLowerCase() === selectedSection.toLowerCase())?.name || '정보 없음'}
              </p>
              <ul className="mt-2 list-disc list-inside">
                {displayedItems.map(item => (
                  <li key={item.id} className="text-gray-600">{item.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedItem && (
        <LocationChangeModal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onLocationChange={handleLocationChange}
          locations={locations}
        />
      )}
      {isAddItemModalOpen && (
        <AddItemModal
          onClose={() => setIsAddItemModalOpen(false)}
          onAddItem={(newItem: Item) => {
            setItems([...items, newItem]);
            setDisplayedItems([...displayedItems, newItem]);
          }}
          existingItems={items}
          locations={locations}
        />
      )}
    </div>
  );
};

export default InventoryLayout;