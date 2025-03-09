grammar Expression;

start:
    multiply
    | divide
    | add
    | subtract
;

expression:
    '(' expression ')'
    | number
;

multiply:
    expression '*' expression
;

divide:
    expression '/' expression
;

add:
    expression '+' expression
;

subtract:
    expression '-' expression
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
