import { useAuth } from '@clerk/clerk-expo'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Transaction, TransactionStats } from '../hooks/useTransaction'
import { Wallet } from '../hooks/useWallet'
import { supabase } from '../utils/supabase'

interface DataContextProps {

  wallets: Wallet[]
  selectedWallet: Wallet | null
  setSelectedWallet: (wallet: Wallet | null) => void
  walletLoading: boolean
  fetchWallets: () => Promise<void>
  createWallet: (data: { wallet_name: string; balance: number; wallet_color: string }) => Promise<Wallet>
  updateWallet: (walletId: number, updates: Partial<Wallet>) => Promise<Wallet>
  deleteWallet: (walletId: number) => Promise<void>
  
  // Transactions
  transactions: Transaction[]
  stats: TransactionStats
  transactionLoading: boolean
  fetchTransactions: () => Promise<void>
  createTransaction: (data: any) => Promise<Transaction>
  updateTransaction: (transactionId: number, updates: any) => Promise<Transaction>
  deleteTransaction: (transactionId: number) => Promise<void>
  
  // Utility
  refreshAll: () => Promise<void>
}

const DataContext = createContext<DataContextProps>({
  wallets: [],
  selectedWallet: null,
  setSelectedWallet: () => {},
  walletLoading: false,
  fetchWallets: async () => {},
  createWallet: async () => ({} as Wallet),
  updateWallet: async () => ({} as Wallet),
  deleteWallet: async () => {},
  
  transactions: [],
  stats: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    todayExpense: 0,
    todayIncome: 0,
    expensePercentage: 0,
    isHighExpense: false,
  },
  transactionLoading: false,
  fetchTransactions: async () => {},
  createTransaction: async () => ({} as Transaction),
  updateTransaction: async () => ({} as Transaction),
  deleteTransaction: async () => {},
  
  refreshAll: async () => {},
})

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth()
  
  // Wallet state
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  
  // Transaction state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<TransactionStats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    todayExpense: 0,
    todayIncome: 0,
    expensePercentage: 0,
    isHighExpense: false,
  })
  const [transactionLoading, setTransactionLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchWallets()
    }
  }, [userId])

  useEffect(() => {
    if (selectedWallet && selectedWallet.id) {
      fetchTransactions()
    } else {
      // Clear transactions if no wallet selected
      setTransactions([])
      setStats({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        todayExpense: 0,
        todayIncome: 0,
        expensePercentage: 0,
        isHighExpense: false,
      })
    }
  }, [selectedWallet?.id])

  // Real-time subscription for wallets
  useEffect(() => {
    if (!userId) return

    const channelName = `wallet-changes-${userId}`
    const walletSubscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Wallet change detected:', payload.eventType, payload.new || payload.old)
          fetchWallets()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active for wallets')
        }
      })

    return () => {
      console.log('🔌 Unsubscribing from wallet changes')
      supabase.removeChannel(walletSubscription)
    }
  }, [userId])

  // Real-time subscription for transactions
  useEffect(() => {
    if (!userId || !selectedWallet?.id) return

    const channelName = `transaction-changes-${selectedWallet.id}`
    const transactionSubscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `wallet_id=eq.${selectedWallet.id}`,
        },
        (payload) => {
          console.log('Transaction change detected:', payload.eventType, payload.new || payload.old)
          fetchTransactions()
          fetchWallets() 
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active for transactions')
        }
      })

    return () => {
      console.log('🔌 Unsubscribing from transaction changes')
      supabase.removeChannel(transactionSubscription)
    }
  }, [userId, selectedWallet?.id])

  const fetchWallets = async () => {
    try {
      setWalletLoading(true)

      const { data, error } = await supabase
        .from('wallet')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setWallets(data || [])
      
      // Update selected wallet with fresh data
      if (data && data.length > 0) {
        if (selectedWallet) {
          const updatedWallet = data.find(w => w.id === selectedWallet.id)
          if (updatedWallet) {
            setSelectedWallet(updatedWallet)
          } else {
            setSelectedWallet(data[0])
          }
        } else {
          setSelectedWallet(data[0])
        }
      }
    } catch (err: any) {
      console.error('Error fetching wallets:', err)
    } finally {
      setWalletLoading(false)
    }
  }

  const createWallet = async (walletData: {
    wallet_name: string
    balance: number
    wallet_color: string
  }) => {
    try {
      setWalletLoading(true)

      const { data, error } = await supabase
        .from('wallet')
        .insert([
          {
            user_id: userId,
            ...walletData,
          },
        ])
        .select()
        .single()

      if (error) throw error

      await fetchWallets()
      return data
    } catch (err: any) {
      console.error('Error creating wallet:', err)
      throw err
    } finally {
      setWalletLoading(false)
    }
  }

  const updateWallet = async (walletId: number, updates: Partial<Wallet>) => {
    try {
      setWalletLoading(true)

      const { data, error } = await supabase
        .from('wallet')
        .update(updates)
        .eq('id', walletId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      await fetchWallets()
      return data
    } catch (err: any) {
      console.error('Error updating wallet:', err)
      throw err
    } finally {
      setWalletLoading(false)
    }
  }

  const deleteWallet = async (walletId: number) => {
    try {
      setWalletLoading(true)

      const { error } = await supabase
        .from('wallet')
        .delete()
        .eq('id', walletId)
        .eq('user_id', userId)

      if (error) throw error

      await fetchWallets()
    } catch (err: any) {
      console.error('Error deleting wallet:', err)
      throw err
    } finally {
      setWalletLoading(false)
    }
  }

  const calculateStats = (txns: Transaction[], walletBalance?: number) => {
    const today = new Date().toISOString().split('T')[0]

    const totalIncome = txns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = txns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const todayIncome = txns
      .filter((t) => t.type === 'income' && t.date.startsWith(today))
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const todayExpense = txns
      .filter((t) => t.type === 'expense' && t.date.startsWith(today))
      .reduce((sum, t) => sum + Number(t.amount), 0)

    
    const currentWalletBalance = walletBalance !== undefined ? walletBalance : selectedWallet?.balance || 0
    
   
    const expensePercentage = currentWalletBalance > 0 ? (totalExpense / currentWalletBalance) * 100 : 0
    const isHighExpense = expensePercentage >= 80

    setStats({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      todayIncome,
      todayExpense,
      expensePercentage: Math.min(expensePercentage, 100),
      isHighExpense,
    })
  }

  const fetchTransactions = async () => {
    if (!selectedWallet) return
    
    try {
      setTransactionLoading(true)

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('wallet_id', selectedWallet.id)
        .order('date', { ascending: false })

      if (error) throw error

      setTransactions(data || [])
      calculateStats(data || [], selectedWallet.balance)
    } catch (err: any) {
      console.error('Error fetching transactions:', err)
    } finally {
      setTransactionLoading(false)
    }
  }

  const createTransaction = async (transactionData: any) => {
    try {
      const { imageUri, ...dataToInsert } = transactionData

      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userId,
            ...dataToInsert,
          },
        ])
        .select()
        .single()

      if (error) throw error

      
      
      return data
    } catch (err: any) {
      console.error('Error creating transaction:', err)
      throw err
    }
  }

  const updateTransaction = async (transactionId: number, updates: any) => {
    try {
      const { imageUri, ...dataToUpdate } = updates

      const { data, error } = await supabase
        .from('transactions')
        .update(dataToUpdate)
        .eq('id', transactionId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Real-time subscription will automatically update the data
      // No manual refresh needed - Supabase will trigger the subscription
      
      return data
    } catch (err: any) {
      console.error('Error updating transaction:', err)
      throw err
    }
  }

  const deleteTransaction = async (transactionId: number) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', userId)

      if (error) throw error

      
    } catch (err: any) {
      console.error('Error deleting transaction:', err)
      throw err
    }
  }

  const refreshAll = async () => {
    await Promise.all([fetchWallets(), fetchTransactions()])
  }

  return (
    <DataContext.Provider
      value={{
        wallets,
        selectedWallet,
        setSelectedWallet,
        walletLoading,
        fetchWallets,
        createWallet,
        updateWallet,
        deleteWallet,
        
        transactions,
        stats,
        transactionLoading,
        fetchTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        
        refreshAll,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
