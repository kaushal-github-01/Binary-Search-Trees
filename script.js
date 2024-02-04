class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.array = this.prepareArray(array);
    this.root = this.buildTree(this.array);
  }

  prepareArray(array) {
    return [...new Set(array)].sort((a, b) => a - b);
  }

  buildTree(array) {
    if (array.length === 0) {
      return null;
    }

    const mid = Math.floor(array.length / 2);
    const rootNode = new Node(array[mid]);

    rootNode.left = this.buildTree(array.slice(0, mid));
    rootNode.right = this.buildTree(array.slice(mid + 1));

    return rootNode;
  }

  insert(value) {
    let node = this.root;

    while (node) {
      if (node.data > value) {
        if (node.left) {
          node = node.left;
        } else {
          node.left = new Node(value);
          return;
        }
      } else {
        if (node.right) {
          node = node.right;
        } else {
          node.right = new Node(value);
          return;
        }
      }
    }
  }

  nextGreaterValue(node) {
    if (node.left) {
      return this.nextGreaterValue(node.left);
    } else {
      return node;
    }
  }

  delete(value) {
    let node = this.root;
    let previous = null;

    while (node) {
      if (node.data === value) {
        if (node.left || node.right) {
          if (node.left && node.right) {
            let nextGreaterValue = node.right;
            if (nextGreaterValue.left) {
              nextGreaterValue = this.nextGreaterValue(nextGreaterValue);
            }
            this.delete(nextGreaterValue.data);

            node.data = nextGreaterValue.data;
            return;
          } else if (node.data === previous.left.data) {
            if (node.left) {
              previous.left = node.left;
            } else {
              previous.left = node.right;
            }
          } else {
            if (node.left) {
              previous.right = node.left;
            } else {
              previous.right = node.right;
            }
          }
          return;
        } else {
          console.log("Do something here, no children");
          console.log("Node: ", node, "Previous: ", previous);
          previous.left = null;
          previous.right = null;
          return;
        }
      } else {
        if (node.data > value) {
          console.log(node.data);
          if (node.left) {
            previous = node;
            node = node.left;
          } else {
            return;
          }
        } else {
          console.log(node.data);
          if (node.right) {
            previous = node;
            node = node.right;
          } else {
            return;
          }
        }
      }
    }
  }

  find(value, node = this.root) {
    if (node.data > value) {
      return this.find(value, node.left);
    } else if (node.data < value) {
      return this.find(value, node.right);
    } else {
      return node;
    }
  }

  levelOrder() {
    let queue = [this.root];
    let array = [];

    while (queue.length > 0) {
      const currentNode = queue.shift();
      array.push(currentNode);
      if (currentNode.left) {
        queue.push(currentNode.left);
      }
      if (currentNode.right) {
        queue.push(currentNode.right);
      }
    }

    return array;
  }

  // Preorder  -> Root, Left, Right
  // Inorder   -> Left, Root, Right
  // Postorder -> Left, Right, Root

  preOrder(currentNode = this.root, result = []) {
    if (currentNode === null) return;

    result.push(currentNode.data);
    this.preOrder(currentNode.left, result);
    this.preOrder(currentNode.right, result);

    return result;
  }

  inOrder(currentNode = this.root, result = []) {
    if (currentNode === null) return;

    this.inOrder(currentNode.left, result);
    result.push(currentNode.data);
    this.inOrder(currentNode.right, result);

    return result;
  }

  postOrder(currentNode = this.root, result = []) {
    if (currentNode === null) return;

    this.postOrder(currentNode.left, result);
    this.postOrder(currentNode.right, result);
    result.push(currentNode.data);

    return result;
  }

  height(currentNode = this.root) {
    if (currentNode === null) return 0;

    const leftHeight = this.height(currentNode.left);
    const rightHeight = this.height(currentNode.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(value, currentNode = this.root, count = 0) {
    if (currentNode === null) return;
    if (value === currentNode.data) return count;

    if (value > currentNode.data) {
      return this.depth(value, currentNode.right, count + 1);
    } else {
      return this.depth(value, currentNode.left, count + 1);
    }
  }

  isBalanced(currentNode = this.root, result = null) {
    if (currentNode === null) return;

    const leftHeight = this.height(currentNode.left);
    const rightHeight = this.height(currentNode.right);

    const diff = Math.abs(leftHeight - rightHeight);
    if (diff > 1) {
      result = false;
      return "Tree is not balanced";
    } else {
      this.isBalanced(currentNode.left);
      this.isBalanced(currentNode.right);
    }
    result = true;
    return "Tree is balanced";
  }

  rebalance() {
    const newArr = this.prepareArray(this.preOrder());
    this.root = this.buildTree(newArr);
    return;
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

//const myTree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
const myTree = new Tree([1, 3, 2, 4]);
myTree.insert(8);
myTree.insert(10);
myTree.insert(11);
myTree.insert(10);
myTree.prettyPrint();
console.log(myTree.isBalanced());
myTree.rebalance();
myTree.prettyPrint();
console.log(myTree.isBalanced());
