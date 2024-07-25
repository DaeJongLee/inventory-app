const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function migrateLocationData() {
  const db = admin.firestore();
  const itemsRef = db.collection('items');
  const snapshot = await itemsRef.get();

  const batch = db.batch();

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (typeof data.location === 'object' && !Array.isArray(data.location)) {
      const newLocation = {
        main: data.location.main || '',
        sub: data.location.sub || '',
        final: data.location.final || ''
      };
      // 숫자 키 제거
      for (let i = 0; i < 7; i++) {
        if (data.location[i]) {
          delete data.location[i];
        }
      }
      Object.assign(data.location, newLocation);
      batch.update(doc.ref, { location: data.location });
    }
  });

  await batch.commit();
  console.log('Migration completed');
}

migrateLocationData().catch(console.error);