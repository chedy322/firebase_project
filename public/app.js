
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js'
// import { GoogleAuthProvider } from "firebase/auth";
// Add Firebase products that you want to use
import { getAuth,signInWithEmailAndPassword ,reauthenticateWithCredential,updateProfile,GoogleAuthProvider, signInWithPopup, signOut,onAuthStateChanged,updateEmail,sendEmailVerification ,createUserWithEmailAndPassword ,sendPasswordResetEmail,fetchSignInMethodsForEmail,EmailAuthProvider, linkWithCredential   } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js'
import { getDatabase, ref, set, onValue, push, update,onChildChanged,remove } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js'

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
// task
// add ability to modify the machine 

const app = initializeApp(firebaseConfig);
console.log("Firebase initialized");
const auth = getAuth();
let db = getDatabase(app);

const provider = new GoogleAuthProvider();
// const main = document.getElementById('main');


// Here is for dynamic content
const base = document.getElementById('base'); 
let signedin = false;

async function handleSignin(e){
try{
  // e.preventDefault();
  let email=document.getElementById('email').value
  let password=document.getElementById('password').value
  if(!email|-!password){
    alert("Please enter both email and password");
    return
  }
  let usercredential=await signInWithEmailAndPassword (auth,email,password)
  const user = usercredential.user;
  const token = user.accessToken;
  localStorage.setItem('token', token);
  console.log('user', user);
  const userId = user.uid;
  const username = user.displayName;
  localStorage.setItem('userInfo',JSON.stringify({
    userId,
    username,
    email:user.email,
    // photo:user.photoURL,
    lasSignIn:user.metadata.lastSignInTime,
    createdAt:user.metadata.createdAt,
  }))
  // handle redirect manually
  window.location.href='/profile';

}catch(err){
  console.log(err);
  alert(err)
}
}
// handle normal signn in
async function handleSgnup(e){
  try{
    console.log('signing in....')
    let email=document.getElementById('sign_up_email').value
    let password=document.getElementById('sign_up_password').value
    let confirm_password=document.getElementById('confirm_password').value
    if(!email||!password||!confirm_password){
      alert("Please enter all fields");
      return
    }
    if(confirm_password!==password){
      alert('Password should be identical')
      return
    }
    const usercredential=await createUserWithEmailAndPassword(auth,email,password);
    const user = usercredential.user;
    const token = user.accessToken;
    localStorage.setItem('token', token);
    console.log('user', user);
    const userId = user.uid;
    const username = user.displayName;
    localStorage.setItem('userInfo',JSON.stringify({
      userId,
      username,
      email:user.email,
      // photo:user.photoURL,
      lasSignIn:user.metadata.lastSignInTime,
      createdAt:user.metadata.createdAt
    }))
    // handle redirect manually
    window.location.href='/profile';
  }catch(err){
    console.log(err)
    alert(err)
  }
}
async function handleGoogleSignIn(e){
  // e.preventDefault()
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('sucess')
    const user = result.user;
    if (!user) {
      alert('You are not authenticated,please try again!');
      return;
    }
    // const signin = document.getElementById("signin");
    // const signout = document.getElementById("signout");
    // Store token in LocalStorage
    const token = user.accessToken;
    localStorage.setItem('token', token);
    console.log('user', user);
    const userId = user.uid;
    const username = user.displayName;
    localStorage.setItem('userInfo',JSON.stringify({
      userId,
      username,
      email:user.email,
      photo:user.photoURL,
      lasSignIn:user.metadata.lastSignInTime,
      createdAt:user.metadata.createdAt
    }))
    // handle redirect manually
    window.location.href='/profile'
    // const route='/profiile'
    // window.history.pushState({}, "", route);
    // renderContent('/profile')
    // console.log(location.pathname)
    // store the previous sign in of the user
    // to do add users sign in here in db with array format
    const previousSignIn = user.metadata.lastSignInTime;
  } catch (error) {
    console.error("Error", error);
    alert(`Error: ${error.message}`);
  }
};
// handle click for form
// signout.addEventListener("click", async () => {
  async function handleSignout(e){
    // e.preventDefault()
    try {
      await signOut(auth);
      // signin.style.display = "block";
      // signout.style.display = "none";
      // signin.hidden=false;
      // signout.hidden=true;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      // updateUIBasedOnAuth(null)
    } catch (error) {
      console.error("Error signing out:", error);
      alert(`Error: ${error.message}`);
    }
  };
  const getUserInfo=()=>{
    return JSON.parse(localStorage.getItem('userInfo'))
  }
  // based on our sign in
  function updateUIBasedOnAuth(user) {
    const signin = document.getElementById("signin");
    const signout = document.getElementById("signout");
  // if there is user we hide the div as well
    if (user) {
      document.getElementById('sign').hidden=true;
      // User is signed in
      signin.hidden = true;
      signout.hidden = false;
    } else {
      document.getElementById('sign').hidden=false;
      // User is signed out
      signin.hidden = false;
      signout.hidden = true;
    }
  }
  function showSignUpForm() {
    document.getElementById('sign').hidden = true;
    document.getElementById('signup').hidden = false;
}
function showSignInForm(){
  document.getElementById('sign').hidden = false;
  document.getElementById('signup').hidden = true;
}
  // Listen for authentication state changes
  // onAuthStateChanged(auth, (user) => {
  //   updateUIBasedOnAuth(user);
  // });
// Working on db
// Error that this is getting targeted immidiately
function handleClick(e) {
  e.preventDefault()
  // console.log(e.target)
  console.log('submitting')
  let level = document.getElementById('level');
  let name = document.getElementById('name');
  console.log(level.value);
  console.log(name.value);
  const userInfo=getUserInfo()
  console.log(userInfo.userId)
  if(!level.value||!name.value){
    alert('Please fill in all fields');
    return
  }
  // console.log('userId',userId)
  const machineref = ref(db, 'users/' + userInfo.userId + '/machines');
  const newmachineref = push(machineref);
  set(newmachineref, {
    level: level.value,
    name: name.value,
    isActivated:false,
  });
  level.value = "";
  name.value = "";
  console.log('success')
  // add time here and then remove

  const showelement=()=>{
    document.getElementById('success').innerText="Form submitted succcessfully"
    setTimeout(() => document.getElementById('success').innerText='',3000)
  }
  showelement()

  // document
  
}
// reading data
// to do fix this issue and make the button update
// make user able to delete machines
// do doculentation
// this function is trigered when user choose date and active button
// add in the db start date and end date
window.updateMachine=async function (machineId,curent_level,isActivated) {
  // send the button id the coud function
  // probably delete this
  const userInfo=getUserInfo()
  const dbref= ref(db, 'users/' + userInfo.userId + '/machines/'+machineId)

  // Get the unique start_date and end_date inputs for this machine
  const start_date = document.getElementById(`start_date_${machineId}`).value;
  const end_date = document.getElementById(`end_date_${machineId}`).value;
  if(!start_date||!end_date){
    alert('Please enter date')
    return;
  }
  console.log(`Machine ID: ${machineId}`);
  console.log(`Start Date: ${start_date}`);
  console.log(`End Date: ${end_date}`);

  // store the updated time which is the start day-todays date
  // here when activate we update the star field based on the new time 
  // update(dbref,{
  //   start_date:start_date,
  //   end_date:end_date
  // })
  // // here we update the the machine level
  // const machine_ref=ref(db,'users/' + userInfo.userId + '/machines/'+machineId)
  // update(machine_ref,{
  //   level:curent_level--
  // })
  console.log('updated')
  document.getElementById('desactivate_btn').hidden=false
  document.getElementById('update_btn').hidden=true
  try{
    const functionURL ="http://127.0.0.1:5001/native-6eb6c/us-central1/buttonClick"
    // here i send the button id to the cloud funtion
    const response = await fetch(functionURL, {
      method: 'POST',
      body:JSON.stringify({machineId
        ,start_date,
        end_date,
        level:curent_level,
        userInfo,
        isActivated
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(response.ok){
      const result=await response.json()
      console.log(result)
    }
  }catch(err){
    console.log(err)
  }

  // Perform any logic to update the machine
  // For example, you can update Firebase data here
  // update the field
  // update(dbref,{
  //   isActivated:true
  // })

}
window.desactivatemachine=async function(machineId){
  console.log('desactivating machine')

  document.getElementById('desactivate_btn').hidden=true
  document.getElementById('update_btn').hidden=false
  try{
    const userInfo=getUserInfo()
     const functionURL ="http://127.0.0.1:5001/native-6eb6c/us-central1/buttonClick"
     const response=await fetch(functionURL,{
      method:'POST',
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({
        machineId,
        userInfo
     })
    })
  }catch(err){
    console.log(err)
  }

}
window.delete_machine=function(machineId){
  console.log('deleting machine')
  const userInfo=getUserInfo()
  const dbref=ref(db, 'users/' + userInfo.userId + '/machines/'+machineId)
  remove(dbref);
}
// Read value from database
function readingInfo(){
  console.log('reading ...')
  // console.log('userId',userId)
  const userInfo=getUserInfo()
  console.log(userInfo)
  // display user metadata
  document.getElementById('email').value = userInfo.email;
  document.getElementById('img').src =userInfo.photo;
  document.getElementById('username').value = userInfo.username;
  let element = document.getElementById('data');
  // here i neeed each machine unique id 

      const dbref = ref(db, 'users/' + userInfo.userId + '/machines');
      onValue(dbref, (snapshot) => {
        element.innerHTML = '';
        if (!snapshot.exists()) {
          element.innerText = 'No data to read! Please enter some information.';
          return;
        }
        snapshot.forEach(child => {
          const activated=child.isActivated;
          const machineId=child.key
          const childelement = document.createElement('h4');
          let data = child.val();
          // childelement.innerText = "Machine: " + data.name + " Level " + data.level;
          // childelement.id=
          childelement.innerHTML= `
          <div>
            <h3>Machine ${data.name}</h3>
            <h3>Level ${data.level}</h3>
            <div id="update_btn">
              <button class="btn-primary" onclick="updateMachine('${machineId}',${data.level},${data.isActivated})">update</button>
            </div>
            <div id="desactivate_btn" hidden>
              <button class="btn-primary" onclick="desactivatemachine('${machineId}')">desactivate</button>
            </div>
            
            <label for="start_date_${machineId}">Start date</label>
            <input id="start_date_${machineId}" type="date"/>
            <label for="end_date_${machineId}">End date</label>
            <input id="end_date_${machineId}" type="date"/>
            <button id="delete_button" onClick="delete_machine('${machineId}')">delete</button>
          </div>
        `
          element.appendChild(childelement);
        });
      });
    }





// Routes we have
const routes = {
  '/': {
    linkLabel: 'Home',
    content: '/template/home.html',
    protected: false
  },
  '/about': {
    linkLabel: 'About',
    content: '/template/about.html',
    protected: false
  },
  '/profile': {
    linkLabel: 'Profile',
    content: '/template/profile.html',
    protected: true
  },
  '/form': {
    linkLabel: 'form',
    content: '/template/form.html',
    protected: true
  },
  '/signin': {
    linkLabel: 'signin',
    content: '/template/signin.html',
    protected: false
  }
};

// const app2 = document.getElementById('cnt');
const nav = document.getElementById('nav');

const renderNavlinks = () => {
  const navFragment = document.createDocumentFragment();
  Object.keys(routes).forEach(route => {
    const { linkLabel } = routes[route];
    if(!routes[route].protected ||routes[route].protected&&getUserInfo()){
      const link = document.createElement('a'); // Use <a> for links
      link.href = route;
      link.innerText = linkLabel;
      link.className = 'nav-link';
      navFragment.appendChild(link);
    }
  });
  nav.appendChild(navFragment); // Append fragment to the nav
};

const navigate = (e) => {
  var route = e.target.pathname;
  if (routes[route].protected && !checkUserstatus()) {
    alert('You are not logged in');
    route = '/signin';
    window.history.pushState({}, "", route);
    renderContent(route);
  } else {
    window.history.pushState({}, "", route);
    renderContent(route);
  }
};

const renderContent = async (route) => {
  if (routes[route]) {
    const html = await fetch(routes[route].content).then((res) => res.text());
    base.innerHTML = html;
    // i get all what i need here
    // const signin = document.getElementById("signin");
    // const signout = document.getElementById("signout");
    // let element = document.getElementById('data');
    // registerEvents() // Register events after rendering new content
    if(route==='/signin'){
      base.addEventListener('click',(e)=>{
        e.preventDefault()
        if(e.target.id==='signin'){
          handleGoogleSignIn(e)
        }
        else if(e.target.id==='signout'){
          handleSignout(e)
        }
        else if(e.target.id=='transfer_sign_up'){
          showSignUpForm()
        }else if(e.target.id=='transfer_sign_in'){
          showSignInForm()
        }
        else if(e.target.id=='sign_up_btn'){
          e.preventDefault()
          handleSgnup(e)
        }
        else if(e.target.id=='sign_in_btn'){
          e.preventDefault()
          handleSignin(e)
        }
      })
      // document.getElementById('form').addEventListener('submit',(e)=>{
      //   e.preventDefault()
      //   console.log('sub')
      //   handleSgnup(e)
      // })
      onAuthStateChanged(auth, (user) => {
          updateUIBasedOnAuth(user);
      });
    }else if(route==='/form'){
      console.log('form')
            base.addEventListener('submit', (e) => {
                console.log('triggering');
                // e.preventDefault();  // Prevents the default form submission
                handleClick(e);  // Ensure handleClick is defined
            });
     
    }

    // if(e.target.id==="btn"){
    // }
  
    else if(route==='/profile'){
      readingInfo()
      document.getElementById('editButton').addEventListener('click',toggleEdit)
      document.getElementById('reset_btn').addEventListener('click',handle_password_reset)
      base.addEventListener('submit',handleSuccess)
  } else if(!routes[route]){
    base.innerHTML = "Page not found";
  }
};
}
// fix this when user is signed in by google and he resets his password we need to link it to an account
function handle_password_reset(){
  console.log('function trigerred for resetting password')
  const userInfo=getUserInfo()
  if(!userInfo){
    alert('Please sign in first')
    return;
  }
  sendPasswordResetEmail(auth,userInfo.email).then(()=>{
    alert('Password reset email sent')
    // check if the resetting email is google
    // fetchSignInMethodsForEmail(auth,userInfo.email).then((signInMethods)=>{
    //   if(signInMethods.includes("google.com")){
    //     const credential=EmailAuthProvider.cre
    //   }
    // })
  }).catch((err)=>{
    alert('Error sending password reset email')
    return
  })
}
function toggleEdit() {
  const form = document.getElementById('profileForm');
  const editButton = document.getElementById('editButton');
  const updateButton = document.getElementById('updateButton');
  const usernameInput = document.getElementById('username');
  const reset_btn=document.getElementById('reset_btn');
  const isEditing = editButton.innerText === 'Edit Profile';

  document.getElementById('email').disabled = !isEditing;
  reset_btn.disabled=!isEditing;
  document.getElementById('profilePic').disabled = !isEditing;
  document.getElementById('username').disabled = !isEditing;
  // reset_btn.disabled=!isEditing;
  editButton.innerText = isEditing ? 'Cancel' : 'Edit Profile';
  updateButton.style.display = isEditing ? 'inline-block' : 'none';

}
function handleError(error){
  document.getElementById('success').innerText = error;
  
  // Clear the success message after 1 second
  setTimeout(() => {
    document.getElementById('success').innerText = '';
  }, 4000);
  toggleEdit()
}
function handleSuccess(event){
  event.preventDefault();
  // no error
  let error;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const profilePic = document.getElementById('profilePic').files[0];
  // const profilePic = 'c:\Users\Lenovo\Pictures\Nouveau dossier\WhatsApp Image 2024-07-14 à 23.43.14_57d0ebc9.jpg';
  console.log(document.getElementById('profilePic').files)
const updatedfields={}
const prev=getUserInfo()
// to do upload the image to firebase storage in order to show
if(email && email!==prev.email){
  updateEmail(auth.currentUser,email).then(()=>{
      
       setTimeout(()=>{
        sendEmailVerification(auth.currentUser).then(()=>{
        console.log('email sent')
        localStorage.setItem('userInfo',JSON.stringify({
          ...prev,
          email:email
        }))
      }).catch((err)=>{
        console.log(err)
        handleError(err)
        error=err
        return
    })
  },9000)
    }).catch((err)=>{
      console.log(err)
      handleError(err)
      error=err
      return
    })

  }

if(username &&username!==prev.username){
  updatedfields.displayName=username
}
// to do check for this later
// if(profilePic){
//   updatedfields.photoURL=profilePic
// }
//  photoURL: "https://example.com/jane-q-user/profile.jpg"

console.log(prev)
updateProfile(auth.currentUser,updatedfields).then(() => {
  localStorage.setItem('userInfo',JSON.stringify({
    ...prev,
    username:username?username:prev.username,
    // photo:profilePic?profilePic:prev.photo
  })
)
const user = auth.currentUser;
console.log('Updated Firebase user info:', user.displayName, user.email, user.photoURL);
}).catch((err) => {
  console.log(err)
  handleError(err)
  error=err
  return
});

  // Simulate an update (in a real app, this would involve sending data to a server)
  console.log('Updated Profile:', {
    email,
    profilePic
  });
if(!error){
  // Show success message and reset fields (in a real app, save the data)
  document.getElementById('success').innerText = "Profile updated successfully!";
  
  // Clear the success message after 1 second
  setTimeout(() => {
    document.getElementById('success').innerText = '';
  }, 2000);
  
  // // Disable the form again after update
  // toggleEdit();
  
  toggleEdit();
}else{
  handleError(error)

}
}





const registerNavLinks = () => {
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      navigate(e);
    }
  });
};

const registerBrowserBackAndForth = () => {
  window.onpopstate = function (e) {
    const route = location.pathname;
    if (routes[route].protected && !checkUserstatus()) {
      alert('You are not logged in');
      window.history.pushState({}, "", '/signin'); 
      renderContent('/signin');
    } else {
      renderContent(route);
    }
  };
};

const renderInitialPage = () => {
  const route = location.pathname;
  if (routes[route].protected && !checkUserstatus()) {
    alert('You are not logged in');
    // window.history.pushState({}, "", '/signin');
    renderContent('/signin');
  } else {
    renderContent(route);
  }
};

function checkUserstatus() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('Not signed in');
    return false;
  }
  console.log(token);
  return true;
}



// Run the app
renderNavlinks();
registerNavLinks();
registerBrowserBackAndForth();
renderInitialPage();
