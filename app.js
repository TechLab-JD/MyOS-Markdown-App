// MyOS Markdown — a tiny editor with live preview.
const KEY = 'myos.markdown';
const input = document.getElementById('md-in');
const out = document.getElementById('md-out');

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function render(src) {
  let s = esc(src);
  s = s.replace(/```([\s\S]*?)```/g, (m, c) => '<pre><code>' + c.replace(/^\n/, '') + '</code></pre>');
  s = s.replace(/^###### (.*)$/gm, '<h6>$1</h6>').replace(/^##### (.*)$/gm, '<h5>$1</h5>')
       .replace(/^#### (.*)$/gm, '<h4>$1</h4>').replace(/^### (.*)$/gm, '<h3>$1</h3>')
       .replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>');
  s = s.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>');
  s = s.replace(/(?:^|\n)((?:- .*(?:\n|$))+)/g, (m, block) =>
    '\n<ul>' + block.trim().split('\n').map((l) => '<li>' + l.replace(/^- /, '') + '</li>').join('') + '</ul>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) =>
    /^(https?:|\/|#|mailto:)/i.test(u) ? '<a href="' + u + '" target="_blank" rel="noopener">' + t + '</a>' : t);
  s = s.replace(/\n{2,}/g, '<br><br>');
  return s;
}

if (input) {
  try { input.value = localStorage.getItem(KEY) || '# Hello, MyOS\n\nType **markdown** on the left.\n\n- it renders\n- live\n\n`code` and [links](https://github.com/TechLab-JD/MyOS) work too.'; } catch (e) {}
  const update = () => { out.innerHTML = render(input.value); };
  let t;
  input.addEventListener('input', () => { update(); clearTimeout(t); t = setTimeout(() => { try { localStorage.setItem(KEY, input.value); } catch (e) {} }, 300); });
  update();
}
