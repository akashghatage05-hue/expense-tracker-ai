'use client';
import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/lib/types';
import { loadExpenses, persistExpenses } from '@/lib/storage';
import { generateId, getSampleExpenses } from '@/lib/utils';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadExpenses();
    if (stored.length === 0) {
      const now = new Date().toISOString();
      const samples: Expense[] = getSampleExpenses().map(s => ({
        ...s,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      }));
      persistExpenses(samples);
      setExpenses(samples);
    } else {
      setExpenses(stored);
    }
    setIsLoaded(true);
  }, []);

  const addExpense = useCallback(
    (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const expense: Expense = { ...data, id: generateId(), createdAt: now, updatedAt: now };
      setExpenses(prev => {
        const next = [expense, ...prev];
        persistExpenses(next);
        return next;
      });
      return expense;
    },
    []
  );

  const updateExpense = useCallback(
    (id: string, data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      setExpenses(prev => {
        const next = prev.map(e =>
          e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
        );
        persistExpenses(next);
        return next;
      });
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id);
      persistExpenses(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    persistExpenses([]);
    setExpenses([]);
  }, []);

  return { expenses, isLoaded, addExpense, updateExpense, deleteExpense, clearAll };
}
