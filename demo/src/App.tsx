import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const requestTodos = () => {
  return axios.post(
    '/graphql',
    {
      query: `
        query todos {
          todos {
            data {
              id
              title
              completed
            }
          }
        }
      `,
    },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

const App = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    requestTodos()
      .then(res => {
        if (res.data.errors) {
          throw res.data.errors[0];
        }
        setTodos(res.data.data.todos.data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, [setTodos]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!todos) {
    return <div>'loading...'</div>;
  }

  if (todos.length === 0) {
    return <div>no todos found</div>;
  }
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <h2>{todo.title}</h2>
          <p>Completed: {todo.completed ? 'true' : 'false'}</p>
        </li>
      ))}
    </ul>
  );
};

export default App;
