import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const baseUrl = import.meta.env.VITE_API_URL;
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData( ({
      ...formData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
     try {
    setLoading(true);
 
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
     navigate('/sign-in');
     if(data.success === false){
      setLoading(false)
      setError(data.message) 
      return; 
     }
    setError(null);
    setLoading(false)
     } catch (error) {
        setLoading(false);
        setError(error.message)
     }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col mt-12 gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          required
          className="border p-3 rounded-lg outline-none"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          required
          className="border p-3 rounded-lg outline-none"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          required
          className="border p-3 rounded-lg outline-none"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase">
         {loading ? "loading..." :"Sign up"}
        </button>
      </form>
      <div className="flex gap-3 mt-3">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}