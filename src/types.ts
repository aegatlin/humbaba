export type WithId = { id: number }
export enum Kind {
  ListMetaDb,
  ListItemDb,
}

export type ListMetaDb = {
  id: string
  name: string
}
export type ListMetaNoId = { name: string }
export type ListMeta = ListMetaNoId & WithId

export type List = ListMeta & { items: ListItem[] }

export type ListItemDb = {
  id: string
  list_id: string
  content: string
}
export type ListItemNoId = {
  listId: number
  content: string
}
export type ListItem = ListItemNoId & { id: number }

export type Payload<T> = { data: T }
