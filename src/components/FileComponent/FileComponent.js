import Rete from 'rete';
import Papa from 'papaparse';

import TextControl from '../Controls/TextControl';
import { dataSocket } from '../Sockets';

export default class FileComponent extends Rete.Component {
  constructor() {
    super('File');
  }

  builder(node) {
    var out1 = new Rete.Output('data', 'Data', dataSocket);
    var ctrl = new TextControl(this.editor, 'filename', node);
    node.data.filename =
      'https://gist.githubusercontent.com/mbostock/4063570/raw/11847750012dfe5351ee1eb290d2a254a67051d0/flare.csv';

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    if (node.data.filename && node.data.filename.length > 0) {
      const parsed = Papa.parse(node.data.filename, {
        header: true,
        dynamicTyping: true,
        trimHeaders: true,
        skipEmptyLines: true,
      });

      node.data.data = parsed;
    } else {
      node.data.data = {};
    }

    outputs['data'] = node.data.data;
    console.log(node.data);
  }
}
