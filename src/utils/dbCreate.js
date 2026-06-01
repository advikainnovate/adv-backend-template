const { exec } = require('child_process');

exec('npx sequelize-cli db:create', (error, stdout, stderr) => {
    if (error) {
        const message = (stderr || error.message || '').toLowerCase();
        if (message.includes('already exists') || message.includes('exist')) {
            console.log('Database already exists. Skipping creation...');
            process.exit(0);
        }
        console.error('Failed to create database:', stderr || error.message);
        process.exit(1);
    }
    console.log('Database created successfully.');
    process.exit(0);
});
