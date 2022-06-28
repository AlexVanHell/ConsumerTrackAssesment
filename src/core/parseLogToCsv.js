const Alpine = require('alpine');
const byline = require('byline');
const { stringify } = require('csv-stringify');
const fs = require('fs');
const maxmind = require('maxmind');
const userAgentParser = require('ua-parser-js');

const columns = [
  'ip',
  'logname',
  'remoteUser',
  'datetime',
  'request',
  'status',
  'sizeCLF',
  'referrer',
  'userAgent',
  'country',
  'state',
  'deviceType',
  'browser',
];

/**
 *
 * @param {string} logFilePath The absolute path of the log file
 * @returns {Promise<string>} The path of the generated CSV file
 */
module.exports = async (logFilePath, csvFilePath) => {
  const geolite2 = await import('geolite2-redist');
  const geoliteReader = await geolite2.open(
    geolite2.GeoIpDbName.City,
    (dbPath) => maxmind.open(dbPath),
  );

  const readStream = fs.createReadStream(logFilePath, { encoding: 'utf-8' });
  const stringifier = stringify({ header: true, columns });
  const csvWritableStream = fs.createWriteStream(csvFilePath);

  return new Promise((resolve) => {
    byline
      .createStream(readStream)
      .pipe(new Alpine().getStringStream())
      .on('data', (row) => {
        const data = JSON.parse(row);
        const userAgent = data['RequestHeader User-agent'];
        const { browser, device } = userAgentParser(userAgent);
        const { country } = geoliteReader.get(data.remoteHost);

        stringifier.write({
          ip: data.remoteHost,
          logname: data.logname,
          remoteUser: data.remoteUser,
          datetime: data.time,
          request: data.request,
          status: data.status,
          sizeCLF: data.sizeCLF,
          referrer: data['RequestHeader Referer'],
          userAgent,
          country: country?.names?.en,
          state: '', // Not possible to get with geolite2-redist
          deviceType: device?.type,
          browser: browser?.name,
        });
      })
      .on('end', () => {
        resolve(csvFilePath);
      });

    stringifier.pipe(csvWritableStream);
  });
};
