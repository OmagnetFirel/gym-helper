import {useState, useCallback} from 'react';
import { Training, CreateTrainingData } from '@/types/training';
import { trainingService } from '@/services/training.service';

export const useTraining = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainingService.getAllTrainings();
      setTrainings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);


  const getTrainingById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      return await trainingService.getTrainingById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTraining = useCallback(async (training: CreateTrainingData) => {
    try {
      setLoading(true);
      setError(null);
      const newTraining = await trainingService.createTraining(training);
      setTrainings(prev => [...prev, newTraining]);
      return newTraining;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTraining = useCallback(async (id: string, training: CreateTrainingData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTraining = await trainingService.updateTraining(id, training);
      setTrainings(prev => prev.map(t => t.id === id ? updatedTraining : t));
      return updatedTraining;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTraining = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await trainingService.deleteTraining(id);
      setTrainings(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trainings,
    loading,
    error,
    fetchTrainings,
    getTrainingById,
    createTraining,
    updateTraining,
    deleteTraining,
  };
}; 