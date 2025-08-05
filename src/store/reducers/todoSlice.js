import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getTodos, 
  addTodo, 
  updateTodo, 
  deleteTodo,
  getCategories,
  getPriorities
} from '../../lib/todos';

// Helper function to reorder todos based on status
const reorderTodos = (todos) => {
  const statusOrder = ['todo', 'in_progress', 'done'];
  return [...todos].sort((a, b) => 
    statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    || new Date(b.created_at) - new Date(a.created_at)
  );
};

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getTodos(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async ({ todo, userId }) => {
    const response = await addTodo({ ...todo, user_id: userId });
    return response;
  }
);

export const editTodo = createAsyncThunk(
  'todos/editTodo',
  async ({ id, updates }) => {
    const response = await updateTodo(id, updates);
    return response;
  }
);

export const removeTodo = createAsyncThunk(
  'todos/removeTodo',
  async (id) => {
    await deleteTodo(id);
    return id;
  }
);

export const fetchCategories = createAsyncThunk(
  'todos/fetchCategories',
  async () => {
    const response = await getCategories();
    return response;
  }
);

export const fetchPriorities = createAsyncThunk(
  'todos/fetchPriorities',
  async () => {
    const response = await getPriorities();
    return response;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    categories: [],
    priorities: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add Todo
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      
      // Update Todo
      .addCase(editTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Delete Todo
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => todo.id !== action.payload);
      })
      
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      
      // Fetch Priorities
      .addCase(fetchPriorities.fulfilled, (state, action) => {
        state.priorities = action.payload;
      });
  },
});

export default todoSlice.reducer;