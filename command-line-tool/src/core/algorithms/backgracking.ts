export interface Node<T> {
    getChildren(): Array<Node<T>>
}
export abstract class Backtracking<T, R> {
    backtrack(node: Node<T>) {
        if (this.isRejected(node)) {
            return
        }
        if (this.isCompleted(node)) {
            return this.output(node)
        }
        node.getChildren().forEach(() => this.backtrack(node))
    }

    protected abstract isRejected(node: Node<T>): boolean
    protected abstract isCompleted(node: Node<T>): boolean
    protected abstract output(node: Node<T>): R
}
