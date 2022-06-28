const Alpine = require('alpine');
const byline = require('byline');
const { stringify } = require('csv-stringify');
const fs = require('fs');
const maxmind = require('maxmind');
const userAgentParser = require('ua-parser-js');
const parseLogToCsv = require('./parseLogToCsv');
const path = require('path');

jest.mock('csv-stringify', () => ({
  stringify: jest.fn(),
}));
jest.mock('ua-parser-js', () => jest.fn());

describe('[Core] parseLogToCsv', () => {
  const stringifyPipeMock = jest.fn();
  const stringifyWriteMock = jest.fn();

  const testLogPath = path.join(__dirname, '..', '..', 'tests', 'test.access.log');

  beforeEach(() => {
    jest.spyOn(fs, 'createWriteStream').mockImplementation(() => null);
    jest.spyOn(fs, 'createReadStream');

    stringify.mockReturnValue({
      write: stringifyWriteMock,
      pipe: stringifyPipeMock,
    });

    userAgentParser.mockReturnValue({
      browser: {
        name: 'Chrome',
      },
      device: {
        type: 'Desktop',
      },
    });
  });

  test('should parse and create csv', async () => {
    const csvPath = await parseLogToCsv(testLogPath, 'resut.csv');

    expect(csvPath).toBe('resut.csv');
    expect(stringifyWriteMock).toHaveBeenNthCalledWith(1, {
      ip: '207.114.153.6',
      logname: '-',
      remoteUser: '-',
      datetime: '10/Jun/2015:18:14:56 +0000',
      request: 'GET /favicon.ico HTTP/1.1',
      status: '200',
      sizeCLF: '0',
      referrer: 'http://www.gobankingrates.com/banking/find-cds-now/',
      userAgent:
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36',
      country: 'United States',
      state: '',
      deviceType: 'Desktop',
      browser: 'Chrome',
    });
    expect(stringifyWriteMock).toBeCalledTimes(3);
  });
});
