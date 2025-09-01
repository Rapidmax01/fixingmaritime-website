// Quick test to see if we can access admin content API in demo mode
async function testAdminContent() {
  try {
    // First, let's test without authentication (should work in demo mode)
    const response = await fetch('http://localhost:3001/api/admin/content/sections', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
    } else {
      const data = await response.json();
      console.log('Success! Content sections:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testAdminContent();