import { defineStore } from 'pinia'
import type { Comment } from '@/types'

type ApiComment = {
  id: number
  post_id: number
  author_id: number
  author_username?: string
  author_profile_picture?: string | null
  content: string
  created_at: string
}

function fromApi(c: ApiComment): Comment {
  return {
    id: c.id,
    postId: c.post_id,
    authorId: c.author_id,
    authorUsername: c.author_username,
    authorProfilePicture: c.author_profile_picture ?? undefined,
    content: c.content,
    createdAt: c.created_at,
  }
}

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    commentsByPost: {} as Record<number, Comment[]>,
  }),
  actions: {
    async fetchComments(postId: number, viewerId: number) {
      const res = await fetch(`/api/comments/post/${postId}?viewerId=${viewerId}`)
      if (!res.ok) {
        if (res.status === 403) {
          this.commentsByPost[postId] = []
          return
        }
        throw new Error('Failed to fetch comments')
      }

      const data = await res.json() as ApiComment[]
      this.commentsByPost[postId] = data.map(fromApi)
    },

    async addComment(postId: number, authorId: number, content: string) {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, authorId, content }),
      })

      if (!res.ok) {
        const body = await res.text()
        throw new Error(body || 'Failed to add comment')
      }

      const created = fromApi(await res.json() as ApiComment)
      const current = this.commentsByPost[postId] ?? []
      this.commentsByPost[postId] = [...current, created]
      return created
    },
  },
})
