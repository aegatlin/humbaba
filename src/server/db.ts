import { eor } from 'eor'
import pg from 'pg'
import {
  Kind,
  ListItem,
  ListItemDb,
  ListItemNoId,
  ListMeta,
  ListMetaDb,
  ListMetaNoId
} from '../types.js'
import { dbTransform } from './dbTransform.js'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export const db = {
  query: async <T>(sql: string, params?: any[]): Promise<pg.QueryResult<T>> => {
    console.log(`Running db query: ${sql}; with query params: ${params}`)
    return await pool.query<T>(sql, params)
  },
  lists: {
    all: async (): Promise<ListMeta[]> => {
      const [e, result] = await eor(
        db.query<ListMetaDb>('SELECT * FROM lists;')
      )
      if (!result) throw e
      return dbTransform(result.rows, { from: Kind.ListMetaDb })
    },
    create: async ({ name }: ListMetaNoId): Promise<void> => {
      const [e, result] = await eor(
        db.query<ListMetaDb>('INSERT INTO lists (name) VALUES ($1)', [name])
      )
      if (!result) throw e
    },
    read: async (id: number): Promise<ListMeta> => {
      const [e, result] = await eor(
        db.query<ListMetaDb>('SELECT * FROM lists WHERE id=$1', [id])
      )
      if (!result) throw e
      return dbTransform(result.rows[0], { from: Kind.ListMetaDb })
    },
    delete: async (id: number): Promise<void> => {
      const [e, result] = await eor(
        db.query<ListMetaDb>('DELETE FROM lists WHERE id=$1', [id])
      )
      if (!result) throw e
    }
  },
  listItems: {
    allForList: async (listId: number): Promise<ListItem[]> => {
      const [e, result] = await eor(
        db.query<ListItemDb>(
          'SELECT * FROM list_items WHERE list_id=$1 ORDER BY id',
          [listId]
        )
      )
      if (!result) throw e
      return dbTransform(result.rows, { from: Kind.ListItemDb })
    },
    create: async ({ listId, content }: ListItemNoId): Promise<void> => {
      const [e, result] = await eor(
        db.query<ListItemDb>(
          'INSERT INTO list_items (list_id, content) VALUES ($1, $2)',
          [listId, content]
        )
      )
      if (!result) throw e
    },
    update: async ({ id, listId, content }: ListItem): Promise<void> => {
      const [e, result] = await eor(
        db.query<ListItemDb>(
          'UPDATE list_items SET content=$1 WHERE id=$2 AND list_id=$3',
          [content, id, listId]
        )
      )
      if (!result) throw e
    },
    delete: async (id: number, listId: number): Promise<void> => {
      const [e, result] = await eor(
        db.query<ListItemDb>(
          'DELETE FROM list_items WHERE id=$1 AND list_id=$2',
          [id, listId]
        )
      )
      if (!result) throw e
    }
  }
}
