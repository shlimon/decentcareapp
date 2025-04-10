import React from 'react';
import { useAuth } from '../../context/auth';

const Profile = () => {
    const { logout, userData } = useAuth();
    const user = userData?.user;

    const handleLogout = () => {
        logout();
    };

    return (
        <main>
            <div className="profile-box-wrapper !h-auto">
                <h2 className="text-3xl font-bold">Profile</h2>
                <div>
                    <div className="mt-5">
                        <p className="my-2">
                            <span>Name: </span>
                            <span>{user?.name}</span>
                        </p>
                        <p className="my-2">
                            <span>Email: </span>
                            <span>{user?.email}</span>
                        </p>
                    </div>
                    <div>
                        <button
                            className="w-full border-0 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer my-2.5 py-2.5 duration-300"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;
