import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where,
  limit 
} from 'firebase/firestore';
import { db, storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Matches
export const addMatch = async (matchData) => {
  try {
    const docRef = await addDoc(collection(db, 'matches'), {
      ...matchData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding match:', error);
    throw error;
  }
};

export const uploadProfilePicture = async (file, userId) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

export const getMatches = async () => {
  try {
    const q = query(collection(db, 'matches'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : data.date,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

export const updateMatch = async (matchId, matchData) => {
  try {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      ...matchData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating match:', error);
    throw error;
  }
};

export const deleteMatch = async (matchId) => {
  try {
    await deleteDoc(doc(db, 'matches', matchId));
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};

// Players
export const addPlayer = async (playerData) => {
  try {
    const docRef = await addDoc(collection(db, 'players'), {
      ...playerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const getPlayers = async () => {
  try {
    const q = query(collection(db, 'players'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dateOfBirth: data.dateOfBirth?.toDate ? data.dateOfBirth.toDate() : data.dateOfBirth, // Convert dateOfBirth to Date object
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error getting players:', error);
    throw error;
  }
};

export const getPlayer = async (playerId) => {
  try {
    const playerDoc = await getDoc(doc(db, 'players', playerId));
    if (playerDoc.exists()) {
      const data = playerDoc.data();
      return {
        id: playerDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting player:', error);
    throw error;
  }
};

export const getPlayerByEmail = async (email) => {
  try {
    const q = query(collection(db, 'players'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting player by email:', error);
    throw error;
  }
};

export const updatePlayer = async (playerId, playerData) => {
  try {
    const playerRef = doc(db, 'players', playerId);
    await updateDoc(playerRef, {
      ...playerData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
};

export const deletePlayer = async (playerId) => {
  try {
    await deleteDoc(doc(db, 'players', playerId));
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
};

// News/Blog Posts
export const addNewsPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, 'news'), {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding news post:', error);
    throw error;
  }
};

export const getNewsPosts = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'news'), 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error getting news posts:', error);
    throw error;
  }
};

export const getNewsPost = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'news', postId));
    if (postDoc.exists()) {
      const data = postDoc.data();
      return {
        id: postDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting news post:', error);
    throw error;
  }
};

export const updateNewsPost = async (postId, postData) => {
  try {
    const postRef = doc(db, 'news', postId);
    await updateDoc(postRef, {
      ...postData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating news post:', error);
    throw error;
  }
};

export const deleteNewsPost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'news', postId));
  } catch (error) {
    console.error('Error deleting news post:', error);
    throw error;
  }
};

// Venues
export const addVenue = async (venueData) => {
  try {
    const docRef = await addDoc(collection(db, 'venues'), {
      ...venueData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding venue:', error);
    throw error;
  }
};

export const getVenues = async () => {
  try {
    const q = query(collection(db, 'venues'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error getting venues:', error);
    throw error;
  }
};

export const updateVenue = async (venueId, venueData) => {
  try {
    const venueRef = doc(db, 'venues', venueId);
    await updateDoc(venueRef, {
      ...venueData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating venue:', error);
    throw error;
  }
};

export const deleteVenue = async (venueId) => {
  try {
    await deleteDoc(doc(db, 'venues', venueId));
  } catch (error) {
    console.error('Error deleting venue:', error);
    throw error;
  }
};

// Teams
export const addTeam = async (teamData) => {
  try {
    const docRef = await addDoc(collection(db, 'teams'), {
      ...teamData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding team:', error);
    throw error;
  }
};

export const getTeams = async () => {
  try {
    const q = query(collection(db, 'teams'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error getting teams:', error);
    throw error;
  }
};

export const updateTeam = async (teamId, teamData) => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, {
      ...teamData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};
