import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  createTodo,
  removeTodo,
  editTodo,
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

const Home = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);
  const [userId, setUserId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
  });

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
      });
    } else {
      setEditMode(false);
      setFormData({ title: "", description: "", due_date: "" });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", description: "", due_date: "" });
    setEditMode(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    if (editMode) {
      await dispatch(editTodo({ id: editingId, updates: formData }));
    } else {
      await dispatch(
        createTodo({
          todo: { ...formData, status: modalStatus, user_id: userId },
          userId,
        })
      );
    }

    closeModal();
  };

  const handleDelete = async (id) => {
    await dispatch(removeTodo(id));
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    if (sourceStatus === destStatus) return;

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

  return (
   <div className="min-h-screen py-6 bg-gray-900">
  {/* Header */}
  <div className="container flex flex-col items-center justify-between gap-4 px-6 mx-auto mb-6 md:flex-row">
    <input
      type="text"
      placeholder="Search your task"
      className="w-full px-4 py-2 text-gray-800 bg-gray-700 md:w-3/4 rounded-xl placeholder:text-gray-500"
    />
    <button
      onClick={() => openModal("todo")}
      className="w-full px-5 py-2 text-white transition bg-blue-800 rounded md:w-auto hover:bg-blue-700"
    >
      + Create Task
    </button>
  </div>

  {/* Board */}
  <DragDropContext onDragEnd={handleDragEnd}>
    <div className="container flex flex-col gap-4 mx-auto text-white md:flex-row">
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
                <h4 className="text-lg font-bold">{STATUS_LABELS[status]}</h4>
                <button
                  onClick={() => openModal(status)}
                  className="px-4 py-2 font-medium text-blue-900 transition bg-white rounded hover:bg-gray-200"
                >
                  + Add Task
                </button>
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
                        <strong className="block text-lg font-semibold text-blue-900">
                          {todo.title}
                        </strong>
                        <p className="mt-1 text-sm text-gray-700">
                          {todo.description}
                        </p>
                        <small className="block mt-1 text-xs text-gray-500">
                          Due: {todo.due_date}
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
          <button
            type="submit"
            className="py-2 mt-2 text-white transition bg-blue-800 rounded hover:bg-blue-700"
          >
            {editMode ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  )}
</div>

  );
};

export default Home;
