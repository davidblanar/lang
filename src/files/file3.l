#(var x (if (> 5 2) (5) (7)))
#(call print x)
#(if (= 4 4) (call print "is true") (call print "is false"))

(fn fib n (if
    (<= n 1)
    (1)
    (+ (call fib (- n 1)) (call fib (- n 2)))))
(var x (call fib 10))
(call print x)

