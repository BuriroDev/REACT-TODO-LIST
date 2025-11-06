import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'

function App() {
  const [userData, setUserData] = useState([]);
  const [CompleteTask, setCompleteTasks] = useState([]);
  const [task, setTask] = useState('');
  const [id, setId] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [editForm, setEditForm] = useState(false);
  const local = "http://localhost/REACT-TODO-LIST/php-todolist-backend/";

  const addToast = () => toast('Task has been added!');
  const deleteToast = () => toast('Task has been Deleted!');
  const editToast = () => toast('Task has been updated!');
  const emptyToast = () => toast('Please enter task and deadline!') 

  const handleTask = (e) => {
    e.preventDefault();

    if(task !== "" && deadline !== ""){
      fetch(local + "add_task.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, deadline })
      })
        .then(() => {
          addToast();
          fetchCompletedTasks();
          setTask('');
          setDeadline('');
        });
    }else{
      emptyToast();
    }
  }

  const handleDelete = (d_id) => {
    fetch(local + "delete_task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ d_id })
    })
      .then(() => {
        deleteToast();
        fetchCompletedTasks();
      });
  }

  const handleDeleteComplete = (c_id) => {
    fetch(local + "delete_task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ c_id })
    })
      .then(() => {
        deleteToast();
        fetchCompletedTasks();
      });
  }

  const showDataform = (id) => {

    fetch(local + "update_task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data: 1 })
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data[0]);
        setId(data[0].id);
        setTask(data[0].task);
        setDeadline(data[0].deadline);
        setEditForm(true);
      });
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(local + "update_task_data.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, task, deadline })
    })
      .then(() => {
        editToast();
        fetchCompletedTasks();
        setEditForm(false);
        setTask('');
        setDeadline('');
      });
  }

  const fetchCompletedTasks = () => {
    fetch(local + "complete_tasks.php")
      .then((res) => res.json())
      .then((data) => setCompleteTasks(data))

    fetch(local + "get_tasks.php")
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }

  const taskCompleted = (c_id) => {

    fetch(local + "mark_complete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ c_id })
    })
      .then(() => fetchCompletedTasks())
  }

  useEffect(() => {
    fetchCompletedTasks();
  }, [])

  if (editForm) {
    return (
      <div className='container mt-5 bg-secondary text-white p-5'>
        <h1 className='mb-5'>Update Task</h1>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Task Name:</label>
            <input type="text" value={task} onChange={(e) => setTask(e.target.value)} class="form-control" required />
          </div>
          <div className="form-group mt-3">
            <label>Deadline:</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} class="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary mt-5">Update</button>
          <button className="btn btn-primary mt-5 float-end" onClick={() => {setEditForm(false); fetchCompletedTasks(); setTask(''); setDeadline('');}}>Back</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ width: "60vw" }}>
      <Toaster />
      <h1 className='mb-5'>To-Do List</h1>

      <form className='mb-5' onSubmit={handleTask}>
        <div className="form-row">
          <div className="form-group col-md-2">
            <label>Task Name:</label>
            <input type="text" className="form-control" value={task} onChange={(e) => setTask(e.target.value)}  />
          </div>
          <div className="form-group col-md-2 mb-2">
            <label>Deadline:</label>
            <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)}  />
          </div>
        </div>
        <button type="submit" className="btn btn-primary float-start mb-5">Add Task</button>
      </form>

      <div className="container mt-5">
        <h3 className='float-center mt-5 mb-3'>Pending Tasks:</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Mark As Complete</th>
              <th scope="col">Task</th>
              <th scope="col">Deadline</th>
              <th scope="col">Status</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(userData) && userData.map((u) => (
              <tr key={u.id}>
                <th><input type="checkbox" onChange={() => taskCompleted(u.id)} /></th>
                <td>{u.task}</td>
                <td>{u.deadline}</td>
                <td>{u.status}</td>
                <td><button className='btn btn-success' onClick={() => showDataform(u.id)}>Edit</button> | <button className='btn btn-danger' onClick={() => handleDelete(u.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container" style={{ marginTop: "150px" }}>
        <h3 className='float-center mt-5 mb-3'>Completed Tasks:</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope='col'>Completed</th>
              <th scope="col">Task</th>
              <th scope="col">Deadline</th>
              <th scope="col">Status</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {CompleteTask.map((c) => (
              <tr key={c.id}>
                <th><input type="checkbox" checked /></th>
                <td>{c.task}</td>
                <td>{c.deadline}</td>
                <td>{c.status}</td>
                <td><button className='btn btn-danger' onClick={() => handleDeleteComplete(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
