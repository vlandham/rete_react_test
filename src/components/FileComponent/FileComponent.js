import Rete from 'rete';
import Papa from 'papaparse';

import TextControl from '../Controls/TextControl';
import { dataSocket } from '../Sockets';

const getFile = async rawFile => {
  const parseFile = rawFile => {
    return new Promise(resolve => {
      Papa.parse(rawFile, {
        download: true,
        complete: results => {
          resolve(results.data);
        },
      });
    });
  };
  const parsedData = await parseFile(rawFile);
  return parsedData;
};
export default class FileComponent extends Rete.Component {
  constructor() {
    super('File');
  }

  builder(node) {
    var out1 = new Rete.Output('data', 'Data', dataSocket);
    var ctrl = new TextControl(this.editor, 'filename', node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    if (node.data.filename && node.data.filename.length > 0) {
      const parsed = getFile(node.data.filename);

      node.data.data = parsed;
    } else {
      node.data.data = {};
    }

    outputs['data'] = node.data.data;
    console.log(node.data);
    console.log(node.data.data);
  }
}
