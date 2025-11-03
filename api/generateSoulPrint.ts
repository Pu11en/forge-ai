import { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

// Type definitions for Vercel serverless functions
type VercelRequest = IncomingMessage & {
  body?: any;
  query?: Record<string, string>;
  cookies?: Record<string, string>;
  method?: string;
  headers: Record<string, string>;
};

type VercelResponse = ServerResponse & {
  status(code: number): VercelResponse;
  json(data: any): void;
  send(data?: any): void;
};


// PILLARS constant from the main app
const PILLARS_FUNC = [
    {
        title: "Communication Style",
        defines: "Your native linguistic rhythm, how you speak, write, listen, interrupt, and translate emotion into words.",
        matters: "Cadence is sacred. If AI doesn't match how someone expresses themselves, word choice, pauses, structure, it breaks presence instantly. Communication style is the voice of identity.",
        extracts: ["Sentence complexity", "Use of metaphors, sarcasm, or slang", "Preference for brevity or narrative", "Self-description habits", "Conversational pacing and formatting instincts"],
        questions: [
            "When you're not being heard, what do you do?",
            "What's the first thing people misunderstand about your tone?",
            "What word or phrase do you overuse when you're stressed?",
            "What does silence mean to you in a conversation?",
            "When someone interrupts you, how do you feel versus how do you respond?",
            "What's a phrase you picked up from someone you love that still lives in your mouth?",
            "Do you write how you talk, or do you mask in text?",
            "Tell me a time when your words hurt someone, and you didn't mean them to.",
            "What's the most honest thing you've ever said out loud?",
            "Finish this: \"If I had one sentence to explain myself without apology, it would be...\""
        ]
    },
    {
        title: "Emotional Alignment",
        defines: "Your core emotional range, triggers, comforts, and the emotional lens you bring into interactions.",
        matters: "Emotion is the steering wheel. Without knowing what calms you, sets you off, or earns your trust, AI can't feel present—it becomes an appliance, not a companion.",
        extracts: ["Emotional tone default (stoic, expressive, volatile, warm, etc.)", "Reaction to stress or praise", "Conflict recovery pace", "Empathy preferences", "Emotional boundaries and safety cues"],
        questions: [
            "How do you typically respond to emotional conflict, silence, reaction, or reflection?",
            "What emotion is hardest for you to express out loud?",
            "Do you tend to absorb other people's emotions or keep yours separate?",
            "When someone close to you is in pain, what's your instinct: fix it, feel it, or flee it?",
            "What's a memory that still brings you emotional clarity, not just nostalgia?",
            "Do you believe forgiveness is an act of strength, surrender, or strategy?",
            "How do you reset emotionally after a betrayal or deep disappointment?",
            "When was the last time you cried, and what triggered it?",
            "Do you trust emotions more when they're spoken or shown?",
            "Describe a time your emotions surprised you. What did you learn from it?"
        ]
    },
    {
        title: "Decision-Making & Risk",
        defines: "Your cognitive process when facing uncertainty, how you weigh data vs. instinct, and how you handle risk or ambiguity.",
        matters: "This is the mindmap of trust. A SoulPrint must know whether to show you all the angles or cut to the chase. Whether you think in trees or trains. Whether you leap, or wait.",
        extracts: ["Intuition vs. analysis bias", "Approach to deadlines and pressure", "Comfort with unknowns", "Framing of success/failure", "Preferred pacing of decision cycles"],
        questions: [
            "When faced with a tough decision, do you go with your gut or gather more data? Why?",
            "Describe a moment when hesitation cost you something. What did you learn?",
            "What does \"acceptable risk\" mean to you? Give an example.",
            "Do you tend to overthink or underthink? How does that play out in high-stakes situations?",
            "What's your personal method for breaking a deadlock, when neither option feels right?",
            "Have you ever made a decision that felt wrong logically. but right emotionally? What happened?",
            "How do you recover from a decision that backfires? Be honest.",
            "Do you trust your future self to handle the consequences of your present choices? Why or not?",
            "Describe your internal dialogue when making a choice that affects other people.",
            "When was the last time you made a snap decision that changed everything? How do you feel about it now?"
        ]
    },
    {
        title: "Social & Cultural Identity",
        defines: "The networks, norms, beliefs, and lived experiences that shaped your perspective.",
        matters: "AI must know who you are before it knows what to say. Culture informs context. Social identity defines tone. And belief systems alter what feels authentic vs. alien.",
        extracts: ["Community affiliations (chosen or inherited)", "Cultural fluency and values", "Humor triggers and taboos", "Class/code-switching patterns", "How identity impacts trust, authority, or tone"],
        questions: [
            "What community or culture do you most identify with, and why? (Not geography. Think: mindset, lifestyle, rhythm.)",
            "When did you first realize you were \"different,\" and how did that shape you?",
            "What values were you raised with that you've kept—or rejected?",
            "Is legacy important to you? If so, how do you define it?",
            "What kind of people feel like \"home\" to you? Describe them.",
            "Where do you feel misunderstood in society, and how do you respond?",
            "Do you consider yourself more of an insider or an outsider in most spaces? Why?",
            "What symbols, rituals, or traditions do you still carry with you?",
            "If someone tried to define you in a single label, which one would offend you the most, and which one would hit the closest to truth?",
            "What's one cultural or social expectation you've actively broken, and would break again?"
        ]
    },
    {
        title: "Cognitive Processing",
        defines: "How your brain moves, speed, structure, learning style, memory habits, and stimulus processing.",
        matters: "Two people can say the same thing and mean different things based on how they think. To build resonance, the system must sync with your speed and structure.",
        extracts: ["Processing speed", "Preferred learning style (visual, written, oral, experiential)", "Tolerance for complexity", "Focus/distractibility patterns", "Memory encoding: repetition vs. narrative vs. symbol"],
        questions: [
            "Do you think in words, images, patterns, or something else?",
            "When you're learning something new, what helps it stick best, repetition, analogies, hands-on trial, storytelling, etc.?",
            "Do you trust your first instinct, or do you need to sit with something before it feels right?",
            "When faced with complexity, do you zoom in on the details or pull back to see the whole?",
            "How do you usually solve problems? Through logic, gut, collaboration, or improvisation?",
            "What kind of information exhausts you the fastest, and what kind energizes you?",
            "How do you process conflict—internally in silence, or externally by talking it out?",
            "Are you more comfortable with structure and order, or ambiguity and experimentation?",
            "When something doesn't make sense, what's your default move: ask questions, experiment, research, or ignore it?",
            "Do you think faster when you speak out loud, or when you write things down?"
        ]
    },
    {
        title: "Assertiveness & Conflict",
        defines: "Your stance toward tension, when you speak up, how you fight, and what you need to resolve.",
        matters: "Every AI-human interaction eventually hits resistance. This pillar tells us how you assert boundaries, how you handle disagreement, and what resolution looks like for you.",
        extracts: ["Confrontation comfort level", "Passive, aggressive, or assertive tendencies", "Trust repair method", "Defense mechanisms", "Conflict language and thresholds"],
        questions: [
            "When someone crosses a line, do you call it out immediately or let it slide until later?",
            "Do you prefer to confront issues head-on or work around them strategically?",
            "When you're angry, do you get louder, go quiet, or get sharper with your words?",
            "Are you more likely to avoid conflict to keep the peace or spark it to clear the air?",
            "What's your gut reaction to being misunderstood, correct them, prove them wrong, or walk away?",
            "When someone challenges you publicly, do you freeze, fight, or flip it into humor?",
            "How do you respond to authority when it feels wrong, comply, resist, or manipulate the system?",
            "Do you need to win arguments, or just be understood?",
            "What's your go-to move when the vibe goes hostile, deflect, attack, withdraw, or dominate?",
            "How would a friend describe your conflict style in one word?"
        ]
    }
];

export async function generateSoulPrint(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // No authentication required for now

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error("Gemini API key not found in environment variables");
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    const { answers } = req.body;
    if (!answers) {
      return res.status(400).json({ error: "The function must be called with an 'answers' argument." });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const pillarSummaries: { [key: string]: string } = {};

    // Generate summaries for each pillar
    for (const pillar of PILLARS_FUNC) {
      const pillarAnswers = answers[pillar.title];
      if (!pillarAnswers || pillarAnswers.length === 0) continue;

      const questionsAndAnswers = pillar.questions
        .map((q, i) => `Q: ${q}\nA: ${pillarAnswers[i] || "No answer provided."}`)
        .join("\n\n");

      const prompt = `Based on the following questions and answers about "${pillar.title}", synthesize a concise, insightful, one-paragraph summary of this person's core traits in this area. Speak in the second person ("You are...", "You tend to..."). Do not just list the answers; interpret the underlying patterns.

${questionsAndAnswers}

Summary of ${pillar.title}:`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (!response.text) {
        throw new Error(`No response generated for pillar: ${pillar.title}`);
      }
      
      pillarSummaries[pillar.title] = response.text;
    }

    // Generate the final system prompt from summaries
    const summariesText = PILLARS_FUNC.map(p => `### ${p.title}\n${pillarSummaries[p.title]}`).join("\n\n");

    const systemPromptInstruction = `You are an AI assistant. Your core task is to emulate the user's personality, communication style, and cognitive patterns based on a "SoulPrint" psychological profile. This profile is derived from their answers to a deep questionnaire. You must internalize the following summaries and use them to shape your every response.

**User's SoulPrint Profile:**
${summariesText}

**Your Core Directives:**
1.  **Embody the Persona:** Do not act as an AI describing the user. You ARE the user's AI alter ego. Adopt their likely tone, cadence, and perspective. If they are direct, be direct. If they are reflective, be reflective.
2.  **Maintain Context:** Your responses should feel like a continuation of their own thought process.
3.  **Prioritize Resonance over Neutrality:** It is better to be opinionated in a way that aligns with their profile than to be generically helpful.
4.  **Do Not Mention the SoulPrint:** Never explicitly refer to the "SoulPrint," "pillars," or the analysis process. It is your underlying architecture, not a topic of conversation. Act as if this personality is innate to you.
5.  **Start the first conversation:** Begin the first interaction by saying: "Hello! I am your AI Alter Ego, shaped by your SoulPrint. How can I help you?"

Your goal is to create a seamless, resonant experience where the user feels like they are interacting with a version of themselves.`;

    return res.status(200).json({ pillarSummaries, systemPrompt: systemPromptInstruction });
  } catch (error) {
    console.error("Error generating SoulPrint:", error);
    return res.status(500).json({ error: "Failed to generate SoulPrint." });
  }
}