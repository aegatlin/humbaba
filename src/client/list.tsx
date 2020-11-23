import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Error } from './error'
import { Loading } from './loading'

const listApi = {
  delete: async (id: number) => {
    await fetch(`/api/list/${id}`, { method: 'DELETE' })
    mutate('/api/list')
  }, 
  create: async (name: string) => {
    await fetch('/api/list/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { list: { name } } })
    })
    mutate('/api/list')
  }
}

type List = {
  id: number,
  name: string
}

const useList = () => {
  const { data, error } = useSWR<List[]>('/api/list')

  if (error) console.log(error)
  return {
    lists: data,
    isLoading: !error && !data,
    isError: error
  }
}

export const ListWrapper = () => {
  return (
    <div>
      <CreateList />
      <AllLists />
    </div>
  )
}

const AllLists = () => {
  const {lists, isLoading, isError} = useList()

  if (isError) return <Error />
  if (isLoading) return <Loading message="lists are loading..." />
  return (
    <div>
      { lists.map((list) => <List key={list.id} list={list} />) }
    </div> 
  )
}

const List = ({list}) => {
  return (
    <div>
      <div>{list.name}</div>
      <button onClick={() => listApi.delete(list.id)}>X</button>
    </div>
  )
}

const CreateList = () => {
  const [newListName, setNewListName] = useState("")

  return (
    <div>
      <div>Create a list:</div>
      <input type="test" value={newListName} onChange={(event) => setNewListName(event.target.value)} />
      <button onClick={() => listApi.create(newListName)}>Submit</button>
    </div>
  )
}