/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// import { GoogleAuthProvider } from "firebase/auth";
// Add Firebase products that you want to use
// const { getDatabase, ref, set, onValue, push, update,onChildChanged,remove } = require('https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js');

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const functions = require("firebase-functions");
const admin = require("firebase-admin")
// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const { schedule } = require("firebase-functions/v2/pubsub");
initializeApp();
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.addmessage= onRequest(async (req, res)=> {
  const original=req.query.text;
  logger.log(original);
  res.json({result: `Message with ID: ${original} added.`});
});

// exports.buttonClick = onRequest(async (req, res) => {
//     if (req.method !== 'POST') {
//       return res.status(405).send('Method Not Allowed');
//     }
  
//     try {
//       const data = req.body;
  
//       // Validate input
//       if (!data || !data.machineId || !data.userInfo || !data.userInfo.userId || !data.button) {
//         return res.status(400).send('Invalid request payload');
//       }
  
//       const machineId = data.machineId;
//       const { start_date, end_date, level, button, userInfo } = data;
  
//       // Database reference
//       const dbRef = admin.database().ref(`users/${userInfo.userId}/machines/${machineId}`);
  
//       if (button === 'update_btn') {
//       logger.log('Update button clicked');
  
//         // Update the database
//         await dbRef.update({
//           isActivated: true,
//           start_date: start_date,
//           end_date: end_date
//         });
  
//         return res.status(200).send('Database updated successfully');
//       }
  
//       if (button === 'desactivate_btn') {
//         logger.log('Deactivating...');
//         await dbRef.update({
//           isActivated: false,
//         });
//         return res.status(200).send('Deactivated successfully');
//       }
  
//     //   return res.status(400).send('Invalid button action');
//     } catch (error) {
//       logger.error('Error updating the database:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   });
  
exports.buttonClick =onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }
  
    try {
        const data = req.body;
  
        // Validate input
        if (!data || !data.machineId || !data.start_date || !data.end_date || data.level === undefined) {
            return res.status(400).send('Invalid request payload');
        }
  
        const machineId = data.machineId;
        const { start_date, end_date, level, button,userInfo,isActivated} = data;
        // Log button click if applicable
        if (button === 'update_btn') {
            console.log('Update button clicked');
            if (!userInfo || !userInfo.userId) {
                return res.status(400).send('User information is missing');
            }
      
            const dbRef = admin.database().ref(`users/${userInfo.userId}/machines/${machineId}`);
      
            // Update the database
            await dbRef.update({
                isActivated: true,
                start_date: start_date,
                end_date: end_date,
                level: level - 1,
            });
      
            return res.status(200).send('Database updated successfully');
        }
  
  
    } catch (error) {
        console.error('Error updating the database:', error);
        return res.status(500).send('Internal Server Error');
    }
  });
// creating subpub function