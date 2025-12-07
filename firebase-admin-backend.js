/* Firebase Admin backend (Express) 
   IMPORTANT: Do NOT commit your real serviceAccountKey.json to a public GitHub repo.
   Instead: add serviceAccountKey.json to the server on your private host after deployment.
*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('\\nERROR: serviceAccountKey.json not found.\\nCreate/upload your service account JSON as serviceAccountKey.json (DO NOT commit to git).\\nSee README for details.\\n');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();
const CONTACTS_COLLECTION = process.env.CONTACTS_COLLECTION || 'contacts';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const ADMIN_PASS = process.env.ADMIN_PASS || 'shadhin123';
function checkAdminAuth(req, res, next) {
  const pass = req.query.admin_pass || req.headers['x-admin-pass'] || (req.body && req.body.admin_pass);
  if (pass === ADMIN_PASS) return next();
  res.status(401).send('Unauthorized. Provide admin_pass query or x-admin-pass header.');
}

// List messages (JSON)
app.get('/api/messages', async (req, res) => {
  try {
    const snap = await db.collection(CONTACTS_COLLECTION).orderBy('createdAt', 'desc').get();
    const items = [];
    snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    res.json({ ok: true, messages: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Optional: accept messages from frontend (if you want server to receive posts)
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;
    if (!message) return res.status(400).json({ ok: false, error: 'message required' });
    const docRef = await db.collection(CONTACTS_COLLECTION).add({
      name: name || '',
      email: email || '',
      phone: phone || '',
      message: message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ ok: true, id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection(CONTACTS_COLLECTION).doc(id).delete();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin UI (view + delete form)
app.post('/delete', checkAdminAuth, bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const id = req.body.id;
  try {
    await db.collection(CONTACTS_COLLECTION).doc(id).delete();
    res.redirect('/admin?admin_pass=' + encodeURIComponent(req.body.admin_pass || ''));
  } catch (err) {
    res.status(500).send('Delete error: ' + err.message);
  }
});

app.get('/admin', checkAdminAuth, async (req, res) => {
  try {
    const snap = await db.collection(CONTACTS_COLLECTION).orderBy('createdAt', 'desc').get();
    const items = [];
    snap.forEach(doc => {
      const d = doc.data();
      items.push({ id: doc.id, name: d.name || '', email: d.email || '', phone: d.phone || '', message: d.message || '', createdAt: d.createdAt ? d.createdAt.toDate().toISOString() : '' });
    });
    res.render('admin', { messages: items, admin_pass: req.query.admin_pass || '' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
});

app.get('/', (req, res) => res.send('Firebase Admin backend running. Visit /admin?admin_pass=YOURPASS'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
