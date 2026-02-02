const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.removeFriend = onCall({ cors: true }, async (request) => {
    const { auth, data } = request;
    if (!auth) {
        throw new HttpsError("unauthenticated", "Authentication required.");
    }
    const friendUid = String(data?.friendUid || "").trim();
    if (!friendUid) {
        throw new HttpsError("invalid-argument", "friendUid is required.");
    }
    if (friendUid === auth.uid) {
        throw new HttpsError("invalid-argument", "Cannot remove yourself.");
    }

    const db = admin.firestore();
    const batch = db.batch();
    const userRef = db.collection("friends").doc(`${auth.uid}_${friendUid}`);
    const friendRef = db.collection("friends").doc(`${friendUid}_${auth.uid}`);
    batch.delete(userRef);
    batch.delete(friendRef);

    const reqId = `${auth.uid}_${friendUid}`;
    const revId = `${friendUid}_${auth.uid}`;
    const reqRef = db.collection("friendRequests").doc(reqId);
    const revRef = db.collection("friendRequests").doc(revId);
    batch.delete(reqRef);
    batch.delete(revRef);

    await batch.commit();
    return { ok: true };
});

exports.acceptFriend = onCall({ cors: true }, async (request) => {
    const { auth, data } = request;
    if (!auth) {
        throw new HttpsError("unauthenticated", "Authentication required.");
    }
    const fromUid = String(data?.fromUid || "").trim();
    const toUid = String(data?.toUid || "").trim();
    const fromHandle = String(data?.fromHandle || "").trim();
    const toHandle = String(data?.toHandle || "").trim();
    if (!fromUid || !toUid) {
        throw new HttpsError("invalid-argument", "fromUid and toUid required.");
    }
    if (auth.uid !== toUid) {
        throw new HttpsError("permission-denied", "Not allowed.");
    }
    if (fromUid === toUid) {
        throw new HttpsError("invalid-argument", "Invalid request.");
    }

    const db = admin.firestore();
    const batch = db.batch();

    const friendId = `${toUid}_${fromUid}`;
    const reverseId = `${fromUid}_${toUid}`;
    batch.set(db.collection("friends").doc(friendId), {
        ownerUid: toUid,
        friendUid: fromUid,
        friendHandle: fromHandle,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(db.collection("friends").doc(reverseId), {
        ownerUid: fromUid,
        friendUid: toUid,
        friendHandle: toHandle,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const reqId = `${fromUid}_${toUid}`;
    batch.delete(db.collection("friendRequests").doc(reqId));

    await batch.commit();
    return { ok: true };
});
