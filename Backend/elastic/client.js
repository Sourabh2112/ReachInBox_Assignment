const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'http://localhost:9200'
});

async function pingElastic() {
    await client.ping();
    // const isAlive = await client.ping();
    // console.log("✅ Elasticsearch connected:", isAlive);
}

module.exports = { client, pingElastic };
