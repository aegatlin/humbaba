export type List = {
  id: number
  name: string
}

export type ListDb = {
  id: string
  name: string
}

export type ListItem = {
  id: number
  listId: number
  content: string
}

export type ListItemDb = {
  id: string
  list_id: string
  content: string
}

export type Payload<T> = {
  data: T 
}