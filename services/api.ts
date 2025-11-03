import { getAuth } from 'firebase/auth';
import type { Answers, PillarSummaries, Message } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production, use relative paths
  : 'http://localhost:3001'; // In development, use local server

class ApiService {
  private async getAuthToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    return await user.getIdToken();
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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