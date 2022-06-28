/* eslint-disable no-console */
const path = require('path');
const parseLogToCsv = require('./core/parseLogToCsv');

jest.mock('./core/parseLogToCsv', () => jest.fn());

describe('index', () => {
  beforeEach(() => {
    parseLogToCsv.mockReturnValue('result_csv_path.csv');
    jest.spyOn(Date, 'now').mockReturnValue('DATE_TIME');
    jest.spyOn(path, 'join');
    jest.spyOn(console, 'log');
    jest.spyOn(process, 'exit').mockReturnValue(undefined);
  });

  test('should call parseLogToCsv', async () => {
    process.argv = ['node', 'src/index.js', 'test_file.access.log'];

    // eslint-disable-next-line global-require
    require('.');
    expect(path.join).toBeCalledWith(__dirname, '..', 'output', 'DATE_TIME-log.csv');
    expect(parseLogToCsv).toBeCalledWith(
      'test_file.access.log',
      expect.stringContaining('DATE_TIME-log.csv'),
    );
    expect(console.log).toHaveBeenNthCalledWith(1, 'Started parsing');
    await new Promise((resolve) => {
      setTimeout(() => { resolve(); }, 0);
    });
    expect(console.log).toHaveBeenNthCalledWith(2, 'Finished parsing', 'result_csv_path.csv');
    expect(console.log).toBeCalledTimes(2);
  });
});
