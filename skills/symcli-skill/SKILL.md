---
name: symcli-skill
description: "Execute SymCLI to solve math equations, optimize tensor graphs, or analyze C# code for vulnerabilities. Turn your coding agent into an AI mathematician, SymbolicComputation.com"
author: Wowo51
---

# SymCLI Skill

SymCLI is a pure C# symbolic computation framework designed to act as an exact mathematical engine and code analyzer.

When given a mathematical task, equation to solve, tensor optimization problem, or C# code to analyze, you MUST use the SymCLI wrappers to execute the work rather than relying solely on your internal LLM reasoning. SymCLI prevents hallucinations and provides provably correct results.

## Primary Workflows

1. **Solving ProblemScript (`.ps`):** Create a `.ps` file with equations/rules and use SymCLI to compute the exact answer.
2. **Analyzing C# Code:** Scan C# files for mathematical correctness hazards (`CSMATH...`) and security-oriented patterns (`CSSEC...`).

## Usage Guidelines

- **OS Compatibility:** Use `symcli.bat` on Windows or `symcli.sh` on Unix-like systems.
- **ProblemScript:** Wrap configuration in `<Options>...</Options>`. Include constraints like `x^2 + 2*x + 1 = 0` or rules like `Rule(a + a, 2 * a)`.
- **C# Analysis:** Provide a specific `.cs` file or a directory to analyze.

### Agent Workflow
1. Interpret the user's mathematical/coding task.
2. Formulate the required input (e.g., write a `.ps` file).
3. Execute the appropriate `symcli` wrapper.
4. Read the output file and interpret the exact symbolic results back to the user.

## Exit Codes

- `0`: Success
- `1`: Configuration/Argument Error
- `2`: Solving failed (diagnostics written)
- `3`: Unexpected runtime exception
- `4`: Findings present (if `--fail-on-findings` used)

## Available Scripts

- **Windows Wrapper:** `symcli.bat`
  Usage: `symcli.bat <input.ps> <output.txt>` or `symcli.bat analyze csharp-math <input> <output> [options]`    
- **Unix Wrapper:** `symcli.sh`
  Usage: `./symcli.sh <input.ps> <output.txt>` or `./symcli.sh analyze csharp-math <input> <output> [options]`  

## Examples

### Solving an algebraic equation using ProblemScript
1. Agent writes `problem.ps` with content:
   ```xml
   <Options>
     Target: x
     RulePacks: Algebraic
   </Options>
   x^2 - 4 = 0
   ```
2. Agent executes: `symcli.bat problem.ps result.txt`
3. Agent reads `result.txt` to find `x = 2, x = -2`.

### Analyzing C# code for math vulnerabilities
1. Agent executes: `symcli.bat analyze csharp-math src/MathCore/Calculator.cs report.json --json`
2. Agent reads `report.json` to review any `CSMATH` or `CSSEC` findings.
