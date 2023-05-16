import React, { ReactNode, createContext, useState } from 'react'

interface UserContextProps {
    children: ReactNode
  }
  interface UserInfo {
    userName: string;
    id: string;
  }
  interface UserContextType {
    userInfo: UserInfo;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
    loggedIn:boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  }
export const UserContext = createContext<UserContextType>({
    userInfo: { userName: '', id: '' },
    setUserInfo: () => {},
    loggedIn: false,
    setLoggedIn: ()=>{}
});

export const UserContextProvider  = ({children}:UserContextProps)=>{
    const [userInfo,setUserInfo] = useState<UserInfo>({userName:'',id:''});
    const [loggedIn,setLoggedIn] = useState<boolean>(false);
    return (
        <UserContext.Provider value={{userInfo,setUserInfo,loggedIn,setLoggedIn}}>
            {children}
        </UserContext.Provider>
      )
}