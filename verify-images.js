// Image verification script for Firebase hosting
const images = [
  '/hero.jpg',
  '/hero-banner.png',
  '/team-celebration.jpg'
];

console.log('🔍 Verifying Firebase image accessibility...\n');

images.forEach(image => {
  fetch(`https://sagachat-3cfaf.web.app${image}`)
    .then(response => {
      if (response.ok) {
        console.log(`✅ ${image} - Accessible (${response.status})`);
      } else {
        console.log(`❌ ${image} - Error (${response.status})`);
      }
    })
    .catch(error => {
      console.log(`❌ ${image} - Network error: ${error.message}`);
    });
});

console.log('\n📝 Image verification complete.');
