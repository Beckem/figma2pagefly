import { CSSData, getCssDataForTag } from './getCssDataForTag';
import { isEffectNode } from './isFigmaRemove';
import { isImageNode } from './isImageNode';
export type UnitType = 'px' | 'rem' | 'remAs10px';

type Component = {
  name: string;
  props: { [property: string]: string | boolean } | null;
  isComponent: true;
  children: Tag[];
};

export type ChunkComponet = {
  nodeId: string;
  isChunk: boolean;
};

export type Tag =
  | {
    id?: string;
    name: string;
    isText?: boolean;
    textCharacters?: string | null;
    isImg?: boolean;
    css: CSSData;
    children: Tag[];
    isComponent?: false;
    tokens?: { [key in string]: string };
  }
  | Component
  | ChunkComponet;

export type ComponentType = {};

export async function buildTagTree(
  node: any,
) {
  if (!node.visible) {
    return null;
  }
  const isImg = isImageNode(node);
  const css = await node.getCSSAsync()
  const childTags: Tag[] = [];
  // if (!isEffectNode(node)) {
  if ('children' in node && !isImg) {
    for (let i = 0; i < node.children.length; i++) {
      const element = node.children[i];
      {
        const childTag = await buildTagTree(element);
        if (childTag) {
          childTags.push(childTag);
        }
      }
    }
    // node.children.forEach(async (child: any) => {
    //   if (child.type === 'INSTANCE') {
    //     const props = Object.keys(child.componentProperties).reduce(
    //       (_props, key) => {
    //         const value = child.componentProperties[
    //           key
    //         ] as ComponentProperties[string];

    //         // component property keys are named like this: "color#primary"
    //         // thus we need to split the key to get the actual property name
    //         const _key = value.type === 'VARIANT' ? key : key.split('#')[0];
    //         return { ..._props, [_key]: value.value };
    //       },
    //       {} as { [property: string]: string | boolean }
    //     );

    //     if ('Instance' in props) {
    //       delete props['Instance'];
    //     }

    //     childTags.push({
    //       name: child.name.replace(' ', ''),
    //       props,
    //       isComponent: true,
    //       children: [],
    //     });
    //     if (child.mainComponent) {
    //       componentNodes.push(child.mainComponent);
    //     }
    //   } else {
    //     const childTag = await buildTagTree(child, componentNodes);
    //     if (childTag) {
    //       childTags.push(childTag);
    //     }
    //   }
    // });
  }
  // }

  const tag: any = {
    id: node.id,
    name: node.name,
    css,
    x: node.x,
    y: node.y,
    children: childTags,
  };

  if (node.type === 'TEXT') {
    tag.isText = true;
    tag.textCharacters = node.characters;
  }
  if (isEffectNode(node)) tag.isEffect = true;
  if (isImg && !isEffectNode(node)) {
    tag.isImg = true;
  }

  return tag;
}
