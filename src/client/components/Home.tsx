import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { List, Payload } from '../../types'
import { Error } from './Error'
import { Loading } from './Loading'

const listApi = {
  delete: async (id: number) => {
    await fetch(`/api/lists/${id}`, { method: 'DELETE' })
    mutate('/api/lists')
  },
  create: async (name: string) => {
    await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { list: { name } } })
    })
    mutate('/api/lists')
  }
}

type UseList = {
  isError: boolean
  isLoading: boolean
  lists: List[]
}
const useList = (): UseList => {
  const { data, error } = useSWR<Payload<List[]>>('/api/lists')

  if (error) console.log(error)
  return {
    isError: error,
    isLoading: !error && !data,
    lists: data?.data
  }
}

export const Home = () => {
  return (
    <div>
      <HomeCreateList />
      <HomeLists />
    </div>
  )
}

const HomeLists = () => {
  const { lists, isLoading, isError } = useList()

  if (isError) return <Error />
  if (isLoading) return <Loading message="lists are loading..." />
  return (
    <div>
      {lists.map((list) => (
        <HomeList key={list.id} list={list} />
      ))}
    </div>
  )
}

const HomeList = ({ list }) => {
  return (
    <div>
      <div>{list.name}</div>
      <button onClick={() => listApi.delete(list.id)}>X</button>
    </div>
  )
}

const HomeCreateList = () => {
  const [newListName, setNewListName] = useState('')

  return (
    <div>
      <div>Create a list:</div>
      <input
        type="test"
        value={newListName}
        onChange={(event) => setNewListName(event.target.value)}
      />
      <button onClick={() => listApi.create(newListName)}>Submit</button>
    </div>
  )
}
