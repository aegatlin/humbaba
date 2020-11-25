import pg from 'pg'
import { List, ListItem } from '../types'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

type ListRow = {
  id: number
  name: string
}

type ListItemRow = {
  id: number
  content: string
  listId: number
}

export const db = {
  query: (text: string, params, callback) => {
    return pool.query(text, params, callback)
  },
  list: {
    all: async () => {
      const { rows } = await pool.query<ListRow>('SELECT * FROM list;')
      return rows
    },
    create: async (name: string) => {
      const res = await pool.query<ListRow>(
        'INSERT INTO list (name) VALUES ($1)',
        [name]
      )
      return res.rows
    },
    delete: async (id: number) => {
      await pool.query<ListRow>('DELETE FROM list WHERE id=$1;', [id])
    }
  },
  listItem: {
    all: async ({ id }: List) => {
      const res = await pool.query('SELECT * FROM list_item WHERE list_id=$1', [id])
      return res.rows
    },
    create: async (content: string, listId: number) => {
      const res = await pool.query<ListItemRow>(
        'INSERT INTO list_item (content, list_id) VALUES ($1, $2);',
        [content, listId]
      )
      return res.rows
    },
    update: async ({ id, content }: ListItem) => {
      const res = await pool.query<ListItemRow>(
        'UPDATE list_item SET content = $1 WHERE id=$2;',
        [content, id]
      )
    },
    delete: async (id: number) => {
      await pool.query<ListItemRow>('DELETE FROM list_item WHERE id=$1;', [id])
    }
  }
}
