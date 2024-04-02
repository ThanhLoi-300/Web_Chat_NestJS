import React, { ChangeEvent, useState } from 'react'
import { Button, InputContainer, InputField, InputLabel } from '../../utils/styles'
import styles from './index.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { postLoginUser } from '../../utils/api'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const init = {
        email: '', password: ''
    }
    const [info, setInfo] = useState(init)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInfo({
            ...info, [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await postLoginUser(info);
            localStorage.setItem('accessToken', response.data.access_token);
            navigate('/conversations');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <InputContainer>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <InputField type="email" id='email' name='email' value={info.email} required onChange={onChange} />
            </InputContainer>
            <InputContainer>
                <InputLabel htmlFor='password'>Password</InputLabel>
                <div className={styles.passwordContainer}>
                    <InputField type={showPassword ? 'text' : 'password'} id='password' name='password' value={info.password} required onChange={onChange} />
                    {showPassword ? (
                        <AiFillEyeInvisible
                            size={24}
                            onClick={() => setShowPassword(false)}
                            cursor="pointer"
                        />
                    ) : (
                        <AiFillEye
                            size={24}
                            onClick={() => setShowPassword(true)}
                            cursor="pointer"
                        />
                    )}
                </div>
            </InputContainer>
            <Button className={styles.button}>Login</Button>
            <div className={styles.footerText}>
                <span>Don't have an account? </span>
                <Link to="/register"><span>Register</span></Link>
            </div>
        </form>
    )
}

export default LoginForm
