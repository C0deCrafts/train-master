import React from 'react';
import {FlatList} from "react-native";
import ChatItem from "./ChatItem";
import {useRouter} from "expo-router";

const ChatList = ({users, currentUser, isChatGroup = false, chatGroups}) => {
    const router = useRouter();

    return (
       <>
           {isChatGroup ? (
                   <FlatList data={chatGroups}
                             keyExtractor={(item, index) => index.toString()}
                             numColumns={1}
                             showsVerticalScrollIndicator={false}
                             renderItem={({item, index})=> (
                                 <ChatItem item={item}
                                           index={index}
                                           isGroup={true}
                                           router={router}
                                           key={index}
                                 />
                             )}
                   />
           ) : (
                   <FlatList
                       data={users}
                       renderItem={({item, index}) => <ChatItem
                           noBorder={index+1 === users.length}
                           router={router}
                           item={item}
                           key={index}
                           currentUser={currentUser}
                       />}
                       keyExtractor={(item, index) => index.toString()}
                       showsVerticalScrollIndicator={false}
                   />
           )}
       </>
    );
};

export default ChatList;