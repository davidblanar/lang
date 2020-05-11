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
(fn fib n (if (<= n 1)
    (1)
    (+ (call fib (- n 1)) (call fib (- n 2)))))

# function call
(call print "printing fib(10)")
(call print (call fib 10))

# call built-in function
(call str_concat "a" "b") # "ab"

# array-like structures can be implemented in the language directly
(fn car cons_cell (call cons_cell (fn _ a b (a)))) # get head of list
(fn cdr cons_cell (call cons_cell (fn _ a b (b)))) # get tail of list
(fn cons a b (fn _cons f (call f a b))) # used to define a list

(var lst (call cons 10 20))
(call print "printing car of lst:")
(call print (call car lst)) # 10
(call print "printing cdr of lst:")
(call print (call cdr lst)) # 20

(var longer_lst (call cons 30 (call cons 60 90)))
(call print "printing car of longer_lst:")
(call print (call car longer_lst)) # 30
(call print "printing car of cdr of longer_lst:")
(call print (call car (call cdr longer_lst))) # 60
(call print "printing cdr of cdr of longer_lst:")
(call print (call cdr (call cdr longer_lst))) # 90

# call a sequence of expressions
(seq [(call print "first") (call print "second") (call print "third")])

# using null value and some recursion
# [1,2,3,4,5]
(var my_lst (call cons 1 (call cons 2 (call cons 3 (call cons 4 (call cons 5 null))))))
(fn map lst f (if (= (call cdr lst) null)
    (call cons (call f (call car lst)) null)
    (call cons (call f (call car lst)) (call map (call cdr lst) f))))

(fn double a (* a 2))
(var doubled_lst (call map my_lst double))
(call map doubled_lst print) # [2,4,6,8,10]

# uncomment to throw error
# (call throw_error "error!")

# dictionaries can be implemented using functions as well
(fn make_dict dict key val
    (fn _ k (if (= key k)
        (val)
        (if (= null dict)
        (null)
        (call dict k)))))

(var my_dict (call make_dict null "a" 200))
(var my_dict (call make_dict my_dict "my_key" true))

(call print (call my_dict "a")) # 200
(call print (call my_dict "my_key")) # true
(call print (call my_dict "not_in_dict")) # null
