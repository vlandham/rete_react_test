import React from 'react';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from 'rete-area-plugin';

import NumComponent from '../NumComponent/NumComponent';
import AddComponent from '../AddComponent/AddComponent';
import CountComponent from '../CountComponent/CountComponent';
import FileComponent from '../FileComponent/FileComponent';

import './App.css';

export async function createEditor(container) {
  var components = [
    new NumComponent(),
    new AddComponent(),
    new FileComponent(),
    new CountComponent(),
  ];

  var editor = new Rete.NodeEditor('demo@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  var engine = new Rete.Engine('demo@0.1.0');

  components.forEach(c => {
    editor.register(c);
    engine.register(c);
  });

  var n1 = await components[0].createNode({ num: 2 });
  var n2 = await components[0].createNode({ num: 3 });
  var add = await components[1].createNode();
  var file = await components[2].createNode();
  const count = await components[3].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];
  file.position = [80, 10];
  count.position = [500, 10];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);
  editor.addNode(file);
  editor.addNode(count);

  editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
  editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));
  editor.connect(file.outputs.get('data'), count.inputs.get('data'));

  editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
    console.log('process');
    await engine.abort();
    await engine.process(editor.toJSON());
  });

  editor.view.resize();
  editor.trigger('process');
  AreaPlugin.zoomAt(editor, editor.nodes);
}

function App() {
  return (
    <div className="App">
      <div style={{ width: '100vw', height: '100vh' }} ref={ref => ref && createEditor(ref)} />
    </div>
  );
}

export default App;
