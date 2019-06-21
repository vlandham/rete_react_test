import Rete from 'rete';

import NumControl from '../Controls/NumControl';
// import TextControl from '../Controls/TextControl';
import { dataSocket, numSocket } from '../Sockets';

import CustomNode from '../CustomNode/CustomNode';

class CountComponent extends Rete.Component {
  constructor() {
    super('Count');
    this.data.component = CustomNode; // optional
  }

  builder(node) {
    var inp1 = new Rete.Input('data', 'Data', dataSocket);
    var out = new Rete.Output('num', 'Number', numSocket);

    inp1.addControl(new NumControl(this.editor, 'data', node));

    return node
      .addInput(inp1)
      .addControl(new NumControl(this.editor, 'preview', node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const data = inputs['data'].length ? inputs['data'][0] : node.data.data;
    const len = data.length;

    this.editor.nodes
      .find(n => n.id === node.id)
      .controls.get('preview')
      .setValue(len);
    outputs['num'] = len;
  }
}

export default CountComponent;
