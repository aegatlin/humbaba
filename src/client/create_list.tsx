import React, { useEffect, useState } from 'react'
import { mutate } from 'swr'

export const CreateList = () => {
  const [name, setName] = useState("")

  const handleChange = (event) => {
    setName(event.target.value)
  }

  const submitHandler = () => {
    const writeNewList = async () => {
      await fetch('api/list/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { list: { name } } })
      })

      mutate('/api/list')
    }

    writeNewList()
  }

  return (
    <div>
      <div>Create a list:</div>
      <input type="text" value={name} onChange={handleChange} />
      <button onClick={submitHandler}>Submit</button>
    </div>
  )
}