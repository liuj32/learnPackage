function Node(data,left,right) {
    this.left = left;
    this.right = right;
    this.data = data;
    this.show = () => {return this.data}
}

function BST() {
    this.root = null;
    this.insert = insert;
}

function insert(data) {
    var node = new Node(data,null,null);
    if(this.root === null) {
        this.root = node
    } else {
        var current = this.root;
        var parent;
        while(true) {
            parent = current;
            if(data < current.data) {
                current = current.left; //到左子树
                if(current === null) {  //如果左子树为空，说明可以将node插入在这里
                    parent.left = node;
                    break;  //跳出while循环
                }
            } else {
                current = current.right;
                if(current === null) {
                    parent.right = node;
                    break;
                }
            }
        }
    }
}

var bst = new BST()
bst.insert(10)
bst.insert(8);
bst.insert(2);
bst.insert(7);
bst.insert(5);

//中序遍历的实现
function inOrder(node) {
    if(node !== null) {
        //如果不是null，就一直查找左变，因此递归
        inOrder(node.left);
        //递归结束，打印当前值
        console.log(node.show());
        //上一次递归已经把左边搞完了，右边
        inOrder(node.right);
    }
}

//前序
inOrder(bst.root);

function preOrder(node) {
    if(node !== null) {
        //根左右
        console.log(node.show());
        preOrder(node.left);
        preOrder(node.right);
    }
}

//后序
function postOrder(node) {
    if(node !== null) {
        //左右根
        postOrder(node.left);
        postOrder(node.right);
        console.log(node.show())
    }
}

preOrder(bst.root);
postOrder(bst.root);