const { client: esClient } = require('../elastic/client')

async function resetElasticsearchIndex(esClient, esIndex) {
    // Step 1: Delete index
    try {
        await esClient.indices.delete({ index: esIndex });
        console.log(`Index "${esIndex}" deleted.`);
    } catch (e) {
        if (e.meta.body.error.type !== 'index_not_found_exception') {
            console.error('Error deleting index:', e);
            return;
        }
    }
    // Step 2: Create index
    await esClient.indices.create({ index: esIndex });
    console.log(`Index "${esIndex}" created.`);
}

module.exports = resetElasticsearchIndex;
