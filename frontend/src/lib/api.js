const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
};

export const fetchApi = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle URL form encoding if body is URLSearchParams or FormData
  if (options.body instanceof URLSearchParams) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.detail || data.message || 'Une erreur est survenue';
    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  }

  return data;
};

export const api = {
  auth: {
    login: (credentials) => {
      const formData = new URLSearchParams();
      formData.append('username', credentials.email || credentials.username);
      formData.append('password', credentials.password);
      return fetchApi('/auth/login', { method: 'POST', body: formData });
    },
    changePassword: (data) => fetchApi('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
    refresh: (refreshToken) => fetchApi('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) }),
    me: () => fetchApi('/auth/me'),
    onboarding: (data) => fetchApi('/auth/onboarding', { method: 'POST', body: JSON.stringify(data) }),
    updateProfile: (data) => fetchApi('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  admin: {
    getUsers: () => fetchApi('/admin/users'),
    createUser: (data) => fetchApi('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    updateUser: (id, data) => fetchApi(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  exercises: {
    getAll: (params = '') => fetchApi(`/exercises${params ? `?${params}` : ''}`),
    getOne: (id) => fetchApi(`/exercises/${id}`),
    create: (data) => fetchApi('/exercises', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/exercises/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/exercises/${id}`, { method: 'DELETE' }),
  },
  routines: {
    getAll: () => fetchApi('/routines'),
    getOne: (id) => fetchApi(`/routines/${id}`),
    create: (data) => fetchApi('/routines', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/routines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/routines/${id}`, { method: 'DELETE' }),
    duplicate: (id) => fetchApi(`/routines/${id}/duplicate`, { method: 'POST' }),
  },
  workouts: {
    getAll: () => fetchApi('/workouts'),
    getOne: (id) => fetchApi(`/workouts/${id}`),
    create: (data) => fetchApi('/workouts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/workouts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    addSets: (id, sets) => fetchApi(`/workouts/${id}/sets`, { method: 'POST', body: JSON.stringify(sets) }),
    getExerciseHistory: (exerciseId) => fetchApi(`/workouts/exercise/${exerciseId}/history`),
  },
  rankings: {
    getMe: () => fetchApi('/rankings/me'),
    getGroup: (exerciseId = '') => fetchApi(`/rankings/group${exerciseId ? `?exercise_id=${exerciseId}` : ''}`),
    getBodygraph: () => fetchApi('/rankings/bodygraph'),
  },
  recovery: {
    create: (data) => fetchApi('/recovery', { method: 'POST', body: JSON.stringify(data) }),
    getToday: () => fetchApi('/recovery/today'),
    getHistory: (days = 30) => fetchApi(`/recovery/history?days=${days}`),
  },
  coach: {
    chat: (message, conversationId = null) => fetchApi('/coach/chat', { 
      method: 'POST', 
      body: JSON.stringify({ message, conversation_id: conversationId }) 
    }),
    getConversations: () => fetchApi('/coach/conversations'),
    getConversation: (id) => fetchApi(`/coach/conversations/${id}`),
    analyzeWorkout: (sessionId) => fetchApi(`/coach/analyze-workout/${sessionId}`, { method: 'POST' }),
    getDailyTip: () => fetchApi('/coach/daily-tip'),
    getDailyWorkout: () => fetchApi('/coach/daily-workout'),
  },
  gamification: {
    getStreak: () => fetchApi('/gamification/streak'),
    getAchievements: () => fetchApi('/gamification/achievements'),
    getAttendanceRanking: () => fetchApi('/gamification/attendance-ranking'),
  },
  feed: {
    getAll: () => fetchApi('/feed'),
    getOne: (id) => fetchApi(`/feed/${id}`),
    publish: (sessionId) => fetchApi(`/feed/publish/${sessionId}`, { method: 'POST' }),
    like: (postId) => fetchApi(`/feed/${postId}/like`, { method: 'POST' }),
    addComment: (postId, content) => fetchApi(`/feed/${postId}/comments`, { 
      method: 'POST', 
      body: JSON.stringify({ content }) 
    }),
    deleteComment: (postId, commentId) => fetchApi(`/feed/${postId}/comments/${commentId}`, { method: 'DELETE' }),
  }
};

export default api;
