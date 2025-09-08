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

// Notifications API types
export interface Notification {
  id: number;
  title: string;
  description: string;
  created_at: string;
  read: boolean;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await fetch(`${API_BASE_URL}/notifications`);
  if (!res.ok) throw new Error('Failed to load notifications');
  return res.json();
};

export const markNotificationRead = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/notifications/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to mark as read');
};

export const clearAllNotifications = async (): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/notifications/clear`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to clear notifications');
};

// Feedback API
export interface FeedbackItem {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

// Feedback endpoints removed
