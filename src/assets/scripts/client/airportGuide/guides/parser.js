const fs = require('fs');

function loadData() {
    const res = [];
    fs.readdirSync('.').forEach(file => {
        const filename = file.split('.')[0];
        const extension = file.split('.')[1];

        if (!(extension === 'md')) {
            return;
        }

        res.push({
            icao: filename,
            data: fs.readFileSync(file)
        });
    });
    console.log(res)
    writeData(res);
}

function writeData(array) {
    array.forEach(item => {
        writeSingle(item['icao'], item['data']);
    })
}

function writeSingle(icao, data) {
    fs.writeFileSync(icao + '.js', data);
}

loadData();