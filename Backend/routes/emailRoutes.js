const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const router = express.Router();

const esClient = new Client({ node: 'http://localhost:9200' });

router.get('/:email', async (req, res) => {
    const userEmail = req.params.email;
    const indexName = `emails_${userEmail.split('@')[0]}`;
    // console.log(indexName);
    
    if (!userEmail) return res.status(400).json({ message: 'Email query is required' });

    try {
        const result = await esClient.search({
            index: indexName,
            size: 1000,
            query: {
                match: {
                    account: userEmail
                }
            }
        });
        const hits = result.hits?.hits || [];
        console.log(hits);
        
        const emails = hits.map(hit => {
            const { date, from, subject, label } = hit._source;
            return { date, from, subject, label };
        });
        console.log(emails);
        
        res.json(emails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Elasticsearch query failed' });
    }
});

module.exports = router;
