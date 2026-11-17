
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getAuth,
    GithubAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA7IDQx6S7DzBJxuDRT3HjgVv6IXtp1rfQ",
    authDomain: "machinelink-14bdf.firebaseapp.com",
    projectId: "machinelink-14bdf",
    storageBucket: "machinelink-14bdf.firebasestorage.app",
    messagingSenderId: "166942228579",
    appId: "1:166942228579:web:e753cc25cd948de116b856"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();
const db = getFirestore(app);
const messageRef = collection(
    db,
    "machines",
    "weld-cell-01",
    "handover"
);
const loginButton = document.getElementById("github-login");
const logoutButton = document.getElementById("logout");

loginButton.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login failed:", error);
        alert("Unable to sign in. Please try again.");
    }
});

const loginSection = document.getElementById("login-section");
const userSection = document.getElementById("user-section");
const userInfo = document.getElementById("user-info");
const handoverForm = document.getElementById("handover-form");

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.hidden = true;
        userSection.hidden = false;
        handoverForm.hidden = false;
        userInfo.textContent = `Signed in as ${user.displayName || user.email || "GitHub user"}`;
    } else {
        loginSection.hidden = false;
        userSection.hidden = true;
        handoverForm.hidden = true;
        userInfo.textContent = "";
    }
});
logoutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Unable to sign out. Please try again.");
    }
});
handoverForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        alert("You must be signed in to submit a handover.");
        return;
    }
    const name = document.getElementById("technician-name").value.trim();
    const message = document.getElementById("handover-message").value.trim();
    if (!name || !message) {
        alert("Please fill in both the name and message fields.");
        return;
    }
    if (name.length > 50 || message.length > 1000) {
        alert("Your name or message is too long. Please limit your name to 50 characters and your message to 1000 characters.");
        return;
    }
    try {
        await addDoc(messagesRef, {
            name: name,
            message: message,
            userId: user.uid,
            createdAt: serverTimestamp()
        });
        handoverForm.reset();
        alert("Message posted successfully!");
    } catch (error) {
        console.error("Error posting message:", error);
        alert("Failed to post message. Please try again.");
    }
});
const messagesContainer = document.getElementById("handover-messages");

const messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "desc")
);
onSnapshot(messagesQuery, (snapshot) => {
    console.log("Handover messages received:", snapshot.size);
    messagesContainer.innerHTML = "";

    if (snapshot.empty) {
        messagesContainer.textContent = "No handover messages yet.";
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();
        const note = document.createElement("div");
        note.className = "handover-note";
        const name = document.createElement("strong");
        name.textContent = data.name;
        const message = document.createElement("p");
        message.textContent = data.message;
        const date = document.createElement("small");

        if (data.createdAt) {
            date.textContent = data.createdAt.toDate().toLocaleString();
        } else {
            date.textContent = "Just now";
        }
        note.appendChild(name);
        note.appendChild(date);
        note.appendChild(message);
        messagesContainer.appendChild(note);
    });
}, (error) => {
    console.error("Error loading messages:", error);
    messagesContainer.textContent = "Failed to load handover messages. Please try again later.";
});