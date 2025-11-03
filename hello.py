def say_hello(name):
    print("Hello, " + name)

say_hello("VS Code")


# i want to make a program that format texts in .csv files to make sql data input faster
# data types that can include characters include: [TEXT,BOOLEAN,ENUM,JSON]
# but still, most of them still need the "". Excluding the boolean
# So we just need to check whether there is character then check if that character is true/false or null or not then put the "" around them.