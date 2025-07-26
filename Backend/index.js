const { syncAccount } = require('./controllers/sync.js');
require('dotenv').config();

(async () => {
    await syncAccount(process.env.EMAIL_USER_1, process.env.EMAIL_PASS_1);
    await syncAccount(process.env.EMAIL_USER_2, process.env.EMAIL_PASS_2);
})();
