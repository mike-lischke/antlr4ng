// $antlr-format alignTrailingComments true, columnLimit 150, minEmptyLines 1, maxEmptyLinesToKeep 1, reflowComments false, useTab false
// $antlr-format allowShortRulesOnASingleLine false, allowShortBlocksOnASingleLine true, alignSemicolons hanging, alignColons hanging

grammar Expr;

prog
    : func+
    ;

func
    : 'def' ID '(' arg (',' arg)* ')' body
    ;

body
    : '{' stat+ '}'
    ;

arg
    : ID
    ;

stat
    : expr ';'          # printExpr
    | ID '=' expr ';'   # assign
    | 'return' expr ';' # ret
    | ';'               # blank
    ;

expr
    : expr ('*' | '/') expr # MulDiv
    | expr ('+' | '-') expr # AddSub
    | primary               # prim
    ;

primary
    : INT          # int
    | ID           # id
    | '(' expr ')' # parens
    ;

MUL
    : '*'
    ;

DIV
    : '/'
    ;

ADD
    : '+'
    ;

SUB
    : '-'
    ;

RETURN
    : 'return'
    ;

ID
    : [a-zA-Z]+
    ;

INT
    : [0-9]+
    ;

NEWLINE
    : '\r'? '\n' -> skip
    ;

WS
    : [ \t]+ -> skip
    ;
