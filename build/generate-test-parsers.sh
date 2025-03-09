
printf "\x1b[1m\x1b[34mGenerating test parsers...\x1b[0m\n\n"

antlr-ng -Dlanguage=TypeScript -v --exact-output-dir -o ./tests/generated ./tests/fixtures/grammars/*.g4
antlr-ng -Dlanguage=TypeScript -v --exact-output-dir -o ./tests/bugs/generated ./tests/bugs/grammars/*.g4
antlr-ng -Dlanguage=TypeScript -v -l --exact-output-dir -o tests/benchmarks/generated tests/benchmarks/MySQLLexer.g4 tests/benchmarks/MySQLParser.g4

printf "done\n\n"
