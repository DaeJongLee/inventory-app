'use client'

import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

interface NameConfirmDialogProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NameConfirmDialog({ name, onConfirm, onCancel }: NameConfirmDialogProps) {
  const handleConfirm = async () => {
    await addDoc(collection(db, 'itemNames'), { name })
    onConfirm()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <p>"{name}" is a new item name. Do you want to add it?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded">
            Yes
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
            No
          </button>
        </div>
      </div>
    </div>
  )
}