import sys
import re

def main():
  with open(str(sys.argv[1]), 'r') as f:
    text = f.read()

  text = adjust_html(text)
  text = to_inline(text)
  text = remove_bibliography(text)

  with open(str(sys.argv[1]), 'w') as f:
    f.write(text)

def adjust_html(text):
  opening = re.compile('\\\<', re.IGNORECASE)
  text = re.sub(opening, "<", text)

  closing = re.compile('\\\>', re.IGNORECASE)
  text = re.sub(closing, ">", text)
  return text

def to_inline(text):
  counter = 0
  while True:
    try:
      counter = counter + 1

      ref = "[^" + str(counter) + "]:"
      nextRef = "[^" + str(counter + 1) + "]:"
      cite = "[^" + str(counter) + "]"

      refStart = text.index(ref)
      refEnd = text.index(nextRef) - 2

      offset = len(str(counter)) + 5

      note = "^[" + text[refStart+offset:refEnd] + "]"
      text = text.replace(cite, note)

    except ValueError:
      break

  if counter > 1:
    note = "^[" + text[refStart+offset:len(text)-1] + "]"
    text = text.replace(cite, note)
    text = text.replace("\n    ", " ")
    cutPoint = text.index("\n^")
    text = text[0:cutPoint]
  
  return text

def remove_bibliography(text):
  marker = re.compile('# Referencias', re.IGNORECASE)
  text = re.split(marker, text)[0]
  return text

if __name__ == "__main__":
    main()