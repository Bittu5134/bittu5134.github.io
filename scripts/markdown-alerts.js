export function githubAlertsPlugin(md) {
  const alertMeta = {
    NOTE: {
      title: 'NOTE',
      borderColor: '#3b82f6',
      bgColor: '#eff6ff',
      iconSvg: '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    },
    TIP: {
      title: 'TIP',
      borderColor: '#22c55e',
      bgColor: '#f0fdf4',
      iconSvg: '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>'
    },
    IMPORTANT: {
      title: 'IMPORTANT',
      borderColor: '#a855f7',
      bgColor: '#faf5ff',
      iconSvg: '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
    },
    WARNING: {
      title: 'WARNING',
      borderColor: '#f59e0b',
      bgColor: '#fffbeb',
      iconSvg: '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
    },
    CAUTION: {
      title: 'CAUTION',
      borderColor: '#ef4444',
      bgColor: '#fef2f2',
      iconSvg: '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>'
    },
  };

  md.core.ruler.after('inline', 'github_alerts', (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'blockquote_open') {
        const inlineToken = tokens[i + 2];
        if (inlineToken && inlineToken.type === 'inline' && inlineToken.children && inlineToken.children.length > 0) {
          const firstChild = inlineToken.children[0];
          const match = firstChild.content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
          if (match) {
            const type = match[1].toUpperCase();
            const meta = alertMeta[type];

            // Remove the [!TYPE] text and any immediately following softbreak
            inlineToken.children.shift();
            if (inlineToken.children[0]?.type === 'softbreak') {
              inlineToken.children.shift();
            }

            tokens[i].type = 'html_block';
            tokens[i].content = `<div class="github-alert my-6 p-4 border-[3px] border-black shadow-brutal" style="background-color: ${meta.bgColor}; border-left: 8px solid ${meta.borderColor};"><div class="flex items-center gap-2 font-mono font-black text-xs tracking-wider mb-2" style="color: ${meta.borderColor};">${meta.iconSvg}<span>${meta.title}</span></div><div class="text-[#14161f] font-mono text-xs sm:text-sm leading-relaxed">`;

            let depth = 1;
            for (let j = i + 1; j < tokens.length; j++) {
              if (tokens[j].type === 'blockquote_open') depth++;
              else if (tokens[j].type === 'blockquote_close') {
                depth--;
                if (depth === 0) {
                  tokens[j].type = 'html_block';
                  tokens[j].content = '</div></div>';
                  break;
                }
              }
            }
          }
        }
      }
    }
  });
}
