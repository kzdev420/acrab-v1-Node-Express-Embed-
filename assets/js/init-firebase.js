var firebaseConfig = {
    apiKey: "AIzaSyDmHYXsXgK5wXlc519YcNf2zs2GKrvB12s",
    authDomain: "arcab-app.firebaseapp.com",
    databaseURL: "https://arcab-app.firebaseio.com",
    projectId: "arcab-app",
    storageBucket: "arcab-app.appspot.com",
    messagingSenderId: "274371550541",
    appId: "1:274371550541:web:c350bc6474e3febb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Initiate Firestore instance
var db = firebase.firestore();

// Initialize Cloud Functions through Firebase
var functions = firebase.functions();

//Storeage Reference
var storage = firebase.storage().ref();

//assign current user
var currentUser;

//Add a state change listener accross the board
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user;
    
    db.collection("user").doc(user.uid).get()
    .then(function (doc){
      currentUser.dbData = doc.data();
      
      OnCurrentUserLoadComplete();
      if(doc.data().agreedToPrivacyPolicy){
        console.log('agreed')
      }else{
        console.log('not')
      }  
    })
    // ...
  } else {
    // User is signed out.
    currentUser = undefined;

    let pathsWithNoAuthRequirments = ['/','/login','/createPassword','/welcomeback']
    if(!pathsWithNoAuthRequirments.includes(window.location.pathname)){
      window.location.href = '/login';
    }
    
  }
});
  