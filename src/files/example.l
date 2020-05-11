# comment
# variable declaration
(var a true) # inline comment
(var b 2.5)
(var c "str")

# variable reference
(var x a)

# comparison
(= 3 5) # false
(>= 2 0) # true

# conditional
(if (< 2 3) (5) (6)) # returns 5

# basic arithmetic
(+ 5 4) # 9
(- 5 4) # 1

# function declaration
(fn fib n (if
    (<= n 1)
    (1)
    (+ (call fib (- n 1)) (call fib (- n 2)))))

# function call
(call fib 10)
(call print (call fib 5))

# call built-in function
(call str_concat "a" "b") # "ab"

# array-like structures can be implemented in the language directly
(fn car cons_cell (call cons_cell (fn _ a b (a)))) # get head of list
(fn cdr cons_cell (call cons_cell (fn _ a b (b)))) # get tail of list
(fn cons a b (fn _cons f (call f a b))) # used to define a list

(var lst (call cons 10 20))
(call print "printing car of lst:")
(call print (call car lst))
(call print "printing cdr of lst:")
(call print (call cdr lst))

(var longer_lst (call cons 30 (call cons 60 90)))
(call print "printing car of longer_lst:")
(call print (call car longer_lst))
(call print "printing car of cdr of longer_lst:")
(call print (call car (call cdr longer_lst)))
(call print "printing cdr of cdr of longer_lst:")
(call print (call cdr (call cdr longer_lst)))
