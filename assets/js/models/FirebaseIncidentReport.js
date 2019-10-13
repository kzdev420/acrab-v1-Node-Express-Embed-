
/**
 * gets the user balance document
 * @param {*} onComplete -  callback on complete
 * @param {*} onError -  callback on error
 */
function addIncidentReport(topic,subject,description,uid,email,onComplete,onError){
    return db.collection("incidentReport").add({
        topic: topic,
        subject: subject,
        description: description,
        uid: uid,
        email: email,
        createdAt: Date.now()
    })
    .then(onComplete)
    .catch(onError);
}
