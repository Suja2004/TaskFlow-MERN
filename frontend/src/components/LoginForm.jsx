import { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            onLogin(); // Update UI to indicate login success
        } catch (error) {
            if (error.response) {
                // If response status is 401, show appropriate message
                setError(error.response.data.message);
            } else {
                setError('Login failed. Please try again.');
            }
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='Login'>
            <input
                className='todo-input'
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                className='todo-input'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button className='todo-btn' type="submit">Login</button>
            {error && <p className='error-message'>{error}</p>}
        </form>
    );
};

export default LoginForm;
