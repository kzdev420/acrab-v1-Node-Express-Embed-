/**
 * 
 * @param {*} email - user email
 * @param {*} password - user password
 * @param {*} firstName - first name
 * @param {*} lastName - last name
 * @param {*} phone - phone
 * 
 * The function creates a user in firebase Auth. Also adds the user to firestore with the provided details.
 * Once completed it will redirect to privacy policy
 */
function createUser(email,password,firstName,lastName,phone,onComplete,onError){
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user){
        console.log(user.user.uid);
        db.collection("user").doc(user.user.uid).set({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            id:user.user.uid
        })
        .then(onComplete)
        .catch(onError);
        
    })
    .catch(onError);
}

/**
 * 
 * @param {*} email - email
 * @param {*} password  - password
 * @param {*} onComplete  - callback on complete
 * @param {*} onError  - callback on error
 */
function loginUser(email,password,onComplete,onError){
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(onComplete)
    .catch(onError);
}

/**
 * 
 * @param {*} value - true/false 
 * @param {*} onComplete -  callback on complete
 * @param {*} onError -  callback on error
 */
function policyAcknowledgement(value,onComplete,onError){
    console.log(currentUser);
    return db.collection("user").doc(currentUser.uid).update({
        agreedToPrivacyPolicy: value
    })
    .then(onComplete)
    .catch(onError);
}

/**
 * dismissedWelcomeToArcab boolean is set to true  
 * @param {*} onComplete -  callback on complete
 * @param {*} onError -  callback on error
 */
function dismissWelcomeToArcab(onComplete,onError){
    console.log(currentUser);
    return db.collection("user").doc(currentUser.uid).update({
        dismissedWelcomeToArcab: true
    })
    .then(onComplete)
    .catch(onError);
}

/**
 * dismissedWelcomeToArcab boolean is set to true  
 * @param {*} onComplete -  callback on complete
 * @param {*} onError -  callback on error
 */
function dismissEmiratesIDVerify(onComplete,onError){
    return db.collection("user").doc(currentUser.uid).update({
        dismissedEmiratesIDVerify: true
    })
    .then(onComplete)
    .catch(onError);
}

/**
 * dismissedWelcomeToArcab boolean is set to true  
 * @param {*} url -  picture URL
 * @param {*} onComplete -  callback on complete
 * @param {*} onError -  callback on error
 */
function saveUploadedIDURL(url1,url2,onComplete,onError){
    console.log(currentUser);
    return db.collection("user").doc(currentUser.uid).update({
        emiratesIDURL1: url1,
        emiratesIDURL2: url2,
        emiratesIDVerified: false
    })
    .then(onComplete)
    .catch(onError);
}