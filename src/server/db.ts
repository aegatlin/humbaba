import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export const db = {
  query: async <T>(sql: string, params?: any[]) => {
    return await pool.query<T>(sql, params)
  }
}
