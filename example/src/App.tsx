import { useEffect, useMemo, useState } from 'react'
import './App.css'

interface User {
  id: number
  name: string
  email: string
}

// Test component for source navigation
const TestComponent = ({ title }: { title: string }) => {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}

function UserCard({ user, onUpdate }: { user: User, onUpdate: (user: User) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user.name)

  const displayName = useMemo(() => {
    return isEditing ? editName : user.name
  }, [isEditing, editName, user.name])

  const handleSave = () => {
    onUpdate({ ...user, name: editName })
    setIsEditing(false)
  }

  return (
    <div className="user-card">
      <h3>{displayName}</h3>
      <p>{user.email}</p>
      {isEditing
        ? (
            <div>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Enter name"
              />
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )
        : (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
    </div>
  )
}

function UserList() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ])

  const [filter, setFilter] = useState('')

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase())
      || user.email.toLowerCase().includes(filter.toLowerCase()),
    )
  }, [users, filter])

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user =>
      user.id === updatedUser.id ? updatedUser : user,
    ))
  }

  const addRandomUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: `User ${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
    }
    setUsers(prev => [...prev, newUser])
  }

  return (
    <div className="user-list">
      <div className="controls">
        <input
          type="text"
          placeholder="Filter users..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button onClick={addRandomUser}>Add User</button>
      </div>

      <div className="users">
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onUpdate={handleUpdateUser}
          />
        ))}
      </div>
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])

  const increment = () => setCount(prev => prev + step)
  const decrement = () => setCount(prev => prev - step)
  const reset = () => setCount(0)

  return (
    <div className="counter">
      <h2>
        Counter:
        {count}
      </h2>
      <div className="counter-controls">
        <button onClick={decrement}>
          -
          {step}
        </button>
        <button onClick={increment}>
          +
          {step}
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      <div>
        <label>
          Step:
          <input
            type="number"
            value={step}
            onChange={e => setStep(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<'counter' | 'users'>('counter')

  return (
    <div className="app">
      <header className="app-header">
        <h1>React DevTools Example</h1>
        <p>
          This is a demo app to showcase the React DevTools plugin.
          Click the ⚛️ button in the top-right corner to open DevTools!
        </p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'counter' ? 'active' : ''}
          onClick={() => setActiveTab('counter')}
        >
          Counter
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'counter' && <Counter />}
        {activeTab === 'users' && <UserList />}
      </main>

      <footer className="app-footer">
        <p>Try inspecting the components above with React DevTools!</p>
        <p>Click the 📝 button next to components to open their source code!</p>
      </footer>

      {/* Test components for source navigation */}
      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h2>Test Components (for source navigation)</h2>
        <TestComponent title="Test Component 1" />
        <TestComponent title="Test Component 2" />
      </div>
    </div>
  )
}

export default App
