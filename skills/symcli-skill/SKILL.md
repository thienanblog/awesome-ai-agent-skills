---
name: symcli-skill
description: "Execute SymCLI to solve math equations, optimize tensor graphs, or analyze C# code for vulnerabilities. Use when the user needs exact symbolic computation, algebraic equation solving, tensor graph optimization, or C# static analysis for mathematical correctness and security patterns."
author: Wowo51
---

# SymCLI Skill

SymCLI is a pure C# symbolic computation framework that acts as an exact mathematical engine and code analyzer. It prevents hallucinations by providing provably correct results through symbolic computation rather than LLM reasoning.

## Workflow

### Step 1: Identify the Task Type

Determine whether the user needs:
- **Symbolic math** — solving equations, simplifying expressions, optimizing tensor graphs
- **C# code analysis** — scanning for mathematical correctness hazards (`CSMATH...`) or security patterns (`CSSEC...`)

### Step 2: Select the Platform Wrapper

| Platform | Wrapper | Example |
|----------|---------|---------|
| Windows | `symcli.bat` | `symcli.bat input.ps output.txt` |
| Unix/macOS | `./symcli.sh` | `./symcli.sh input.ps output.txt` |

### Step 3: Prepare Input

**For symbolic math:** Write a ProblemScript (`.ps`) file with `<Options>` configuration and equations:

```xml
<Options>
  Target: x
  RulePacks: Algebraic
</Options>
x^2 - 4 = 0
```

**For C# analysis:** Provide a `.cs` file path or directory:

```bash
symcli.bat analyze csharp-math src/MathCore/Calculator.cs report.json --json
```

### Step 4: Execute and Interpret Results

1. Run the appropriate wrapper command
2. Read the output file for results
3. Present the exact symbolic results to the user

## ProblemScript Guidelines

- Wrap configuration in `<Options>...</Options>` blocks
- Specify the `Target` variable to solve for
- Select appropriate `RulePacks` (e.g., `Algebraic`, `Trigonometric`)
- Include constraints as equations: `x^2 + 2*x + 1 = 0`
- Define custom rules when needed: `Rule(a + a, 2 * a)`

## Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | Success | Read and present the output file |
| `1` | Configuration/argument error | Check input file syntax and command arguments |
| `2` | Solving failed | Review diagnostics in the output file for unsatisfiable constraints |
| `3` | Runtime exception | Report the error and verify SymCLI installation |
| `4` | Findings present | Review findings when `--fail-on-findings` flag is used |

## Examples

### Solving an Algebraic Equation

1. Write `problem.ps`:
   ```xml
   <Options>
     Target: x
     RulePacks: Algebraic
   </Options>
   x^2 - 4 = 0
   ```
2. Execute: `symcli.bat problem.ps result.txt`
3. Read `result.txt` → `x = 2, x = -2`

### Analyzing C# Code for Math Vulnerabilities

1. Execute: `symcli.bat analyze csharp-math src/MathCore/Calculator.cs report.json --json`
2. Read `report.json` to review `CSMATH` or `CSSEC` findings
3. Present findings with severity levels and recommended fixes
