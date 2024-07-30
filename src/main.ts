import {
  getSelectedNodesOrAllNodes,
  showUI,
} from '@create-figma-plugin/utilities';
import { Tag, buildTagTree } from './figmaNode/buildTagTree';
import { removeUnnecessaryPropsFromTagTree } from './figmaNode/removeUnnecessaryPropsFromTagTree';
import { addAbsoluteInNode } from './figmaNode/addAbsoluteInNode';

export type PluginToUiMessage =
  | {
      type: 'sendSelectedNode';
      nodeId: string;
      nodeJSON: Tag;
    }

export default async function () {
  const selectedNode = getSelectedNodesOrAllNodes()[0];
  const thisTagTree = await buildTagTree(selectedNode);
  addAbsoluteInNode(thisTagTree, {});
  
  if (!thisTagTree) {
    figma.notify('No visible nodes found');
    return;
  }

  showUI({ height: 450, width: 600 });


  const msg: PluginToUiMessage = {
    type: 'sendSelectedNode',
    nodeId: selectedNode.id,
    nodeJSON: removeUnnecessaryPropsFromTagTree(thisTagTree),

  };
  figma.ui.postMessage(msg);
}
