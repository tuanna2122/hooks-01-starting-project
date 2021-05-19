import React, { useState } from 'react';

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => { }
});

const AuthContextProvider = props => {
    const [isAuthenticated, setAuthenticated] = useState(false);

    const loginHandler = () => {
        setAuthenticated(true);
    };

    return (
        <AuthContext.Provider
            value={{ isAuth: isAuthenticated, login: loginHandler }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;