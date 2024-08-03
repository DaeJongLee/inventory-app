import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed for your project
import { generateRandomMedicineName, generateRandomSalesLocation, generateRandomStorageLocation } from '../utils/randomDataUtils';

// Function to remove undefined values from an object
const removeUndefined = (obj: any): any => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeUndefined(obj[key]);
    } else if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

const AddTestDataForm: React.FC = () => {
  const [count, setCount] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let i = 0; i < count; i++) {
      try {
        const name = generateRandomMedicineName();
        const location = generateRandomSalesLocation();
        const storageLocation = generateRandomStorageLocation();

        const newItem = removeUndefined({
          name,
          location,
          storageLocation,
          lowStock: Math.random() < 0.2, // 20% chance of low stock
          orderPlaced: Math.random() < 0.1, // 10% chance of order placed
        });

        await addDoc(collection(db, 'items'), newItem);
        console.log(`Test item added: ${name}`);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    console.log(`${count} test items added successfully.`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="count" className="block text-sm font-medium text-gray-700">
          추가할 테스트 데이터 수
        </label>
        <input
          type="number"
          id="count"
          value={count}
          onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10)))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          min="1"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        랜덤 테스트 데이터 추가
      </button>
    </form>
  );
};

export default AddTestDataForm;
