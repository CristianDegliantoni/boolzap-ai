// preparazione dom
const chatBoxEl = document.querySelector("#chat-box");
const inputEl = document.querySelector("input");
const buttonEl = document.querySelector("button");

// preparazione dati
const messages = [
	{
		text: 'Ciao, come va?',
		time: '31/10/2026 11:00:00',
		type: 'sent'
	},
	{
		text: 'Tutto bene, e tu?',
		time: '31/10/2026 11:00:01',
		type: 'received'
	}
];

chatBoxEl.innerHTML = "";

// renderizza una card per ogni messaggio
for (const messaggio of messages) {

	chatBoxEl.innerHTML += `
			<div class="chat-row ${messaggio.type}">
				<div class="chat-message">
					<p>${messaggio.text}</p>
					<time datetime="18/11/2025 11:34:00">
						${messaggio.time}
					</time>
				</div>
			</div>
	`;

}

buttonEl.addEventListener("click", function () {

	const inputText = inputEl.value.trim();

	const adesso = new Date();
	const tempoStringa = adesso.toLocaleString();

	const newMessage = {
		text: inputText,
		time: tempoStringa,
		type: "sent",
	};

	messages.push(newMessage);

	console.log("Messaggio inviato", newMessage);

	chatBoxEl.innerHTML = "";

	// renderizza una card per ogni messaggio
	for (const messaggio of messages) {

		chatBoxEl.innerHTML += `
			<div class="chat-row ${messaggio.type}">
				<div class="chat-message">
					<p>${messaggio.text}</p>
					<time datetime="18/11/2025 11:34:00">
						${messaggio.time}
					</time>
				</div>
			</div>
	`;

	}

	inputEl.value = "";
	inputEl.focus();

});