import React from 'react'
import useSWR, { mutate } from 'swr'
import { Error } from './error'
import { Loading } from './loading'

type List = {
  id: number,
  name: string
}

const useLists = () => {
  const { data, error } = useSWR<List[]>('/api/list')

  if (error) console.log(error)
  return {
    lists: data,
    isLoading: !error && !data,
    isError: error
  }
}

export const Lists = () => {
  const {lists, isLoading, isError} = useLists()

  if (isError) return <Error />
  if (isLoading) return <Loading message="lists are loading..." />
  return (
    <div>
      <p>here's some lists!</p>
      { lists.map((list) => <List key={list.id} list={list} />) }
    </div>
  )
}

const List = ({list}) => {
  const clickHandler = async () => {
    await fetch(`/api/list/${list.id}`, {
      method: 'DELETE'
    })

    mutate('/api/list')
  }

  return (
    <div>
      <div>{list.name}</div>
      <button onClick={clickHandler}>X</button>
    </div>
  )
}