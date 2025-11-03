import type { Answers, PillarSummaries, Message } from '../types';

// For both development and production, use relative paths
// Vercel will handle the API routes in both environments
const API_BASE_URL = '';

class ApiService {
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async generateSoulPrint(answers: Answers): Promise<{ pillarSummaries: PillarSummaries; systemPrompt: string }> {
    return this.makeRequest('generateSoulPrint', { answers });
  }

  async continueChat(messages: Message[], systemPrompt: string): Promise<{ text: string }> {
    return this.makeRequest('continueChat', { messages, systemPrompt });
  }
}

export const apiService = new ApiService();