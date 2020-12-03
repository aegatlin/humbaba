import React, { useState } from 'react'
import useSWR, { mutate, useSWRInfinite } from 'swr'
import { List, Payload } from '../../types'
import { Error } from './Error'
import { Loading } from './Loading'

const listsApi = {
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

type UseLists = {
  isError: boolean
  isLoading: boolean
  lists: List[]
}
const useLists = (): UseLists => {
  const { data, error } = useSWR<Payload<List[]>>('/api/lists')
  if (error) console.log(error)
  return {
    isError: error,
    isLoading: !error && !data,
    lists: data?.data
  }
}

export const Home = () => {
  const [listId, setListId] = useState()

  return (
    <div>
      <CreateList />
      <ListsMetadata setListId={setListId} />
      {listId && <CreateListItem listId={listId} />}
      {listId && <ListDisplay listId={listId} />}
    </div>
  )
}

const useList = (id: number) => {
  const { data, error } = useSWR<Payload<List>>(`/api/lists/${id}`)
  if (error) console.log(error)
  return {
    isError: error,
    isLoading: !error && !data,
    list: data?.data
  }
}

const ListDisplay = ({ listId }) => {
  if (!listId) return null

  const { isError, isLoading, list } = useList(listId)
  if (isError) return <Error />
  if (isLoading) return <Loading message="list is loading..." />
  return (
    <div style={{ border: '1px solid black' }}>
      <div style={{ border: '1px solid black' }}>{list.name}</div>
      <div>
        {list.items.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </div>
    </div>
  )
}

const ListsMetadata = ({ setListId }) => {
  const { lists, isLoading, isError } = useLists()

  if (isError) return <Error />
  if (isLoading) return <Loading message="lists are loading..." />
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {lists.map((list) => (
        <ListMetadata key={list.id} list={list} setListId={setListId} />
      ))}
    </div>
  )
}

type ListMetadataProps = {
  list: List
  setListId: (id: number) => void
}
const ListMetadata = ({ list, setListId }: ListMetadataProps) => {
  return (
    <div
      onClick={() => setListId(list.id)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        border: '1px solid black',
        padding: '5px',
        margin: '5px'
      }}
    >
      <div>{list.name}</div>
      <div
        style={{ margin: '2px', padding: '2px' }}
        onClick={() => listsApi.delete(list.id)}
      >
        X
      </div>
    </div>
  )
}

const listItemApi = {
  create: async ({ content, listId }: { content: string, listId: number}) => {
    await fetch(`/api/lists/${listId}`)
  }
}

const CreateListItem = ({ listId }) => {
  const [newListItemName, setNewListItemName] = useState('')

  return (
    <div>
      <input
        type="text"
        value={newListItemName}
        onChange={(event) => setNewListItemName(event.target.value)}
      />
      <button onClick={() => }>Submit</button>
    </div>
  )
}

const CreateList = () => {
  const [newListName, setNewListName] = useState('')

  return (
    <div>
      <div>Create a list:</div>
      <input
        type="test"
        value={newListName}
        onChange={(event) => setNewListName(event.target.value)}
      />
      <button onClick={() => listsApi.create(newListName)}>Submit</button>
    </div>
  )
}
