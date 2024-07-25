'use client'

import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'

export default function AddInventoryItem() {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !quantity || !image) {
      alert('모든 필드를 채워주세요.')
      return
    }

    try {
      const imageRef = ref(storage, `inventory/${Date.now()}_${image.name}`)
      await uploadBytes(imageRef, image)
      const imageUrl = await getDownloadURL(imageRef)

      await addDoc(collection(db, 'inventory'), {
        name,
        quantity: Number(quantity),
        imageUrl
      })

      setName('')
      setQuantity('')
      setImage(null)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="w-full p-2 border rounded"
        required
      />
      <div>
        <label htmlFor="fileInput" className="cursor-pointer bg-blue-500 text-white p-2 rounded">
          {image ? '파일 선택됨' : '파일 선택'}
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="hidden"
          accept="image/*"
        />
      </div>
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
        Add Item
      </button>
    </form>
  )
}