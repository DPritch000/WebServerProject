import { defineStore } from 'pinia'
import type { Workout } from '@/types'
import workoutsData from '@/data/workouts.json'

const STORAGE_KEY = 'wspp_posts_v1'

function loadPosts(): Workout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Workout[]
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
    load() {
      this.posts = loadPosts()
    },
    clear() {
      this.posts = []
      savePosts(this.posts)
    }
  }
})
