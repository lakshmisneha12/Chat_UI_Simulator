const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ":" +
           now.getMinutes().toString().padStart(2, '0');
}

function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.innerHTML = `${text}<div class="time">${getTime()}</div>`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    const typing = document.createElement("div");
    typing.classList.add("message", "bot");
    typing.textContent = "Typing...";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    // smart reply
    handleReply(typing, text);
}

/* ===========================
   SMART REPLY HANDLER
=========================== */
function handleReply(typingDiv, userText) {
    const msg = userText.toLowerCase();

    // 👋 Greetings
    if (msg === "hi" || msg === "hello" || msg === "hey") {
        typingDiv.innerHTML = `Hello 👋 How can I help you?<div class="time">${getTime()}</div>`;
        return;
    }

    // 😊 How are you
    if (msg.includes("how are you")) {
        typingDiv.innerHTML = `I'm doing great 😄 Thanks for asking!<div class="time">${getTime()}</div>`;
        return;
    }

    // 🤖 Name
    if (msg.includes("your name")) {
        typingDiv.innerHTML = `I'm your Smart Chat Assistant 🤖<div class="time">${getTime()}</div>`;
        return;
    }

    // 🙏 Thanks
    if (msg.includes("thank")) {
        typingDiv.innerHTML = `You're welcome 😊<div class="time">${getTime()}</div>`;
        return;
    }

    // 👋 Bye
    if (msg.includes("bye")) {
        typingDiv.innerHTML = `Goodbye 👋 Have a great day!<div class="time">${getTime()}</div>`;
        return;
    }

    // 🌍 Otherwise → API
    fetchApiReply(typingDiv, userText);
}

/* ===========================
   API REPLY (NO API KEY)
=========================== */
async function fetchApiReply(typingDiv, userText) {
    try {
        const res = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(userText)}&format=json&no_html=1`
        );
        const data = await res.json();

        let reply = "I couldn't find an answer 🤔 Try asking differently.";

        if (data.AbstractText) {
            reply = data.AbstractText;
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            reply = data.RelatedTopics[0].Text;
        }

        typingDiv.innerHTML = `${reply}<div class="time">${getTime()}</div>`;
    } catch {
        typingDiv.innerHTML = `Network error 😔<div class="time">${getTime()}</div>`;
    }
}
