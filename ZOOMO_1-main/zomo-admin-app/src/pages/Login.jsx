import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Login() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const success = await login(email, password); // ✅ awaited
    if (success) navigate('/admin/orders');
    else setError('Invalid credentials. Try again.');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
        <button className="w-full py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Login</button>
      </form>
    </div>
  );
}
