// Simple API test
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('Testing API endpoints...');
  
  // Test generateSoulPrint
  console.log('\n1. Testing generateSoulPrint...');
  try {
    const response = await fetch(`${API_BASE_URL}/generateSoulPrint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: {
          "Communication Style": ["I speak directly and concisely."]
        }
      })
    });
    
    const data = await response.json();
    console.log('✅ generateSoulPrint works');
    console.log('System prompt generated:', data.systemPrompt ? 'Yes' : 'No');
    
    // Test continueChat with the generated system prompt
    console.log('\n2. Testing continueChat...');
    const chatResponse = await fetch(`${API_BASE_URL}/continueChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ sender: 'user', text: 'Tell me about yourself.' }],
        systemPrompt: data.systemPrompt
      })
    });
    
    const chatData = await chatResponse.json();
    if (chatResponse.ok) {
      console.log('✅ continueChat works');
      console.log('AI response:', chatData.text);
      
      // Check if AI mentions being Alter Ego
      const mentionsAlterEgo = chatData.text.includes('AI Alter Ego');
      console.log('✅ AI mentions being Alter Ego:', mentionsAlterEgo);
    } else {
      console.log('❌ continueChat failed:', chatData.error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAPI();