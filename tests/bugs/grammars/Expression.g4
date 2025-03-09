grammar Expression;

start:
    expression
;

expression:
    expression '*' expression   # multiply
    | expression '/' expression # divide
    | expression '+' expression # add
    | expression '-' expression # subtract
    | number                    # simple
;

number:
    NUMBER
;

NUMBER:
    [0-9]+
;

WS:
    [ \t\r\n]+ -> skip
;
