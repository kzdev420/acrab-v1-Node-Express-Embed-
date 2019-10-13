
/**
 * gets the user balance document
 * @param {*} onComplete -  callback on complete
 * @param {*} onError -  callback on error
 */
function getUserBalance(onComplete,onError){
    return db.collection("balance").doc(currentUser.uid).get()
    .then(onComplete)
    .catch(onError);
}

/**
 * gets the user balance document
 * @param {*} onComplete -  callback on complete
 * @param {*} onError -  callback on error
 */
function getUserSavedCards(onComplete,onError){
    return db.collection("balance").doc(currentUser.uid).get()
    .then(doc=>{
        let savedCards = [];
        Object.keys(doc.data().card).forEach(function (item) {
            var currentCard = [];
            currentCard.type = item.split('-')[0];
            currentCard.last4 = item.split('-')[1];
            currentCard.stripeID = doc.data().card[item];
            savedCards.push(currentCard);
        });
        onComplete(savedCards);
        

    })
    .catch(onError);
}