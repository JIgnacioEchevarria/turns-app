import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const URL = import.meta.env.VITE_BACKEND_URL

export const useServiceStore = create()(persist((set, get) => {
  return {
    services: [],
    serviceError: null,
    isLoading: false,

    resetServiceErrors: () => {
      set({ serviceError: null })
    },

    fetchServices: async () => {
      set({ isLoading: true, serviceError: null })
      try {
        const res = await fetch(`${URL}/api/v1/services`)
        const data = await res.json()

        if (res.ok) {
          set({ services: data.data, serviceError: null })
        } else {
          set({ services: [], serviceError: data })
        }
      } catch (error) {
        set({ services: [], serviceError: 'Error getting services' })
      } finally {
        set({ isLoading: false })
      }
    },

    removeService: async (id) => {
      set({ isLoading: true, serviceError: null })
      try {
        const res = await fetch(`${URL}/api/v1/services/${id}/deactivate`, {
          method: 'PATCH',
          credentials: 'include'
        })
        const data = await res.json()

        if (res.ok) {
          set({ serviceError: null })
          return data.status
        } else {
          set({ serviceError: data })
          return data.status
        }
      } catch (error) {
        set({ serviceError: 'Error when deleting service' })
      } finally {
        set({ isLoading: false })
      }
    },

    addService: async (info) => {
      set({ isLoading: true, serviceError: null })
      try {
        const res = await fetch(`${URL}/api/v1/services`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(info)
        })
        const data = await res.json()

        if (res.ok) {
          set({ serviceError: null })
          return data.status
        } else {
          set({ serviceError: data })
          return data.status
        }
      } catch (error) {
        set({ serviceError: 'Error adding service' })
      } finally {
        set({ isLoading: false })
      }
    },

    editService: async (id, info) => {
      set({ isLoading: true, serviceError: null })
      try {
        const res = await fetch(`${URL}/api/v1/services/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(info)
        })
        const data = await res.json()

        if (res.ok) {
          set({ serviceError: null })
          return data.status
        } else {
          set({ serviceError: data })
          return data.status
        }
      } catch (error) {
        set({ serviceError: 'Error when editing service' })
      } finally {
        set({ isLoading: false })
      }
    }
  }
}, {
  name: 'services',
  partialize: (state) => {
    // Se uitiliza partialize para evitar que determinados estados se persistan.
    // availableTurns no quiero que persista entre renderizaciones
    return Object.fromEntries(
      Object.entries(state).filter(([key]) =>
        key !== 'serviceError'
      )
    )
  }
}))
