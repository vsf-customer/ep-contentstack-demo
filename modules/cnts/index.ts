import path from 'path';

// eslint-disable-next-line func-names
export default function (options: object): void {
  this.addPlugin({
    src: path.resolve(__dirname, './plugin.ts'),
    options
  });
}
