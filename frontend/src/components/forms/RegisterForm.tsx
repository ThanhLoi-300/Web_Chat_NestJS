import { Button, InputContainer, InputField, InputLabel } from '../../utils/styles'
import styles from './index.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { ChangeEvent, useState } from 'react'
import { postRegisterUser } from '../../utils/api'
import { toast } from 'react-toastify'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState({
        password: false, confirmPassword: false
    });
    const init = {
        email: '', name: '', password: '', confirmPassword: ''
    }
    const [info, setInfo] = useState(init)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInfo({
            ...info, [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { confirmPassword, ...register } = info
        if (confirmPassword === register.password) {
            console.log(register)
            try {
                await postRegisterUser(register);
                navigate('/login');
                toast.success("Account is created successfully")
            } catch (err: any) {
                toast.error(err.response.data.message)
            }
        } else {
            toast.error("Password and ConfirmPassword have to same")
        }
        
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <InputContainer>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <InputField type="email" id='email' name='email' value={info.email} required onChange={onChange} />
            </InputContainer>
            <InputContainer>
                <InputLabel htmlFor='name'>Name</InputLabel>
                <InputField type="text" id='name' name='name' value={info.name} required onChange={onChange} />
            </InputContainer>
            <InputContainer>
                <InputLabel htmlFor='password'>Password</InputLabel>
                <div className={styles.passwordContainer}>
                    <InputField type={showPassword.password ? 'text' : 'password'} id='password' name='password' value={info.password} required onChange={onChange} />
                    {showPassword.password ? (
                        <AiFillEyeInvisible
                            size={24}
                            onClick={() => setShowPassword({
                                ...showPassword, password: false
                            })}
                            cursor="pointer"
                        />
                    ) : (
                        <AiFillEye
                            size={24}
                            onClick={() => setShowPassword({
                                ...showPassword, password: true
                            })}
                            cursor="pointer"
                        />
                    )}
                </div>
            </InputContainer>
            <InputContainer>
                <InputLabel htmlFor='password'>Confirm Password</InputLabel>
                <div className={styles.passwordContainer}>
                    <InputField type={showPassword.confirmPassword ? 'text' : 'password'} id='confirmPassword' name='confirmPassword' value={info.confirmPassword} required onChange={onChange} />
                    {showPassword.confirmPassword ? (
                        <AiFillEyeInvisible
                            size={24}
                            onClick={() => setShowPassword({
                                ...showPassword, confirmPassword: false
                            })}
                            cursor="pointer"
                        />
                    ) : (
                        <AiFillEye
                            size={24}
                            onClick={() => setShowPassword({
                                ...showPassword, confirmPassword: true
                            })}
                            cursor="pointer"
                        />
                    )}
                </div>
            </InputContainer>
            <Button type="submit" className={styles.button}>Create My Account</Button>
            <div className={styles.footerText}>
                <span>Already have an account? </span>
                <Link to="/login"><span>Login</span></Link>
            </div>
        </form>
    )
}

export default RegisterForm
