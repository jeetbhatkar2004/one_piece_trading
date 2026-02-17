'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Send } from 'lucide-react'

interface Post {
  id: string
  username: string
  content: string
  likesCount: number
  isLiked: boolean
  createdAt: string
}

export function SocialFeed() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [postContent, setPostContent] = useState('')

  const { data, isLoading } = useQuery<{ posts: Post[] }>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 30000,
  })

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create post')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setPostContent('')
    },
  })

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to like post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (postContent.trim() && session) {
      createPostMutation.mutate(postContent.trim())
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      {session && (
        <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
          <h2 className="font-display text-3xl text-black mb-4">SHARE YOUR THOUGHTS</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind? e.g., 'Zoro will defeat Mihawk next chapter! Long Zoro!'"
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-black/40">
                {postContent.length}/500
              </span>
              <motion.button
                type="submit"
                disabled={!postContent.trim() || createPostMutation.isPending}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-op-red hover:bg-op-orange text-white px-6 py-2 rounded font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Post
              </motion.button>
            </div>
            {createPostMutation.isError && (
              <p className="text-sm text-op-red font-mono">
                {createPostMutation.error.message}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Posts Feed */}
      <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
        <h2 className="font-display text-3xl text-black mb-6">GLOBAL FEED</h2>
        {isLoading ? (
          <div className="text-center py-8 text-black/60">
            <div className="animate-pulse font-mono">Loading posts...</div>
          </div>
        ) : !data || data.posts.length === 0 ? (
          <div className="text-center py-8 text-black/60">
            <p className="font-mono">No posts yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-black/5 rounded border border-black/10 hover:border-op-red/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-op-red/20 border-2 border-op-red/50 flex items-center justify-center">
                      <span className="text-xs font-mono text-op-red font-bold">
                        {post.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium text-black">@{post.username}</p>
                      <p className="font-mono text-xs text-black/40">{formatTime(post.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <p className="font-mono text-sm text-black mb-3 whitespace-pre-wrap">{post.content}</p>
                
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => session && likeMutation.mutate(post.id)}
                    disabled={!session || likeMutation.isPending}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-2 px-3 py-1 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                      post.isLiked
                        ? 'bg-op-red/20 text-op-red border-2 border-op-red/50'
                        : 'bg-white border-2 border-black/20 text-black/60 hover:border-op-red/50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-op-red' : ''}`} />
                    {post.likesCount}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
