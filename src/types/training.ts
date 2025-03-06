export interface Exercise {
  id: string;
  name: string;
  type: 'weight' | 'cardio';
  sets: number;
  reps: number;
  weight?: number;
  time?: number;
  notes?: string;
  images?: string[];
}

export interface ExerciseFormData {
  name: string;
  type: 'weight' | 'cardio';
  numberOfSets: number;
  numberOfRepetitions: number;
  weight?: number;
  time?: number;
  restTime: number;
  observations: string;
  image: FileList;
}

export interface Training {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  notes?: string;
  duration?: number;
}

export interface CreateTrainingData {
  name: string;
  date: Date;
  exercises: Exercise[];
  notes?: string;
} 