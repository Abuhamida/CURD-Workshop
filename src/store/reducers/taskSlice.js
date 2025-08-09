import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { taskService } from '../../lib/TaskService'

// Async thunks for CRUD operations
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId, { rejectWithValue }) => {
    try {
      return await taskService.getAllTasks(userId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      return await taskService.createTask(taskData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(id, updates)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(taskId)
      return taskId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const moveTaskToColumn = createAsyncThunk(
  'tasks/moveTask',
  async ({ taskId, newStatus, newPosition }, { rejectWithValue }) => {
    try {
      return await taskService.moveTask(taskId, newStatus, newPosition)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    completionPercentage: 0
  },
  reducers: {
    calculateCompletion: (state) => {
      const total = state.items.length
      const completed = state.items.filter(task => task.status === 'done').length
      state.completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        taskSlice.caseReducers.calculateCompletion(state)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload)
        taskSlice.caseReducers.calculateCompletion(state)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload
      })
      
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        taskSlice.caseReducers.calculateCompletion(state)
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload
      })
      
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task.id !== action.payload)
        taskSlice.caseReducers.calculateCompletion(state)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload
      })
      
      // Move task
      .addCase(moveTaskToColumn.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        taskSlice.caseReducers.calculateCompletion(state)
      })
  }
})

export const { calculateCompletion } = taskSlice.actions
export default taskSlice.reducer