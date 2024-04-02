import React from 'react'
import { Page } from '../utils/styles'
import LoginForm from '../components/forms/LoginForm'

const LoginPage = () => {
  return (
    <Page display="flex" justifyContent='center' alignItems='center'>
      <LoginForm />
    </Page>
  )
}

export default LoginPage
