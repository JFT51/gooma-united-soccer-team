// Script to add matches to Firebase database
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh0OjEQ2q1Pfypc-tOPPaJg0bHNzQaaPc",
  authDomain: "sagachat-3cfaf.firebaseapp.com",
  projectId: "sagachat-3cfaf",
  storageBucket: "sagachat-3cfaf.firebasestorage.app",
  messagingSenderId: "1035940942432",
  appId: "1:1035940942432:web:7cf07b666dc7e3fd74a905",
  measurementId: "G-EXYPTFEJFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Match data from user input
const matchData = `30-08-2025	LAS MANAS	-	GOOMA UNITED		15:00
06-09-2025	GOOMA UNITED	-	V.B.		15:15
13-09-2025	MORTSEL VC	-	GOOMA UNITED		16:30
27-09-2025	BENNE 1980 B	-	GOOMA UNITED		15:30
04-10-2025	GOOMA UNITED	-	FOXES OXFORD		15:15
11-10-2025	MANHATTAN	-	GOOMA UNITED		14:00
18-10-2025	GOOMA UNITED	-	ELITE ATHLETIC		15:15
08-11-2025	SCHONENBERG	-	GOOMA UNITED		15:00
15-11-2025	GOOMA UNITED	-	BELLE VUE		15:00
22-11-2025	RUISBROEK S.K.	-	GOOMA UNITED		13:00
29-11-2025	GOOMA UNITED	-	LAS MANAS		15:00
06-12-2025	V.B.	-	GOOMA UNITED		15:00
13-12-2025	GOOMA UNITED	-	MORTSEL VC		15:00
17-01-2026	GOOMA UNITED	-	BENNE 1980 B		15:00
24-01-2026	FOXES OXFORD	-	GOOMA UNITED		13:30
31-01-2026	GOOMA UNITED	-	MANHATTAN		15:00
07-02-2026	ELITE ATHLETIC	-	GOOMA UNITED		12:00
28-02-2026	GOOMA UNITED	-	SCHONENBERG		15:15
07-03-2026	BELLE VUE	-	GOOMA UNITED		15:00
14-03-2026	GOOMA UNITED	-	RUISBROEK S.K.		15:15`;

function parseMatches(matchData) {
  const lines = matchData.trim().split('\n');
  const matches = [];

  lines.forEach(line => {
    const parts = line.split('\t').filter(part => part.trim() !== '');
    if (parts.length >= 4) {
      const dateStr = parts[0];
      const team1 = parts[1].trim();
      const team2 = parts[3].trim();
      const time = parts[4] ? parts[4].trim() : '15:00';

      // Parse date (DD-MM-YYYY format)
      const [day, month, year] = dateStr.split('-');
      const date = new Date(`${year}-${month}-${day}T${time}:00`);

      // Determine if Gooma United is home or away
      const isHome = team1.includes('GOOMA UNITED');

      const match = {
        date: date,
        opponent: isHome ? team2 : team1,
        venue: isHome ? 'Home Stadium' : 'Away',
        type: isHome ? 'home' : 'away',
        competition: 'League',
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      matches.push(match);
    }
  });

  return matches;
}

async function addMatchesToDatabase(matches) {
  console.log(`📅 Adding ${matches.length} matches to database...\n`);

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    try {
      const docRef = await addDoc(collection(db, 'matches'), match);
      console.log(`✅ Match ${i + 1}: ${match.opponent} (${match.type}) - Added with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`❌ Error adding match ${i + 1}:`, error);
    }
  }

  console.log(`\n🎉 Successfully added ${matches.length} matches to the database!`);
}

// Run the script
const matches = parseMatches(matchData);
console.log('📋 Parsed matches:');
matches.forEach((match, index) => {
  console.log(`${index + 1}. ${match.opponent} (${match.type}) - ${match.date.toLocaleDateString()} ${match.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
});

console.log('\n🚀 Starting database upload...\n');

// Uncomment the next line to actually add to database
addMatchesToDatabase(matches);

// For now, just show what would be added
// console.log('📝 Preview mode - uncomment addMatchesToDatabase(matches) to add to database');
