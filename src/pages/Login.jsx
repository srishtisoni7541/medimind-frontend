import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleAuthLoaded, setGoogleAuthLoaded] = useState(false)

  // Initialize Google OAuth
  useEffect(() => {
    // Load the Google API script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogleAuth
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initializeGoogleAuth = () => {
    if (!window.google?.accounts) return;
    
    const clientId = '862279115366-q1f226phjifaqibkcom9re648j5q00n8.apps.googleusercontent.com';
    
    // Make sure we're using exactly the same client ID as the backend
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleSignIn,
      cancel_on_tap_outside: true,
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { 
        theme: 'outline', 
        size: 'large',
        width: '100%',
        text: state === 'Sign Up' ? 'signup_with' : 'signin_with'
      }
    );
    
    setGoogleAuthLoaded(true);
  }
  
  // Update the handleGoogleSignIn function:
  
  const handleGoogleSignIn = async (response) => {
    setIsLoading(true);
    try {
      // Send the ID token to your backend with lowercase mode value
      const { data } = await axios.post(backendUrl + '/api/user/google-auth', { 
        idToken: response.credential,
        mode: state.toLowerCase().replace(' ', '') // Normalize to 'signup' or 'login'
      });
      
      if (data.success) {
        localStorage.setItem('utoken', data.token);
        setToken(data.token);
        toast.success(state === 'Sign Up' ? 'Account created successfully!' : 'Login successful');
        navigate('/');
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(error.response?.data?.message || 'Error authenticating with Google');
    } finally {
      setIsLoading(false);
    }
  }

  // Re-render Google button when state changes between Login/Signup
  useEffect(() => {
    if (googleAuthLoaded && window.google?.accounts) {
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          theme: 'outline', 
          size: 'large',
          width: '100%',
          text: state === 'Sign Up' ? 'signup_with' : 'signin_with'
        }
      )
    }
  }, [state, googleAuthLoaded])

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          localStorage.setItem('utoken', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        }
        else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          localStorage.setItem('utoken', data.token)
          setToken(data.token)
          toast.success('Login successful')
          navigate('/')
        }
        else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {state === 'Sign Up' ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {state === 'Sign Up' ? 'Sign up to book appointments and manage your health' : 'Log in to access your account and appointments'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Toggle between login and signup */}
          <div className="flex rounded-md shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setState('Sign Up')}
              className={`w-1/2 py-2 px-4 text-sm font-medium rounded-l-md focus:outline-none ${
                state === 'Sign Up'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setState('Login')}
              className={`w-1/2 py-2 px-4 text-sm font-medium rounded-r-md focus:outline-none ${
                state === 'Login'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Login
            </button>
          </div>

          {/* Google Sign-in button */}
          <div className="mb-6">
            <div id="google-signin-button" className="w-full"></div>
            {!googleAuthLoaded && (
              <div className="w-full py-2 flex justify-center">
                <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={state === 'Sign Up' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state === 'Login' && (
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-dark">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    {state === 'Sign Up' ? 'Creating account...' : 'Logging in...'}
                  </>
                ) : (
                  <>
                    {state === 'Sign Up' ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            {state === 'Sign Up' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setState('Login')}
                  className="font-medium text-primary hover:text-primary-dark focus:outline-none"
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setState('Sign Up')}
                  className="font-medium text-primary hover:text-primary-dark focus:outline-none"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login