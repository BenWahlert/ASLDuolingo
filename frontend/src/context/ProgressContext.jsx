import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [user, setUser] = useState({ total_xp: 0, current_level: 1, current_streak: 0 });

  const loadLessons = async () => {
    const response = await api.get('/api/lessons');
    setLessons(response.data);
    return response.data;
  };

  const loadLesson = async (lessonId) => {
    const response = await api.get(`/api/lessons/${lessonId}`);
    setCurrentLesson(response.data);
    return response.data;
  };

  const loadExercises = async (lessonId) => {
    const response = await api.get(`/api/lessons/${lessonId}/exercises`);
    setExercises(response.data);
    return response.data;
  };

  const startLesson = async (lessonId) => {
    const response = await api.post(`/api/progress/${lessonId}/start`);
    return response.data;
  };

  const submitExercise = async (exerciseId, answer, attemptCount) => {
    const response = await api.post('/api/progress/exercise', {
      exerciseId,
      answer,
      attemptCount
    });

    if (response.data.newTotalXp !== undefined) {
      setUser(prev => ({
        ...prev,
        total_xp: response.data.newTotalXp,
        current_level: response.data.newLevel
      }));
    }

    return response.data;
  };

  const completeLesson = async (lessonId) => {
    const response = await api.put(`/api/progress/${lessonId}/complete`);

    if (response.data.newTotalXp !== undefined) {
      setUser(prev => ({
        ...prev,
        total_xp: response.data.newTotalXp,
        current_level: response.data.newLevel
      }));
    }

    return response.data;
  };

  const loadUserStats = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        lessons,
        currentLesson,
        exercises,
        user,
        loadLessons,
        loadLesson,
        loadExercises,
        startLesson,
        submitExercise,
        completeLesson,
        loadUserStats
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
