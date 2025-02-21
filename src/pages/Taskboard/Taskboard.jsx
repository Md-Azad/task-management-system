import { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const Taskboard = () => {
  const [tasks, setTasks] = useState([]);
  const modalRef = useRef(null);

  const column = [
    { id: "TODO", title: "To-Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks");
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
  }, []);

  const handeAddTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const today = new Date();

    // Get the current date, month, and year
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based, so add 1
    const year = today.getFullYear();

    // Format the date as desired (e.g., DD/MM/YYYY)
    const formattedDate = `${day}/${month}/${year}`;

    const newTask = {
      title,
      description,
      status: "To-Do",
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
  useEffect(() => {
    socket.on("tasksUpdated", (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("tasksUpdated");
    };
  }, []);

  console.log(tasks);

  return (
    <section className="px-12 my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className=" bg-green-400">
        <div className="flex justify-between px-4 pt-2">
          <h1 className="text-white text-xl font-bold">To-Do</h1>

          <button
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            <IoMdAddCircleOutline className="text-3xl text-white" />
          </button>
        </div>
        <div className="">
          {tasks.map((task) => (
            <div
              key={task._id}
              className=" bg-white mx-2 my-2 flex items-center justify-between p-4"
            >
              <div>
                <h1>{task?.title}</h1>
                <p>{task.description}</p>
              </div>
              <div className=" flex items-center justify-center gap-4">
                <button className="btn bg-yellow-400 ">
                  <CiEdit className=" text-2xl " />
                </button>
                <button className="btn btn-error">
                  <MdDeleteOutline className=" text-white text-2xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-32 bg-gray-200"></div>
      <div className="h-32 bg-orange-200"></div>

      {/* modal */}
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <dialog ref={modalRef} id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
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
              <input className={`btn btn-primary `} type="submit" value="Add" />
            </div>
          </form>
        </div>
      </dialog>
    </section>
  );
};

export default Taskboard;
