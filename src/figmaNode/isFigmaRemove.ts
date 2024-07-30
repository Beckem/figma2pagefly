const excludeNode = ['STAR', 'ELLIPSE', 'POLYGON', 'RECTANGLE', 'LINE', 'VECTOR', 'BOOLEAN_OPERATION']

export function isEffectNode(node: SceneNode): boolean {
    if (excludeNode.includes(node.type)) return true;
    return false;
}
