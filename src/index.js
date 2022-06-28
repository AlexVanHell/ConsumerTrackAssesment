const path = require('path');
const parseLogToCsv = require('./core/parseLogToCsv');

const main = async () => {
  const [, , logFilePath] = process.argv;

  const csvFileName = `${Date.now()}-log.csv`;
  const csvFilePath = path.join(__dirname, '..', 'output', csvFileName);

  // eslint-disable-next-line no-console
  console.log('Started parsing');

  const csvPath = await parseLogToCsv(logFilePath, csvFilePath);

  // eslint-disable-next-line no-console
  console.log('Finished parsing', csvPath);
  process.exit(0);
};

main();
