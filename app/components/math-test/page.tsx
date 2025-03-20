'use client';

import { useState } from 'react';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import styles from './page.module.scss';

export default function MathTestPage() {
  const [markdownInput] = useState(`# LaTeX Math Examples

## Inline Math

Einstein's famous equation: $E = mc^2$ shows the relationship between mass and energy.

The quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ solves ax² + bx + c = 0.

When $n \\to \\infty$, the sequence converges.

## Block Math

The Pythagorean theorem is represented as:

$$a^2 + b^2 = c^2$$

Maxwell's Equations in differential form:

$$
\\begin{align*}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\epsilon_0} \\\\
\\nabla \\cdot \\mathbf{B} &= 0 \\\\
\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0\\mathbf{J} + \\mu_0\\epsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t}
\\end{align*}
$$

The Euler's identity:

$$e^{i\\pi} + 1 = 0$$

The probability density function of a normal distribution:

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$

## Complex Math Examples

The Fourier Transform:

$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t}dt$$

Schrödinger's Equation:

$$i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left[-\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t)\\right]\\Psi(\\mathbf{r},t)$$
`);

  return (
    <div className={styles.container}>
      <h1>LaTeX Math Rendering Test</h1>
      <div className={styles.content}>
        <MarkdownRenderer content={markdownInput} />
      </div>
    </div>
  );
} 