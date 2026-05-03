const admin = require('firebase-admin');

async function check() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT_BASE64 is missing');
    return;
  }

  try {
    const json = Buffer.from(b64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(json);

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const db = admin.firestore();
    const collections = await db.listCollections();
    console.log('✅ Connected to Firestore!');
    console.log('Collections:', collections.map(c => c.id).join(', ') || 'None');
  } catch (e) {
    console.error('❌ Connection failed:', e.message);
  }
}

check();
console.error('❌ Connection failed:', e.message);
  }
}

check();
