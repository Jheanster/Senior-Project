import { auth, docDB, fileDB } from "../firebase";
import { serverTimestamp } from "@firebase/firestore";
import { assignProspectScore } from "./ProspectScoreService";
import { assignDistanceFromLocalUser } from "./UserLocationService";
import * as FileSystem from "expo-file-system";

const MAX_DISTANCE_MI = 25;
const DONT_LOAD_ALREADY_SEEN_PROSPECTS = false; //for testing purposes

const usersCol = docDB.collection("users");
const matchesCol = docDB.collection("matches");

var localUser = null;
var sortedProspects = [];

var cachedMatches = null;
const cachedProspects = {};
const cachedPFPUrls = {};
const cachedMostRecentMessages = {};
const cachedAllMessages = {};

async function registerUser(newData) {
  try {
    await auth.createUserWithEmailAndPassword(newData.email, newData.password);
    return await usersCol.add({
      email: newData.email.toLowerCase(),
    });
  } catch (error) {
    return await Promise.reject(error);
  }
}

function loginUser(data) {
  return auth.signInWithEmailAndPassword(data.email, data.password);
}

function getDataFromDoc(doc) {
  const data = doc.data();
  data.id = doc.id;
  return data;
}

function loadLocalUserData(email, onCompletionFunc) {
  usersCol
    .where("email", "==", email)
    .get()
    .then((snapshot) => {
      if (snapshot.size === 1) {
        //console.log("Snapshot size: ", snapshot.size)
        //console.log("Snapshot Data: ", snapshot.docs[0].data())
        localUser = getDataFromDoc(snapshot.docs[0]);
        //console.log(localUser)
        console.log('Running loadLocalUserData function')
        if (localUser?.name){
          assignPFP(localUser, () => {
            if (onCompletionFunc) {
              onCompletionFunc();
            }
          });
        } else {
          if(onCompletionFunc){
            onCompletionFunc();
          }
        }
        
      } else if (snapshot.size > 1) {
        console.warn(
          "Error: There are multiple users with the email: '" + email + "'"
        );
      } else {
        console.warn(
          "Error: We couldn't find a user with the email: '" + email + "'"
        );
      }
    });
}

function getLocalUserData() {
  return localUser;
}

function loadProspectsData(onCompletionFunc) {

  console.log("Calling load Prospect data")
  if (localUser != null && localUser?.country && localUser?.state) {
    let query = usersCol
      .where("country", "==", localUser?.country)
      .where("state", "==", localUser?.state);
    // console.log("Query: ", query)
    if (DONT_LOAD_ALREADY_SEEN_PROSPECTS) {
      usersCol
        .doc(localUser.id)
        .collection("approvals")
        .get()
        .then((approvalSnapshot) => {
          const approvalEmails = approvalSnapshot.docs.map(
            (approvalDoc) => approvalDoc.data().email
          );

          usersCol
            .doc(localUser.id)
            .collection("rejections")
            .get()
            .then((rejectionSnapshot) => {
              const rejectionEmails = rejectionSnapshot.docs.map(
                (rejectionDoc) => rejectionDoc.data().email
              );
              const blacklist = [
                localUser.email,
                ...approvalEmails,
                ...rejectionEmails,
              ];

              query = query.where("email", "not-in", blacklist);
              loadProspectsDataFromQuery(query, onCompletionFunc);
            });
        });

    } else {
      let query = usersCol.where("email", "!=", localUser.email);
      loadProspectsDataFromQuery(query, onCompletionFunc);
    }
  } else {

    // The user doesn't have a country or state, they are  a new user.
    onCompletionFunc();
    // console.warn(
    //   "Error: Trying to load prospects before loading the local user"
    // );
  }
}

function loadProspectsDataFromQuery(query, onCompletionFunc) {
  query.get().then((snapshot) => {
    if (snapshot.empty) {
      console.log("No users with local country or state");
      onCompletionFunc();
    }

    const validProspects = [];

    snapshot.forEach((otherUserDoc) => {
      const otherUser = getDataFromDoc(otherUserDoc);
      console.log("Loaded prospect: " + otherUser.name);
      assignDistanceFromLocalUser(localUser, otherUser);

      if (otherUser.distance <= MAX_DISTANCE_MI) {
        assignProspectScore(localUser, otherUser);
        console.log("  -Within distance");
        if (!isNaN(otherUser.score)) {
          console.log("  -Acceptable score");
          validProspects.push(otherUser);
          cachedProspects[otherUser.id] = otherUser;
        }
      }
    });

    if (validProspects.length > 0) {
      sortedProspects = validProspects.sort(
        (user1, user2) => user2.score - user1.score
      );

      let numPFPsLoaded = 0;
      sortedProspects.forEach((prospect) => {
        assignPFP(prospect, () => {
          numPFPsLoaded++;
          if (numPFPsLoaded === sortedProspects.length && onCompletionFunc) {
            onCompletionFunc();
          }
        });
      });
    } else {
      sortedProspects = validProspects;
      console.log("No valid prospective matches");
      onCompletionFunc();
    }
  });
}

function getProspectsData() {
  return sortedProspects;
}

function updateLocalUserInDB(newData) {
  for (let field in newData) {
    localUser[field] = newData[field];
  }
  usersCol.doc(localUser.id).update(newData);
}

function getPFPRef(user) {
  return fileDB.ref("pfps/pfp-" + user.id + ".png");
}

function assignPFP(user, onCompletionFunc) {
  getPFPRef(user)
    .getDownloadURL()
    .then(
      (url) => {
        user.pfp = url;
        cachedPFPUrls[user.id] = url;
        if (onCompletionFunc) {
          onCompletionFunc(true);
        }
      },
      () => {
        fileDB
          .ref("pfps/blank-default-pfp-wue0zko1dfxs9z2c.webp")
          .getDownloadURL()
          .then((url) => {
            user.pfp = url;
            cachedPFPUrls[user.id] = url;
            if (onCompletionFunc) {
              onCompletionFunc(true);
            }
          });
        console.warn("Defaulting to a PFP for " + user.email);
      }
    );
}

async function updateLocalUserPFPInDB(image) {
  try {
    const { uri } = await FileSystem.getInfoAsync(image);

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError("Network request failed"));
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    await getPFPRef(localUser).put(blob);
  } catch (error) {
    console.error(error);
  }
}

function addProspectApprovalToDB(prospect, onNewMatchFunc) {
  const localApprovalRef = usersCol
    .doc(localUser.id)
    .collection("approvals")
    .doc(prospect.id);
  localApprovalRef.get().then((localApproval) => {
    if (!localApproval.exists) {
      localApprovalRef.set({ email: prospect.email });

      const prospectApprovalRef = usersCol
        .doc(prospect.id)
        .collection("approvals")
        .doc(localUser.id);
      prospectApprovalRef.get().then((prospectApproval) => {
        if (prospectApproval.exists) {
          matchesCol.add({
            userIDs: [localUser.id, prospect.id],
            timestamp: serverTimestamp(),
          });

          onNewMatchFunc();
        }
      });
    }
  });
}

function addProspectRejectionToDB(prospect) {
  usersCol
    .doc(localUser.id)
    .collection("rejections")
    .doc(prospect.id)
    .set({ email: prospect.email });
}

function listenForLocalUserMatches(onUpdatedFunc) {
  if (cachedMatches) {
    onUpdatedFunc(cachedMatches);
  }

  const unsubscribe = matchesCol
    .where("userIDs", "array-contains", localUser.id)
    .onSnapshot((matchesSnapshot) => {
      const matches = matchesSnapshot.docs.map((matchDoc) =>
        getDataFromDoc(matchDoc)
      );
      const prevLength = cachedMatches ? cachedMatches.length : 0;

      if (matches.length > prevLength) {
        onUpdatedFunc(matches);
        cachedMatches = matches;
      }
    });
  return unsubscribe;
}

function loadMatchedProspect(match, onLoadedFunc) {
  const prospectID =
    match.userIDs[0] === localUser.id ? match.userIDs[1] : match.userIDs[0];

  if (cachedProspects[prospectID]) {
    onLoadedFunc(cachedProspects[prospectID]);
  }

  usersCol
    .doc(prospectID)
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const prospect = getDataFromDoc(userDoc);

        if (cachedPFPUrls[prospect.id]) {
          prospect.pfp = cachedPFPUrls[prospect.id];
          onLoadedFunc(prospect);
        } else {
          assignPFP(prospect, () => onLoadedFunc(prospect));
        }

        cachedProspects[prospectID] = prospect;
      } else {
        console.warn("Matched prospect '" + prospectID + "' not found");
        onLoadedFunc(null);
      }
    });
}

function listenForMostRecentMessage(match, onUpdatedFunc) {
  if (cachedMostRecentMessages[match.id]) {
    onUpdatedFunc(cachedMostRecentMessages[match.id]);
  }

  const unsubscribe = matchesCol
    .doc(match.id)
    .collection("messages")
    .orderBy("timestamp", "desc")
    .limit(1)
    .onSnapshot((messagesSnapshot) => {
      if (messagesSnapshot.size === 1) {
        const message = getDataFromDoc(messagesSnapshot.docs[0]);
        onUpdatedFunc(message);
        cachedMostRecentMessages[match.id] = message;
      }
    });

  return unsubscribe;
}

function listenForAllMessages(match, onUpdatedFunc) {
  if (cachedAllMessages[match.id]) {
    onUpdatedFunc(cachedAllMessages[match.id]);
  }

  const unsubscribe = matchesCol
    .doc(match.id)
    .collection("messages")
    .orderBy("timestamp", "desc")
    .onSnapshot((messagesSnapshot) => {
      const messages = messagesSnapshot.docs.map((messageDoc) =>
        getDataFromDoc(messageDoc)
      );
      const prevLength = cachedAllMessages[match.id]
        ? cachedAllMessages[match.id].length
        : 0;

      if (messages.length > prevLength) {
        onUpdatedFunc(messages);
        cachedAllMessages[match.id] = messages;
      }
    });

  return unsubscribe;
}

function addMessageToDB(match, text) {
  const message = {
    userID: localUser.id,
    timestamp: serverTimestamp(),
    text,
  };

  matchesCol.doc(match.id).collection("messages").add(message);
  return message;
}

export {
  registerUser,
  loginUser,
  loadLocalUserData,
  getLocalUserData,
  loadProspectsData,
  getProspectsData,
  updateLocalUserInDB,
  updateLocalUserPFPInDB,
  assignPFP,
  addProspectApprovalToDB,
  addProspectRejectionToDB,
  listenForLocalUserMatches,
  loadMatchedProspect,
  listenForMostRecentMessage,
  listenForAllMessages,
  addMessageToDB,
};
