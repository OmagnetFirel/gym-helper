import { Training, CreateTrainingData } from '@/types/training';
import { APP_CONFIG } from '@/constants/config';

class TrainingService {
  private static instance: TrainingService;
  private storageKey: string;

  private constructor() {
    this.storageKey = APP_CONFIG.STORAGE.TRAININGS_KEY;
  }

  public static getInstance(): TrainingService {
    if (!TrainingService.instance) {
      TrainingService.instance = new TrainingService();
    }
    return TrainingService.instance;
  }

  private getTrainingsFromStorage(): Training[] {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) return [];
    return JSON.parse(storedData);
  }

  private saveTrainingsToStorage(trainings: Training[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(trainings));
  }

  async getAllTrainings(): Promise<Training[]> {
    return this.getTrainingsFromStorage();
  }

  async getTrainingById(id: string): Promise<Training | undefined> {
    const trainings = this.getTrainingsFromStorage();
    return trainings.find(training => training.id === id);
  }

  async createTraining(training: CreateTrainingData): Promise<Training> {
    const trainings = this.getTrainingsFromStorage();
    const newTraining: Training = {
      ...training,
      id: crypto.randomUUID(),
    };
    
    trainings.push(newTraining);
    this.saveTrainingsToStorage(trainings);
    return newTraining;
  }

  async updateTraining(id: string, training: CreateTrainingData): Promise<Training> {
    const trainings = this.getTrainingsFromStorage();
    const index = trainings.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Training not found');
    }

    const updatedTraining: Training = {
      ...training,
      id,
    };

    trainings[index] = updatedTraining;
    this.saveTrainingsToStorage(trainings);
    return updatedTraining;
  }

  async deleteTraining(id: string): Promise<void> {
    const trainings = this.getTrainingsFromStorage();
    const filteredTrainings = trainings.filter(t => t.id !== id);
    this.saveTrainingsToStorage(filteredTrainings);
  }
}

export const trainingService = TrainingService.getInstance();