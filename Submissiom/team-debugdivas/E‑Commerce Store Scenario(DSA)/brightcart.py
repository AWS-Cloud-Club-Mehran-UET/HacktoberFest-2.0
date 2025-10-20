# brightcart.py
# E Commerce prototype demonstrating custom data structures adapted to domain rules.

from collections import deque, defaultdict, Counter
from typing import Optional, Any, List, Dict, Set, Tuple


#############################
# Product & Carousel (DLL)  #
#############################

class Product:
    def __init__(self, product_id: str, name: str, promoted: bool = False):
        self.id = product_id
        self.name = name
        self.promoted = promoted
        # pointers for doubly linked list usage
        self.prev = None
        self.next = None

    def __repr__(self):
        return f"Product({self.id!r}, promoted={self.promoted})"


class BrowsingCarousel:
    """
    Doubly linked list for personalized carousel.
    Business rules implemented:
        featured/promoted products should occupy the first 3 positions.
        if a promoted product is removed, auto promote the next suitable product
        (prefer an already promoted product further down; if none, promote the
         first non promoted item encountered).
        validateCarousel detects & fixes cycles (Floyd's algorithm on 'next').
    """

    def __init__(self):
        self.head: Optional[Product] = None
        self.tail: Optional[Product] = None
        self.size = 0
        # map for O(1) access by product id
        self._index: Dict[str, Product] = {}

    #   internal helpers  
    def _link_nodes(self, a: Optional[Product], b: Optional[Product]):
        if a: a.next = b
        if b: b.prev = a

    def _append_node(self, node: Product):
        node.prev = node.next = None
        if not self.head:
            self.head = self.tail = node
        else:
            self._link_nodes(self.tail, node)
            self.tail = node
        self._index[node.id] = node
        self.size += 1

    def _prepend_node(self, node: Product):
        node.prev = node.next = None
        if not self.head:
            self.head = self.tail = node
        else:
            self._link_nodes(node, self.head)
            self.head = node
        self._index[node.id] = node
        self.size += 1

    def _remove_node_obj(self, node: Product):
        # unlink node
        if node.prev:
            node.prev.next = node.next
        else:
            self.head = node.next
        if node.next:
            node.next.prev = node.prev
        else:
            self.tail = node.prev
        node.prev = node.next = None
        self._index.pop(node.id, None)
        self.size  = 1

    def _move_node_to_front_obj(self, node: Product):
        if node is self.head:
            return
        # unlink
        if node.prev:
            node.prev.next = node.next
        if node.next:
            node.next.prev = node.prev
        if node is self.tail:
            self.tail = node.prev
        # insert at front
        node.prev = None
        node.next = self.head
        if self.head:
            self.head.prev = node
        self.head = node
        if self.tail is None:
            self.tail = node

    #   public API  
    def addToFront(self, product_id: str, name: str, promoted: bool = False):
        if product_id in self._index:
            print(f"[addToFront] Product {product_id} already present; moving to front and updating promotion flag.")
            node = self._index[product_id]
            node.promoted = promoted or node.promoted
            self._move_node_to_front_obj(node)
            # re ensure top promotions
            self._ensure_top_promoted()
            return
        node = Product(product_id, name, promoted)
        self._prepend_node(node)
        self._ensure_top_promoted()  # enforce top 3 constraint

    def addToEnd(self, product_id: str, name: str, promoted: bool = False):
        if product_id in self._index:
            print(f"[addToEnd] Product {product_id} already present; moving to end and updating promotion flag.")
            node = self._index[product_id]
            node.promoted = promoted or node.promoted
            if node is self.tail:
                return
            # unlink and append
            self._remove_node_obj(node)
            self._append_node(node)
            self._ensure_top_promoted()
            return
        node = Product(product_id, name, promoted)
        self._append_node(node)
        self._ensure_top_promoted()

    def removeProduct(self, product_id: str)  > bool:
        node = self._index.get(product_id)
        if not node:
            print(f"[removeProduct] Not found: {product_id}")
            return False
        was_promoted = node.promoted
        self._remove_node_obj(node)
        if was_promoted:
            # auto promote next suitable product into top 3
            self._ensure_top_promoted()
        return True

    def moveToFront(self, product_id: str)  > bool:
        node = self._index.get(product_id)
        if not node:
            return False
        self._move_node_to_front_obj(node)
        self._ensure_top_promoted()
        return True

    def validateCarousel(self)  > bool:
        """
        Detect cycle using Floyd's Tortoise and Hare on 'next'. If cycle found,
        attempt to break it by rewiring pointers logically: find cycle entry
        and set the previous node's next to None. Also recompute tail.
        Returns True if a cycle was detected and repaired.
        """
        slow = fast = self.head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                # cycle detected
                break
        else:
            # no cycle
            return False

        # find cycle entry
        slow = self.head
        prev = None
        # keep track of node before meeting (to break)
        while slow is not fast:
            prev = fast
            slow = slow.next
            fast = fast.next
        # 'fast' is at cycle start; 'prev' is node before cycle start along the loop.
        # Break the cycle by setting prev.next = None and recomputing tail.
        if prev:
            prev.next = None
            # fix prev.next.prev if exists
            if prev.next is None:
                # locate tail by traversing
                cur = self.head
                prevnode = None
                while cur:
                    prevnode = cur
                    cur = cur.next
                self.tail = prevnode
            # recompute prev links (prev pointers might still be inconsistent inside cycle)
            # Recompute full prev chain from head
            cur = self.head
            prevnode = None
            while cur:
                cur.prev = prevnode
                prevnode = cur
                cur = cur.next
            self.size = 0
            cur = self.head
            while cur:
                self._index[cur.id] = cur
                self.size += 1
                cur = cur.next
        return True

    #   helper to ensure top 3 promoted  
    def _ensure_top_promoted(self):
        """
        Ensure that up to first 3 positions contain promoted products.
        If a promoted product is missing in the top 3, try to find the next promoted product
        in the list and move it into the needed slot(s). If no promoted products exist
        down the list, auto promote (set promoted=True) of the earliest non promoted(s).
        """
        # gather first 3 nodes
        nodes = []
        cur = self.head
        while cur and len(nodes) < 3:
            nodes.append(cur)
            cur = cur.next

        # find how many promoted present in these nodes
        promoted_count = sum(1 for n in nodes if n.promoted)
        needed = 3   promoted_count
        if needed <= 0:
            return

        # find additional promoted nodes further down
        cur = nodes[ 1].next if nodes else self.head
        promoted_found = []
        while cur and len(promoted_found) < needed:
            if cur.promoted:
                promoted_found.append(cur)
            cur = cur.next

        # Move found promoted nodes into top slots (after existing head promoted order)
        for pnode in promoted_found:
            # move to just after last already promoted among top 3
            self._move_node_to_front_obj(pnode)
            # then rotate so existing head promoted remain order? Simpler: repeatedly move to front to fill slots.
            # This preserves that promoted ones become part of the top region.
        if len(promoted_found) < needed:
            # auto promote earliest non promoted nodes to fill slots
            cur = self.head
            while cur and needed > 0:
                if not cur.promoted:
                    cur.promoted = True
                    # move to front to honor top three rule
                    self._move_node_to_front_obj(cur)
                    needed  = 1
                cur = cur.next

    #   utilities  
    def to_list(self)  > List[Tuple[str, str, bool]]:
        res = []
        cur = self.head
        while cur:
            res.append((cur.id, cur.name, cur.promoted))
            cur = cur.next
        return res

    def __repr__(self):
        return " >".join([f"{pid}{'*' if prom else ''}" for pid,_,prom in self.to_list()])


#############################
# Cart + Undo Stack + Queue #
#############################

class CartAction:
    """
    Represent a change in cart. Example actions:
        add: {"type": "add", "product_id": ..., "qty": ...}
        remove: {"type": "remove", "product_id": ..., "qty": ...}
        change_qty: {"type": "change", "product_id": ..., "from": ..., "to": ...}
    Grouping:
        actions can be grouped with a group_id (so they are undone atomically).
    """
    def __init__(self, action_type: str, payload: dict, group_id: Optional[str] = None):
        self.type = action_type
        self.payload = payload
        self.group = group_id

    def __repr__(self):
        return f"CartAction({self.type}, {self.payload}, group={self.group})"


class Cart:
    """
    Shopping cart with undo stack:
       store current items as product_id  > qty
       pushCartAction(action): record and apply action
       undoLastAction(): revert last action or whole group atomically
    """
    def __init__(self, cart_id: str):
        self.cart_id = cart_id
        self.items: Dict[str, int] = {}
        self._undo_stack: List[CartAction] = []

    def pushCartAction(self, action: CartAction):
        # apply the action and push it to the stack
        self._apply_action(action)
        self._undo_stack.append(action)

    def _apply_action(self, action: CartAction):
        t = action.type
        p = action.payload
        if t == "add":
            pid = p['product_id']; q = p.get('qty', 1)
            self.items[pid] = self.items.get(pid, 0) + q
        elif t == "remove":
            pid = p['product_id']; q = p.get('qty', None)
            if q is None or pid not in self.items:
                # remove entirely
                self.items.pop(pid, None)
            else:
                self.items[pid] = max(0, self.items.get(pid, 0)   q)
                if self.items[pid] == 0:
                    self.items.pop(pid, None)
        elif t == "change":
            pid = p['product_id']; new = p['to']
            if new <= 0:
                self.items.pop(pid, None)
            else:
                self.items[pid] = new
        else:
            raise ValueError("Unknown action type " + t)

    def _revert_action(self, action: CartAction):
        # revert the given action (inverse operation). Note: group atomicity handled outside.
        t = action.type
        p = action.payload
        if t == "add":
            pid = p['product_id']; q = p.get('qty', 1)
            # revert add by subtracting
            if pid in self.items:
                self.items[pid] = max(0, self.items.get(pid, 0)   q)
                if self.items[pid] == 0: self.items.pop(pid, None)
        elif t == "remove":
            pid = p['product_id']; q = p.get('qty', None)
            # remove original means items were removed; but we don't know original quantity
            # For robust undo, user should store removed_qty in payload during push
            removed_qty = p.get('removed_qty')
            if removed_qty is not None:
                self.items[pid] = self.items.get(pid, 0) + removed_qty
            else:
                # can't restore quantity reliably; skip
                pass
        elif t == "change":
            pid = p['product_id']; old = p.get('from')
            if old is None:
                # can't restore
                pass
            else:
                if old <= 0:
                    self.items.pop(pid, None)
                else:
                    self.items[pid] = old
        else:
            raise ValueError("Unknown action type " + t)

    def undoLastAction(self):
        if not self._undo_stack:
            print("[undoLastAction] Nothing to undo")
            return False
        # pop last action; if it has group_id, pop all actions in the same group (last to first)
        last_action = self._undo_stack.pop()
        if last_action.group:
            group_id = last_action.group
            # revert the popped action first
            self._revert_action(last_action)
            # now continue popping while the previous actions belong to same group
            while self._undo_stack and self._undo_stack[ 1].group == group_id:
                act = self._undo_stack.pop()
                self._revert_action(act)
        else:
            self._revert_action(last_action)
        return True

    def get_cart_items(self):
        return dict(self.items)

    def __repr__(self):
        return f"Cart({self.cart_id}, items={self.items})"


class Order:
    def __init__(self, order_id: str, customer_id: str, items: Dict[str, int]):
        self.order_id = order_id
        self.customer_id = customer_id
        self.items = items

    def __repr__(self):
        return f"Order({self.order_id}, cust={self.customer_id})"


class OrderQueue:
    """
    Queue for processing orders.
    VIP orders may jump ahead but only up to one position (to avoid starvation).
    Implementation: normal orders appended to right; VIP inserted at position max(len 1, 0)
    so they overtake only the current last element by one position.
    """
    def __init__(self):
        self._deque: deque = deque()

    def enqueueOrder(self, order: Order, vipFlag: bool = False):
        if not vipFlag or len(self._deque) == 0:
            self._deque.append(order)
        else:
            # insert one position ahead of tail (i.e., before the last element)
            if len(self._deque) == 1:
                # only one existing => VIP becomes front? No — rule says jump ahead only up to one position.
                # Insert before the last element (which is head if len==1) => becomes head
                self._deque.appendleft(order)
            else:
                # pop last element, append VIP, then append last back
                last = self._deque.pop()
                self._deque.append(order)
                self._deque.append(last)

    def processNextOrder(self)  > Optional[Order]:
        if not self._deque:
            return None
        return self._deque.popleft()

    def peek(self):
        return list(self._deque)

    def __len__(self):
        return len(self._deque)


##################################
# Customer DB (BST) & Graph     #
##################################

class CustomerNode:
    def __init__(self, cid: int, profile: dict):
        self.cid = cid
        self.profile = profile  # e.g., {"name":..., "purchases": [product_ids], "purchase_count": int}
        self.left: Optional['CustomerNode'] = None
        self.right: Optional['CustomerNode'] = None
        self.parent: Optional['CustomerNode'] = None

    def __repr__(self):
        return f"Customer({self.cid})"


class CustomerBST:
    """
    BST keyed by customer id. Supports:
        addCustomer(id, profile)
        findCustomer(id)
        deleteCustomer(id)
        promoteHotCustomer(id): performs limited rotations to move hot customer upward
        recommendProducts(customerId, k): BFS like neighbor traversal on product co purchase graph
    """

    def __init__(self):
        self.root: Optional[CustomerNode] = None
        # product co purchase graph: product_id  > set(neighbor_product_id)
        self.product_graph: Dict[str, Set[str]] = defaultdict(set)

    # BST insert
    def addCustomer(self, cid: int, profile: dict):
        node = CustomerNode(cid, profile)
        if not self.root:
            self.root = node
            return node
        cur = self.root
        while True:
            if cid < cur.cid:
                if cur.left:
                    cur = cur.left
                else:
                    cur.left = node
                    node.parent = cur
                    break
            elif cid > cur.cid:
                if cur.right:
                    cur = cur.right
                else:
                    cur.right = node
                    node.parent = cur
                    break
            else:
                # existing  > update profile
                cur.profile = profile
                return cur
        return node

    def findCustomer(self, cid: int)  > Optional[CustomerNode]:
        cur = self.root
        while cur:
            if cid == cur.cid:
                return cur
            elif cid < cur.cid:
                cur = cur.left
            else:
                cur = cur.right
        return None

    def _transplant(self, u: CustomerNode, v: Optional[CustomerNode]):
        if u.parent is None:
            self.root = v
        elif u is u.parent.left:
            u.parent.left = v
        else:
            u.parent.right = v
        if v:
            v.parent = u.parent

    def _tree_minimum(self, node: CustomerNode)  > CustomerNode:
        cur = node
        while cur.left:
            cur = cur.left
        return cur

    def deleteCustomer(self, cid: int)  > bool:
        node = self.findCustomer(cid)
        if not node:
            return False
        if not node.left:
            self._transplant(node, node.right)
        elif not node.right:
            self._transplant(node, node.left)
        else:
            y = self._tree_minimum(node.right)
            if y.parent is not node:
                self._transplant(y, y.right)
                y.right = node.right
                y.right.parent = y
            self._transplant(node, y)
            y.left = node.left
            y.left.parent = y
        return True

    #   rotations used by promoteHotCustomer  
    def _rotate_left(self, x: CustomerNode):
        y = x.right
        if y is None:
            return
        x.right = y.left
        if y.left:
            y.left.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x is x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def _rotate_right(self, x: CustomerNode):
        y = x.left
        if y is None:
            return
        x.left = y.right
        if y.right:
            y.right.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x is x.parent.right:
            x.parent.right = y
        else:
            x.parent.left = y
        y.right = x
        x.parent = y

    def promoteHotCustomer(self, cid: int, max_steps: int = 2):
        """
        If a customer is 'hot' (profile contains 'purchase_count'), perform up to
        max_steps local rotations to move them closer to root.
        This implements a limited splay like behavior but not full splay (to keep local).
        """
        node = self.findCustomer(cid)
        if not node:
            return False
        steps = 0
        while node.parent and steps < max_steps:
            parent = node.parent
            if parent.parent is None:
                # single rotation (zig)
                if node is parent.left:
                    self._rotate_right(parent)
                else:
                    self._rotate_left(parent)
            else:
                gp = parent.parent
                # perform double rotation depending on alignment (zig zig or zig zag)
                if node is parent.left and parent is gp.left:
                    self._rotate_right(gp)
                    self._rotate_right(parent)
                elif node is parent.right and parent is gp.right:
                    self._rotate_left(gp)
                    self._rotate_left(parent)
                elif node is parent.right and parent is gp.left:
                    self._rotate_left(parent)
                    self._rotate_right(gp)
                else:
                    self._rotate_right(parent)
                    self._rotate_left(gp)
            steps += 1
        return True

    #   recommendations using simple product graph  
    def add_co_purchase(self, p1: str, p2: str):
        if p1 == p2: return
        self.product_graph[p1].add(p2)
        self.product_graph[p2].add(p1)

    def recommendProducts(self, customerId: int, k: int = 5)  > List[Tuple[str, int]]:
        """
        Recommend top k products based on customer's purchased products and the product co purchase graph.
        Strategy:
            start from customer's purchased products as seeds
            BFS/neighbor traversal up to depth 2 collecting neighbor counts
            rank products by neighbor frequency, exclude already purchased
        """
        node = self.findCustomer(customerId)
        if not node:
            return []
        purchased = set(node.profile.get('purchases', []))
        counter = Counter()
        # depth 1 neighbors
        for p in purchased:
            for nbr in self.product_graph.get(p, ()):
                if nbr not in purchased:
                    counter[nbr] += 1
            # depth 2 (neighbors of neighbors)
            for nbr in self.product_graph.get(p, ()):
                for nbr2 in self.product_graph.get(nbr, ()):
                    if nbr2 not in purchased and nbr2 != p:
                        counter[nbr2] += 0.5  # less weight for second hop
        # top k
        return counter.most_common(k)


######################
# Demo & Tests below #
######################

def demo():
    print("=== DEMO: BrowsingCarousel ===")
    bc = BrowsingCarousel()
    # add some products
    bc.addToEnd("p1", "Lamp")
    bc.addToEnd("p2", "Chair", promoted=True)
    bc.addToEnd("p3", "Table")
    bc.addToEnd("p4", "Vase", promoted=True)
    bc.addToEnd("p5", "Rug")
    bc.addToFront("p0", "Featured Sofa", promoted=True)
    print("Carousel list:", bc.to_list())
    # should ensure top 3 have promoted products
    print("Display:", bc)
    # remove a promoted product and see auto promote
    bc.removeProduct("p4")
    print("After removing p4:", bc.to_list())
    # move p5 to front
    bc.moveToFront("p5")
    print("After moveToFront p5:", bc.to_list())
    # intentionally create a cycle for testing validateCarousel
    # WARNING: That's just for demo   manually stitch tail.next to head.next
    if bc.head and bc.head.next and bc.tail:
        bc.tail.next = bc.head.next
        bc.head.next.prev = bc.tail  # create broken cycle pointers
    print("Cycle created. validateCarousel repairs:", bc.validateCarousel())
    print("After validate:", bc.to_list())

    print("\n=== DEMO: Cart & OrderQueue ===")
    cart = Cart("cart_1")
    # simple actions
    cart.pushCartAction(CartAction("add", {"product_id": "p1", "qty": 2}, group_id=None))
    cart.pushCartAction(CartAction("add", {"product_id": "p2", "qty": 1}, group_id="bundle1"))
    cart.pushCartAction(CartAction("add", {"product_id": "p3", "qty": 1}, group_id="bundle1"))
    print("Cart items after bundle add:", cart.get_cart_items())
    # undo should revert whole bundle atomically
    cart.undoLastAction()
    print("Cart items after undo (bundle):", cart.get_cart_items())
    # test remove with removed_qty for reliable undo
    # perform remove but record removed_qty
    cart.pushCartAction(CartAction("add", {"product_id": "p4", "qty": 3}))
    cart.pushCartAction(CartAction("remove", {"product_id": "p4", "removed_qty": 2}, group_id=None))
    print("Cart before undo remove:", cart.get_cart_items())
    cart.undoLastAction()
    print("Cart after undo remove:", cart.get_cart_items())

    # Order queue with VIP behavior
    oq = OrderQueue()
    oq.enqueueOrder(Order("o1", "u1", {"p1":1}))
    oq.enqueueOrder(Order("o2", "u2", {"p2":2}))
    oq.enqueueOrder(Order("o3", "u3", {"p3":1}), vipFlag=True)  # vip should jump ahead by 1
    oq.enqueueOrder(Order("o4", "u4", {"p4":1}), vipFlag=True)
    print("Order queue state:", oq.peek())
    print("Process next order:", oq.processNextOrder())
    print("Queue after process:", oq.peek())

    print("\n=== DEMO: CustomerBST + Recommendations ===")
    cb = CustomerBST()
    cb.addCustomer(100, {"name": "Ali", "purchases": ["p1", "p2"], "purchase_count": 10})
    cb.addCustomer(200, {"name": "ahmed", "purchases": ["p2", "p3"], "purchase_count": 3})
    cb.addCustomer(50, {"name": "ayesha", "purchases": ["p4"], "purchase_count": 1})
    cb.addCustomer(150, {"name": "zainab", "purchases": ["p1","p3"], "purchase_count": 7})
    print("Customers added. Find 150:", cb.findCustomer(150))

    # Build co purchase edges
    cb.add_co_purchase("p1","p2")
    cb.add_co_purchase("p1","p3")
    cb.add_co_purchase("p2","p5")
    cb.add_co_purchase("p3","p6")
    # Recommend for Alice (100)
    recs = cb.recommendProducts(100, k=5)
    print("Recommendations for zainab (100):", recs)

    # promote hot customer (zainab with high purchase_count)
    print("Root before promote:", cb.root)
    cb.promoteHotCustomer(100, max_steps=3)
    print("Root after promote:", cb.root)

if __name__ == "__main__":
    demo()
