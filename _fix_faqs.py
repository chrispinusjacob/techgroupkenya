from pathlib import Path
import re

text = Path("index.html").read_text(encoding="utf-8")

def remove_faq(text, question):
    pat = (
        r'\s*<div class="faq-item">\s*'
        r'<motion class="faq-q"><span class="faq-q-text">'
        + re.escape(question)
        + r"</span>.*?</motion>\s*"
        r'<div class="faq-a">.*?</motion>\s*'
        r"</motion>\s*"
    )
    pat = pat.replace("motion", "div")
    new_text, n = re.subn(pat, "", text, count=1, flags=re.DOTALL)
    if n != 1:
        raise SystemExit(f"Failed to remove FAQ: {question!r} (n={n})")
    return new_text

for q in [
    "What tech events do you host in Kenya?",
    "What services does Tech Group Kenya offer?",
    "Do you run hackathons and developer meetups in Kenya?",
]:
    text = remove_faq(text, q)

new_answer = (
    '<motion class="faq-a"><strong>Discover:</strong> Workshops, meetups, hackathons, and conferences on '
    '<a href="https://events.techgroupkenya.co.ke" target="_blank" rel="noopener">events.techgroupkenya.co.ke</a>, '
    'plus updates via our <a href="https://redirect.techgroupkenya.co.ke" target="_blank" rel="noopener">community channels</a>.'
    "<br><br><strong>Promote:</strong> List your event on Tech Events, or "
    '<a href="#contact">contact us</a> / <a href="mailto:echo@techgroupkenya.co.ke">echo@techgroupkenya.co.ke</a>.</motion>'
).replace("motion", "div")

text, n = re.subn(
    r'(<div class="faq-q"><span class="faq-q-text">How do I discover or promote a tech event in Kenya\?</span>.*?</svg></div>\s*)<div class="faq-a">.*?</div>',
    r"\1" + new_answer,
    text,
    count=1,
    flags=re.DOTALL,
)
if n != 1:
    raise SystemExit(f"Failed to update discover FAQ (n={n})")

Path("index.html").write_text(text, encoding="utf-8", newline="\n")
print("FAQ count:", text.count('class="faq-item"'))
