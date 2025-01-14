// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABQxMGSPwMdr4UBEL1f1dKNZvrh4GmgP8",
  authDomain: "native-6eb6c.firebaseapp.com",
  databaseURL: "https://native-6eb6c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "native-6eb6c",
  storageBucket: "native-6eb6c.firebasestorage.app",
  messagingSenderId: "1002338302672",
  appId: "1:1002338302672:web:092ecb86da8ab626c0bcd5",
  measurementId: "G-KCRJTBJNB0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log("Firebase initialized");

// Get Firebase services
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Google Sign-In</title>
  <!-- Firebase App and Auth -->
  <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"></script>
  <!-- Your custom scripts -->
  <!-- <script src="./firebase-config.js"></script> -->
  <script src="./app.js"></script>
</head>
<body>
  <h1>Google Authentication 3</h1>
  <button id="signin">Sign In with Google</button>
  <button id="signout" style="display: none;">Sign Out</button>
</body>
</html>
