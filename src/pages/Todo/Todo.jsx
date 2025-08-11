import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchTodos,
  createTodo,
  removeTodo,
  editTodo,
  fetchCategories,
  fetchPriorities,
} from "../../store/reducers/todoSlice";

import { supabase } from "../../lib/supabase";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

const STATUSES = ["todo", "in_progress", "review", "done"];
const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const Todo = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);
  const categories = useSelector((state) => state.todos.categories);
  const priorities = useSelector((state) => state.todos.priorities);

  console.log(categories)

  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    category_id: "",
    priority_id: "",
  });

  const [searchTask, setSearchTask] = useState("");

  const filteredTodos = todos.filter((todo) =>
    (todo.title || "").toLowerCase().includes(searchTask.toLowerCase())
  );

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        dispatch(fetchTodos(user.id));
      }
    };

    getUser();

    dispatch(fetchCategories());
    dispatch(fetchPriorities());

    // Listen for auth changes to refresh todos
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          dispatch(fetchTodos(session.user.id));
        } else {
          setUserId(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  const openModal = (status, todo = null) => {
    setModalStatus(status);
    setIsModalOpen(true);
    if (todo) {
      setEditMode(true);
      setEditingId(todo.id);
      setFormData({
        title: todo.title,
        description: todo.description,
        due_date: todo.due_date,
        category_id: todo.category_id,
        priority_id: todo.priority_id,
      });
    } else {
      setEditMode(false);
      setFormData({ title: "", description: "", due_date: "", category_id: "", priority_id: "" });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", description: "", due_date: "", category_id: "", priority_id: "" });
    setEditMode(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    if (!formData.title.trim() || !formData.description.trim()) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    if (formData.title.trim().length < 3 || formData.title.trim().length > 10) {
      Swal.fire("Error", "Title must be between 3 and 10 characters.", "error");
      return;
    }

    if (formData.description.trim().length < 10 || formData.description.trim().length > 20) {
      Swal.fire("Error", "Description must be between 10 and 100 characters.", "error");
      return;
    }

    if (!formData.category_id || !formData.priority_id) {
      Swal.fire("Error", "Please select category and priority.", "error");
      return;
    }

    setLoading(true);

    if (editMode) {
      await dispatch(editTodo({ id: editingId, updates: formData }));
      Swal.fire("Updated!", "The todo has been updated successfully.", "success");
    } else {
      await dispatch(
        createTodo({
          todo: { ...formData, status: modalStatus, user_id: userId },
          userId,
        })
      );
      Swal.fire("Added!", "The todo has been added successfully.", "success");
    }

    closeModal();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(removeTodo(id));
        Swal.fire("Deleted!", "The item has been deleted successfully.", "success");
      }
    });
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    if (sourceStatus === destStatus) return;

    // Optimistic UI update
    dispatch(
      editTodo({
        id: draggableId,
        updates: { status: destStatus },
        optimistic: true,
      })
    );

    // Save to DB
    await dispatch(
      editTodo({
        id: draggableId,
        updates: { status: destStatus },
      })
    );
  };

  const columnColors = [
    "bg-blue-800",
    "bg-indigo-800",
    "bg-purple-800",
    "bg-pink-800",
  ];

  const getPriorityColor = (priorityName) => {
    switch (priorityName?.toLowerCase()) {
      case "high":
        return "bg-red-600 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getCategoryColor = (categoryName) => {
    switch (categoryName?.toLowerCase()) {
      case "astronaut training":
        return "bg-blue-600 text-white";
      case "launch operations":
        return "bg-orange-500 text-white";
      case "mission control":
        return "bg-purple-600 text-white";
      case "mission planning":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen py-6 bg-gray-900">
      {/* Header */}
      <div className="container flex flex-col items-center justify-between gap-4 px-6 mx-auto mb-6 md:flex-row">
        <input
          type="text"
          placeholder="Search your task"
          value={searchTask}
          onChange={(e) => setSearchTask(e.target.value)}
          className="w-full px-4 py-2 text-white bg-gray-700 md:w-3/4 rounded-xl placeholder:text-gray-500"
        />
        <button
          onClick={() => openModal("todo")}
          className="w-full px-5 py-2 text-white transition bg-blue-800 rounded md:w-auto hover:bg-blue-700"
        >
          + Create Task
        </button>
      </div>

      {searchTask ? (
        <div className="container flex flex-col gap-4 mx-auto mt-4 text-white">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className=" w-full md:w-fit p-4 mb-4 text-gray-900 bg-gray-100 rounded-lg shadow-md"
              >
                <div className=" flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-800">{todo.title}</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getPriorityColor(todo.priorities?.name)}`}
                  >
                    {todo.priorities?.name}
                  </span>
                </div>
                <p className="mt-1  text-gray-700">
                  {todo.description}
                </p>
                <div className="my-2 text-sm text-gray-500 flex gap-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getCategoryColor(todo.categories?.name)}`}
                  >
                    {todo.categories?.name}
                  </span>
                </div>
                <small className="block mt-1 text-xs text-gray-500">
                  Due: {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "No date"}
                </small>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => openModal(todo.status, todo)}
                    className="px-3 py-1 text-sm text-white bg-blue-800 rounded hover:bg-blue-700"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="px-3 py-1 text-sm text-white bg-red-800 rounded hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="mt-4 text-center text-gray-400">No tasks found.</p>
          )}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="container mx-auto text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {STATUSES.map((status, index) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 rounded-xl ${columnColors[index]} shadow-lg min-h-[300px]`}
                  >
                    {/* Column header */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold">{STATUS_LABELS[status]} </h4>
                    </div>

                    {/* Tasks */}
                    {todos
                      .filter((todo) => todo.status === status)
                      .map((todo, i) => (
                        <Draggable
                          draggableId={todo.id.toString()}
                          index={i}
                          key={todo.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 mb-4 text-gray-900 bg-gray-100 rounded-lg shadow-md"
                            >
                              <div className=" flex items-center justify-between">
                                <span className="text-lg font-bold text-blue-800">{todo.title}</span>
                                <span
                                  className={`px-3 py-1 text-xs rounded-full ${getPriorityColor(todo.priorities?.name)}`}
                                >
                                  {todo.priorities?.name}
                                </span>
                              </div>
                              <p className="mt-1  text-gray-700">
                                {todo.description}
                              </p>
                              <div className="my-2 text-sm text-gray-500 flex gap-4">
                                <span
                                  className={`px-3 py-1 text-xs rounded-full ${getCategoryColor(todo.categories?.name)}`}
                                >
                                  {todo.categories?.name}
                                </span>
                              </div>
                              <small className="block mt-1 text-xs text-gray-500">
                                Due: {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "No date"}
                              </small>
                              <div className="flex gap-3 mt-3">
                                <button
                                  onClick={() => openModal(status, todo)}
                                  className="px-3 py-1 text-sm text-white bg-blue-800 rounded hover:bg-blue-700"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(todo.id)}
                                  className="px-3 py-1 text-sm text-white bg-red-800 rounded hover:bg-red-700"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-11/12 max-w-md p-6 text-white bg-gray-800 shadow-lg rounded-xl">
            <button
              onClick={closeModal}
              className="absolute text-gray-300 top-2 right-3 hover:text-white"
            >
              ✖
            </button>
            <h4 className="mb-4 text-xl font-semibold text-white">
              {editMode ? "Edit Task" : "Add New Task"}
            </h4>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="p-2 text-white bg-gray-700 rounded placeholder:text-gray-300"
              />
              <input
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                className="p-2 text-white bg-gray-700 rounded placeholder:text-gray-300"
              />

              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className="p-2 text-white bg-gray-700 rounded"
              />

              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="p-2 text-white bg-gray-700 rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.priority_id}
                onChange={(e) =>
                  setFormData({ ...formData, priority_id: e.target.value })
                }
                className="p-2 text-white bg-gray-700 rounded"
                required
              >
                <option value="">Select Priority</option>
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="py-2 mt-2 text-white transition bg-blue-800 rounded hover:bg-blue-700"
              >
                {loading ? "Loading..." : (
                  editMode ? "Update" : "Add"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
