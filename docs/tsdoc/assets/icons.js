(function() {
  addIcons();

  function addIcons() {
    if (document.readyState === 'loading') return document.addEventListener('DOMContentLoaded', addIcons);
    const svg = document.body.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    svg.innerHTML = `<g id="icon-1" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-module)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">M</text></g><g id="icon-2" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-module)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">M</text></g><g id="icon-4" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-namespace)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">N</text></g><g id="icon-8" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-enum)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">E</text></g><g id="icon-16" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-property)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">P</text></g><g id="icon-32" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-variable)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">V</text></g><g id="icon-64" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-function)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">F</text></g><g id="icon-128" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">C</text></g><g id="icon-256" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-interface)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">I</text></g><g id="icon-512" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-constructor)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">C</text></g><g id="icon-1024" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-property)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">P</text></g><g id="icon-2048" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-method)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">M</text></g><g id="icon-4096" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-function)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">F</text></g><g id="icon-8192" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-property)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">P</text></g><g id="icon-16384" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-constructor)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">C</text></g><g id="icon-32768" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-property)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">P</text></g><g id="icon-65536" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-type-alias)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">T</text></g><g id="icon-131072" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-type-alias)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">T</text></g><g id="icon-262144" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-accessor)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">A</text></g><g id="icon-524288" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-accessor)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">A</text></g><g id="icon-1048576" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-accessor)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">A</text></g><g id="icon-2097152" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-type-alias)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">T</text></g><g id="icon-4194304" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-reference)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><text fill="var(--color-icon-text)" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">R</text></g><g id="icon-8388608" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-document)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><g stroke="var(--color-icon-text)" fill="none" stroke-width="1.5"><polygon points="6,5 6,19 18,19, 18,10 13,5"></polygon><line x1="9" y1="9" x2="13" y2="9"></line><line x1="9" y1="12" x2="15" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></g></g><g id="icon-folder" class="tsd-no-select"><rect fill="var(--color-icon-background)" stroke="var(--color-document)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><g stroke="var(--color-icon-text)" fill="none" stroke-width="1.5"><polygon points="5,5 10,5 12,8 19,8 19,18 5,18"></polygon></g></g><g id="icon-chevronDown" class="tsd-no-select"><path d="M4.93896 8.531L12 15.591L19.061 8.531L16.939 6.409L12 11.349L7.06098 6.409L4.93896 8.531Z" fill="var(--color-icon-text)"></path></g><g id="icon-chevronSmall" class="tsd-no-select"><path d="M1.5 5.50969L8 11.6609L14.5 5.50969L12.5466 3.66086L8 7.96494L3.45341 3.66086L1.5 5.50969Z" fill="var(--color-icon-text)"></path></g><g id="icon-checkbox" class="tsd-no-select"><rect class="tsd-checkbox-background" width="30" height="30" x="1" y="1" rx="6" fill="none"></rect><path class="tsd-checkbox-checkmark" d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25" stroke="none" stroke-width="3.5" stroke-linejoin="round" fill="none"></path></g><g id="icon-menu" class="tsd-no-select"><rect x="1" y="3" width="14" height="2" fill="var(--color-icon-text)"></rect><rect x="1" y="7" width="14" height="2" fill="var(--color-icon-text)"></rect><rect x="1" y="11" width="14" height="2" fill="var(--color-icon-text)"></rect></g><g id="icon-search" class="tsd-no-select"><path d="M15.7824 13.833L12.6666 10.7177C12.5259 10.5771 12.3353 10.499 12.1353 10.499H11.6259C12.4884 9.39596 13.001 8.00859 13.001 6.49937C13.001 2.90909 10.0914 0 6.50048 0C2.90959 0 0 2.90909 0 6.49937C0 10.0896 2.90959 12.9987 6.50048 12.9987C8.00996 12.9987 9.39756 12.4863 10.5008 11.6239V12.1332C10.5008 12.3332 10.5789 12.5238 10.7195 12.6644L13.8354 15.7797C14.1292 16.0734 14.6042 16.0734 14.8948 15.7797L15.7793 14.8954C16.0731 14.6017 16.0731 14.1267 15.7824 13.833ZM6.50048 10.499C4.29094 10.499 2.50018 8.71165 2.50018 6.49937C2.50018 4.29021 4.28781 2.49976 6.50048 2.49976C8.71001 2.49976 10.5008 4.28708 10.5008 6.49937C10.5008 8.70852 8.71314 10.499 6.50048 10.499Z" fill="var(--color-icon-text)"></path></g><g id="icon-anchor" class="tsd-no-select"><g stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path></g></g>`;
    svg.style.display = 'none';
    if (location.protocol === 'file:') updateUseElements();
  }

  function updateUseElements() {
    document.querySelectorAll('use').forEach(el => {
      if (el.getAttribute('href').includes('#icon-')) {
        el.setAttribute('href', el.getAttribute('href').replace(/.*#/, '#'));
      }
    });
  }
})()