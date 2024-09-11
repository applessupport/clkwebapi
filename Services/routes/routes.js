const express = require('express');
const router = express.Router();
const admin = require('../firebaseConfig');
const db = admin.firestore();

// Route to check if a user exists by email
router.get('/api/checkuser', async (req, res) => {
    const { email } = req.query;

    try {
        // Attempt to fetch the user by email
        const userRecord = await admin.auth().getUserByEmail(email);
        
        if (userRecord) {
            // If the user is found, respond with a success message and user ID
            return res.status(200).json({ message: 'User exists', userId: userRecord.uid });
        }
    } catch (error) {
        // Handle the case where the user is not found
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ message: 'User not found' });
        }
        // Handle any other errors
        res.status(500).json({ message: 'Error checking user', error: error.message });
    }
});

// Route to check if an app exists for a user
router.get('/api/app', async (req, res) => {
    const { name, userId } = req.query;

    try {
        // Query Firestore to find apps by name
        let appQuery = db.collection('apps').where('name', '==', name);
        const appSnapshot = await appQuery.get();

        // If no apps are found, respond with an error
        if (appSnapshot.empty) {
            return res.status(404).json({ message: 'App not found' });
        }

        // If a userId is provided, filter the apps by userId
        if (userId) {
            const userFilteredApps = appSnapshot.docs.filter(doc => doc.data().userId === userId);

            // If no apps are found for the user, respond with an error
            if (userFilteredApps.length === 0) {
                return res.status(404).json({ message: 'App not found for the provided userId' });
            }

            // Respond with the app data if found
            return res.status(200).json({
                message: 'App found for the provided userId',
                appId: userFilteredApps[0].id,
                appData: userFilteredApps[0].data()
            });
        }

        // If no userId is provided or no apps found, respond with an error
        return res.status(404).json({ message: "App Not Found" });
        
    } catch (error) {
        console.error("Error fetching app:", error);
        // Handle any errors that occur during app retrieval
        res.status(500).json({ message: 'Error checking app', error: error.message });
    }
});

module.exports = router;
