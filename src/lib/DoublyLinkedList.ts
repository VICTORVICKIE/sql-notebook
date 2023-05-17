type Node<T> = {
    value: T;
    id: number;
    prev?: Node<T>;
    next?: Node<T>;
};

export class DoublyLinkedList<T> {
    public length: number;
    private head?: Node<T>;
    private tail?: Node<T>;
    private next_id: number;

    constructor() {
        this.length = 0;
        this.head = undefined;
        this.tail = undefined;
        this.next_id = 0;
    }

    public get_idx(id: number): number {
        let idx = 0;
        let current = this.head;
        while (current) {
            if (current.id === id) {
                return idx;
            }
            idx++;
            current = current.next;
        }
        return -1;
    }

    iter(): T[] {
        const array: T[] = [];
        let current = this.head;

        while (current) {
            array.push(current.value);
            current = current.next;
        }

        return array;
    }

    delete() {
        while (this.head) {
            this.remove(0);
        }
    }

    prepend(item: T) {
        const node = { value: item, id: this.next_id++ } as Node<T>;

        this.length++;
        if (!this.head) {
            this.head = this.tail = node;
            return node.id;
        }

        node.next = this.head;
        this.head.prev = node;
        this.head = node;

        return node.id;
    }
    insert(item: T, idx: number) {
        if (idx > this.length) {
            throw new Error('Index out of bounds');
        }

        if (idx === this.length) {
            return this.append(item);
        } else if (idx === 0) {
            return this.prepend(item);
        }

        this.length++;
        const current = this._get(idx) as Node<T>;
        const previous = current.prev;

        const node = { value: item, id: this.next_id++ } as Node<T>;
        node.next = current;
        node.prev = previous;
        current.prev = node;

        if (previous) {
            previous.next = node;
        }

        return node.id;
    }

    append(item: T) {
        this.length++;
        const node = { value: item, id: this.next_id++ } as Node<T>;

        if (!this.tail) {
            this.head = this.tail = node;
            return node.id;
        }
        node.prev = this.tail;
        this.tail.next = node;
        this.tail = node;

        return node.id;
    }

    pop() {
        return this.remove(this.length - 1);
    }

    get(idx: number) {
        return this._get(idx)?.value;
    }

    remove(idx: number) {
        const node = this._get(idx);
        if (!node) {
            return undefined;
        }
        return this._remove(node);
    }

    private _get(idx: number) {
        let current = this.head;
        for (let i = 0; current && i < idx; ++i) {
            current = current.next;
        }
        return current;
    }

    private _remove(node: Node<T>) {
        this.length--;

        if (this.length === 0) {
            const out = this.head?.value;
            this.head = this.tail = undefined;
            return out;
        }

        if (node.prev) {
            node.prev.next = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }

        if (node === this.head) {
            this.head = node.next;
        }

        if (node === this.tail) {
            this.tail = node.prev;
        }

        node.prev = node.next = undefined;
        return node.value;
    }
}
