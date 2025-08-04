
const socket = io('http://localhost:3000');

socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)

});

// document.querySelector('button').onclick = () => {

//     const text = document.querySelector('input').value;
//     socket.emit('message', text)
    
// }

// Regular Websockets

// const socket = new WebSocket('ws://localhost:8080');

// // Listen for messages
// socket.onmessage = ({ data }) => {
//     console.log('Message from server ', data);
// };

// document.querySelector('button').onclick = () => {
//     socket.send('hello');
// }

// Get DOM elements
const messageList = document.querySelector("ul");
const messageInput = document.querySelector("input");
const sendButton = document.querySelector("button");

/**
 * Appends a new message to the message list.
 * @param {string} msg - The message content.
 */
function addMessage(msg) {
  const item = document.createElement("li");
  item.textContent = msg;
  messageList.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight); // Auto-scroll to the bottom
}

// ---- WebSocket Event Handlers ----

// Fired when the connection to the server is successful
socket.on("connect", () => {
  console.log("Connected to the server!");
});

// Listen for "chat_message" events from the server
socket.on("chat_message", (msg) => {
  addMessage(msg);
});

// ---- DOM Event Listeners ----

// Send message when the button is clicked
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message.trim()) {
    // Send the message to the server
    socket.emit("chat_message", message);
    messageInput.value = ""; // Clear the input field
    messageInput.focus();
  }
});

// Allow sending messages with the "Enter" key
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendButton.click();
  }
});