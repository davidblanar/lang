(fn car cons_cell (call cons_cell (fn _ a b (a))))
(fn cdr cons_cell (call cons_cell (fn _ a b (b))))
(fn cons a b (fn _cons f (call f a b)))
(var x (call cons 10 20))
(call print "printing car of x:")
(call print (call car x))
(call print "printing cdr of x:")
(call print (call cdr x))

(var a (call cons 14 28))
(var b (call cons 30 a))

(call print "printing car of b:")
(call print (call car b))
(call print "printing car of cdr of b:")
(call print (call car (call cdr b)))
(call print "printing cdr of cdr of b:")
(call print (call cdr (call cdr b)))