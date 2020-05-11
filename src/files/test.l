#function add (dict, key, val) {
#  return function (k) {
#    if (key === k) {
#      return val;
#    } else {
#      if (dict) {
#        return dict(k);
#      } else {
#        return null
#      }
#    }
#  }
#}

#d0("asd")

(fn make_dict dict key val
    (fn _ k (if (= key k)
        (val)
        (if (= null dict)
        (null)
        (call dict k)))))

(var x (call make_dict null "a" 1))
(var x (call make_dict x "b" 2))
(var x (call make_dict x "c" false))
(call print (call x "asd"))
