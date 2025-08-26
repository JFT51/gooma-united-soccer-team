// Sample Data Initialization Script for Gooma United Website
// This script can be run in the browser console to populate the database with sample data

// Sample Matches Data
const sampleMatches = [
  {
    opponent: "FC Brussels",
    date: "2025-09-15",
    time: "15:00",
    venue: "Gooma Stadium",
    type: "home",
    competition: "League"
  },
  {
    opponent: "Antwerp United",
    date: "2025-09-22",
    time: "18:30",
    venue: "Antwerp Arena",
    type: "away",
    competition: "League"
  },
  {
    opponent: "Ghent FC",
    date: "2025-09-29",
    time: "14:00",
    venue: "Gooma Stadium",
    type: "home",
    competition: "Cup"
  },
  {
    opponent: "Liège Sports",
    date: "2025-10-06",
    time: "16:00",
    venue: "Liège Stadium",
    type: "away",
    competition: "League"
  },
  {
    opponent: "Bruges City",
    date: "2025-10-13",
    time: "15:30",
    venue: "Gooma Stadium",
    type: "home",
    competition: "European"
  }
];

// Sample Players Data
const samplePlayers = [
  {
    name: "Marco Van Der Berg",
    position: "Goalkeeper",
    age: 28,
    nationality: "Belgian",
    jerseyNumber: 1,
    height: "190cm",
    weight: "85kg",
    bio: "Experienced goalkeeper with excellent reflexes and leadership qualities.",
    email: "marco.vanderberg@goomaunited.be",
    goals: 0,
    assists: 2,
    matches: 25,
    yellowCards: 1,
    redCards: 0
  },
  {
    name: "Jean-Baptiste Dubois",
    position: "Defender",
    age: 26,
    nationality: "Belgian",
    jerseyNumber: 4,
    height: "185cm",
    weight: "80kg",
    bio: "Solid defender with great aerial ability and tactical awareness.",
    email: "jean.dubois@goomaunited.be",
    goals: 3,
    assists: 5,
    matches: 28,
    yellowCards: 4,
    redCards: 0
  },
  {
    name: "Ahmed El Mansouri",
    position: "Midfielder",
    age: 24,
    nationality: "Moroccan",
    jerseyNumber: 8,
    height: "175cm",
    weight: "72kg",
    bio: "Creative midfielder with excellent passing range and vision.",
    email: "ahmed.elmansouri@goomaunited.be",
    goals: 8,
    assists: 12,
    matches: 30,
    yellowCards: 2,
    redCards: 0
  },
  {
    name: "Lucas Silva",
    position: "Forward",
    age: 22,
    nationality: "Brazilian",
    jerseyNumber: 10,
    height: "178cm",
    weight: "75kg",
    bio: "Talented striker with pace, skill, and a keen eye for goal.",
    email: "lucas.silva@goomaunited.be",
    goals: 18,
    assists: 7,
    matches: 29,
    yellowCards: 3,
    redCards: 1
  },
  {
    name: "Pierre Janssens",
    position: "Midfielder",
    age: 30,
    nationality: "Belgian",
    jerseyNumber: 6,
    height: "182cm",
    weight: "78kg",
    bio: "Team captain and experienced midfielder with great leadership skills.",
    email: "pierre.janssens@goomaunited.be",
    goals: 5,
    assists: 9,
    matches: 31,
    yellowCards: 5,
    redCards: 0
  }
];

// Sample News Articles
const sampleNews = [
  {
    title: "Gooma United Wins 3-1 Against FC Brussels",
    content: "In a thrilling match at Gooma Stadium, our team secured a convincing 3-1 victory against FC Brussels. Lucas Silva opened the scoring in the 15th minute with a brilliant solo effort, followed by goals from Ahmed El Mansouri and Pierre Janssens. The team showed great character and determination throughout the match.",
    category: "Match Results",
    author: "tibo@indii.be",
    tags: ["victory", "match", "goals"],
    featured: true
  },
  {
    title: "New Signing: Welcome Lucas Silva",
    content: "We are excited to announce the signing of Brazilian forward Lucas Silva from São Paulo FC. The 22-year-old striker brings pace, skill, and goal-scoring ability to our squad. Silva has already impressed in training and is expected to make his debut in the upcoming match against Antwerp United.",
    category: "Transfers",
    author: "tibo@indii.be",
    tags: ["transfer", "new player", "signing"],
    featured: false
  },
  {
    title: "Youth Academy Success",
    content: "Our youth academy continues to produce talented players. Three academy graduates have been promoted to the first team squad this season. The academy's focus on technical development and character building is paying dividends for the club's future.",
    category: "Community",
    author: "tibo@indii.be",
    tags: ["youth", "academy", "development"],
    featured: false
  },
  {
    title: "Season Tickets Now Available",
    content: "Season tickets for the 2025-26 season are now available for purchase. Early bird prices are valid until the end of September. Join us for what promises to be an exciting season as we aim for promotion to the first division.",
    category: "Tickets",
    author: "tibo@indii.be",
    tags: ["tickets", "season", "supporters"],
    featured: false
  }
];

// Sample Venues
const sampleVenues = [
  {
    name: "Gooma Stadium",
    address: "Rue du Football 123, Brussels, Belgium",
    capacity: 15000,
    type: "home"
  },
  {
    name: "Antwerp Arena",
    address: "Antwerp Sports Complex, Antwerp, Belgium",
    capacity: 20000,
    type: "away"
  },
  {
    name: "Ghent Stadium",
    address: "Ghent City Center, Ghent, Belgium",
    capacity: 18000,
    type: "away"
  }
];

// Function to initialize sample data
async function initializeSampleData() {
  console.log("Starting sample data initialization...");
  
  try {
    // Add matches
    console.log("Adding sample matches...");
    for (const match of sampleMatches) {
      await addMatch(match);
    }
    
    // Add players
    console.log("Adding sample players...");
    for (const player of samplePlayers) {
      await addPlayer(player);
    }
    
    // Add news articles
    console.log("Adding sample news articles...");
    for (const article of sampleNews) {
      await addNewsPost(article);
    }
    
    // Add venues
    console.log("Adding sample venues...");
    for (const venue of sampleVenues) {
      await addVenue(venue);
    }
    
    console.log("Sample data initialization completed successfully!");
    
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}

// Instructions for use:
console.log(`
To initialize sample data:
1. Make sure you're logged in as admin
2. Open browser console on the website
3. Run: initializeSampleData()

Note: Make sure Firebase security rules allow write access for authenticated users.
`);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sampleMatches,
    samplePlayers,
    sampleNews,
    sampleVenues,
    initializeSampleData
  };
}

