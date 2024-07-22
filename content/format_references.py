import re

header = """---
title: Referencias
---

<a id="referencias-chapter"></a>
<header class="chapter-headers">
  <h1 number="13">{{ page.title }}</h1>
</header>

<div class="references-block">


"""

def main():

  filename = "13_referencias.md"

  with open(filename, 'r') as f:
    text = f.read()

  text = sort_biblography(text)

  with open("13_referencias_sorted.md", 'w') as f:
    f.write(text)
  
  print(f"References done: {filename}")

def sort_biblography(text):
  list = text.split("\n")
  grouped = []
  idx = -1

  for l in list:
    if "---------" not in l:
      idx += 1
      grouped.append([])
    
    grouped[idx].append(l)
  
  return format_to_list(grouped)

def format_to_list(grouped):
  copied = grouped.copy()
  def sort_fn(e):
    return e[0]
  
  copied.sort(key=sort_fn)

  formatted = []
  for list in copied:
    for e in list:
      if e != "":
        formatted.append(e)

  formatted = [f"- {f}" for f in formatted]

  formatted = [i for n, i in enumerate(formatted) if i not in formatted[:n]] # remove duplicates

  joined = "\n".join(formatted)

  return f"{header}{joined}\n\n</div>"

if __name__ == "__main__":
  main()