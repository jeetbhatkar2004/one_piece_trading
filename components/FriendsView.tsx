'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { UserPlus, Check, X, Users } from 'lucide-react'
import { useState } from 'react'

interface Friend {
  id: string
  user: {
    id: string
    username: string
  }
  isSender: boolean
}

interface PendingRequest {
  id: string
  user: {
    id: string
    username: string
  }
}

interface FriendsData {
  friends: Friend[]
  pendingSent: PendingRequest[]
  pendingReceived: PendingRequest[]
}

export function FriendsView() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [searchUsername, setSearchUsername] = useState('')

  const { data: friendsData, isLoading } = useQuery<FriendsData>({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await fetch('/api/friends')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: !!session,
    refetchInterval: 10000,
  })

  const sendRequestMutation = useMutation({
    mutationFn: async (username: string) => {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send request')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      setSearchUsername('')
    },
  })

  const respondRequestMutation = useMutation({
    mutationFn: async ({ requestId, accept }: { requestId: string; accept: boolean }) => {
      const res = await fetch('/api/friends/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, accept }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to respond')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
  })

  if (!session) {
    return (
      <div className="bg-white border-2 border-black/20 rounded-lg p-8 text-center shadow-sm">
        <p className="text-black/60 mb-4 font-mono">Please login to view friends</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-black/60">
        <div className="animate-pulse font-mono">Loading friends...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Add Friend Section */}
      <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
        <h2 className="text-3xl text-black mb-4">ADD FRIEND</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Enter username"
            className="flex-1 px-4 py-3 bg-white border-2 border-black/20 rounded text-black font-mono placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-op-red focus:border-op-red"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchUsername) {
                sendRequestMutation.mutate(searchUsername)
              }
            }}
          />
          <motion.button
            onClick={() => searchUsername && sendRequestMutation.mutate(searchUsername)}
            disabled={!searchUsername || sendRequestMutation.isPending}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-op-red hover:bg-op-orange text-white px-6 py-3 rounded font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Send
          </motion.button>
        </div>
        {sendRequestMutation.isError && (
          <p className="mt-2 text-sm text-op-red font-mono">
            {sendRequestMutation.error.message}
          </p>
        )}
      </div>

      {/* Pending Received Requests */}
      {friendsData?.pendingReceived && friendsData.pendingReceived.length > 0 && (
        <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
          <h2 className="text-3xl text-black mb-4">PENDING REQUESTS</h2>
          <div className="space-y-3">
            {friendsData.pendingReceived.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-black/5 rounded border border-black/10"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-black/60" />
                  <span className="font-mono text-black font-medium">@{request.user.username}</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => respondRequestMutation.mutate({ requestId: request.id, accept: true })}
                    disabled={respondRequestMutation.isPending}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-op-yellow hover:bg-op-orange text-black px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </motion.button>
                  <motion.button
                    onClick={() => respondRequestMutation.mutate({ requestId: request.id, accept: false })}
                    disabled={respondRequestMutation.isPending}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white border-2 border-black/20 hover:border-op-red text-black px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
        <h2 className="text-3xl text-black mb-4">FRIENDS ({friendsData?.friends.length || 0})</h2>
        {friendsData?.friends && friendsData.friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {friendsData.friends.map((friend) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center justify-between p-4 bg-black/5 rounded border border-black/10 hover:border-op-red/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-op-red/20 border-2 border-op-red/50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-op-red" />
                  </div>
                  <span className="font-mono text-black font-medium">@{friend.user.username}</span>
                </div>
                <span className="text-xs font-mono text-black/40 uppercase">Friend</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-black/60">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-mono">No friends yet. Add some friends to see their trades!</p>
          </div>
        )}
      </div>

      {/* Pending Sent Requests */}
      {friendsData?.pendingSent && friendsData.pendingSent.length > 0 && (
        <div className="bg-white border-2 border-black/20 rounded-lg p-6 shadow-sm">
          <h2 className="text-3xl text-black mb-4">SENT REQUESTS</h2>
          <div className="space-y-3">
            {friendsData.pendingSent.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-black/5 rounded border border-black/10"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-black/60" />
                  <span className="font-mono text-black font-medium">@{request.user.username}</span>
                </div>
                <span className="text-xs font-mono text-black/40 uppercase">Pending</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
