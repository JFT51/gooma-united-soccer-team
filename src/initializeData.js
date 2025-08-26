import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Initialize admin user
export const initializeAdminUser = async () => {
  try {
    // Create admin user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'tibo@indii.be', 
      'tibo123'
    );
    const user = userCredential.user;

    // Create admin user document
    await setDoc(doc(db, 'users', user.uid), {
      email: 'tibo@indii.be',
      role: 'admin',
      name: 'Tibo Admin',
      createdAt: new Date(),
      isActive: true
    });

    console.log('Admin user created successfully');
    return user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', error);
    }
  }
};

// Initialize sample data
export const initializeSampleData = async () => {
  try {
    // Sample venues
    const venues = [
      {
        name: 'Gooma Stadium',
        address: 'Rue du Football 123, Brussels, Belgium',
        capacity: 15000,
        isHomeVenue: true
      },
      {
        name: 'Brussels Arena',
        address: 'Avenue des Sports 456, Brussels, Belgium',
        capacity: 20000,
        isHomeVenue: false
      }
    ];

    for (const venue of venues) {
      await addDoc(collection(db, 'venues'), {
        ...venue,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Sample players
    const players = [
      {
        name: 'Jean Dupont',
        position: 'Goalkeeper',
        jerseyNumber: 1,
        age: 28,
        nationality: 'Belgian',
        bio: 'Experienced goalkeeper with excellent reflexes and leadership skills.',
        stats: { matches: 45, cleanSheets: 18, saves: 156 }
      },
      {
        name: 'Marc Janssen',
        position: 'Defender',
        jerseyNumber: 4,
        age: 26,
        nationality: 'Belgian',
        bio: 'Solid defender known for his aerial ability and tactical awareness.',
        stats: { matches: 42, goals: 3, assists: 7 }
      },
      {
        name: 'Pierre Leroy',
        position: 'Midfielder',
        jerseyNumber: 8,
        age: 24,
        nationality: 'Belgian',
        bio: 'Creative midfielder with excellent passing range and vision.',
        stats: { matches: 38, goals: 8, assists: 12 }
      },
      {
        name: 'Lucas Van Der Berg',
        position: 'Forward',
        jerseyNumber: 10,
        age: 22,
        nationality: 'Belgian',
        bio: 'Talented striker with pace and clinical finishing ability.',
        stats: { matches: 40, goals: 18, assists: 6 }
      }
    ];

    for (const player of players) {
      await addDoc(collection(db, 'players'), {
        ...player,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Sample matches
    const matches = [
      {
        opponent: 'Brussels FC',
        date: new Date('2025-09-15T15:00:00'),
        venue: 'Gooma Stadium',
        isHome: true,
        status: 'upcoming',
        competition: 'Belgian League'
      },
      {
        opponent: 'Antwerp United',
        date: new Date('2025-09-22T14:30:00'),
        venue: 'Antwerp Stadium',
        isHome: false,
        status: 'upcoming',
        competition: 'Belgian League'
      },
      {
        opponent: 'Ghent City',
        date: new Date('2025-08-20T16:00:00'),
        venue: 'Gooma Stadium',
        isHome: true,
        status: 'completed',
        result: { home: 2, away: 1 },
        competition: 'Belgian League'
      }
    ];

    for (const match of matches) {
      await addDoc(collection(db, 'matches'), {
        ...match,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Sample news posts
    const newsPosts = [
      {
        title: 'Gooma United Wins Against Ghent City',
        content: 'In an exciting match at home, Gooma United secured a 2-1 victory against Ghent City. Lucas Van Der Berg scored both goals in the second half.',
        author: 'Tibo Admin',
        published: true,
        featured: true,
        tags: ['match-report', 'victory']
      },
      {
        title: 'New Player Signing: Welcome Pierre Leroy',
        content: 'We are excited to announce the signing of midfielder Pierre Leroy. The 24-year-old brings creativity and vision to our midfield.',
        author: 'Tibo Admin',
        published: true,
        featured: false,
        tags: ['transfer', 'new-signing']
      },
      {
        title: 'Training Camp Preparation for New Season',
        content: 'The team is preparing intensively for the upcoming season with a training camp in the Ardennes. Focus on fitness and team building.',
        author: 'Tibo Admin',
        published: true,
        featured: false,
        tags: ['training', 'preparation']
      }
    ];

    for (const post of newsPosts) {
      await addDoc(collection(db, 'news'), {
        ...post,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// Initialize everything
export const initializeApp = async () => {
  await initializeAdminUser();
  await initializeSampleData();
};

