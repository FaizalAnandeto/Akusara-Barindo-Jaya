// API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  password: string;
}

export interface ApiError {
  error: string;
}

// Login API function
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
};
