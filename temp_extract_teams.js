
import { getMatches } from './src/services/database.js';

async function extractTeams() {
  try {
    const matches = await getMatches();
    const teams = new Set();
    teams.add('Gooma United'); // Add the home team

    matches.forEach(match => {
      teams.add(match.opponent);
    });

    console.log('Unique Teams:', Array.from(teams));
  } catch (error) {
    console.error('Error extracting teams:', error);
  }
}

extractTeams();
