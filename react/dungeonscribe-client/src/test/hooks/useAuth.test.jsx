import { renderHook, act } from '@testing-library/react'
import {AuthProvider, UseAuth} from '../../context/AuthContext';

//Wrapper provides the AuthContext to the hook
const wrapper = ({children}) => <AuthProvider>{children}</AuthProvider>;

describe('useAuth hook', () => {

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    it('should return isAuthenticated false when no token exists', () => {
        const {result} = renderHook(() => UseAuth(), {wrapper});
        
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBe(null);

    });

    it("should return isAuthenticated true when a token exists", () => {

        localStorage.setItem('token', 'mock-jwt-token');

        const {result} = renderHook(() => UseAuth(), {wrapper});
        
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe('mock-jwt-token');
    })

    it('should set isAuthenticated to true after login', () => {
        const {result} = renderHook(() => UseAuth(), {wrapper});

        act(() => {
            result.current.login('mock-jwt-token');
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe('mock-jwt-token');
        expect(localStorage.getItem('token')).toBe('mock-jwt-token');

    });

    it('should set isAuthenticated to false after logout', () => {
        localStorage.setItem('token', 'mock-jwt-token');

        const {result} = renderHook(() => UseAuth(), {wrapper});
        act(() => {
            result.current.logout();
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBe(null);
        expect(localStorage.getItem('token')).toBe(null);
    });


    it("should persist token to localStorage on login", () => {
        const {result} = renderHook(() => UseAuth(), {wrapper});
        act(() => {
            result.current.login('mock-jwt-token');
        });
        expect(localStorage.getItem('token')).toBe('mock-jwt-token');
    });

    it("should remove token from localStorage on logout", () => {
        localStorage.setItem('token', 'mock-jwt-token');
        const {result} = renderHook(() => UseAuth(), {wrapper});
        act(() => {
            result.current.logout();
        });
        expect(localStorage.getItem('token')).toBe(null);
    });

});