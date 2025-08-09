import { configureStore } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import todoReducer from "./reducers/todoSlice";
import authReducer from "./reducers/authSlice"; 
import taskReducer from "./reducers/taskSlice"; 

const todoPersistConfig = {
  key: 'todos',
  storage,
  whitelist: ['items'] 
};


const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'] 
};

const taskPersistConfig = {
  key: 'tasks',
  storage,
  whitelist: ['items']
};

const rootReducer = {
  todos: persistReducer(todoPersistConfig, todoReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  tasks: persistReducer(taskPersistConfig, taskReducer),
  // other reducers...
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

const persistor = persistStore(store);

export { store, persistor };