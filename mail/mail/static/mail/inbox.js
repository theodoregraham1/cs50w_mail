document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    document.querySelector('#compose-form').onsubmit = () => send_email();

    // By default, load the inbox
    load_mailbox('inbox');

});

function compose_email() {

    // Show compose view and hide other views
    hide_views()
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

	console.log('Loaded mailbox: ' + mailbox)

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `
		<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>
		<ul id="emails-list" class="list-group"></ul>
		`;

	// Show emails
	fetch(`/emails/${mailbox}`)
		.then(response => response.json())
		.then(emails => {
			console.log(emails);

			emails.forEach((email) => {

				const li = document.createElement('li');
				li.className = `list-group-item`;

				if (email.read) {
					li.style.background = `#d6d6d6`
				}

				li.innerHTML = `<b>${email.sender}</b> ${email.subject} <div class="me-auto">${email.timestamp}</div>`;

				li.addEventListener('click', () => load_email(email));
				document.querySelector('#emails-list').append(li);

			});
		});


}

function load_email(email) {
	console.log('Loaded email - id: ' + email.id);

	// Show the email and hide other views
	hide_views();
    document.querySelector('#email-view').style.display = 'block';
	const view = document.querySelector('#email-view');

	view.append(`<div><b>From:</b> ${email.sender}</div>`);
	view.append(`<div><b>To:</b> ${email.recipients}</div>`);
	view.append(`<div><b>Subject:</b> ${email.subject}</div>`);
	view.append(`<div><b>Timestamp:</b> ${email.timestamp}</div>`);

}

function send_email() {
	const data = {
            recipients: document.querySelector('#compose-recipients').value,
            subject: document.querySelector('#compose-subject').value,
            body: document.querySelector('#compose-body').value
        };

    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify(data)
    })
	    .then(response => response.json())
	    .then(result => {
            // Print result
            console.log(result);
        });

	load_mailbox('inbox')
	return false;
}

function hide_views() {
	// Hide views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
	document.querySelector('#email-view').style.display = 'none';
}