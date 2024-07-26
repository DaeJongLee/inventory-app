'use client'

import React, { useState, useEffect } from 'react';
import { Search, Info, MapPin } from 'lucide-react';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemLocation } from '../types/types';
import { locations } from '../data/locations';
import LocationButton from './LocationButton';
import LocationChangeModal from './LocationChangeModal';
import SubLocationModal from './SubLocationModal';
import InventoryItemStatus from './InventoryItemStatus';
import InventoryStatusLists from './InventoryStatusLists';

const InventoryLayout = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [highlightedLocation, setHighlightedLocation] = useState<ItemLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSubLocationModalOpen, setIsSubLocationModalOpen] = useState(false);
  const [selectedMainLocation, setSelectedMainLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    setHighlightedLocation(null);
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
      setHighlightedLocation(results[0].location);
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
    const subName = location.sub ? ` > ${locations.find(loc => loc.id === location.sub)?.name || location.sub}` : '';
    const finalName = location.final ? ` > ${locations.find(loc => loc.id === location.final)?.name || location.final}` : '';
    return `${mainName}${subName}${finalName}`;
  };

  const handleMainLocationClick = (location: string) => {
    if (location === 'red-' || location === 'blue-') {
      setSelectedMainLocation(location);
      setIsSubLocationModalOpen(true);
    } else {
      handleSectionClick(location);
    }
  };

  const handleSubLocationSelect = (subLocation: string) => {
    setIsSubLocationModalOpen(false);
    handleSectionClick(`${selectedMainLocation}${subLocation}`);
  };

  const updateItemStatus = async (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => {
    try {
      const itemRef = doc(db, 'items', itemId);
      
      // Firebase 데이터베이스 업데이트
      await updateDoc(itemRef, { 
        [status]: value,
        [`${status}Time`]: value ? new Date().toISOString() : null
      });
  
      // 로컬 상태 업데이트
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

  const renderInventoryLayout = () => (
    <div className="grid grid-cols-3 gap-4">
      {/* 조제실 레이아웃 */}
      <div className="col-span-3">
        <h3 className="text-lg font-semibold mb-2">조제실</h3>
        <div className="grid grid-cols-4 gap-1">
          {/* 조제실 4열 횡대*/}
          <div></div>
          <LocationButton id="MA" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'MA' || highlightedLocation?.sub === 'MA'} />
          <LocationButton id="MB" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'MB' || highlightedLocation?.sub === 'MB'} />
          <div></div>
          {/* 1열 */}
          <LocationButton id="LC" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'LC' || highlightedLocation?.sub === 'LC'} />
          <div></div>
          <div></div>
          <LocationButton id="RA" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'RA' || highlightedLocation?.sub === 'RA'} />
          {/* 2열 */}
          <LocationButton id="LB" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'LB' || highlightedLocation?.sub === 'LB'} />
          <LocationButton id="INS" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'INS' || highlightedLocation?.sub === 'INS'} />
          <div></div>
          <LocationButton id="RB" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'RB' || highlightedLocation?.sub === 'RB'} />
          <LocationButton id="LA" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'LA' || highlightedLocation?.sub === 'LA'} />
          <LocationButton id="N (0-9)" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'N (0-9)' || highlightedLocation?.sub === 'N (0-9)'} />
          <div></div>
          <LocationButton id="RC" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === 'RC' || highlightedLocation?.sub === 'RC'} />
          {/* 3열 */}
        </div>
      </div>
      {/* 판매 구역 레이아웃 */}
      <div className="col-span-3">
        <h3 className="text-lg font-semibold mb-2">판매 구역</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-5 gap-1">
            <LocationButton id="냉장고" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === '냉장고'} />
            <LocationButton id="온장고" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === '온장고'} />
            <LocationButton id="랙" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === '랙'} />
            <LocationButton id="의자밑" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === '의자밑'} />
            <LocationButton id="밴드매대" onClick={handleSectionClick} isHighlighted={highlightedLocation?.main === '밴드매대'} />
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="grid grid-rows-3 gap-1">
              <LocationButton id="Red-A" onClick={handleSectionClick} isHighlighted={highlightedLocation?.sub === 'Red-A'} />
              <LocationButton id="Red-B" onClick={handleSectionClick} isHighlighted={highlightedLocation?.sub === 'Red-B'} />
              <LocationButton id="red-" onClick={() => handleMainLocationClick('red-')} isHighlighted={highlightedLocation?.sub === 'red-'} />
            </div>
            <div className="grid grid-rows-3 gap-1">
              <LocationButton id="Blue-A" onClick={handleSectionClick} isHighlighted={highlightedLocation?.sub === 'Blue-A'} />
              <LocationButton id="Blue-B" onClick={handleSectionClick} isHighlighted={highlightedLocation?.sub === 'Blue-B'} />
              <LocationButton id="blue-" onClick={() => handleMainLocationClick('blue-')} isHighlighted={highlightedLocation?.sub === 'blue-'} />
            </div>
            <LocationButton id="Green-" onClick={handleSectionClick} isHighlighted={highlightedLocation?.sub === 'Green-'} />
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['DPA', 'DPB', 'DPC', 'DPD', 'DPE', 'DPF', 'DPG'].map(id => (
              <LocationButton 
                key={id} 
                id={id} 
                onClick={handleSectionClick} 
                isHighlighted={highlightedLocation?.main === id || highlightedLocation?.sub === id} 
              />
            ))}
          </div>
        </div>
      </div>
      {/* 집하장 레이아웃 */}
      <div className="col-span-3">
        <h3 className="text-lg font-semibold mb-2">집하장</h3>
        <div className="grid grid-cols-3 gap-1">
          {['SL', 'SM', 'SR', 'SS'].map(id => (
            <LocationButton 
              key={id} 
              id={id} 
              onClick={handleSectionClick} 
              isHighlighted={highlightedLocation?.main === id || highlightedLocation?.sub === id} 
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex max-w-6xl mx-auto p-4">
      <div className="w-1/2 pr-4">
        <h1 className="text-2xl font-bold mb-4">재고 레이아웃</h1>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="아이템 검색..."
              className="flex-grow p-2 border rounded-l"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r" disabled={isLoading}>
              {isLoading ? 'Loading...' : <Search size={20} />}
            </button>
          </div>
        </form>
        
        {renderInventoryLayout()}
      </div>
      
      <div className="w-1/2 pl-4">
        <InventoryStatusLists items={items} />
        <h2 className="text-xl font-bold mb-4">
          {selectedSection ? `${selectedSection} 아이템 목록` : '검색 결과'}
        </h2>
        <ul className="space-y-2">
        {displayedItems.map((item) => (
        <li key={item.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
          <div>
            <span className="font-semibold">{item.name}</span>
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
                className="bg-blue-500 text-white p-1 rounded mr-2"
              >
                위치 변경
              </button>
              <button 
                onClick={() => handleDeleteItem(item.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                삭제
              </button>
            </div>
          </div>
        </li>
      ))}
        </ul>
        
        {selectedSection && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-lg font-semibold flex items-center">
              <Info className="mr-2" />
              {selectedSection} 정보
            </h3>
            <p className="mt-2">
              {locations.find(loc => loc.id.toLowerCase() === selectedSection.toLowerCase())?.name || '정보 없음'}
            </p>
            <ul className="mt-2">
              {displayedItems.map(item => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isModalOpen && selectedItem && (
        <LocationChangeModal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onLocationChange={handleLocationChange}
          locations={locations}
        />
      )}
{isSubLocationModalOpen && (
        <SubLocationModal
          mainLocation={selectedMainLocation}
          onSelect={handleSubLocationSelect}
          onClose={() => setIsSubLocationModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InventoryLayout;