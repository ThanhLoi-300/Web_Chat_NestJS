import { useContext, useEffect, useState } from 'react';
// import { MoonLoader } from 'react-spinners';
import { Edit } from 'akar-icons';
import { UserBanner } from '../../components/settings/profile/UserBanner';
import {
    OverlayStyle, Page,
    EditMessageInputField,
} from '../../utils/styles';
import {
    ProfileEditActionBar,
    ProfileSection,
    SettingsProfileUserDetails,
} from '../../utils/styles/settings';
import { Button } from '../../utils/styles/button';
import { updateToken, updateUserProfile } from '../../utils/api';
import { AuthContext } from '../../utils/context/AuthContext';
import { CDN_URL } from '../../utils/constants';
import { UserAvatar } from '../../components/settings/profile/UserAvatar';
import app, { uploadFile } from '../../utils/uploadFile';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const SettingsProfilePage = () => {
    const { user, updateAuthUser } = useContext(AuthContext);

    const [avatarFile, setAvatarFile] = useState<File>();
    const [avatarSource, setAvatarSource] = useState(
        user?.avatar || ''
    );
    const [avatarSourceCopy, setAvatarSourceCopy] = useState(avatarSource);

    const [bannerSource, setBannerSource] = useState(
        user?.banner || ''
    );
    const [bannerFile, setBannerFile] = useState<File>();
    const [bannerSourceCopy, setBannerSourceCopy] = useState(bannerSource);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [name, setName] = useState(user!.name);

    useEffect(() => {
        console.log('Updating Banner URL');
        console.log(user?.banner);
        setBannerSource(user?.banner || '');
        setBannerSourceCopy(user?.banner || '');
    }, [user?.banner]);

    const isChanged = () => bannerFile || avatarFile || name != user!.name;

    useEffect(() => {
        setIsChange(isChanged() ? true : false);
    }, [bannerFile, avatarFile, name]);

    useEffect(() => {
        if (!isEditing) setName(user!.name);
    }, [isEditing]);

    const reset = () => {
        setIsChange(false)
        setBannerSourceCopy(bannerSource);
        setAvatarSourceCopy(avatarSource);
        setIsEditing(false);
        setAvatarFile(undefined);
        setBannerFile(undefined);
    };

    const save = async () => {
        let bannerLink = '';
        let avatarLink = '';

        if (bannerFile) {
            const link: string = await new Promise((resolve, reject) => {
                const storage = getStorage(app);
                const fileName = new Date().getTime() + bannerFile?.name!;
                const storageRef = ref(storage, `gs://video-8f328.appspot.com/Multi_Vendor_Website/${fileName}`);

                uploadBytes(storageRef, bannerFile!)
                    .then((snapshot) => {
                        getDownloadURL(storageRef)
                            .then((url) => {
                                resolve(url);
                            })
                            .catch((error) => {
                                console.log("Error getting download URL:", error);
                                reject(error);
                            });
                    })
                    .catch((error) => {
                        console.log("Error uploading file:", error);
                        reject(error);
                    });
            });
            bannerLink = link
            console.log(bannerLink);
        }

        if (avatarFile) {
            const link: string = await new Promise((resolve, reject) => {
                const storage = getStorage(app);
                const fileName = new Date().getTime() + avatarFile?.name!;
                const storageRef = ref(storage, `gs://video-8f328.appspot.com/Multi_Vendor_Website/${fileName}`);

                uploadBytes(storageRef, avatarFile!)
                    .then((snapshot) => {
                        getDownloadURL(storageRef)
                            .then((url) => {
                                resolve(url);
                            })
                            .catch((error) => {
                                console.log("Error getting download URL:", error);
                                reject(error);
                            });
                    })
                    .catch((error) => {
                        console.log("Error uploading file:", error);
                        reject(error);
                    });
            });
            avatarLink = link
            console.log(avatarLink);
        }

        // avatarFile && formData.append('avatar', await uploadFile(avatarFile));
        name != user?.name ? name : user?.name;
        try {
            setLoading(true);
            updateToken()
            const { data: updatedUser } = await updateUserProfile(bannerLink, avatarLink, name);
            console.log(updatedUser);
            setBannerFile(undefined);
            setAvatarFile(undefined);
            updateAuthUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <OverlayStyle>
                    {/* <MoonLoader size={40} color="#fff" /> */}
                    Loading
                </OverlayStyle>
            )}
            <Page>
                <UserBanner
                    bannerSource={bannerSource}
                    bannerSourceCopy={bannerSourceCopy}
                    setBannerSourceCopy={setBannerSourceCopy}
                    setBannerFile={setBannerFile}
                />
                <ProfileSection>
                    <SettingsProfileUserDetails>
                        <UserAvatar
                            avatarSource={avatarSource}
                            avatarSourceCopy={avatarSourceCopy}
                            setAvatarSourceCopy={setAvatarSourceCopy}
                            setAvatarFile={setAvatarFile}
                        />
                        <span>@{user?.name} <Edit size={28} onClick={() => setIsEditing(!isEditing)} /></span>
                    </SettingsProfileUserDetails>
                    {
                        isEditing && (<div style={{ width: '50%' }}>
                            <EditMessageInputField
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>)
                    }

                </ProfileSection>
                {isChange && (
                    <ProfileEditActionBar>
                        <div>
                            <span>You have unsaved changes</span>
                        </div>
                        <div className="buttons">
                            <Button
                                size="md"
                                variant="secondary"
                                onClick={reset}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button size="md" onClick={save} disabled={loading}>
                                Save
                            </Button>
                        </div>
                    </ProfileEditActionBar>
                )}
            </Page>
        </>
    );
};