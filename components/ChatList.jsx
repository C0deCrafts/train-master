import React, {useEffect} from 'react';
import {FlatList} from "react-native";
import ChatItem from "./ChatItem";
import {useRouter} from "expo-router";
import AppleStyleSwipeableRow from "./SwipeableRow";
import SwipeableRow from "./SwipeableRow";

const ChatList = ({users, currentUser, isChatGroup = false, chatGroups}) => {
    const router = useRouter();

    useEffect(() => {
        console.log("CurrentUSER: ", currentUser)
        console.log("Users: ", users)
    }, [currentUser, users]);

    return (
       <>
           {isChatGroup ? (
                           <FlatList data={chatGroups}
                                     keyExtractor={(item, index) => index.toString()}
                                     numColumns={1}
                                     showsVerticalScrollIndicator={false}
                                     bounces={false}
                                     renderItem={({item, index})=> (
                                         <ChatItem item={item}
                                                   index={index}
                                                   isGroup={true}
                                                   router={router}
                                                   key={index}
                                                   currentUser={currentUser}
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
                              bounces={false}
                          />
           )}
       </>
    );
};

export default ChatList;