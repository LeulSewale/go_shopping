'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';
import { initializeFavorites } from '@/store/slices/favoritesSlice';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // Initialize favorites when auth state changes (login/logout)
    const userId = auth.user?.id || null;
    dispatch(initializeFavorites(userId));
  }, [dispatch, auth.user?.id, auth.isAuthenticated]);

  return null;
}

