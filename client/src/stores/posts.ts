import { defineStore } from 'pinia'
import type { Workout } from '@/types'

type ApiPost = {
  id: number
  title: string
  description: string | null
  author_id: number
  author_username?: string
  author_profile_picture?: string | null
  duration_minutes: number
  distance_km: number | null
  date: string
  picture: string | null
}

function fromApi(post: ApiPost): Workout {
  return {
    id: post.id,
    userId: post.author_id,
    authorUsername: post.author_username,
    authorProfilePicture: post.author_profile_picture ?? undefined,
    title: post.title,
    description: post.description ?? undefined,
    durationMinutes: post.duration_minutes,
    distanceKm: post.distance_km ?? undefined,
    date: post.date,
    picture: post.picture ?? undefined,
  }
}

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Workout[],
    loading: false,
  }),
  getters: {
    postsByUser: (state) => {
      return (userId: number) => state.posts
        .filter(p => p.userId === userId)
        .slice()
        .sort((a,b) => +new Date(b.date) - +new Date(a.date))
    },
    postsForUserAndFriends: (state) => {
      return (userId: number, friendIds: number[]) => state.posts
        .filter(p => p.userId === userId || friendIds.includes(p.userId))
        .slice()
        .sort((a,b) => +new Date(b.date) - +new Date(a.date))
    }
  },
  actions: {
    async fetchFeed(userId: number) {
      this.loading = true
      try {
        const res = await fetch(`/api/posts/feed/${userId}`)
        if (!res.ok) throw new Error('Failed to fetch feed')
        const data = await res.json() as ApiPost[]
        this.posts = data.map(fromApi)
      } finally {
        this.loading = false
      }
    },

    async fetchByUser(userId: number, viewerId: number) {
      this.loading = true
      try {
        const res = await fetch(`/api/posts/user/${userId}?viewerId=${viewerId}`)
        if (!res.ok) throw new Error('Failed to fetch user posts')
        const data = await res.json() as ApiPost[]
        this.posts = data.map(fromApi)
      } finally {
        this.loading = false
      }
    },

    async addPost(payload: {
      userId: number
      title: string
      description?: string
      durationMinutes: number
      distanceKm?: number
      date: string
      picture?: string
    }) {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: payload.userId,
          title: payload.title,
          description: payload.description,
          durationMinutes: payload.durationMinutes,
          distanceKm: payload.distanceKm,
          date: payload.date,
          picture: payload.picture,
        }),
      })

      if (!res.ok) throw new Error('Failed to create post')

      const created = fromApi(await res.json() as ApiPost)
      this.posts.unshift(created)
      return created
    },

    async updatePost(id: number, patch: Partial<Workout>) {
      const body: any = {
        title: patch.title,
        description: patch.description,
        duration_minutes: patch.durationMinutes,
        distance_km: patch.distanceKm,
        date: patch.date,
        picture: patch.picture,
      }

      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to update post')

      const updated = fromApi(await res.json() as ApiPost)
      const idx = this.posts.findIndex(p => p.id === id)
      if (idx !== -1) this.posts[idx] = updated
      return updated
    },

    async removePost(id: number) {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 404) throw new Error('Failed to delete post')

      const idx = this.posts.findIndex(p => p.id === id)
      if (idx === -1) return false
      this.posts.splice(idx, 1)
      return true
    },

    load() {
      return
    },

    clear() {
      this.posts = []
    }
  }
})
