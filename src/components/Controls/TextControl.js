import React from 'react';
import Rete from 'rete';

export default class TextControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      onPointerMove={e => e.stopPropagation()}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = TextControl.component;

    // const initial = node.data[key] || '';
    const initial =
      'https://gist.githubusercontent.com/mbostock/4063570/raw/11847750012dfe5351ee1eb290d2a254a67051d0/flare.csv';

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: v => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}
