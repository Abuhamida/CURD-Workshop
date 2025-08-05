import { supabase } from './supabase';

// Todo operations
export const getTodos = async (userId) => {
  const { data, error } = await supabase
    .from('todos')
    .select(`
      id,
      title,
      description,
      status,
      due_date,
      categories(name, color),
      priorities(name, level)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addTodo = async (todo) => {
  const { data, error } = await supabase
    .from('todos')
    .insert(todo)
    .select(`
      id,
      title,
      description,
      status,
      due_date,
      categories(name, color),
      priorities(name, level)
    `)
    .single();

  if (error) throw error;
  return data;
};

export const updateTodo = async (id, updates) => {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select(`
      id,
      title,
      description,
      status,
      due_date,
      categories(name, color),
      priorities(name, level)
    `)
    .single();

  if (error) throw error;
  return data;
};

export const deleteTodo = async (id) => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Category operations
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

// Priority operations
export const getPriorities = async () => {
  const { data, error } = await supabase
    .from('priorities')
    .select('*')
    .order('level', { ascending: false });

  if (error) throw error;
  return data;
};