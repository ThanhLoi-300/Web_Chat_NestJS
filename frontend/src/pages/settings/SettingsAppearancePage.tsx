import { useDispatch } from 'react-redux';
import { setTheme } from '../../store/settings/settingsSlice';
import { Page } from '../../utils/styles';
import { SelectableTheme } from '../../utils/types';
import { useState } from 'react';

export const SettingsAppearancePage = () => {
    const dispatch = useDispatch();
    const [dark, setDark] = useState(localStorage.getItem('theme'))

    const handleThemeChange = (theme: SelectableTheme) => {
        dispatch(setTheme(theme));
        localStorage.setItem('theme', theme);
        setDark(theme)
    };

    return (
        <Page>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}>
                <span>Theme</span>
                <form>
                    <input
                        type="radio"
                        id="dark"
                        name="theme"
                        checked={dark == 'dark'}
                        onChange={() => handleThemeChange('dark')}
                    />
                    <label htmlFor="dark">Dark</label>
                    <input
                        type="radio"
                        id="light"
                        name="theme"
                        checked={dark == 'light'}
                        onChange={() => handleThemeChange('light')}
                    />
                    <label htmlFor="light">Light</label>
                </form>
            </div>
        </Page>
    );
};