import React, { useEffect, useReducer } from 'react'
import { MdDelete } from 'react-icons/md';

const App = () => {
  const initialState = {
    input: "",
    tasks: JSON.parse(localStorage.getItem("tasks")) ||  [],
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

        case "delete":
          return {
            ...state,
            tasks: state.tasks.filter((task) => task.id != action.payload),
          }

          break

       
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
    dispatch({ type: "addTask" });
  };

  const handleDelete = (id) => {
    dispatch({type: "delete", payload: id})
  } 

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <div className="h-screen bg-black flex justify-center items-center">
    <div className="w-80 rounded-2xl p-3 bg-gray-300 flex flex-col gap-3">
      <h1 className="text-center text-lg font-bold">To-Do App</h1>
      <div className="w-full bg-white h-10 pl-3 flex p-1">
        <input
          type="text"
          value={state.input}
          onChange={handleChange}
          placeholder="Add Todo"
          className="w-full outline-none"
        />
        <button
          onClick={handleTask}
          className="bg-black text-white w-20 h-full cursor-pointer"
        >
          Add
        </button>
      </div>
      {state.tasks.map((task) => (
        <div
          key={task.id}
          className="w-full h-10 bg-white flex pl-1 items-center justify-between"
        >
          <p>{task.text}</p>
          <div className="w-12 h-full flex items-center gap-2">
            {/* <MdEdit className="cursor-pointer" /> */}
            <MdDelete onClick={() => handleDelete(task.id)} className="cursor-pointer" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default App