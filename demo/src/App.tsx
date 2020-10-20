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

  useEffect(() => {
    requestTodos().then(res => {
      setTodos(res.data.data.todos.data);
    });
  }, [setTodos]);

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
