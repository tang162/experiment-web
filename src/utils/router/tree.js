
/**
 * @zh_CN 遍历树形结构，并返回所有节点中指定的值。
 * @param tree 树形结构数组
 * @param getValue 获取节点值的函数
 * @param options 作为子节点数组的可选属性名称。
 * @returns 所有节点中指定的值的数组
 */
function traverseTreeValues(
  tree,
  getValue,
  options = {},
) {
  const result = [];
  const { childProps } = options || {
    childProps: "children",
  };

  const dfs = (treeNode) => {
    const value = getValue(treeNode);
    result.push(value);
    const children = (treeNode)?.[childProps];
    if (!children) {
      return;
    }
    if (children.length > 0) {
      for (const child of children) {
        dfs(child);
      }
    }
  };

  for (const treeNode of tree) {
    dfs(treeNode);
  }
  return result.filter(Boolean);
}

/**
 * 根据条件过滤给定树结构的节点，并以原有顺序返回所有匹配节点的数组。
 * @param tree 要过滤的树结构的根节点数组。
 * @param filter 用于匹配每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 * @returns 包含所有匹配节点的数组。
 */
function filterTree(
  tree,
  filter,
  options = {},
) {
  const { childProps } = options || {
    childProps: "children",
  };

  const _filterTree = (nodes) => {
    return nodes.filter((node) => {
      if (filter(node)) {
        if (node[childProps]) {
          node[childProps] = _filterTree(node[childProps]);
        }
        return true;
      }
      return false;
    });
  };

  return _filterTree(tree);
}

/**
 * 根据条件重新映射给定树结构的节
 * @param tree 要过滤的树结构的根节点数组。
 * @param mapper 用于map每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 */
function mapTree(
  tree,
  mapper,
  options = {},
) {
  const { childProps } = options || {
    childProps: "children",
  };
  return tree.map((node) => {
    const mapperNode = mapper(node);
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options);
    }
    return mapperNode;
  });
}

export { filterTree, mapTree, traverseTreeValues };
