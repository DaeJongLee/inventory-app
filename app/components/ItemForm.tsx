'use client'

import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { locations } from '../data/locations';

export default function ItemForm() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState({
    main: '',
    sub: '',
    final: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location.main) {
      setError('이름과 위치를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'items'), {
        name,
        location,
        imageUrl
      });

      setName('');
      setLocation({ main: '', sub: '', final: '' });
      setImage(null);
    } catch (error) {
      setError('아이템 추가 중 오류가 발생했습니다.');
      console.error('Error adding item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="아이템 이름"
        className="w-full p-2 border rounded"
      />
      <select
        value={location.main}
        onChange={(e) => setLocation({ ...location, main: e.target.value, sub: '', final: '' })}
        className="w-full p-2 border rounded"
      >
        <option value="">주 위치 선택</option>
        {locations.map(loc => (
          <option key={loc.id} value={loc.id}>{loc.name}</option>
        ))}
      </select>
      {location.main && (
        <select
          value={location.sub}
          onChange={(e) => setLocation({ ...location, sub: e.target.value, final: '' })}
          className="w-full p-2 border rounded"
        >
          <option value="">세부 위치 선택</option>
          {locations.find(loc => loc.id === location.main)?.children?.map(subLoc => (
            <option key={subLoc.id} value={subLoc.id}>{subLoc.name}</option>
          ))}
        </select>
      )}
      {location.sub && (
        <select
          value={location.final}
          onChange={(e) => setLocation({ ...location, final: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">최종 위치 선택</option>
          {locations.find(loc => loc.id === location.main)?.children?.find(subLoc => subLoc.id === location.sub)?.children?.map(finalLoc => (
            <option key={finalLoc.id} value={finalLoc.id}>{finalLoc.name}</option>
          ))}
        </select>
      )}
      <input
        type="file"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        className="w-full p-2 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button 
        type="submit" 
        className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? '추가 중...' : '아이템 추가'}
      </button>
    </form>
  );
}