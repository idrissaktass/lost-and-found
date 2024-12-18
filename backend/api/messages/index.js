// api/messages/index.js
export { default as send } from './send';
export { default as read } from './read/[messageId]';
export { default as getAllMessages } from './getAllMessages'; // Get all messages for a user
export { default as getMessagesBetween } from './[username]/[recipient]'; // Get messages between two users
export { default as getUnread } from './getUnread';
