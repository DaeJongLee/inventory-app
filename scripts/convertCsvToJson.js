const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => {
    const locationParts = data.위치명.split(' ');
    results.push({
      name: data.상품명,
      location: {
        main: locationParts[0] || '',
        sub: locationParts[1] || '',
        final: locationParts[2] || ''
      }
    });
  })
  .on('end', () => {
    fs.writeFileSync('inventory_data.json', JSON.stringify(results, null, 2));
    console.log('JSON file has been saved.');
  });