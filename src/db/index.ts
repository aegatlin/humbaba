import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

type ListRow = {
  id: number,
  name: string
}

export const db = {
  query: (text: string, params, callback) => {
    return pool.query(text, params, callback)
  },
  getAllLists: async () => {
    const { rows } = await pool.query<ListRow>('SELECT * FROM list;')
    return rows
  },
  writeNewList: async (name) => {
    const res = await pool.query<ListRow>('INSERT INTO list (name) VALUES ($1)', [name])
    return res.rows
  }
}
