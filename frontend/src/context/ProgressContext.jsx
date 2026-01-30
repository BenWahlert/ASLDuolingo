import { createContext, useContext, useState } from 'react';
import * as dataService from '../services/dataService';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [user, setUser] = useState(dataService.getUserData());

  const loadLessons = async () => {
    return new Promise(resolve => {
      const data = dataService.getAllLessons();
      setLessons(data);
      resolve(data);
    });
  };

  const loadLesson = async (lessonId) => {
    return new Promise(resolve => {
      const data = dataService.getLessonById(lessonId);
      setCurrentLesson(data);
      resolve(data);
    });
  };

  const loadExercises = async (lessonId) => {
    return new Promise(resolve => {
      const data = dataService.getLessonExercises(lessonId);
      setExercises(data);
      resolve(data);
    });
  };

  const startLesson = async (lessonId) => {
    return new Promise(resolve => {
      const result = dataService.startLesson(lessonId);
      setUser(dataService.getUserData());
      resolve(result);
    });
  };

  const submitExercise = async (exerciseId, answer, attemptCount) => {
    return new Promise(resolve => {
      const result = dataService.submitExercise(exerciseId, answer, attemptCount);

      if (result.newTotalXp !== undefined) {
        setUser(dataService.getUserData());
      }

      resolve(result);
    });
  };

  const completeLesson = async (lessonId) => {
    return new Promise(resolve => {
      const result = dataService.completeLesson(lessonId);

      if (result.newTotalXp !== undefined) {
        setUser(dataService.getUserData());
      }

      resolve(result);
    });
  };

  const loadUserStats = async () => {
    return new Promise(resolve => {
      setUser(dataService.getUserData());
      resolve();
    });
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
