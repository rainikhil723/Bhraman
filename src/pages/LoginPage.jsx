import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert(`Welcome back, ${user.firstName}!`);
      window.dispatchEvent(new Event("userChanged"));
      navigate('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setError(''); // Clear error as user types
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 p-3 w-full border rounded-lg"
              value={email}
              onChange={handleChange(setEmail)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 p-3 w-full border rounded-lg"
              value={password}
              onChange={handleChange(setPassword)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>
        <p className="text-center">
          New user?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
