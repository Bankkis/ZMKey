import * as feather from 'feather-icons';

export const PostHTMLFeather = tree => {
  tree.match({ tag: 'feather' }, (node) => {
    const icon = feather.icons[node.attrs.icon];

    if (icon) {
      return {
        tag: 'div',
        attrs: { class: node.attrs.class, style: 'display: flex' },
        content: icon.toSvg({ width: node.attrs.width || 24, height: node.attrs.height || 24 }),
      }
    }
    return node;
  });
}