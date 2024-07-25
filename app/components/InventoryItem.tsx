'use client'

import { useState } from 'react'
import Image from 'next/image'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

interface InventoryItemProps {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string;
}

export default function InventoryItem({ id, name, quantity, imageUrl }: InventoryItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editQuantity, setEditQuantity] = useState(quantity)

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'inventory', id), {
        name: editName,
        quantity: editQuantity
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'inventory', id))
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  if (isEditing) {
    return (
      <div className="border p-4 rounded-lg">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="mb-2 p-1 border rounded w-full"
        />
        <input
          type="number"
          value={editQuantity}
          onChange={(e) => setEditQuantity(Number(e.target.value))}
          className="mb-2 p-1 border rounded w-full"
        />
        <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mr-2">저장</button>
        <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded">취소</button>
      </div>
    )
  }

  return (
    <div className="border p-4 rounded-lg">
      <div className="relative w-32 h-32 mb-2">
        <Image 
          src={imageUrl} 
          alt={name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p>수량: {quantity}</p>
      <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-2 rounded mr-2 mt-2">수정</button>
      <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded mt-2">Delete</button>
    </div>
  )
}