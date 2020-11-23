import React from 'react'

const App = () => {
  const lists = [{name: 'one'}, {name: 'two'}]

  return ( 
    <div>
      <h1>Hello, from humbaba</h1>
      <Lists lists={lists} />
    </div>
  )
} 

const Lists = ({lists}) => {
  console.log(lists)
  return (
    <div>
      <p>here's some lists!</p>
      { lists.map(list => <List list={list} />) }
    </div>
  )
}

const List = ({list}) => {
  return (
    <div>{list.name}</div>
  )
}

export default <App />