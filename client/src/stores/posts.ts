import { defineStore } from 'pinia'
import type { Workout } from '@/types'
import workoutsData from '@/data/workouts.json'
import demoPosts from '@/data/posts.json'

const STORAGE_KEY = 'wspp_posts_v1'


// inline type for workouts.json (no new type file)
const workouts = workoutsData as {
  id: number
  name: string
  photo: string
}[]


function loadPosts(): Workout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    const stored = raw
      ? JSON.parse(raw) as Workout[]
      : []

    const demo = demoPosts as Workout[]

    const map = new Map<number, Workout>()

    for (const p of stored) map.set(p.id, p)
    for (const p of demo)
      if (!map.has(p.id)) map.set(p.id, p)

    return Array
      .from(map.values())
      .slice()
      .sort(
        (a, b) =>
          +new Date(b.date) -
          +new Date(a.date)
      )

  } catch {
    return []
  }
}


function savePosts(posts: Workout[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(posts)
    )
  } catch {}
}


export const usePostsStore = defineStore('posts', {

  state: () => ({
    posts: loadPosts() as Workout[],
  }),


  getters: {

    postsByUser: (state) => {
      return (userId: number) =>
        state.posts
          .filter(p => p.userId === userId)
          .slice()
          .sort(
            (a,b) =>
              +new Date(b.date) -
              +new Date(a.date)
          )
    },


    postsForUserAndFriends: (state) => {
      return (
        userId: number,
        friendIds: number[]
      ) =>
        state.posts
          .filter(
            p =>
              p.userId === userId ||
              friendIds.includes(p.userId)
          )
          .slice()
          .sort(
            (a,b) =>
              +new Date(b.date) -
              +new Date(a.date)
          )
    }

  },


  actions: {

    addPost(
      payload:
      Omit<Workout, 'id' | 'title'>
      & { workoutId?: number; title?: string }
    ) {

      const id = Date.now()

      let title = payload.title ?? ''
      let picture = payload.picture


      if (payload.workoutId) {

        const w = workouts.find(
          x => x.id === payload.workoutId
        )

        if (w) {
          title = w.name
          picture = w.photo
        }
      }


      const newPost: Workout = {
        id,
        ...payload,
        title,
        picture,
      }


      this.posts.unshift(newPost)

      savePosts(this.posts)

      return newPost
    },


    updatePost(
      id: number,
      patch: Partial<Workout>
    ) {

      // don't allow changing the id
      const safePatch = { ...patch }
      if ('id' in safePatch) delete (safePatch as Partial<Workout>).id

      const idx = this.posts.findIndex(p => p.id === id)
      if (idx === -1) return null

      const updated = {
        ...this.posts[idx],
        ...safePatch
      } as Workout

      // use splice to ensure Vue reactivity for array element replacement
      this.posts.splice(idx, 1, updated)

      savePosts(this.posts)

      return updated
    },


    removePost(id: number) {

      const idx =
        this.posts.findIndex(
          p => p.id === id
        )

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
