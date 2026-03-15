import { defineStore } from 'pinia'
import type { Workout } from '@/types'
import workoutsData from '@/data/workouts.json'
import demoPosts from '@/data/posts.json'

const STORAGE_KEY = 'wspp_posts_v1'

function loadPosts(): Workout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const stored = raw ? JSON.parse(raw) as Workout[] : []
    const demo = demoPosts as Workout[]
    // merge stored posts and demo posts, prefer stored on id collisions
    const map = new Map<number, Workout>()
    for (const p of stored) map.set(p.id, p)
    for (const p of demo) if (!map.has(p.id)) map.set(p.id, p)
    // return sorted by date descending
    return Array.from(map.values()).slice().sort((a,b) => +new Date(b.date) - +new Date(a.date))
  } catch (e) {
    return []
  }
}

function savePosts(posts: Workout[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)) } catch { }
}

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: loadPosts() as Workout[],
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
    addPost(payload: Omit<Workout,'id'> & { workoutId?: number }) {
      const id = Date.now()
      // if workoutId provided, try to set title and picture from workouts.json
      let title = payload.title
      let picture = (payload as any).picture
      if ((payload as any).workoutId) {
        const w = (workoutsData as any[]).find(x => x.id === (payload as any).workoutId)
        if (w) {
          title = w.name
          picture = w.photo
        }
      }

      const newPost: Workout = { id, ...payload, title: title as string, picture }
      this.posts.unshift(newPost)
      savePosts(this.posts)
      return newPost
    },
    updatePost(id: number, patch: Partial<Workout>) {
      const idx = this.posts.findIndex(p => p.id === id)
      if (idx === -1) return null
      this.posts[idx] = { ...this.posts[idx], ...patch }
      savePosts(this.posts)
      return this.posts[idx]
    },
    removePost(id: number) {
      const idx = this.posts.findIndex(p => p.id === id)
      if (idx === -1) return false
      this.posts.splice(idx, 1)
      savePosts(this.posts)
      return true
    },
    load() {
      this.posts = loadPosts()
    },
    clear() {
      this.posts = []
      savePosts(this.posts)
    }
  }
})
