// Test updating content with subtext
async function testUpdateContent() {
  try {
    // Try to update hero section with subtext
    const response = await fetch('http://localhost:3001/api/admin/content/sections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'hero-section',
        type: 'hero',
        name: 'Hero Section',
        title: 'Your Gateway to Global Maritime Solutions',
        content: 'Your trusted partner for comprehensive maritime solutions.',
        subtext: 'To book for a truck to load and deliver your container or cargo, safe and sound tap the request for truck(s) button below.'
      })
    });

    console.log('Response status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
    
    if (!response.ok) {
      // Try to parse as JSON if possible
      try {
        const jsonError = JSON.parse(data);
        console.error('Error details:', jsonError);
      } catch (e) {
        console.error('Error text:', data);
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testUpdateContent();