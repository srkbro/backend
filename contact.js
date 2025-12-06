
/*
Include this script in your frontend (e.g., index.html) to send contact form data to Firestore.
Make sure firebase-config-example.js (with your config) is also included on the page.
Example usage in HTML form:
<form id="contactForm">
  <input name="name" required />
  <input name="email" type="email" required />
  <input name="subject" />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
<script src="firebase-config-example.js"></script>
<script src="contact.js"></script>
*/

// init (compat)
if (!window.firebaseConfig) {
  console.error('Please put your Firebase config into firebase-config-example.js');
}
const app = firebase.initializeApp(window.firebaseConfig || {});
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const data = {
      name: f.get('name') || '',
      email: f.get('email') || '',
      subject: f.get('subject') || '',
      message: f.get('message') || '',
      timestamp: Date.now()
    };
    try {
      await db.collection('contact_messages').add(data);
      alert('Message sent. Thank you!');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Error sending message. See console.');
    }
  });
});
