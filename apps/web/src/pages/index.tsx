import { socket } from '@/libs/socket';
import { Avatar, Button, Flex, Form, Input, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { MessageData, NextCursor, ReplyType } from './type';

const MessageComponent = ({ item, handleReply = () => {}, deep = 0 }: any) => {
  const sender = item?.sender[0];
  const date = new Date(item?.createdAt);
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: deep * 20 + 'px',
            border: '1px solid black',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Avatar>{sender.username}</Avatar>
            <p>{sender.username}</p>
            <p>{date.toLocaleString()}</p>
            <p>{sender.email}</p>
            <Button
              onClick={() =>
                handleReply({
                  rootId: item?.rootId,
                  parentId: item?._id,
                  username: sender.username,
                  message: item?.message,
                })
              }
            >
              Reply
            </Button>
          </div>
          <p>{item?.message}</p>
        </div>
      </div>
      {item?.children.length > 0 &&
        item?.children.map((child: MessageData, key: number) => (
          <MessageComponent
            item={child}
            key={key}
            handleReply={handleReply}
            deep={deep + 1}
          />
        ))}
    </div>
  );
};

export default function App() {
  const [api, contextHolder] = notification.useNotification();

  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [messagesData, setMessagesData] = useState<MessageData[]>([]);
  const [replyData, setReplyData] = useState<ReplyType | null>(null);
  const [message, setMessage] = useState('');
  const [nextCursor, setNextCursor] = useState<NextCursor | null>(null);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    history.push('/auth');
  };

  // Function to update the map with new data
  const updateMapWithData = (
    data: MessageData[],
    map: { [keyof: string]: any },
  ) => {
    data.forEach((item) => {
      // Ensure every item has a children array initialized
      if (!map[item._id]) {
        map[item._id] = { ...item, children: [] };
      } else {
        map[item._id] = { ...map[item._id], ...item };
      }

      if (item.parentId) {
        // Initialize the parent item if not already initialized
        if (!map[item.parentId]) {
          map[item.parentId] = { id: item.parentId, children: [] };
        }

        // Push the current item into its parent's children array
        map[item.parentId].children.push(map[item._id]);
      }
    });
  };

  const handleReply = ({ rootId, parentId, username, message }: ReplyType) => {
    setReplyData({ rootId, parentId, username, message });
  };

  const handleSendMessage = () => {
    socket.emit('message', {
      message: message,
      rootId: replyData?.rootId,
      parentId: replyData?.parentId,
    });
    window.location.reload();
  };
  const handlePaginateMessage = () => {
    socket.emit('pagination', nextCursor);
  };

  const handleData = (data: MessageData[]) => {
    const currData: MessageData[] = [...messagesData];
    data?.forEach((item) => {
      const newItem = { ...item, children: [] };
      if (item.parentId === null) {
        currData.push(newItem);
      } else {
        const root = currData.find((i) => i._id === newItem.rootId);
        if (!root) {
          return;
        }
        checkParentData(root, newItem);
      }
    });
    return currData;
  };
  const handleUpdateData = (value: {
    data: MessageData[];
    nextCursor: NextCursor;
  }) => {
    const { data, nextCursor } = value;
    const currData = handleData(data);
    setMessagesData([...currData]);
    setNextCursor(nextCursor);
  };

  const checkParentData = (data: MessageData, curr: MessageData) => {
    if (data._id === curr.parentId) {
      data.children.push(curr);
      return;
    } else {
      data.children.forEach((item) => checkParentData(item, curr));
    }
  };

  function onMessageEvent(value: {
    data: MessageData[];
    nextCursor: NextCursor;
  }) {
    // Create a map to store the data indexed by id.
    const map: { [keyof: string]: any } = {};
    updateMapWithData(value.data, map);

    // Extract the results that have no parents to form the roots of trees
    const result: MessageData[] = Object.values(map).filter(
      (item) => item.parentId === null,
    );
    setMessagesData(result);
    setNextCursor(value.nextCursor);
  }

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      history.push('/auth');
      return;
    }
    setUsername(sessionStorage.getItem('username') ?? '');
    function onConnect() {
      setIsConnected(true);
    }

    socket.on('connect', () => {
      console.log('connected');
      onConnect();
    });
    socket.on('disconnect', async (err) => {
      api.error({ message: err, onClose: () => history.push('/auth') });
    });

    socket.on('message', (data) => {
      onMessageEvent(data);
    });

    socket.on('error', (err) => {
      api.error({ message: err });
    });

    socket.on('new-message', (data) => {
      const newData = handleData(data);
      setMessagesData(newData);
    });
    socket.on('pagination', (data) => {
      handleUpdateData(data);
    });
  }, [messagesData, onMessageEvent, api, history]);

  return (
    <div>
      {contextHolder}
      <div
        style={{
          height: '5vh',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, textAlign: 'center' }}>Chat Room</div>
        <p>Username: {username}</p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <div
        style={{
          height: '70vh',
          overflowY: 'scroll',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {messagesData?.map((item, key) => (
          <MessageComponent item={item} key={key} handleReply={handleReply} />
        ))}
        <Flex justify="center" align="center">
          {nextCursor && (
            <Button
              style={{ textAlign: 'center' }}
              onClick={handlePaginateMessage}
            >
              Loading more...
            </Button>
          )}
        </Flex>
      </div>
      <div style={{ height: '10vh' }}>
        {replyData && (
          <div
            style={{
              border: '1px solid gray',
              borderRadius: 'rounded',
              display: 'flex',
            }}
          >
            <div style={{ flex: 1 }}>
              <p>{replyData?.username}</p>
              <p>{replyData?.message}</p>
            </div>
            <Button onClick={() => setReplyData(null)}>x</Button>
          </div>
        )}
        <Form
          onSubmitCapture={handleSendMessage}
          style={{ display: 'flex', gap: 10 }}
        >
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={handleSendMessage}>Submit</Button>
        </Form>
      </div>
    </div>
  );
}
