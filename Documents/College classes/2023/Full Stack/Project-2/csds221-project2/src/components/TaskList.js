// TaskList.js
import React from 'react';
import { Table, Button } from 'react-bootstrap';

const TaskList = ({ tasks }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Deadline</th>
          <th>Priority</th>
          <th>Is Complete</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={index}>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{task.date}</td>
            <td>{task.priority}</td>
            <td>
              <input type="checkbox" checked={task.isComplete} readOnly />
            </td>
            <td>
              <Button variant="info">Update</Button>{' '}
              <Button variant="danger">Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TaskList;
