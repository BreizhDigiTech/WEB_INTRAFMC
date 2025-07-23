// Store des notifications

import { defineStore } from 'pinia'
import type { Notification } from '@/shared/types/app'

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        notifications: [] as Notification[],
        maxNotifications: 5
    }),

    getters: {
        hasNotifications: (state) => state.notifications.length > 0,
        unreadCount: (state) => state.notifications.length
    },

    actions: {
        // Ajouter une notification
        add(notification: Omit<Notification, 'id'>) {
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)

            const newNotification: Notification = {
                id,
                duration: 5000, // 5 secondes par défaut
                ...notification
            }

            this.notifications.unshift(newNotification)

            // Limiter le nombre de notifications
            if (this.notifications.length > this.maxNotifications) {
                this.notifications = this.notifications.slice(0, this.maxNotifications)
            }

            // Auto-suppression après la durée spécifiée
            if (newNotification.duration && newNotification.duration > 0) {
                setTimeout(() => {
                    this.remove(id)
                }, newNotification.duration)
            }

            return id
        },

        // Supprimer une notification
        remove(id: string) {
            const index = this.notifications.findIndex(n => n.id === id)
            if (index > -1) {
                this.notifications.splice(index, 1)
            }
        },

        // Vider toutes les notifications
        clear() {
            this.notifications = []
        },

        // Méthodes de raccourci pour les différents types
        success(title: string, message: string, duration?: number) {
            return this.add({
                type: 'success',
                title,
                message,
                duration
            })
        },

        error(title: string, message: string, duration?: number) {
            return this.add({
                type: 'error',
                title,
                message,
                duration: duration || 8000 // Plus long pour les erreurs
            })
        },

        warning(title: string, message: string, duration?: number) {
            return this.add({
                type: 'warning',
                title,
                message,
                duration
            })
        },

        info(title: string, message: string, duration?: number) {
            return this.add({
                type: 'info',
                title,
                message,
                duration
            })
        }
    }
})
