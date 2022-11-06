const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;
const text = fs.createWriteStream(path.resolve(__dirname, 'test.txt'));

stdout.write('Hello!!! Enter text. For exit press Ctrl + C or enter "exit"\n');
stdin.on('data', data => {
    
    if(data.toString().trim() == 'exit') {
        console.log('Bye! Bye!');
        process.exit();
    } else {
        text.write(`${data.toString()}`);
        console.log('Enter text. For exit press Ctrl + C or enter "exit"\n');
    }
});
process.on('SIGINT', () => {
    console.log('Bye! Bye!');
    process.exit();
});