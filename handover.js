
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getAuth,
    GithubAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

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