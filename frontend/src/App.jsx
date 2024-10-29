import { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isRegistering, setIsRegistering] = useState(false);
    const [editTodo, setEditTodo] = useState(null);

    const fetchTodos = async () => {
        if (!isLoggedIn) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://dcinfotech-task-6-7-backend.onrender.com/todos', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [isLoggedIn]);

    const handleLogin = () => {
        setIsLoggedIn(true);
        fetchTodos();
    };

    const handleRegister = () => {
        setIsRegistering(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setTodos([]);
        setEditTodo(null);
    };

    const handleEditTodo = (todo) => {
        setEditTodo(todo);
    };

    const handleClearEdit = () => {
        setEditTodo(null);
    };

    return (
        <div className="App TodoWrapper">
            <h1>Make Every Day Count</h1>
            {!isLoggedIn ? (
                isRegistering ? (
                    <RegisterForm onRegister={handleRegister} />
                ) : (
                    <LoginForm onLogin={handleLogin} />
                )
            ) : (
                <div>
                    <TodoForm fetchTodos={fetchTodos} editTodo={editTodo} clearEdit={handleClearEdit} />
                    <div >
                        <TodoList todos={todos} fetchTodos={fetchTodos} onEdit={handleEditTodo} />
                    </div>
                </div>
            )
            }
            <div className="toggle-button">

                <button
                    onClick={() => setIsRegistering((prev) => !prev)}
                    disabled={isLoggedIn}
                >
                    {isRegistering ? 'Already have an account? Login' : 'Create an account'}
                </button>
            </div>
            <div>
                {isLoggedIn && (
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>)}

            </div>
        </div >
    );
};

export default App;
