import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import Culumns from "./Culumns";
import { DndContext } from "@dnd-kit/core";
import useAuth from "../../hooks/useAuth";

const socket = io("http://localhost:3000");
// const socket = io("https://task-management-system-server-1.onrender.com");

const Taskboard = () => {
  const { user, dark } = useAuth();
  const [tasks, setTasks] = useState([]);
  const modalRef = useRef(null);

  const CULUMNS = [
    { id: "TODO", title: "To-Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // const response = await fetch(
        //   `https://task-management-system-server-1.onrender.com/tasks/${user?.email}`
        // );
        const response = await fetch(
          `http://localhost:3000/tasks/${user?.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user?.email]);

  useEffect(() => {
    socket.on("tasksUpdated", (updatedTasks) => {
      console.log("Tasks Updated (From Server):", updatedTasks);
      setTasks(updatedTasks);
    });

    //   Cleanup the event listener on component unmount
    return () => {
      socket.off("tasksUpdated");
    };
  }, []);

  const showMod = () => {
    document.getElementById("my_modal_3").showModal();
  };

  const handeAddTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title?.value;
    const description = form.description?.value;
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const newTask = {
      _id: nanoid(),
      email: user?.email,
      title,
      description,
      status: "TODO",
      date: formattedDate,
    };

    // Emit task data to WebSocket server
    socket.emit("addTask", newTask);
    if (modalRef.current) {
      modalRef.current.close();
    }

    // Clear form
    form.reset();
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;
    const taskId = active.id;

    const newStatus = over.id;
    console.log(taskId, newStatus);

    setTasks(() =>
      tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );

    const updatedTask = tasks.find((task) => task._id === taskId);

    if (updatedTask) {
      socket.emit("updateTask", { ...updatedTask, status: newStatus });
    }
  }

  return (
    <section className={`px-12 my-12 ${dark ? "" : "bg-gray-700"} `}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DndContext onDragEnd={handleDragEnd}>
          {CULUMNS.map((culumn) => (
            <Culumns
              key={culumn.id}
              culumn={culumn}
              showMod={showMod}
              tasks={tasks.filter((task) => task.status === culumn.id)}
            ></Culumns>
          ))}
        </DndContext>
      </div>

      {/* modal */}
      <dialog ref={modalRef} id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={handeAddTask} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Title here"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <input className="btn btn-primary" type="submit" value="Add" />
            </div>
          </form>
        </div>
      </dialog>
    </section>
  );
};

export default Taskboard;
