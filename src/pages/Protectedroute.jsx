import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile } from '../store/actions/useraction'
import { useNavigate, useLocation } from 'react-router-dom'

function Protectedroute({ children }) {
    const {
        user,
        loading,
        isAuthenticated,
        error
    } = useSelector((state) => state.User)

    const [isChecking, setIsChecking] = useState(true);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Always fetch user profile when the component mounts
        const checkAuth = async () => {
            await dispatch(fetchUserProfile());
            setIsChecking(false);
        };
        
        checkAuth();
    }, [dispatch])

    useEffect(() => {
        // Only navigate after initial check is complete
        if (!isChecking && !loading && !isAuthenticated) {
            console.log("Redirecting to login, auth state:", { loading, isAuthenticated, error });
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [isChecking, loading, isAuthenticated, navigate, location.pathname, error])

    // Show loading while checking authentication
    if (loading || isChecking) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4">Verifying authentication...</p>
            </div>
        )
    }

    // Return children only when authenticated
    return isAuthenticated ? children : null
}

export default Protectedroute