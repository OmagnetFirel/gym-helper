export const APP_CONFIG = {
  STORAGE: {
    TRAININGS_KEY: 'gym-app-trainings',
  },
  ROUTES: {
    HOME: '/',
    CREATE: '/cadastro',
    LIST: '/listar',
    TRAINING: '/treino/:id',
  },
  THEME: {
    STORAGE_KEY: 'vite-ui-theme',
    DEFAULT_THEME: 'system',
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },
  VALIDATION: {
    MAX_EXERCISES: 20,
    MAX_SETS: 10,
    MAX_REPS: 1000,
    MAX_WEIGHT: 1000,
  },
} as const; 