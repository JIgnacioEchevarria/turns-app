import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const URL = import.meta.env.VITE_BACKEND_URL

export const useUserStore = create()(persist((set, get) => {
  return {
    isLoading: false,
    userError: null,
    userInfo: null,
    users: [],

    resetUserErrors: () => {
      set({ userError: null })
    },

    register: async (userData) => {
      set({ isLoading: true, userError: null })
      try {
        const res = await fetch(`${URL}/api/v1/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        const data = await res.json()

        if (res.ok) {
          set({ userError: null })
          return true
        } else {
          set({ userError: data })
        }
      } catch (error) {
        set({ userError: 'Error when registering' })
      } finally {
        set({ isLoading: false })
      }
    },

    login: async (userData) => {
      set({ isLoading: true, userError: null })
      try {
        const res = await fetch(`${URL}/api/v1/users/auth`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        const data = await res.json()

        if (res.ok) {
          set({ userError: null, userInfo: data.data })
          return true
        } else {
          set({ userError: data })
        }
      } catch (error) {
        set({ userError: 'Error when logging in' })
      } finally {
        set({ isLoading: false })
      }
    },

    logout: async () => {
      set({ isLoading: true, userError: null })
      try {
        const res = await fetch(`${URL}/api/v1/users/logout`, {
          method: 'POST',
          credentials: 'include'
        })
        const data = await res.json()

        if (res.ok) {
          set({ userError: null, userInfo: null })
          return true
        } else {
          set({ userError: data })
          return false
        }
      } catch (error) {
        set({ userError: 'Error logout' })
      } finally {
        set({ isLoading: false })
      }
    },

    update: async (userData) => {
      set({ isLoading: true, userError: null })
      try {
        const res = await fetch(`${URL}/api/v1/users`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        const data = await res.json()

        if (res.ok) {
          set({ userError: null, userInfo: data.data })
          return data.status
        } else {
          set({ userError: data })
          return data.status
        }
      } catch (error) {
        set({ userError: 'Error when update profile' })
      } finally {
        set({ isLoading: false })
      }
    },

    editPassword: async (info) => {
      set({ isLoading: true, userError: null })
      try {
        const res = await fetch(`${URL}/api/v1/users/password`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(info)
        })
        const data = await res.json()

        if (res.ok) {
          set({ userError: null })
          return data.status
        } else {
          set({ userError: data })
          return data.status
        }
      } catch (error) {
        set({ userError: 'Error when update password' })
      } finally {
        set({ isLoading: false })
      }
    },

    fetchUsers: async () => {
      set({ isLoading: true, userError: null })
      try {
        const res = await fetch(`${URL}/api/v1/users`, {
          credentials: 'include'
        })
        const data = await res.json()

        if (res.ok) {
          set({ users: data.data, userError: null })
          return data.status
        } else {
          set({ users: [], userError: data })
          return data.status
        }
      } catch (error) {
        set({ users: [], userError: 'Error getting users' })
      } finally {
        set({ isLoading: false })
      }
    },

    changeRole: async (info) => {
      set({ isLoading: true, userError: null })
      try {
        const res = await fetch(`${URL}/api/v1/users/role`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(info)
        })
        const data = await res.json()

        if (res.ok) {
          set({ userError: null })
          return data.status
        } else {
          set({ userError: data })
          return data.status
        }
      } catch (error) {
        console.log(error)
      } finally {
        set({ isLoading: false })
      }
    }
  }
}, {
  name: 'user',
  partialize: (state) => {
    // Se uitiliza partialize para evitar que determinados estados se persistan.
    // availableTurns no quiero que persista entre renderizaciones
    return Object.fromEntries(
      Object.entries(state).filter(([key]) =>
        key !== 'userError' ||
        key !== 'userSuccessMessage'
      )
    )
  }
}))
