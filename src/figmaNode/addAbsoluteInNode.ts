

export function addAbsoluteInNode(treeNode: any, parent: any, absolute = false) {
    if (treeNode.css?.position === 'absolute') {
        if (treeNode.css) {
            treeNode.css.position = 'absolute !important';
        }
    };
    if (absolute) {
        if (treeNode?.css?.width !== parent?.css?.width && treeNode?.css?.height !== parent?.css?.height) {
            treeNode.css.position = 'absolute !important';
            treeNode.css.top = treeNode.y + 'px';
            treeNode.css.left = treeNode.x + 'px';
        }
    }
    if ('children' in treeNode) {
        if (treeNode.children.length > 1 && treeNode?.css?.width && treeNode?.css?.height) {
            treeNode.css = {
                position: 'relative',
                ...treeNode.css
            };
            treeNode.children.forEach((child: any) => {
                if (child.css)
                    addAbsoluteInNode(child, treeNode, true);
            });
        }
        else {
            treeNode.children.forEach((child: any) => {
                if (child.css)
                    addAbsoluteInNode(child, parent, false);
            });
        }
    }
}