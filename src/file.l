# a simple program
(4)
("str")
(var a 12)
(var b 2.5)
(var c "string")
(var x a)
(+ a b)
(+ 4 5)
(call print a)
(call print 6 (+ a b)) # should print 14.5 to console
(call print c) # should print 'c' to console
(fn my_func1 a (a))
(fn my_func2 a (call print a))
(fn mult a b (* a b))
(call print (call mult 3 4)) # should print 12 to console
