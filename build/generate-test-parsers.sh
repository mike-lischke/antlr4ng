
  printf "\x1b[1m\x1b[34mGenerating test parsers...\x1b[0m\n\n"

  antlr4ng -Dlanguage=TypeScript -visitor -Xexact-output-dir -o ./tests/generated ./tests/fixtures/grammars/*.g4
  antlr4ng -Dlanguage=TypeScript -o tests/benchmarks/generated -visitor -listener -Xexact-output-dir tests/benchmarks/MySQLLexer.g4 tests/benchmarks/MySQLParser.g4

  printf "done\n\n"
