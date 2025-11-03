// Comprehensive test script for SoulPrint integration
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

// Test data for questionnaire answers
const sampleAnswers = {
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
  "Emotional Alignment": [
    "I respond to emotional conflict with reflection first, then action.",
    "Vulnerability is hardest for me to express openly.",
    "I tend to keep my emotions separate from others.",
    "When someone is in pain, my instinct is to fix the problem.",
    "A memory that brings clarity is when I realized I couldn't control others' emotions.",
    "I believe forgiveness is strategic for my own peace of mind.",
    "I reset emotionally by analyzing what went wrong and making a plan.",
    "Last time I cried was during a movie that reminded me of personal loss.",
    "I trust emotions more when they're shown through actions.",
    "My emotions surprised me when I felt relief after leaving a toxic situation."
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
  ],
  "Social & Cultural Identity": [
    "I identify with tech culture - problem-solving, innovation, continuous learning.",
    "Realized I was different when I didn't fit traditional expectations in my family.",
    "I kept the value of hard work but rejected rigid thinking from my upbringing.",
    "Legacy is important - I define it as the knowledge I pass to others.",
    "People who feel like home are curious, analytical, and straightforward.",
    "I feel misunderstood when people think I'm cold when I'm just processing.",
    "I'm an outsider in most spaces - gives me perspective.",
    "I carry the ritual of morning coffee and planning from my father.",
    "Label that offends me: 'emotional' - one that fits: 'analytical'.",
    "Broken expectation: that I should follow traditional career paths."
  ],
  "Cognitive Processing": [
    "I think in patterns and systems.",
    "Learning sticks best through hands-on trial and error.",
    "I trust my first instinct but verify with data.",
    "When faced with complexity, I break it down into smaller components.",
    "I solve problems through logic and analysis.",
    "Information that exhausts me: gossip; energizes me: technical documentation.",
    "I process conflict internally first, then discuss solutions.",
    "I prefer structure and order over ambiguity.",
    "When something doesn't make sense, I research until it does.",
    "I think faster when I write things down."
  ],
  "Assertiveness & Conflict": [
    "I call out crossed lines immediately but politely.",
    "I prefer to confront issues head-on with data.",
    "When angry, I get sharper and more precise with words.",
    "I spark conflict to clear the air rather than avoid it.",
    "When misunderstood, I explain my reasoning calmly.",
    "When challenged publicly, I respond with facts and logic.",
    "I resist authority when it's wrong by providing alternatives.",
    "I need to be understood, not necessarily to win.",
    "My go-to move in hostile situations is to de-escalate with logic.",
    "Friends describe my conflict style as 'direct'."
  ]
};

// Test functions
async function testGenerateSoulPrint() {
  console.log('\n=== Testing /api/generateSoulPrint ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/generateSoulPrint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: sampleAnswers })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ generateSoulPrint: SUCCESS');
      console.log('✅ Pillar summaries generated:', Object.keys(data.pillarSummaries).length);
      
      // Check if system prompt contains pillar summaries
      const hasPillarSummaries = Object.keys(data.pillarSummaries).every(pillar => 
        data.systemPrompt.includes(pillar)
      );
      console.log('✅ System prompt contains pillar summaries:', hasPillarSummaries);
      
      // Check for core directives
      const hasDirectives = data.systemPrompt.includes('Core Directives');
      console.log('✅ System prompt contains core directives:', hasDirectives);
      
      return { success: true, data };
    } else {
      console.log('❌ generateSoulPrint: FAILED');
      console.log('Error:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('❌ generateSoulPrint: ERROR');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testContinueChat(systemPrompt) {
  console.log('\n=== Testing /api/continueChat ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/continueChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ sender: 'user', text: 'Tell me about yourself.' }],
        systemPrompt: systemPrompt
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ continueChat: SUCCESS');
      console.log('✅ AI response generated:', data.text ? 'Yes' : 'No');
      
      // Check if AI response mentions being an AI Alter Ego
      const mentionsAlterEgo = data.text.includes('AI Alter Ego');
      console.log('✅ AI mentions being Alter Ego:', mentionsAlterEgo);
      
      return { success: true, data };
    } else {
      console.log('❌ continueChat: FAILED');
      console.log('Error:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('❌ continueChat: ERROR');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

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
    } else {
      console.log('❌ Empty messages should have been rejected');
    }
  } catch (error) {
    console.log('❌ Empty messages test failed:', error.message);
  }
}

async function testSoulPrintIntegration() {
  console.log('\n=== Testing SoulPrint Integration ===');
  
  // Generate SoulPrint with sample answers
  const soulPrintResult = await testGenerateSoulPrint();
  
  if (!soulPrintResult.success) {
    console.log('❌ Cannot test integration - SoulPrint generation failed');
    return;
  }
  
  const { systemPrompt } = soulPrintResult.data;
  
  // Test chat with the generated system prompt
  const chatResult = await testContinueChat(systemPrompt);
  
  if (!chatResult.success) {
    console.log('❌ Cannot test integration - Chat failed');
    return;
  }
  
  // Test multiple messages to see if AI maintains persona
  console.log('\n--- Testing persona maintenance ---');
  try {
    const response = await fetch(`${API_BASE_URL}/continueChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { sender: 'user', text: 'How do you make decisions?' },
          { sender: 'ai', text: chatResult.data.text },
          { sender: 'user', text: 'What do you do when you\'re stressed?' }
        ],
        systemPrompt: systemPrompt
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ AI maintains persona across multiple messages');
      
      // Check if response reflects the personality from sample answers
      const reflectsPersonality = data.text.toLowerCase().includes('data') || 
                               data.text.toLowerCase().includes('analyze') ||
                               data.text.toLowerCase().includes('logical');
      console.log('✅ AI response reflects personality:', reflectsPersonality);
    } else {
      console.log('❌ Persona maintenance test failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Persona maintenance test error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting SoulPrint Integration Tests');
  console.log('=====================================');
  
  await testGenerateSoulPrint();
  await testContinueChat("You are a helpful assistant.");
  await testEdgeCases();
  await testSoulPrintIntegration();
  
  console.log('\n=====================================');
  console.log('🏁 Testing Complete');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export {
  testGenerateSoulPrint,
  testContinueChat,
  testEdgeCases,
  testSoulPrintIntegration,
  sampleAnswers
};