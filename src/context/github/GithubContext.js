import { createContext, useReducer } from 'react'
import GithubReducer from './GithubReducer'

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
// const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    isLoading: false,
  }

  const [state, dispatch] = useReducer(GithubReducer, initialState)

  // Get user search results
  const searchUsers = async (text) => {
    setLoading()

    const params = new URLSearchParams({
      q: text,
    })

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`)

    const { items } = await response.json()

    dispatch({
      type: 'GET_USERS',
      payload: items,
    })
  }

  // Get single user
  const getUser = async (login) => {
    setLoading()

    const response = await fetch(`${GITHUB_URL}/users/${login}`)

    if (response.status === 404) {
      window.location = '/notfound'
    } else {
      const data = await response.json()

      dispatch({
        type: 'GET_USER',
        payload: data,
      })
    }
  }

  // Get a single user's repos
  const getUserRepos = async (login) => {
    setLoading()

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10,
    })

    const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`)

    const data = await response.json()

    dispatch({
      type: 'GET_USER_REPOS',
      payload: data,
    })
  }

  // Clears user search results
  const clearUsers = () => {
    dispatch({
      type: 'CLEAR_USERS',
    })
  }

  // Set isLoading to be true
  const setLoading = () => {
    dispatch({
      type: 'SET_LOADING',
    })
  }

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        isLoading: state.isLoading,
        searchUsers,
        getUserRepos,
        clearUsers,
        getUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
