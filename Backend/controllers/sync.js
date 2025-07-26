const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const { client: esClient } = require('../elastic/client');
const categorizeEmail = require("./AiCategorizer.js");
const resetElasticsearchIndex = require("./reset_Index.js")
const axios = require('axios');


const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";
const WEBHOOK_URL = "https://webhook.site/c44d12e6-3e7a-4ee4-9cfc-27b5d4fb1204";


async function syncAccount(user, pass) {
    const esIndex = `emails_${user.split('@')[0]}`; // e.g., emails_sourabh
    // await resetElasticsearchIndex(esClient, esIndex);

    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: { user, pass }
    });

    await client.connect();
    await client.mailboxOpen('INBOX');

    const since = new Date(Date.now() - 30 * 60 * 1000);

    for await (let message of client.fetch({ since }, { source: true })) {
        const parsed = await simpleParser(message.source);
        const category = await categorizeEmail(parsed.text || parsed.subject);

        const doc = {
            account: user,
            label: category,
            subject: parsed.subject,
            from: parsed.from.text,
            to: parsed.to?.text,
            date: parsed.date,
            folder: 'INBOX',
            text: parsed.text,
            html: parsed.html
        };

        if (category === 'Interested') {
            await axios.post(WEBHOOK_URL, {
                subject: parsed.subject,
                label: category,
                from: parsed.from.text,
                to: parsed.to?.text,
                date: parsed.date,
                label: category
            });
            console.log("📡 Webhook sent for Interested email.");

            await axios.post(SLACK_WEBHOOK_URL, {
                text: `📩 *New Interested Email!*\n*Subject:* ${parsed.subject}\n*label:*${category}\n*From:* ${parsed.from.text}\n*Date:* ${parsed.date}`
            });

            console.log("📡 Webhook + 🔔 Slack notification sent for Interested email.");
        }

        const docId = parsed.messageId || `${parsed.date.getTime()}_${parsed.subject}`;

        // console.log("Predicted label:", category);

        await esClient.index({
            index: esIndex,
            id: docId,
            body: doc
        });
        // console.log(`📥 Indexed in ${esIndex}:`, parsed.subject);
    }

    // Real-time incoming email
    client.on('mail', async () => {
        for await (let msg of client.fetch('1:*', { source: true })) {
            const parsed = await simpleParser(msg.source);
            const category = await categorizeEmail(parsed.text || parsed.subject);

            const doc = {
                account: user,
                label: category,
                subject: parsed.subject,
                from: parsed.from.text,
                to: parsed.to?.text,
                date: parsed.date,
                folder: 'INBOX',
                text: parsed.text,
                html: parsed.html
            };

            const docId = parsed.messageId || `${parsed.date.getTime()}_${parsed.subject}`;

            if (category === 'Interested') {
                await axios.post(WEBHOOK_URL, {
                    subject: parsed.subject,
                    label: category,
                    from: parsed.from.text,
                    to: parsed.to?.text,
                    date: parsed.date,
                    label: category
                });
                console.log("📡 Webhook sent for Interested email.");
            }
            // console.log("Predicted label:", category);

            await esClient.index({
                index: esIndex,
                id: docId,
                body: doc
            });
            // console.log(`📨 New mail in ${esIndex}:`, parsed.subject);
        }
    });

    console.log(`✅ IMAP live for: ${user} (index: ${esIndex})`);
}

module.exports = { syncAccount };
