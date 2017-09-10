

const signin = (state = 'reactjs', action) => {
  switch (action.type) {
    case 'signin':
      return action.reddit
    default:
      return state
  }
}

export default signin
