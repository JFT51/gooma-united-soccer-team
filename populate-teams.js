import { getMatches, addTeam } from './src/services/database.js';

const extractTeamsFromMatches = async () => {
  try {
    // Get all matches
    const matches = await getMatches();
    
    // Extract unique team names
    const teamSet = new Set();
    matches.forEach(match => {
      if (match.homeTeam) teamSet.add(match.homeTeam);
      if (match.awayTeam) teamSet.add(match.awayTeam);
    });
    
    // Convert team names to team objects
    const teams = Array.from(teamSet).map(teamName => ({
      name: teamName,
      logo: null, // Will be added by admin later
      fieldAddress: '', // Will be added by admin later
      colors: [], // Will be added by admin later
    }));
    
    // Add teams to database
    console.log(`Found ${teams.length} teams to add...`);
    
    for (const team of teams) {
      try {
        const teamId = await addTeam(team);
        console.log(`Added team: ${team.name} with ID: ${teamId}`);
      } catch (error) {
        console.error(`Error adding team ${team.name}:`, error);
      }
    }
    
    console.log('Finished adding teams');
    
  } catch (error) {
    console.error('Error extracting teams:', error);
  }
};

// Run the script
extractTeamsFromMatches();
