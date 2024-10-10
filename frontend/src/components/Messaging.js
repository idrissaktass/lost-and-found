import { Box, IconButton, Modal, Typography, List, ListItem, CircularProgress, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery, useTheme } from '@mui/material';

const Messaging = ({ open, onClose, recipient }) => {
    const [messages, setMessages] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState('');
    const [content, setContent] = useState('');
    const [userName, setUserName] = useState(localStorage.getItem("username") || "username");
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [messageCounts, setMessageCounts] = useState(0);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchMessages = async () => {
        setLoadingMessages(true);
        console.log("Fetching messages...");
      
        try {
          const response = await fetch(`https://lost-and-found-backend-red.vercel.app/api/messages/getAllMessages?username=${userName}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include', // Include credentials if needed
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch messages');
          }
      
          const data = await response.json();
          if (data.messages && data.unreadMessages && data.messageCounts) {
            setMessageCount(data.unreadMessages.length);
            console.log("Unread messages count:", data.unreadMessages.length);
            setMessageCounts(data.messageCounts);
          } else {
            console.warn("No messages found or data structure is incorrect.");
            setMessageCount(0);
          }
          setRecipients(data.uniqueRecipients);
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setLoadingMessages(false);
        }
      };
      
    
    useEffect(() => {
        fetchMessages();
        if (recipient !== "") {
            handleRecipientClick(recipient);
        }
    }, [userName, recipient]);

const handleRecipientClick = async (recipient) => {
  if (selectedRecipient === recipient) {
    setSelectedRecipient('');
    setMessages([]);
  } else {
    setSelectedRecipient(recipient);
    setLoadingMessages(true);

    const fetchUrl = `https://lost-and-found-backend-red.vercel.app/api/messages/${userName}/${recipient}`;
    console.log('Fetching messages from:', fetchUrl);

    try {
      const response = await fetch(fetchUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages for recipient: ${recipient}, status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data);

      data.forEach(message => {
        if (!message.read) {
          markMessageAsRead(message._id);
        }
      });

      fetchMessages();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
      if (isSmallScreen) {
        setShowMessages(true); 
      }
    }
  }
};

const markMessageAsRead = async (messageId) => {
    try {
      const response = await fetch(`https://lost-and-found-backend-red.vercel.app/api/messages/read/${messageId}`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include', // Include credentials if needed
      });
  
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
  
      console.log('Message marked as read:', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
      
    
      const sendMessage = async (e) => {
        e.preventDefault();
        setSendingMessage(true); // Start loading spinner
        try {
          const response = await fetch('https://lost-and-found-backend-red.vercel.app/api/messages/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              senderName: userName,
              recipientUsername: selectedRecipient,
              content,
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to send message');
          }
      
          const data = await response.json();
          setMessages((prevMessages) => [...prevMessages, data.message]);
          setContent('');
        } catch (error) {
          console.error('Error sending message:', error);
        } finally {
          setSendingMessage(false); // Stop loading spinner
        }
      };
      

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                height={"80%"}
                overflow={"scroll"}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: "90%", md: "80%", lg: "60%" },
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: "10px",
                    padding: {xs:"10px", sm:"20px"},
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        color: "text.secondary",
                        zIndex: 999,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h5">Messaging {selectedRecipient && `with ${selectedRecipient}`}</Typography>
                <Box display="flex" height="95%">
                    {isSmallScreen ? (
                        showMessages ? (
                            <Box flex={1}>
                                <IconButton onClick={() => setShowMessages(false)}>
                                    <ArrowBackIcon />
                                </IconButton>
                                    <List>
                                        {messages.map((msg) => (
                                            <ListItem key={msg._id} sx={{ backgroundColor: "#ac595921", margin: "2px", display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="body2">
                                                    <strong>{msg.sender.username !== userName ? msg.sender.username : 'You'}: </strong>
                                                    {msg.content}
                                                </Typography>
                                                <Typography textAlign="end" variant="em">
                                                    <em>({new Date(msg.timestamp).toLocaleString()})</em>
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                <form onSubmit={sendMessage}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Type your message"
                                        required
                                    />
                                    <Button type="submit" variant="contained" color="primary" sx={{ marginTop: "10px", marginBottom:"10px", backgroundColor: "#ac5959" }}>
                                      {sendingMessage ? <CircularProgress size={24} /> : 'Send'}
                                    </Button>
                                </form>
                            </Box>
                        ) : (
                            <Box flex={1} paddingRight="10px" overflow="auto">
                                <List>
                                    {recipients.map((recipient) => (
                                        <ListItem
                                            button
                                            key={recipient}
                                            onClick={() => handleRecipientClick(recipient)}
                                            sx={{ cursor:"pointer",
                                                border: "1px solid #ac5959", borderRadius: "5px", marginBottom: "5px",
                                                backgroundColor: selectedRecipient === recipient ? '#ac5959' : 'transparent',
                                                color: selectedRecipient === recipient ? 'white' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: selectedRecipient === recipient ? '#ac5959' : 'transparent',
                                                },
                                            }}
                                        >
                                            {loadingMessages && selectedRecipient === recipient ? (
                                                <CircularProgress size={26} />
                                            ) : (
                                                <Typography variant="body2">
                                                    {recipient} {messageCounts[recipient] > 0 && `(${messageCounts[recipient]})`}
                                                </Typography>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )
                    ) : (
                        <>
                            <Box flex={1} borderRight="1px solid #ccc" paddingRight="10px" overflow="auto">
                                <List>
                                    {recipients.map((recipient) => (
                                        <ListItem
                                            button
                                            key={recipient}
                                            onClick={() => handleRecipientClick(recipient)}
                                            sx={{ cursor:"pointer",
                                                border: "1px solid #ac5959", borderRadius: "5px", marginBottom: "5px",
                                                backgroundColor: selectedRecipient === recipient ? '#ac5959' : 'transparent',
                                                color: selectedRecipient === recipient ? 'white' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: selectedRecipient === recipient ? '#ac5959' : 'transparent',
                                                },
                                            }}
                                        >
                                            <Typography variant="body2">{recipient}</Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                            <Box flex={2} paddingLeft="10px">
                                {selectedRecipient && (
                                    <>
                                        {loadingMessages ? (
                                            <Box display={"flex"} justifyContent={"center"} mb={2}><CircularProgress /></Box>
                                        ) : (
                                            <List>
                                                {messages.map((msg) => (
                                                    <ListItem key={msg._id} sx={{ backgroundColor: "#ac595921", margin: "2px", display: "flex", justifyContent: "space-between" }}>
                                                        <Typography variant="body2">
                                                            <strong>{msg.sender.username !== userName ? msg.sender.username : 'You'}: </strong>
                                                            {msg.content}
                                                        </Typography>
                                                        <Typography textAlign="end" variant="em">
                                                            <em>({new Date(msg.timestamp).toLocaleString()})</em>
                                                        </Typography>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
                                        <form onSubmit={sendMessage}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Type your message"
                                                required
                                            />
                                            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: "10px",marginBottom:"10px", backgroundColor: "#ac5959" }}>
                                              {sendingMessage ? <CircularProgress size={24} /> : 'Send'}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default Messaging;
