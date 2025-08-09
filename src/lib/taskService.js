import { supabase } from './supabase'

export const taskService = {
  // Create new task
  async createTask(taskData) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, user_id: user.id }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Get all tasks for user
  async getAllTasks(userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get tasks by column/status
  async getTasksByColumn(status, userId) {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Update task
  async updateTask(taskId, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete task
  async deleteTask(taskId) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
    
    if (error) throw error
    return true
  },

  // Move task between columns (drag & drop)
  async moveTask(taskId, newStatus, newPosition = 0) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status: newStatus, 
        position: newPosition,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}