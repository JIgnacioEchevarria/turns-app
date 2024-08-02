import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const URL = import.meta.env.VITE_BACKEND_URL

export const useTurnStore = create()(persist((set, get) => {
  return {
    availableTurns: [],
    userTurns: [],
    registeredTurns: [],
    isLoading: false,
    turnError: null,

    resetTurnErrors: () => {
      set({ turnError: null })
    },

    configureCalendar: async (info) => {
      set({ isLoading: true, turnError: null })
      try {
        const res = await fetch(`${URL}/api/v1/turns`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(info)
        })
        const data = await res.json()

        if (res.ok) {
          return data.status
        } else {
          set({ turnError: data })
          return data.status
        }
      } catch (error) {
        console.log(error)
      } finally {
        set({ isLoading: false })
      }
    },

    fetchAvailableTurns: async (date) => {
      set({ isLoading: true, turnError: null })
      try {
        const res = await fetch(`${URL}/api/v1/turns/${date}/available`)
        const data = await res.json()

        if (res.ok) {
          set({ availableTurns: data.data, turnError: null })
          return data.status
        } else {
          set({ availableTurns: [], turnError: data })
          return data.status
        }
      } catch (error) {
        set({ availableTurns: [], turnError: 'Error getting turns' })
      } finally {
        set({ isLoading: false })
      }
    },

    clearAvailableTurns: () => {
      set({ availableTurns: [] })
    },

    fetchUserTurns: async () => {
      set({ isLoading: true, turnError: null })
      try {
        const res = await fetch(`${URL}/api/v1/turns/user`, {
          credentials: 'include'
        })
        const data = await res.json()

        if (res.ok) {
          set({ userTurns: data.data, turnError: null })
        } else {
          set({ userTurns: [], turnError: data })
        }
      } catch (error) {
        set({ turnError: 'Error getting turns' })
      } finally {
        set({ isLoading: false })
      }
    },

    fetchRegisteredTurns: async (date) => {
      set({ isLoading: true, turnError: null })
      try {
        const res = await fetch(`${URL}/api/v1/turns/${date}/registered`, {
          credentials: 'include'
        })
        const data = await res.json()

        if (res.ok) {
          set({ registeredTurns: data.data, turnError: null })
          return data.status
        } else {
          set({ registeredTurns: [], turnError: data })
          return data.status
        }
      } catch (error) {
        set({ turnError: 'Error getting turns' })
      } finally {
        set({ isLoading: false })
      }
    },

    requestTurn: async (info) => {
      set({ isLoading: true, turnError: null })
      try {
        const res = await fetch(`${URL}/api/v1/turns?turnId=${info.turn}&serviceId=${info.service}`, {
          method: 'PATCH',
          credentials: 'include'
        })
        const data = await res.json()

        if (res.ok) {
          set({ turnError: null })
          return data.status
        } else {
          set({ turnError: data })
          return data.status
        }
      } catch (error) {
        set({ turnError: 'Error when requesting an turn' })
      } finally {
        set({ isLoading: false })
      }
    },

    cancelTurn: async (id) => {
      set({ isLoading: true, turnError: null })
      try {
        const res = await fetch(`${URL}/api/v1/turns/${id}/status`, {
          method: 'PATCH',
          credentials: 'include'
        })
        const data = await res.json()

        if (res.ok) {
          set({ turnError: null })
          return data.statusMessage
        } else {
          set({ turnError: data })
          return data.statusMessage
        }
      } catch (error) {
        set({ turnError: 'Error canceling turn' })
      } finally {
        set({ isLoading: false })
      }
    }
  }
}, {
  name: 'turns',
  partialize: (state) => {
    // Se uitiliza partialize para evitar que determinados estados se persistan.
    // availableTurns no quiero que persista entre renderizaciones
    return Object.fromEntries(
      Object.entries(state).filter(([key]) =>
        key !== 'availableTurns' &&
        key !== 'registeredTurns' &&
        key !== 'isLoading' &&
        key !== 'turnError'
      )
    )
  }
}))
