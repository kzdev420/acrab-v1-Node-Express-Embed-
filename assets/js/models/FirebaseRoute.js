/**
 * Gets all Available Routes
 */
function getAllAvailableRoutes(onComplete, onError) {
	return db.collection('route').get().then(onComplete).catch(onError);
}

/**
 * Gets all Routes the current user is a member of
 */
function getRoutesForUser(onComplete, onError) {
	return db
		.collection('route')
		.where('members', 'array-contains', currentUser.uid)
		.get()
		.then(onComplete)
		.catch(onError);
}

/**
 * Gets Route
 */
function getRoute(id, onComplete, onError) {
	return db.collection('route').doc(id).get().then(onComplete).catch(onError);
}
