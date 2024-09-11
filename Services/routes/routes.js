const express = require('express');
const router = express.Router();
const admin = require('../firebaseConfig');
const db = admin.firestore();



router.get('/api/checkuser', async (req, res) => {
    const { email } = req.query;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        
        if (userRecord) {
            return res.status(200).send({ message: 'User exists', userId: userRecord.uid });
        }
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Error checking user', error: error.message });
    }
});

router.get('/api/app', async (req, res) => {
    const { name, userId } = req.query;

    try {
        let appQuery = db.collection('apps').where('name', '==', name);
        
        const appSnapshot = await appQuery.get();

        if (appSnapshot.empty) {
            return res.status(404).json({ message: 'App not found' });
        }

        if (userId) {
            const userFilteredApps = appSnapshot.docs.filter(doc => doc.data().userId === userId);

            if (userFilteredApps.length === 0) {
                return res.status(404).json({ message: 'App not found for the provided userId' });
            }

            return res.status(200).json({
                message: 'App found for the provided userId',
                appId: userFilteredApps[0].id,
                appData: userFilteredApps[0].data()
            });
        }

     
        return res.status(404).json({'message':"App Not Found"});
        
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Error checking app', error: error.message });
    }
});


module.exports = router;
