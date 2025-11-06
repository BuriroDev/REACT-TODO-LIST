import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [userData, setUserData] = useState([]);
  const [CompleteTask, setCompleteTasks] = useState([]);
  const [task, setTask] = useState('');
  const [id, setId] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [editForm, setEditForm] = useState(false);
  const local = "http://localhost/REACT-TODO-LIST/php-todolist-backend/";

  const handleTask = () => {
    fetch(local + "add_task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, deadline })
    })
  }

  const handleDelete = (d_id) => {
    fetch(local + "delete_task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ d_id })
    })
      .then(() => fetchCompletedTasks());
  }

  const handleDeleteComplete = (c_id) => {
    fetch(local + "delete_task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ c_id })
    })
      .then(() => fetchCompletedTasks());
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

  const handleUpdate = (up_id, up_task, up_deadline) => [
      
      fetch(local + "update_task_data.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ up_id, up_task, up_deadline })
      })
      .then(() => fetchCompletedTasks)
  ]

  const fetchCompletedTasks = () => {
    fetch(local + "complete_tasks.php")
      .then((res) => res.json())
      .then((data) => setCompleteTasks(data))

    fetch(local + "get_tasks.php")
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }

  const taskCompleted = (c_id) => {
    console.log(c_id);
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
        <h1 className='mb-5'>Update Task:</h1>
        <form>
          <div className="form-group">
            <label>Task Name:</label>
            <input type="text" value={task} onChange={(e) => setTask(e.target.value)} class="form-control" required />
          </div>
          <div className="form-group mt-3">
            <label>Deadline:</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary mt-5" onClick={() => handleUpdate(id, task, deadline)}>Submit</button>
          <button class="btn btn-primary mt-5 float-end" onClick={() => setEditForm(true)}>Back</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ width: "60vw" }}>
      <h1 className='mb-5'>To-Do List:</h1>

      <form className='mb-5' onSubmit={handleTask}>
        <div className="form-row">
          <div className="form-group col-md-2">
            <label>Task Name:</label>
            <input type="text" className="form-control" value={task} onChange={(e) => setTask(e.target.value)} />
          </div>
          <div className="form-group col-md-2 mb-2">
            <label>Deadline:</label>
            <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
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
            {userData.map((u) => (
              <tr key={u.id}>
                <th><input type="checkbox" onChange={() => taskCompleted(u.id)} /></th>
                <td>{u.task}</td>
                <td>{u.deadline}</td>
                <td>{u.status}</td>
                <td><button className='btn btn-success' onClick={() => showDataform(u.id)}>Update</button> | <button className='btn btn-danger' onClick={() => handleDelete(u.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container" style={{marginTop: "150px"}}> 
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
