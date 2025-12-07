// ===============================
//  CONTACT.JS — Final Version
// ===============================

// Check firebase config loaded
if (!window.firebaseConfig) {
  console.error("Firebase config missing");
} else {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }
  } catch (e) {
    console.error("Firebase init error:", e);
  }
}

const db = (window.firebase && firebase.firestore) ? firebase.firestore() : null;

// -------------------------------
// initContactForm()
// -------------------------------
function initContactForm(opts) {
  const form = document.querySelector(opts.formSelector);
  const nameEl = document.querySelector(opts.nameSelector);
  const emailEl = document.querySelector(opts.emailSelector);
  const msgEl = document.querySelector(opts.messageSelector);
  const btn = document.querySelector(opts.submitSelector);

  if (!form || !nameEl || !emailEl || !msgEl || !btn) {
    console.error("Contact form selectors mismatch");
    return;
  }

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = msgEl.value.trim();

    if (!name || !email || !message) {
      alert("Fill all fields");
      return;
    }

    if (!db) {
      alert("Database not ready! Check Firebase.");
      return;
    }

    btn.disabled = true;

    try {
      await db.collection("contact_messages").add({
        name,
        email,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert("Message sent successfully!");
      nameEl.value = "";
      emailEl.value = "";
      msgEl.value = "";

    } catch (err) {
      console.error(err);
      alert("Send failed: " + err.message);

    } finally {
      btn.disabled = false;
    }
  });
}

// ----------------------------------
// AUTO INITIALIZE FOR YOUR CONTACT PAGE
// ----------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#contactForm")) {
    initContactForm({
      formSelector: "#contactForm",
      nameSelector: "#name",
      emailSelector: "#email",
      messageSelector: "#message",
      submitSelector: ".btn"
    });
  }
});

// ----------------------------------
// REQUIRED BY HTML ON-SUBMIT HANDLER
// ----------------------------------
function submitContact(e) {
  // prevent old default handler
  if (e) e.preventDefault();
  // actual submit happens via button click listener above
}
