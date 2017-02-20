"use strict";
var tests = [
{ valid: true,
  src: "$1+1=2$",
  comment: "simple equation starting and ending with numbers."
},
{ valid: true,
  src: "$1+1<3$",
  comment: "simple equation including special html character."
},
{ valid: true,
  src: "$x$",
  comment: "inline equation with single character"
},
{ valid: true,
  src: "$\\varphi$",
  comment: "inline equation with single greek character"
},
{ valid: true,
  src: "You get 3$ if you solve $1+2$",
  comment: "use of currency symbol"
},
{ valid: true,
  src: "If you solve $1+2$ you get $3",
  comment: "use of currency symbol"
},
{ valid: true,
  src: "$\\frac{1}{2}$",
  comment: "inline fraction"
},
{ valid: true,
  src: "$\\begin{pmatrix}x\\\\y\\end{pmatrix}$",
  comment: "inline column vector"
},
{ valid: true,
  src: "${\\tilde\\bold e}_\\alpha$",
  comment: "inline bold vector notation"
},
{ valid: true,
  src: "$a^{b}$",
  comment: "exponentiation"
},
{ valid: true,
  src: "$a^\*b$ with $a^\*$",
  comment: "conjugate complex"
},
{ valid: true,
  src: "${e}_x$\n$$e_\\alpha$$",
  comment: "greek index"
},
{ valid: true,
  src: "$$c{\\bold e}_x = a{\\bold e}_\\alpha - b\\tilde{\\bold e}_\\alpha$$",
  comment: "underline tests"
},
{ valid: true,
  src: "a$1+1=2$\n$1+1=2$b\nc$x$d",
  comment: "non-numeric character before opening $ or\nafter closing $ or both is allowed."
},
{ valid: true,
  src: "$x$ $ ",
  comment: "following dollar character '$' is allowed."
},
{ valid: true,
  src: "$x$ $y$",
  comment: "consecutive inline equations."
},
{ valid: true,
  src: "$$1+1=2$$",
  comment: "display equation on its own single line."
},
{ valid: true,
  src: "$$\n1+1=2\n$$",
  comment: "display equation with line breaks."
},
{ valid: true,
  src: "$$\\begin{matrix}\n f & = & 2 + x + 3 \\\\\n & = & 5 + x \n\\end{matrix}$$",
  comment: "multiline equation."
},
{ valid: true,
  src: "$$\\begin{pmatrix}x_2 \\\\ y_2 \\end{pmatrix} = \n\\begin{pmatrix} A & B \\\\ C & D \\end{pmatrix}\\cdot\n\\begin{pmatrix} x_1 \\\\ y_1 \\end{pmatrix}$$",
  comment: "vector equation."
},
{ valid: true,
  src: "$$f(x) = x^2 - 1$$ (1)",
  comment: "display equation with equation number."
},
{ valid: true,
  src: "`code`$a-b$",
  comment: "inline equation following code section."
},
{ valid: true,
  src: "```\ncode\n```\n$$a+b$$",
  comment: "equation following code block."
},
{ valid: true,
  src: "```\ncode\n```\n$$a+b$$(1)",
  comment: "numbered equation following code block."
},
{ valid: true,
  src: "1. $1+2$\n2. $2+3$\n    1. $3+4$",
  comment: "Equations in list."
},
{ valid: true,
  src: "$\\sum\_{i=1}^n$",
  comment: "Inline sum."
},
{ valid: true,
  src: "$$\\sum\_{i=1}^n$$",
  comment: "Sum without equation number."
},
{ valid: true,
  src: "$$\\sum\_{i=1}\^n$$ \(2\)",
  comment: "Sum with equation number."
},
{ valid: true,
  src: "$${\\bold e}(\\varphi) = \\begin{pmatrix}\n\\cos\\varphi\\\\\\sin\\varphi\n\\end{pmatrix}$$ (3)",
  comment: "equation number always vertically aligned."
},
{ valid: true,
  src: "> see $a = b + c$ \n> $$c^2=a^2+b^2$$ (2) \n> $$c^2=a^2+b^2$$ ",
  comment: "equations in blockquote."
},
{ valid: false,
  src: "3$1+1=2$\n$1+1=2$4\n5$x$6",
  comment: "numeric character before opening $ or\nafter closing $ is not allowed."
},
{ valid: false,
  src: "$ $\n$ x$\n$x $",
  comment: "whitespace character after opening $\nor before closing $ is not allowed."
},
{ valid: false,
  src: "\\$1+1=2$\n$1+1=2\\$",
  comment: "escaped dollars '\\$' are interpreted as\ndollar '$' characters."
},
{ valid: false,
  src: "$1+1=2$$1+1=2$",
  comment: "at least one character (whitespace) is required\nbetween two inline formulas."
},
{ valid: false,
  src: "$1+1=\n2$",
  comment: "line break in inline equation is not allowed."
}
]

if (typeof module === "object" && module.exports)
   module.exports = tests;
