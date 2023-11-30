import re
import argparse
import os

def parse_arguments():
    parser = argparse.ArgumentParser(description="Convert a flag -t to a boolean value and open a file.")
    parser.add_argument('-t', action='store_true', help='Set the boolean flag to True')
    parser.add_argument('-f', '--filename', help='Specify a filename to open')
    args = parser.parse_args()
    return args.t, args.filename

def main():
  maketooltips, filename = parse_arguments()

  with open(filename, 'r') as f:
    text = f.read()

  text = adjust_html(text)
  text = to_inline(text, maketooltips)
  text = remove_bibliography(text)
  text = replace_after(text, '---', "-", 2)
  text = adjust_escapes(text)
  text = adjust_months(text)

  with open(filename, 'w') as f:
    f.write(text)

def adjust_months(text):
  translations = {
    "january ": "Enero ",
    "february ": "Febrero ",
    "march ": "Marzo ",
    "april ": "Abril ",
    "may ": "Mayo ",
    "june ": "Junio ",
    "july ": "Julio ",
    "august ": "Agosto ",
    "september ": "Septiembre ",
    "october ": "Octubre ",
    "november ": "Noviembre ",
    "december ": "Diciembre "
  }

  for t in translations:
    month = re.compile(t, re.IGNORECASE)
    text = re.sub(month, translations[t], text)

  return text

def adjust_escapes(text):
  opening = re.compile(r'\\\[', re.IGNORECASE)
  text = re.sub(opening, "[", text)

  closing = re.compile(r'\\\]', re.IGNORECASE)
  text = re.sub(closing, "]", text)

  lodash = re.compile(r'\\_', re.IGNORECASE)
  text = re.sub(lodash, "_", text)

  quote = re.compile(r'\\"', re.IGNORECASE)
  text = re.sub(quote, '"', text)

  orline = re.compile(r'\\\|', re.IGNORECASE)
  text = re.sub(orline, '|', text)

  accessed = re.compile('accessed', re.IGNORECASE)
  text = re.sub(accessed, 'accedido en', text)

  return text

def adjust_html(text):
  opening = re.compile('\\\<', re.IGNORECASE)
  text = re.sub(opening, "<", text)

  closing = re.compile('\\\>', re.IGNORECASE)
  text = re.sub(closing, ">", text)
  return text

def to_inline(text, maketooltips):
  counter = 0

  while True:
    try:
      print(f"CITE {counter}", end='\r')

      counter = counter + 1

      ref = "[^" + str(counter) + "]:"
      nextRef = "[^" + str(counter + 1) + "]:"
      cite = "[^" + str(counter) + "]"

      refStart = text.index(ref)
      refEnd = text.index(nextRef) - 2

      offset = len(str(counter)) + 5

      cleannote = text[refStart+offset:refEnd]
      note = "^[" + cleannote + "]"

      if maketooltips:
        note = f"<span id='quote-fn{str(counter)}' class='tooltip'>{note}<span class='tooltiptext'>{cleannote}</span></span>"

      text = text.replace(cite, note, 1)

    except ValueError:
      break

  if counter > 1:
    cleannote = text[refStart+offset:len(text)-1]
    note = "^[" + cleannote  + "]"

    if maketooltips:
        note = f"<span class='tooltip'>{note}<span class='tooltiptext'>{cleannote}</span></span>"

    text = text.replace(cite, note)
    text = text.replace("\n    ", " ")
    # cutPoint = text.index("\n^")
    # text = text[0:cutPoint]

  print(f"CITE {counter}")
  return text

def replace_after(text, search, replace, n):
  marker = re.compile('---', re.IGNORECASE)
  parts = re.split(marker, text, n)
  return search.join(parts[: n]) + search + search.join(parts[n :]).replace(search, replace)
    
def remove_bibliography(text):
  marker = re.compile('# Referencias', re.IGNORECASE)
  text = re.split(marker, text)[0]
  return text

if __name__ == "__main__":
    main()