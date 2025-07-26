# 📧 Email Aggregator App

This project is an **Email Aggregator** that connects with multiple IMAP email accounts, stores data in **Elasticsearch**, and offers a simple frontend to **load** and **search** emails based on **subject**, **from**, and **labels**.

---

## 🏗️ Project Structure

<pre>
```bash 
project-root/ ├── backend/ │ ├── controller/ │ │ ├── ai.js │ │ ├── reset.js │ │ └── sync.js │ ├── elastic/ │ │ └── elastic.js │ ├── route/ │ │ └── emailRoutes.js │ ├── app.js │ └── index.js ├── frontend/ │ ├── public/ │ ├── src/ │ │ ├── App.js │ │ ├── App.css │ │ └── components/ │ │ └── EmailTable.js │ └── package.json ├── .env └── README.md 
```
</pre>

---

## 🚀 Features Implemented

### ✅ Step 1-5 Completed

- **IMAP Email Sync**: Fetches emails from multiple IMAP accounts.
- **Elasticsearch Integration**: Emails are stored with index format `emails_<username>`.
- **AI Categorization**: Emails are categorized using OpenAI API into: Interested, Meeting Booked, Not Interested, Spam, and Out of Office.
- **Frontend Interface**:
  - Load all emails by entering the email and clicking “Load Emails”
  - Search functionality to filter by `from`, `subject`, or `label`
  - Clean table view for all email data

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/email-aggregator.git
cd email-aggregator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. .env

```bash
PORT=3001
ELASTIC_URL=http://localhost:9200
ELASTIC_USERNAME=your_username
ELASTIC_PASSWORD=your_password
OPENAI_API_KEY=your_openai_key
```

### 3. Run the backend:

```bash
node index.js
# This will sync your emails
```
```bash
node app.js
# This will start the API server

```
