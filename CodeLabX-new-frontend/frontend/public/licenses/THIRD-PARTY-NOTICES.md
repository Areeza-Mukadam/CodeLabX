# Browser runtime notices

## Java: TraceJVM 0.4.1

The browser Java compiler and runtime are provided by [`@tracecode/tracejvm`](https://github.com/tracecodeapp/tracejvm), licensed under AGPL-3.0-only. The runtime release includes the applicable TraceJVM, OpenJDK/Temurin, b-jvm, and TeaVM-javac license materials under `/tracejvm/legal/`. The npm package license and complete third-party notices are also included there.

TraceJVM is pre-release and implements a Java 23 core profile. Programs using interactive `System.in` are sent to the existing server runner.

## Python: Pyodide 314.0.7

Pyodide is licensed under the Mozilla Public License 2.0. The complete license text is in `MPL-2.0.txt`. Source: <https://github.com/pyodide/pyodide>.

## C and C++: WASM-OJ Clang toolchain

The browser C/C++ compiler host and SDK are licensed under MIT. Clang 22 and libc++ assets retain their LLVM/Apache-2.0 license terms and third-party notices. The complete installed notice files are shipped as `WASM-OJ-BROWSER-THIRD-PARTY-NOTICES.md` and `WASM-OJ-CLANG-THIRD-PARTY-NOTICES.md` in the production `licenses/` directory. Sources: <https://github.com/wasm-oj/forge> and <https://github.com/llvm/llvm-project>.

## SQL: SQLite WASM 3.41.2

SQLite WASM is distributed under the SQLite blessing. Its JavaScript wrapper package is Apache-2.0. Source: <https://github.com/sqlite/sqlite-wasm>.

The browser SQL runner uses SQLite 3.41.2, matching the configured Piston SQLite version. SQL queries and their result rows stay in the browser. The browser C/C++ runner uses WASI P1; the compiler assets are downloaded from this application origin and cached by the browser.

## Assembly: rft0 8086 playground

The browser 8086 assembler and emulator sources are copied from <https://github.com/rft0/8086-playground>. The upstream repository does not include a license file. They were included at the project owner's explicit request to reuse the reference code. Review the upstream repository's licensing terms before redistributing this application.
