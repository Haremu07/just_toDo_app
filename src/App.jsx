import React, { useEffect, useReducer } from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const App = () => {
  const initialState = {
    input: "",
    tasks: JSON.parse(localStorage.getItem("tasks")) || [],
    editingId: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "input":
        return {
          ...state,
          input: action.payload,
        };

      case "addTask":
        if (!state.input.trim()) return state;
        const newTask = {
          id: Date.now(),
          text: state.input.trim(),
        };

        return {
          ...state,
          tasks: [...state.tasks, newTask],
          input: "",
        };

      case "startEdit":
        const taskToEdit = state.tasks.find(
          (task) => task.id === action.payload
        );
        return {
          ...state,
          input: taskToEdit?.text,
          editingId: action.payload,
        };

      case "applyEdit":
        return {
          ...state,
          tasks: state.tasks.map((task) =>
            task.id === state.editingId ? { ...task, text: state.input } : task
          ),
          input: "",
          editingId: null,
        };

      case "delete":
        return {
          ...state,
          tasks: state.tasks.filter((task) => task.id !== action.payload),
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    dispatch({
      type: "input",
      payload: e.target.value,
    });
  };

  const handleTask = () => {
    if (state.editingId) {
      dispatch({ type: "applyEdit" });
    } else {
      dispatch({ type: "addTask" });
    }
  };

  const handleDelete = (id) => {
    dispatch({ type: "delete", payload: id });
  };

  const handleEdit = (id) => {
    dispatch({ type: "startEdit", payload: id });
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <div className="h-screen bg-black flex justify-center items-center">
      <div className="w-80 max-h-full rounded-2xl p-3 bg-gray-300 flex flex-col gap-3">
        <h1 className="text-center text-lg font-bold">To-Do App</h1>

        <div className="w-full bg-white h-10 pl-3 flex p-1">
          <input
            type="text"
            value={state.input}
            onChange={handleChange}
            placeholder="Add  Todo"
            className="w-full outline-none"
          />
          <button
            onClick={handleTask}
            className="bg-black text-white w-20 h-full cursor-pointer"
          >
            {state.editingId ? "Save" : "Add"}
          </button>
        </div>

        <div className="overflow-y-auto flex flex-col gap-2">
          {state.tasks.map((task) => (
            <div
              key={task.id}
              className="w-full h-10 bg-white flex pl-1 items-center justify-between"
            >
              <p>{task.text}</p>
              <div className="w-12 h-full flex items-center gap-2">
                <MdEdit
                  onClick={() => handleEdit(task.id)}
                  className="cursor-pointer text-green-500"
                />
                <MdDelete
                  onClick={() => {
                    let confirm = window.confirm(
                      "Are you sure you want to delete this task?"
                    );
                    if (confirm) handleDelete(task.id);
                  }}
                  className="cursor-pointer text-red-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
