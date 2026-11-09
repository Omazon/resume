"""Convert the three resume HTML sources into standalone, editable LaTeX files.

Run from any directory with Python 3; no third-party packages are required.
"""

from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
SOURCES = {
    "WordPress": "resume-wordpress.html",
    "Webflow": "resume-webflow.html",
    "Frontend": "resume-pdf-frontend.html",
}


class Node:
    def __init__(self, tag="", attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def find(self, tag=None, cls=None):
        for child in self.children:
            if isinstance(child, Node):
                if (tag is None or child.tag == tag) and (
                    cls is None or cls in child.attrs.get("class", "").split()
                ):
                    return child
                found = child.find(tag, cls)
                if found is not None:
                    return found
        return None

    def text(self):
        return "".join(c.text() if isinstance(c, Node) else c for c in self.children)


class Parser(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {"meta", "link", "br", "hr", "img", "input"}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def escape(text):
    replacements = {
        "\\": r"\textbackslash{}", "&": r"\&", "%": r"\%",
        "$": r"\$", "#": r"\#", "_": r"\_", "{": r"\{", "}": r"\}",
        "~": r"\textasciitilde{}", "^": r"\textasciicircum{}",
        "—": "---", "–": "--", "·": r"\textperiodcentered{}",
        "’": "'", "“": "``", "”": "''",
    }
    return "".join(replacements.get(c, c) for c in re.sub(r"\s+", " ", text))


def inline(node):
    if isinstance(node, str):
        return escape(node)
    body = "".join(inline(c) for c in node.children)
    classes = node.attrs.get("class", "").split()
    if node.tag == "a":
        return r"\href{" + escape(node.attrs["href"]) + "}{" + body + "}"
    if "job-company" in classes:
        return r"\textcolor{accent}{" + body + "}"
    if node.tag == "strong" or any(c in classes for c in ("edu-degree", "cert-name")):
        return r"\textbf{" + body + "}"
    return body


PREAMBLE = r"""\documentclass[10pt,letterpaper]{article}
% Standalone source: compile with pdfLaTeX in Codex or Overleaf.
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[margin=16mm,top=14mm,bottom=14mm]{geometry}
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}
\usepackage{xcolor}
\usepackage{enumitem}
\usepackage{needspace}
\usepackage{hyperref}
\definecolor{ink}{HTML}{0F172A}
\definecolor{body}{HTML}{334155}
\definecolor{accent}{HTML}{2563EB}
\definecolor{muted}{HTML}{64748B}
\definecolor{rulecolor}{HTML}{CBD5E1}
\hypersetup{colorlinks=true,urlcolor=accent,linkcolor=accent,
  pdfauthor={Omar Boza},pdftitle={Omar Boza - VARIANT Resume}}
\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{2pt}
\setlength{\emergencystretch}{2em}
\renewcommand{\baselinestretch}{1.08}
\setlist[itemize]{leftmargin=13pt,label=\textbullet,itemsep=1pt,
  topsep=2pt,parsep=0pt,partopsep=0pt}
\newcommand{\cvsection}[1]{\par\addvspace{8pt}\Needspace{4\baselineskip}%
  {\color{ink}\bfseries\fontsize{10.5}{13}\selectfont #1\par}\nobreak
  {\color{rulecolor}\hrule height 0.7pt}\nobreak\vspace{4pt}}
\newenvironment{cvjob}[2]{\par\addvspace{5pt}\noindent
  \begin{minipage}{\linewidth}
  {\color{ink}\bfseries #1\par}
  {\color{muted}\fontsize{8.5}{11}\selectfont #2\par}
}{\end{minipage}\par}
\newcommand{\cvproject}[1]{\par\addvspace{2pt}\noindent
  \begin{minipage}{\linewidth}#1\end{minipage}\par}
\newcommand{\cveducation}[2]{\par\addvspace{2pt}\noindent
  \begin{minipage}{\linewidth}#1\par
  {\color{muted}\fontsize{8.5}{11}\selectfont #2\par}\end{minipage}\par}
\begin{document}
\color{body}
\raggedright
"""


def convert(variant, filename):
    root = Parser((ROOT / "scripts" / filename).read_text(encoding="utf-8")).root
    page = root.find(cls="page")
    header = page.find("header")
    out = ["% Source: scripts/" + filename, PREAMBLE.replace("VARIANT", variant)]
    out.append(r"{\color{ink}\bfseries\fontsize{22}{25}\selectfont " + inline(header.find("h1")).strip() + r"\par}")
    out.append(r"\vspace{2pt}{\color{accent}\bfseries\fontsize{11}{14}\selectfont " + inline(header.find(cls="headline")).strip() + r"\par}")
    out.append(r"\vspace{4pt}{\fontsize{8.8}{12}\selectfont " + inline(header.find(cls="contact-line")).strip() + r"\par}")
    for section in page.children:
        if not isinstance(section, Node) or section.tag != "section":
            continue
        out.append("\n" + r"\cvsection{" + inline(section.find("h2")).strip() + "}")
        for node in section.children:
            if not isinstance(node, Node) or node.tag == "h2":
                continue
            classes = node.attrs.get("class", "").split()
            if "job" in classes:
                title = inline(node.find(cls="job-title")).strip()
                dates = inline(node.find(cls="job-dates")).strip()
                out.append(r"\begin{cvjob}{" + title + "}{" + dates + "}\n" + r"\begin{itemize}")
                for li in node.find("ul").children:
                    if isinstance(li, Node) and li.tag == "li":
                        out.append(r"  \item " + inline(li).strip())
                out.extend([r"\end{itemize}", r"\end{cvjob}"])
            elif "edu" in classes:
                out.append(r"\cveducation{" + inline(node.find("p")).strip() + "}{" + inline(node.find(cls="job-dates")).strip() + "}")
            elif "project" in classes or "cert" in classes:
                out.append(r"\cvproject{" + inline(node).strip() + "}")
            else:
                out.append(inline(node).strip() + r"\par")
    out.append(r"\end{document}" + "\n")
    destination = ROOT / "output" / "latex" / f"Omar-Boza-Resume-{variant}.tex"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text("\n".join(out), encoding="utf-8")
    print(destination)


if __name__ == "__main__":
    for variant, filename in SOURCES.items():
        convert(variant, filename)
