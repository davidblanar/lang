# a simple program
#(4)
#("str")
#(var a 12)
#(var b 2.5)
#(var c "string")
#(var x a)
#(var y (+ a b))
#(+ 4 5)
#(call print a) # should print 12 to console
#(call print (+ 6 (+ a b))) # should print 20.5 to console
#(call print c) # should print 'string' to console
#(fn my_func1 a (a))
#(call print (call my_func1 "whatever"))
#(fn my_func2 a (call print a))
#(call my_func2 "test")
#(fn mult a b (* a b))
#(call print (call mult 3 5)) # should print 15 to console
(fn no_args_func (5))
(call no_args_func)
#(call print (call no_args_func)) # should print 5 to console
