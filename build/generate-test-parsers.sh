
printf "\x1b[1m\x1b[34mGenerating test parsers...\x1b[0m\n\n"

# Temporarily copy the ANTLR4 jar to the antlr4ng-cli directory, to allow using a newer version, not yet published to npm.
cp cli/antlr4-4.13.2-SNAPSHOT-complete.jar node_modules/antlr4ng-cli/antlr4-4.13.2-SNAPSHOT-complete.jar

antlr4ng -Dlanguage=TypeScript -visitor -Xexact-output-dir -o ./tests/generated ./tests/fixtures/grammars/*.g4
antlr4ng -Dlanguage=TypeScript -o tests/benchmarks/generated -visitor -listener -Xexact-output-dir tests/benchmarks/MySQLLexer.g4 tests/benchmarks/MySQLParser.g4

printf "done\n\n"
