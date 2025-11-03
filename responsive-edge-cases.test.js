// Test responsive design and edge cases
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function testEdgeCases() {
  console.log('\n=== Testing Edge Cases ===');
  
  // Test with empty answers
  console.log('\n--- Testing empty answers ---');
  try {
    const response = await fetch(`${API_BASE_URL}/generateSoulPrint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: {} })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Empty answers handled gracefully');
      console.log('✅ System prompt generated with undefined pillars:', data.systemPrompt.includes('undefined'));
    } else {
      console.log('❌ Empty answers caused error:', data.error);
    }
  } catch (error) {
    console.log('❌ Empty answers test failed:', error.message);
  }
  
  // Test with very long answers
  console.log('\n--- Testing very long answers ---');
  const longAnswers = {
    "Communication Style": [
      "A".repeat(1000) + " This is a very long answer to test how the system handles lengthy responses."
    ]
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/generateSoulPrint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: longAnswers })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Long answers handled gracefully');
      console.log('✅ System prompt generated:', data.systemPrompt ? 'Yes' : 'No');
    } else {
      console.log('❌ Long answers caused error:', data.error);
    }
  } catch (error) {
    console.log('❌ Long answers test failed:', error.message);
  }
  
  // Test continueChat with empty messages
  console.log('\n--- Testing continueChat with empty messages ---');
  try {
    const response = await fetch(`${API_BASE_URL}/continueChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [],
        systemPrompt: "You are a helpful assistant."
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.log('✅ Empty messages properly rejected');
      console.log('✅ Error message:', data.error);
    } else {
      console.log('❌ Empty messages should have been rejected');
    }
  } catch (error) {
    console.log('❌ Empty messages test failed:', error.message);
  }
  
  // Test with missing system prompt
  console.log('\n--- Testing continueChat with missing system prompt ---');
  try {
    const response = await fetch(`${API_BASE_URL}/continueChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ sender: 'user', text: 'Hello' }]
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.log('✅ Missing system prompt properly rejected');
      console.log('✅ Error message:', data.error);
    } else {
      console.log('❌ Missing system prompt should have been rejected');
    }
  } catch (error) {
    console.log('❌ Missing system prompt test failed:', error.message);
  }
}

async function testPersonaConsistency() {
  console.log('\n=== Testing Persona Consistency ===');
  
  // Generate SoulPrint with detailed answers
  const detailedAnswers = {
    "Communication Style": [
      "I tend to speak directly and concisely. When I'm not heard, I repeat myself more firmly.",
      "People often think I'm being blunt when I'm just being efficient.",
      "I tend to say 'literally' when I'm stressed.",
      "Silence in conversation means I'm thinking carefully about my response.",
      "When interrupted, I feel frustrated but usually let it pass.",
      "A phrase I picked up is 'it is what it is' from my grandfather.",
      "I write similarly to how I talk - direct and to the point.",
      "I once hurt someone by being too direct without realizing it.",
      "The most honest thing I've said is admitting I was wrong about something important.",
      "If I had one sentence to explain myself: I'm practical, direct, and value efficiency over pleasantries."
    ],
    "Decision-Making & Risk": [
      "I gather data first, then trust my gut for the final decision.",
      "Hesitation cost me a job opportunity once - learned to be more decisive.",
      "Acceptable risk means calculated risks with backup plans.",
      "I tend to overthink in high-stakes situations.",
      "My method for breaking deadlocks is to list pros and cons objectively.",
      "Made a decision that felt wrong logically but right emotionally - chose my gut.",
      "I recover from bad decisions by analyzing what went wrong and adapting.",
      "I trust my future self to handle consequences because I've grown.",
      "When decisions affect others, I consider their perspectives but make the final call.",
      "Made a snap decision to move cities - changed my life for the better."
    ]
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/generateSoulPrint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: detailedAnswers })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Detailed SoulPrint generated');
      
      // Test multiple messages to see if AI maintains persona
      console.log('\n--- Testing persona maintenance across messages ---');
      const chatResponse1 = await fetch(`${API_BASE_URL}/continueChat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: 'How do you make decisions?' }],
          systemPrompt: data.systemPrompt
        })
      });
      
      const chatData1 = await chatResponse1.json();
      if (chatResponse1.ok) {
        console.log('✅ First response generated');
        
        // Check if response reflects the personality from sample answers
        const reflectsPersonality = chatData1.text.toLowerCase().includes('data') || 
                                 chatData1.text.toLowerCase().includes('analyze') ||
                                 chatData1.text.toLowerCase().includes('logical') ||
                                 chatData1.text.toLowerCase().includes('direct');
        console.log('✅ AI response reflects analytical personality:', reflectsPersonality);
        
        // Test second message to see if persona is maintained
        const chatResponse2 = await fetch(`${API_BASE_URL}/continueChat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { sender: 'user', text: 'How do you make decisions?' },
              { sender: 'ai', text: chatData1.text },
              { sender: 'user', text: 'What do you do when you\'re stressed?' }
            ],
            systemPrompt: data.systemPrompt
          })
        });
        
        const chatData2 = await chatResponse2.json();
        if (chatResponse2.ok) {
          console.log('✅ Second response generated');
          
          // Check if second response also maintains persona
          const maintainsPersona = chatData2.text.toLowerCase().includes('direct') ||
                               chatData2.text.toLowerCase().includes('efficient') ||
                               chatData2.text.toLowerCase().includes('practical');
          console.log('✅ AI maintains persona across messages:', maintainsPersona);
        } else {
          console.log('❌ Second response failed:', chatData2.error);
        }
      } else {
        console.log('❌ First response failed:', chatData1.error);
      }
    } else {
      console.log('❌ Detailed SoulPrint generation failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Persona consistency test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Responsive Design and Edge Cases Tests');
  console.log('================================================');
  
  await testEdgeCases();
  await testPersonaConsistency();
  
  console.log('\n================================================');
  console.log('🏁 Testing Complete');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export {
  testEdgeCases,
  testPersonaConsistency
};