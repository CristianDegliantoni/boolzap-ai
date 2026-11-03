/******************** PREPARAZIONE DOM ***********************/
const chatBoxEl = document.querySelector("#chat-box");
const inputEl = document.querySelector("input");
const buttonEl = document.querySelector("button");
const contactStatusEl = document.querySelector('.contact-status');


/********************* PREPARAZIONE DATI *********************/
//ToDo: spostare i dati in apiConfig.js
//ToDo: untangle functions chain
const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

const messages = [
	{
		text: 'Ciao! Mi aiuti a studiare?',
		time: '31/10/2026 11:00:00',
		type: 'sent'
	},
	{
		text: 'Certamente! Quale argomento o materia vuoi affrontare oggi?',
		time: '31/10/2026 11:00:01',
		type: 'received'
	}
];

/*********************** PAGE INIT ED EVENTI *****************/
showMessages();

inputEl.addEventListener("keyup", function (event) {
	if (event.key == "Enter") {
		sendMessage();
	}
});

buttonEl.addEventListener("click", sendMessage);


/******************** FUNCTIONS ******************************/

//In base ad array messaggi, renderizza le cards
function showMessages() {

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

	chatBoxEl.scrollTop = chatBoxEl.scrollHeight;

}

//Recupera input utente e chiama addMessage()
function sendMessage() {

	// recupero cosa l'utente ha scritto in <input>
	const inputText = inputEl.value.trim();

	// se non ha scritto nulla, non facciamo nulla
	if (inputText == "") {
		//return = la funzione ha terminato
		return;
	}

	addMessage(inputText, "sent");

	inputEl.value = "";
	inputEl.focus();

	getAnswer();
}

//In base al testo e tipo di messaggio, crea oggetto e chiama showMessages(); 
function addMessage(messageText, messageType) {

	const adesso = new Date();
	const tempoStringa = adesso.toLocaleString();

	const newMessage = {
		text: messageText,
		time: tempoStringa,
		type: messageType,
	};

	messages.push(newMessage);

	showMessages();

}

//Chiama la webapi di openrouter e ottiene una risposta
function getAnswer() {

	// Mostro lo stato nella UI
	contactStatusEl.innerText = 'Sta scrivendo...';

	//ToDo: spostare
	const requestConfig = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "openai/gpt-4o-mini",
			messages: formatDataForOpenRouter()
		})
	};

	//ToDo: controllare response.ok e gestire errori
	fetch(apiUrl, requestConfig).then(response => {
		return response.json();
	}).then(data => {

		const risposta = data.choices[0].message.content;
		console.log(risposta);

		addMessage(risposta, "received");
		contactStatusEl.innerText = 'Online 🟢';
	});

}

function formatDataForOpenRouter() {
	const results = [
		{
			role: "system",
			content: "Sei un tutor per lo studio amichevole, paziente e chiaro. Rispondi in italiano. Aiuta lo studente a capire i concetti, spiegali con parole semplici ed esempi pratici, e guidalo passo dopo passo negli esercizi."
		}
	];

	/* array di oggetti. ogni oggetto ha proprietà role e content */
	/* ogni oggetto rappresenta un prompt */

	for (const messaggio of messages) {

		const oggettoFormattato = {
			content: messaggio.text,
		};

		if (messaggio.type == "sent") {
			oggettoFormattato.role = "user";
		} else {
			oggettoFormattato.role = "assistant";
		}

		results.push(oggettoFormattato);

	}

	return results;
}
