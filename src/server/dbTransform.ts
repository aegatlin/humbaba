import { Kind, ListItem, ListItemDb, ListMeta, ListMetaDb } from '../types.js'

type Opts = { from: Kind }

export function dbTransform(i: ListMetaDb, o: Opts): ListMeta
export function dbTransform(i: ListItemDb, o: Opts): ListItem
export function dbTransform(i: ListMetaDb[], o: Opts): ListMeta[]
export function dbTransform(i: ListItemDb[], o: Opts): ListItem[]
export function dbTransform(i: any, o: Opts): any {
  if (Array.isArray(i)) return i.map((e) => dbTransform(e, o))

  switch (o.from) {
    case Kind.ListMetaDb: {
      const { id, name }: ListMetaDb = i as ListMetaDb
      return { id: parseInt(id), name }
    }
    case Kind.ListItemDb: {
      const { id, list_id, content } = i as ListItemDb
      return { id: parseInt(id), listId: parseInt(list_id), content }
    }
    default:
      throw new Error('dbTransform failure')
  }
}
