/*
Iris Text by Gen1x - 2026

Code inspiration:
- Skins (TurboWarp version)
- Animated Text (PenguinMod version)
- Lambda by jwklong

Enjoy!! :D
*/

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Iris Text must run unsandboxed');
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;

    const STATE_KEY = 'irisText';
    const DEFAULT_TEXT = 'Hello world!';

    const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfqCAwUATlcnNTYAAAXWElEQVR42tWbeZBd1X3nP+fc/d33ul9v6tYugTYkIpAsEAbMADY4rkkFFw4zIYPjZVI2YyfUxKmamsnsnsQwA3YywDhVTsoeZ/EyKTvBnomNGAzGIIODoBEIEGq1ltbS3a+7X/db73rO/HHfk7pb3eoWECfzq3ol9X33vnu+3/M7v/M7v/M9gnfJbn7s5YUudwGbgV3A1cBWYC3QA/iA1bovBurAJDACHAYGgZeBI0B5/g8/fceud6Xd4p08fOv3DqC0XAj0NcBtwA3AptY189xLxYWv1VrPv5S0gA8BzwFPAH87nwwpFD/65ff8/AlYoMc3AXe2PjsBD0BKiZQSwzCQhoGUEiFE9mmDbxGglUIpRZqmpEqh0nQ2MU3gIPDd1mdo9svfrkdcMgELAL8c+CRwN7CxDdq0LCzLyoC3QF+Kaa1RaUqSpsRxTJokKKXaXx8Dvgl8FTj6Toi4pFbNA18Efh34TbJxjmma2I6DZVlIKS/lp5e0NE2Jo4goikjTtH35CPAo8KfA9NshYVkE3PLYS+i5t+4F/hNwOyBN08RxXSzLuuSevlRTShFFEVEYtolQwL5We15o3ye14kcfXjo2LNnaeb1uAZ8A/gOwWkqJ67rYjvN3DnwhIsIgIAzDdpw4DXwe+BrZrAIs7Q0XbfU88J3Avydzece2bVzPwzCMnyvw+RbHMUGzSZIkACHZkPgvwMxySFiUgHng+4AvAfcIIXBdF8d1f+69vpgppWg2m0Rh2L7058DngNJSJCyIYN6Y7wP+B3CXlBLP87Ad5x01WC9y/Z3QqbUmCALCIGgPib8EPtsmQaB56o7dFzxnLvhj55vSSdbzd0kpyfk+lmVxqaYBCRhSYhoS0zAwpDjnQUppUqVIUkWiFKlS6EskRAiB53kIIQiaTbTWd5ENid8EZvQiv3bB1VmubwH3A7/zdsC3QdumSc6xyTkWjmViSokU4oLho7Um1ZokTQmihHoY0Yxi4vNT3rItCAKajUb7zy8C/4ZWYJw/FOa0Yt64/xTwsBDCyfk+tm1fUm/kbIvOnIfv2JiGRLC46y/UIA1ESUo1CKk0mgRxckkkNBsNgiCAzAvuA77S/m42CeYiz+8lm+oc13UvCbxrmXTnfQqegyHEOdDLAT//Pts06Mnn6PRcZhpNyvXmsj3C9bx2zuC0sLzCrDxhPuGze79Ilmb+om3b5Hx/WdFeCEHR9+jJ57ANY9mAL8WCOKFUqVELwmXdr9KUWq3WTph+SJauT8N5L5CQrepm2a8Dt0spcVtBZSkzpWSgs0B/ZwFrKfB69kfM+1z8PZ5lsqqrk5788jpFGsZsDLe3sDEbswnMXtJeThY1peu6y0pyTEMyUOyg4C4wNWoAgVbZRyUaFStUqkijGJ2m6Fa4FwJM18WwDKQpESYIoRGyxVaLH0MK+jrzGIZgolJH6YuzZts2cRwThaFsYfs/wNE25vkx4JPA5vaiZikz5ALgNWgtUbEgacY0pqapj40zM3KMmTPHqY2OEDfqhNUp0jhEpylCSBDg967CLfaS6+mnuG4T+YFV+L195Pq6sXImwlAZKQJ68j5oKFXrC9US5pjruiRxjFJqcwvjv21/J2aN/U1ki4qNfj6/ZOATQjDQWaDoey3QAhVLwkqT8rHjTBw+xJnB5ygPH6JeOk1UK6OSGCUE2jDBMKD9b5IgkhiRppDGCCExbBfL7yTX3U/fFXtYtetGVuy4is61q7ByBtLUaBTjlRpTtQZL2axZ4RjZcBia7wF3AhtN01zWfN/le3TmPLQSpKGgcqrEqZ89y8mf7mP0tecJp0ukUYC2bXR3P2rr1aiuFaj1W1H5Tsh3gGGiTQuUQoRNRH0GOXYKefYkxtnjJKUzNIfOMjk0yJHH/4L8yg2suupGLrv5l+m/6ipy3T49uTxBqGkEEYi0FdUWGAqOQxRFKKU2trD+t9ke0AX8ANib832cJdzftUzWdHUhU4vpk6Mce/pxjuz7FhNDB0nCJn6hQLRqI8G6rSTrt6LXb0V39oDng2VnAc9s9bwh6fJsmomiqQXEETSq0Kgjj7+B+eoLmMOvISfHoFkHIXA6ull51U1s//An6Nt6JRMjxxgdO0Nx5y8g/cXrEI16nTBbL7wAfAgotz3gGmCnlHLJ3hcIutwC4UTIsaf/hkN/9SdMvHWAJI5Yu24d//hDt+Nf8z7+sF4kyhXBzYPjstKzuabXY1PB4mAl5fmqohZrul2DDw24vDwdc6iaIJRCxCF5S1Jbv5no6huJS2eQp45i/uxJnMMvEVSmOP6Tv2bs0PN0rLyMZnmMdR/8GGLnLtCKbHZvzSxoEAoEWLZNFEVorXe2MO9rE3Ab4JlLVHK0Bk+41A6f5OA3vszxnzxG1KhS7OrmV+76KJ/6jU/grN/Ex/afoOoYyEIXOcfhV/ot/uUai205iS2hnmq+N5Hy745FuK5FpyXpdi1oglSKXb0e6zyDfSWfWr6I7ugm7e4nvWwHG+pnuXLwCfb/6CmmJ87QmDqLm+/GL3QhYoEOLFQQEk3PEE6O4a5YgbumB4TGNE2klKRp6rUw7zNb7n8DcPHe1wIRGky98iJvfP0BJo4exLJtbr7lZn7rvs/y/vffgmFZfGb/MfaXmrByA45rc+96h99dKekyz8/beUPwa/0mUsDXJgWJgg4TZJqyJmeyu8OkFCmiRGW9WOgCywHXY6S/n9/5pVu492OH+PIffYWnnv4xYX2Gwf/5H+k7+BxmoZP6mWEaZ4/hr9rElk/+q5Y3aIQQmJbVToxuALpMsnrepnbldkFTAt0UlJ59mqG/eJDq6DG6e3r4zGc+zac+9c/p6ekB4JnxGn95fAr8IhgmpoDbC8wBP9vu6DUZBd4MICcFK2zJnmL23FioEGjWOIJ1eYuZ1OF1w6QxPsIfn6jyww+8n69fdy3f/Ob/4tFH/4hjx45z6sffBjRucRV9uz7Emtt+FadnAFVL0CpB+iamadLKIzcBm40Nd9/7S8BHDMOQCxY5NOim5OwTP+StP/sCjcnTbN++nQcffICPf/yj+L4PQKo1v/d6if1nK5DvBDfHClPz26ttuq2FCbAEDNeavDQd4hgGmztseh2BEDAVaTYXLPb0OKxyDaopjAQa3agyPlNja9Fj70CR9+zZzU3/6H3MVCocHRomSVPc4gCmm2dm6AATL/+E0Wf+hrhcoWPzdoSdVZG01g7wskm2Y2MahrEgeGKTqQMvcvRbXySYHmfvddfx0EMPsGvXVXNuHalHPH2qDLk8VkcRwxCkQtC4SI6igR+9MMhfDQ7TXexgx44r2HL5RhzTYEeHgQBSDW9UU16cjlEIyHeRNOo8fnqaezZ2YQrBjh3beeSRP2Dv3mv54hf/kFMjh6mPHkEgMLwCxa17KO7YjXQMtNRIKVFKmcDVJtl2FXIh91cGtSMnGPrGQwTTY9z6/lt58MH72bp1ywW3vlhuMhKk0DNAr+9xXdEErZlQi+fsk42AwVNjpLUapWqFH4+corR7Fze89xosw6Aca16cjjnZTMEw8QyDQBTRQZ39pTpDtZhthSxh832fT3/6N7jiim3c/4X/ynPP7Se/7hfY8qv/mo4d2zCLDsgUgZgd6LdKsr26C6O/kkRjNYa//SjTwwe58cYbePjhLy0IHuDNSkisBdgupTDhSD3BkILn6oKx5EI30MBXXzrCwZFx2qsgnaa8fuAAg6+/RS2B001FwYAP9jvc2W9yR7/Jmg4H/AJng5Sh2oWrwptuupE//bOv8bGPf5S0WqJ29ijB+Cj1Y6cIz5ZBzSFgrQn0iPkVGg2qCSPf/wajP3ucPXvew4MPPcCGDesX7c3RIM1WNCol0RavVRJONBVTsQkY/GKnZoOlIYoYma7zndeGeWT/IeJUgVKgsnW+jmLeeu0QGzZtZnPexDWyoRBqONFUVJOsgUmSUGrGC7alr6+XL3zh91g5MMDDjz7I8e95+Ks3s+nX7sMZ6J6Ntcck26WdS4AyqA0Nc/rH32Hj+rXc/8Dvc+WVOxYFH2vN6XoIqaJoCrZ1WUgJzUQTKTgawNcTwczYKIPP7udsucJEI+RcOUIpkEZGgtYE9ToyCfHzJpUY3qymDDcSxiKd1SuTBK0U1TBetE2FQp777vssh159hZ8OldnwT36bju2bQSqEPIfVN2ltUZ+7pEE1Uk49/i2MoMzn/vP9XH/9dSxlQmtwPITt0GNBlyXQSPKmwGmFlxP1mFdHy1m21nZDTfb/9r6faaGkQaqzvxUQao1vCDbmJKVE0Cx0kpRL1OOLV4fyhQLX7r2W042/xc+5rYbOQWtdWBLTkmCsxNShn/JP77qTe+65e0nwhhB0mNmivhzE/GCkiWVZOLbJJt9kT9HEMaCY8zBclzQMs95WKhs2hpGRIAQohd/Zge+6pAo8Cdd2ZblBrOBoQ/NMLSUBOtylS3XrN2zAqH2f8KmvIPK/hbl+xZzvTbJqqX0uTKUG1cOv0uOkXH/9e5e1MpRAr+9AWIEwxLRM1vgWWwoW/Y7AAJIUVvZ1s2btak68eTgD267v2U5GiBBgO2y7YgsdnoXQUIo0B6ZThIAwUdSihLA8gSM1G3Lmkm0rFotZglefgiignRW2LDaButba1lqDFqhqhHnqVVau6MLL5ZZ8Qdu2d7oInWKIlOtXdrG9YGAAsYZAgUFW5Nx19U4mz45SK5eznp8TexSrN2/kyi2XIwClod8WbM5JXpqOmYhUtloMA3pci00d7kXbpJKEk8eOo1SKObAN2dMPQs0uoNRNMllKl1YKYkly+ADO5GFSQ1Kv15ZNwDU9Pv0FjzEhGY0FqqaoJ5rpRJMoxc3dFiSC3p4ebrrtAwy+9DLjp0+TRBFohZvPs3HrVnZftQPHskhSKIWKRgprXEmu22JfKaSRSJAGO7ss1vqLD4Gg0eS5p55i8MABZNdarOvuQHS6INLZZbRJk0yTs0kphVaKdPglCKuAoDReImw0MSwTc4mhsDlvc/0Kn+9WFEeamsP1FITEFZo9BQPXEGidZXZr+vsY+OAHGC9PM1OrY5uS3s4OCvk8lhTZpCBgOlY8OxnTaWXPBkEESQw64YNr+sgZC69ca5UKzzzxJG8ceo24cw3OzvdhblyHMLMhp86X1keMDXffex2wR0oDy3LQsURXy5AmVMtlahMTHH/rLcZOnSZNEnK+vyAZphD4huSxo6NESITtYku4qdvkirykmmhKkcY3BZYE1xR0+R4rujrp6cjqipYUhAoqqcaRgg5LMpnAyVpMLW257tQYmx3N569eTbd9YfY6MznFvu//b4aHhmgW13Ny062ka/oRjmoNfz17//Bxk0yNlaQqNTFTrJ27MDZsQ01NMNOo8qyUdE+W6B55g1cGB+kfGGDn7t1cvnUrbs6b8/JbVvjc1uvy2FgJ7eVZ6dn0mfD8VMxwI6XDNljpSoSAmViTMwRSwGSo0Wh6bEmQap6eiFjjSHZ2WlzdYVKOUiabCYQBNKr8syvWcnn+QvcfO32GZ598kpMnTjKZX8/wqmtpdvtIK52Vcqi21CYBBo0Nd99rAHeitW/bFtIWyJyF0VNErOin0d1LubiWsrsSlERNneHM8WFGT51Gpyn5jgJWq4BqS8FlBYcnzsww0whJpcFwJBiup4QK9nZbrLAFg9WU58sxq1wD3xQ8X054fSZibc7EloKhasLhRko1yUgJU02pPA2VSd43UOCB3aspmOfdX6Upr79ykP/7gx8wXpqgVLiMoXXXEvXkkJaaswEYxzFxFNGKfV8yNtx9b4OsPrbWMAxM02xVlDRCKoSpsyWk71POryb1VuCmEc2J05wcHubMyRFQipzvYzsOq3MWHY7JkyfGqdWbNL1OAAqWZE+nyZlA8+xUTJhqVrkGSsGhasxEIuh3DQYcwdlmwkQzYSrWDNcTJksl1MQom3OCR65bz/ZZ0b9SLvP8Mz/hhWefo9KMOdWzkxPrdpMUHcQ88ADheWnNQeARY8Pd9wbANuB6hFi4HC5AGBptQ1joRq/YQmr4yEaZ6uQox48e5ehbQ5CmeF6OPQNFiq7F/vEqYaIgaOBKUKbN4ExMI05QStNjGwgEb1YjEiGoJ5oVjsFkAuPNBLRGBU3UxFm2dHl8+b0buHlFPuvJMOTNV1/jqR/uY3joCA2zg2P9ezizdhuqQyLMCxdgSimC8+P/28D32lXh24G/FlJ6hUJhyR2hXr9Ap5FDj0/hnXyV/OQQRmMSyzQodnWzcvUqVm/cyNNxjoeOTHO8kWQlrWIf+B2twiWsK7j0eQYvV9IsMscJedciSVKCRgNq0xA1uaHH4b/vXc97ujzCRpMzJ0/y6uAgJ44dI0ig1ruFE33bme4oIF0FcuEiRBRF1Gs1yDSHHwb2XVAW9zwP1/MuSoBlGKzpLmJLi7ihYbKMN/I63vhbeHEFFQdYlkXez3PKyjOocpywOhh1O5nu6CdGkhgm2iuAZWUJkVZQmYEkypKd+gwrRMxHNvbwL9bn8RsznDl1mpMnTjA9OUmiJUF+gJlVV1HqWcWEDsBIF1dVaE2tXm+P/wvK4mUy9eXeKIqwHeei1eE4TSlVa6zq6sQpCFSum6D3BprTO7FKZ/DG38KpnCGu1ihS4VYhCBHUhMXUWYfIzlEzbKpeEZ3roGZ7EIdQm8FBY8cBbhKy3VVsOvImz/1simazmeURpkvUfTmNgW1EfauJfJtKY/rccnoxS9KUJD63evxuCzMLbo15uRyue/E0E7L9ub7OfEa6BqUEaQyqniAqFazyGE5lDKM2gWhMIcMqlk7xbKuVj2fClaiVmCilssqtYaCUJlIKwy2QmB6h10VQGCDqWYPu7ccoWGhDMTozQy1ceru8XqsRZb0/Z2tMwBxtwO8Dv2sYBvlCYUm1pxCCvg4/26ic623ZbnAMKtboMIFmgKzPIMMAIwkxkxCiJsQhQivaIlhhOQjbJTVsYstF+50oL4/2XIRrYthgGJoUzdhMlZlGc0nwcRxTr9Xawe8LtDZHn75j1wW7w18F7krTdHMYBEsuhrTWTFTqoKE7nztXVBGtWUMagAM6b4IqoHQBrQSJ1sSqFQuVPq8LEIDMqsJIEFIgpcaQ2VY5IvOYRCnGZmrLAj8v8zvSwnjOTMgk56398qNkQsM/CMNQtgXPFzOlNaVqnUQpegs+ppRzdQ6i5WaGJptbFojQswmY8/3cewUQJAnjM8tXiYRhSJyNfdXCdrSN+dwrYWGJjGma+Pn8soXPOcemr+CTc5avKVqOiRbRlWbIRLVOlCxPMJUkCfVarZ36LiiRWUwlthf4DrDadhxyudyyJCmaTC7TmXMp+h6OaS5bHbYocKAZxZRrDapBuKQYom1KKeq1WltCexr4CC2R1HJUYi+QCY8fjsLQaStEl9PgVCmmag2qzZCC51BwHVzbyrSBs4ha7Pn294lSNKOYSiOgHkYkSi1bOKm1ptFozNYPf54FFGKz33nOFhJKCiFwPW9ZU+OchpDVCx3LJGfbuLaJbRoYbbFk6/UajVJZ4SRMEppRTDOKiZKseHEpitE2+Fm64eULJRcgoZMscNzzdkloE9F+mSEFUkhkWyqrzxOQKoXS+pJlshcB/+e0pLILgYdFhoDUCiUkrQc/Bzha67uajQZaqWXL5xZiOVWalBTSecF/qV5ZwpRSNBqNdqoLmVj6c23wYpGBd8lyecikZ57nLbyf+PdgSZLQPD/m4Z3K5RchYc6BCaMlQrwUGe27bVprwjAkDIL2VPfuHZhYhIQ5R2aEEFi2zXJFle+mxXFMEASzFzjv/pGZti11aEpKiW3b2I7zd0qE1po0TQmDoC1ygEUOTS12QOJtEdC2pY7NtVVmlm1jmua7dqRGKUWSJERRRHIeOPy8js1dhARY4OCkEALZqi+apnnJhydnH5pMkoQkSWbX8uHv6+DkEkQseHQWzh+fbX/EfDK0zkC3gLdL1/PS3n8YR2dn29s9PL1M+4d9eHq+/f96fP7/AVA/+mtM7QhMAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTA4LTEyVDIwOjAxOjQ1KzAwOjAwrxRBGQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0wOC0xMlQyMDowMTo0NSswMDowMN5J+aUAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjYtMDgtMTJUMjA6MDE6NTcrMDA6MDDSacnNAAAAAElFTkSuQmCC';

    const COLOR_PRIMARY = '#17B9C7';
    const COLOR_SECONDARY = '#149DA9';
    const COLOR_TERTIARY = '#0F808A';

    /* stolen from PM's animated text extension code :3 */
    const SANS_SERIF_ID = 'Sans Serif';
    const SERIF_ID = 'Serif';
    const HANDWRITING_ID = 'Handwriting';
    const MARKER_ID = 'Marker';
    const CURLY_ID = 'Curly';
    const PIXEL_ID = 'Pixel';

    const PLAYFUL_ID = 'Playful';
    const BUBBLY_ID = 'Bubbly';
    const BITSANDBYTES_ID = 'Bits and Bytes';
    const TECHNOLOGICAL_ID = 'Technological';
    const ARCADE_ID = 'Arcade';
    const ARCHIVO_ID = 'Archivo';
    const ARCHIVOBLACK_ID = 'Archivo Black';
    const SCRATCH_ID = 'Scratch';

    const RANDOM_ID = 'Random';

    const FONT_IDS = [
        SANS_SERIF_ID, SERIF_ID, HANDWRITING_ID, MARKER_ID, CURLY_ID, PIXEL_ID,
        PLAYFUL_ID, BUBBLY_ID, ARCADE_ID, BITSANDBYTES_ID, TECHNOLOGICAL_ID,
        SCRATCH_ID, ARCHIVO_ID, ARCHIVOBLACK_ID
    ];

    // in case the rendering screws up:
    const FONT_FALLBACKS = {
        [SANS_SERIF_ID]: 'sans-serif',
        [SERIF_ID]: 'serif',
        [HANDWRITING_ID]: 'cursive',
        [MARKER_ID]: 'fantasy',
        [CURLY_ID]: 'cursive',
        [PIXEL_ID]: 'monospace',
        [PLAYFUL_ID]: 'cursive',
        [BUBBLY_ID]: 'cursive',
        [BITSANDBYTES_ID]: 'monospace',
        [TECHNOLOGICAL_ID]: 'sans-serif',
        [ARCADE_ID]: 'monospace',
        [ARCHIVO_ID]: 'sans-serif',
        [ARCHIVOBLACK_ID]: 'sans-serif',
        [SCRATCH_ID]: 'sans-serif'
    };

    function cssFontFamily(fontId) {
        const fallback = FONT_FALLBACKS[fontId] || 'sans-serif';
        return `"${fontId}", ${fallback}`;
    }

    function randomFontOtherThan(currentFont) {
        const others = FONT_IDS.filter(id => id !== currentFont);
        return others[Math.floor(Math.random() * others.length)];
    }

    function buildFontMenuItems() {
        const builtIns = [{
                text: 'Sans Serif',
                value: SANS_SERIF_ID
            },
            {
                text: 'Serif',
                value: SERIF_ID
            },
            {
                text: 'Handwriting',
                value: HANDWRITING_ID
            },
            {
                text: 'Marker',
                value: MARKER_ID
            },
            {
                text: 'Curly',
                value: CURLY_ID
            },
            {
                text: 'Pixel',
                value: PIXEL_ID
            },
            {
                text: 'Playful',
                value: PLAYFUL_ID
            },
            {
                text: 'Bubbly',
                value: BUBBLY_ID
            },
            {
                text: 'Arcade',
                value: ARCADE_ID
            },
            {
                text: 'Bits and Bytes',
                value: BITSANDBYTES_ID
            },
            {
                text: 'Technological',
                value: TECHNOLOGICAL_ID
            },
            {
                text: 'Scratch',
                value: SCRATCH_ID
            },
            {
                text: 'Archivo',
                value: ARCHIVO_ID
            },
            {
                text: 'Archivo Black',
                value: ARCHIVOBLACK_ID
            }
        ];

        const customFonts = [];
        document.fonts.forEach(face => {
            if (!FONT_IDS.includes(face.family) && !customFonts.some(f => f.value === face.family)) {
                customFonts.push({
                    text: face.family,
                    value: face.family
                });
            }
        });

        return [
            ...builtIns,
            ...customFonts,
            {
                text: 'random font',
                value: RANDOM_ID
            }
        ];
    }

    const KNOWN_TAGS = ['color', 'b', 'i', 'u', 's', 'size', 'font'];
    const SELF_CLOSING_TAGS = ['wait'];
    const TAG_RE = /\[(\/?)([a-z0-9_-]+)(?:=([^\]]+))?\]/gi;
    const TAG_RE_STRIP = /\[(\/?)([a-z0-9_-]+)(?:=([^\]]+))?\]/gi;

    function parseRichText(text, base) {
        const stack = [Object.assign({
            customTags: []
        }, base)];
        const out = [];
        TAG_RE.lastIndex = 0;
        let i = 0;
        let match;
        while ((match = TAG_RE.exec(text)) !== null || i < text.length) {
            const tagStart = match ? match.index : text.length;
            while (i < tagStart) {
                const style = stack[stack.length - 1];
                out.push({
                    char: text[i],
                    color: style.color,
                    bold: style.bold,
                    italic: style.italic,
                    underline: style.underline,
                    strike: style.strike,
                    size: style.size,
                    font: style.font,
                    tags: style.customTags
                });
                i++;
            }
            if (!match) break;
            const closing = match[1] === '/';
            const tag = match[2].toLowerCase();
            const value = match[3];
            if (SELF_CLOSING_TAGS.indexOf(tag) !== -1) {
                i = match.index + match[0].length;
                continue;
            }
            if (closing) {
                if (stack.length > 1) stack.pop();
            } else {
                const prev = stack[stack.length - 1];
                const top = {
                    color: prev.color,
                    bold: prev.bold,
                    italic: prev.italic,
                    underline: prev.underline,
                    strike: prev.strike,
                    size: prev.size,
                    font: prev.font,
                    customTags: prev.customTags
                };
                if (KNOWN_TAGS.indexOf(tag) !== -1) {
                    switch (tag) {
                        case 'color':
                            top.color = value || top.color;
                            break;
                        case 'b':
                            top.bold = true;
                            break;
                        case 'i':
                            top.italic = true;
                            break;
                        case 'u':
                            top.underline = true;
                            break;
                        case 's':
                            top.strike = true;
                            break;
                        case 'size':
                            top.size = Number(value) || top.size;
                            break;
                        case 'font':
                            top.font = value === RANDOM_ID ?
                                randomFontOtherThan(prev.font) :
                                (value || top.font);
                            break;
                    }
                } else {
                    top.customTags = top.customTags.concat([tag]);
                }
                stack.push(top);
            }
            i = match.index + match[0].length;
        }
        return out;
    }

    function characterStyleSnapshot(style) {
        return {
            color: style.color,
            bold: style.bold,
            italic: style.italic,
            underline: style.underline,
            strike: style.strike,
            size: style.size,
            font: style.font,
            tags: Array.isArray(style.tags) ? style.tags.slice() : []
        };
    }

    function applyCharacterStyleOverrides(chars, overrides) {
        for (const index in overrides) {
            const char = chars[index];
            const override = overrides[index];
            if (!char || !override) continue;
            char.color = override.color;
            char.bold = override.bold;
            char.italic = override.italic;
            char.underline = override.underline;
            char.strike = override.strike;
            char.size = override.size;
            char.font = override.font;
        }
    }

    function characterStyleFromJSON(value, base) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
        const style = characterStyleSnapshot(base);
        if (typeof value.color === 'string') style.color = value.color;
        if (typeof value.bold === 'boolean') style.bold = value.bold;
        if (typeof value.italic === 'boolean') style.italic = value.italic;
        if (typeof value.underline === 'boolean') style.underline = value.underline;
        if (typeof value.strike === 'boolean') style.strike = value.strike;
        if (Number.isFinite(value.size)) style.size = Math.max(1, value.size);
        if (typeof value.font === 'string') style.font = value.font;
        if (Array.isArray(value.tags) && value.tags.every(tag => typeof tag === 'string')) {
            style.tags = value.tags.slice();
        }
        return style;
    }

    function stripMarkup(text) {
        TAG_RE_STRIP.lastIndex = 0;
        return text.replace(TAG_RE_STRIP, '');
    }

    function defaultBaseStyle() {
        return {
            color: '#9966ff',
            bold: false,
            italic: false,
            underline: false,
            strike: false,
            size: 32,
            font: HANDWRITING_ID,
            customTags: []
        };
    }

    const WAIT_RE = /\[wait=([0-9]*\.?[0-9]+)\]/gi;

    function splitWaitStages(text) {
        WAIT_RE.lastIndex = 0;
        const stages = [];
        let i = 0;
        let match;
        let textSoFar = '';
        while ((match = WAIT_RE.exec(text)) !== null) {
            textSoFar += text.slice(i, match.index);
            stages.push({
                text: textSoFar,
                waitAfter: Math.max(0, Number(match[1]) || 0)
            });
            i = match.index + match[0].length;
        }
        textSoFar += text.slice(i);
        stages.push({
            text: textSoFar,
            waitAfter: 0
        });
        return stages;
    }

    function defaultState() {
        return {
            rawText: '',
            finalText: '',
            visible: false,
            baseStyle: defaultBaseStyle(),
            align: 'center',
            smoothing: true,
            letterSpacing: 0,
            lineSpacing: 1.2,
            typingSpeeds: {
                default: 0.05,
                symbols: 0.05,
                punctuation: 0.15,
                numbers: 0.05
            },
            customTypingSpeeds: {},
            maxWidth: null,
            maxHeight: null,
            textShadow: {
                enabled: false,
                color: '#000000',
                opacity: 50,
                blur: 8,
                offsetX: 4,
                offsetY: 4
            },
            textBackground: {
                enabled: false,
                color: '#000000',
                opacity: 50,
                radius: 8,
                padding: 8
            },
            textBorder: {
                enabled: false,
                color: '#000000',
                opacity: 100,
                size: 2
            },
            charOverrides: {},
            charOverridesVersion: 0,
            resetCharTransformsOnText: true,
            charStyleOverrides: {},
            charStyleOverridesVersion: 0,
            typingControl: null,
            skinId: null,
            drawableWidth: 0,
            drawableHeight: 0,
            charBoxes: [],
            charsByTag: new Map(),
            shapeKey: null,
            layoutKey: null,
            layout: null,
            charBoxesLayout: null,
            paintDirty: true,
            paintFingerprint: null,
            lastFamiliesKey: null,
            lastFontDefs: '',
            revealToken: 0
        };
    }

    function getShapeKey(state) {
        const base = state.baseStyle;
        return [
            state.rawText,
            base.color,
            base.bold ? 1 : 0,
            base.italic ? 1 : 0,
            base.underline ? 1 : 0,
            base.strike ? 1 : 0,
            base.size,
            base.font,
            state.letterSpacing,
            state.lineSpacing,
            state.maxWidth || 0,
            state.maxHeight || 0,
            state.charStyleOverridesVersion
        ].join('\u0001');
    }

    function getState(target) {
        let state = target.getCustomState(STATE_KEY);
        if (!state) {
            state = defaultState();
            target.setCustomState(STATE_KEY, state);
        } else {
            const defaults = defaultState();
            state.textShadow = Object.assign(defaults.textShadow, state.textShadow || {});
            state.textBackground = Object.assign(defaults.textBackground, state.textBackground || {});
            state.textBorder = Object.assign(defaults.textBorder, state.textBorder || {});
            state.typingSpeeds = Object.assign(defaults.typingSpeeds, state.typingSpeeds || {});
            state.customTypingSpeeds = Object.assign({}, state.customTypingSpeeds || {});
            if (typeof state.smoothing !== 'boolean') state.smoothing = defaults.smoothing;
            state.charStyleOverrides = Object.assign({}, state.charStyleOverrides || {});
            if (typeof state.resetCharTransformsOnText !== 'boolean') state.resetCharTransformsOnText = defaults.resetCharTransformsOnText;
            if (typeof state.charStyleOverridesVersion !== 'number') state.charStyleOverridesVersion = 0;
            if (state.typingControl !== 'skip' && state.typingControl !== 'stop') state.typingControl = null;
        }
        return state;
    }

    const TYPING_PUNCTUATION = '.,!?;:\'"…';
    const TYPING_SYMBOLS = '@#$%^&*+=<>/\\|~`_-()[]{}';

    function typingGroupForCharacter(char) {
        if (/^[0-9]$/.test(char)) return 'numbers';
        if (TYPING_PUNCTUATION.includes(char)) return 'punctuation';
        if (TYPING_SYMBOLS.includes(char)) return 'symbols';
        return 'default';
    }

    function typingDelayForCharacter(state, char) {
        if (_hasOwn.call(state.customTypingSpeeds, char)) return state.customTypingSpeeds[char];
        return state.typingSpeeds[typingGroupForCharacter(char)];
    }

    function splitTypingSteps(text) {
        const steps = [];
        TAG_RE.lastIndex = 0;
        let lastIndex = 0;
        let match;

        const addCharacters = value => {
            for (const char of Array.from(value)) {
                steps.push({
                    content: char,
                    char
                });
            }
        };

        while ((match = TAG_RE.exec(text)) !== null) {
            addCharacters(text.slice(lastIndex, match.index));
            steps.push({
                content: match[0],
                char: null
            });
            lastIndex = match.index + match[0].length;
        }
        addCharacters(text.slice(lastIndex));
        return steps;
    }

    function exportTextSettings(state) {
        return JSON.stringify({
            version: 1,
            baseStyle: {
                color: state.baseStyle.color,
                bold: state.baseStyle.bold,
                italic: state.baseStyle.italic,
                underline: state.baseStyle.underline,
                strike: state.baseStyle.strike,
                size: state.baseStyle.size,
                font: state.baseStyle.font
            },
            align: state.align,
            smoothing: state.smoothing,
            resetCharTransformsOnText: state.resetCharTransformsOnText,
            letterSpacing: state.letterSpacing,
            lineSpacing: state.lineSpacing,
            typingSpeeds: Object.assign({}, state.typingSpeeds),
            customTypingSpeeds: Object.assign({}, state.customTypingSpeeds),
            maxWidth: state.maxWidth,
            maxHeight: state.maxHeight,
            textShadow: Object.assign({}, state.textShadow),
            textBackground: Object.assign({}, state.textBackground),
            textBorder: Object.assign({}, state.textBorder)
        });
    }

    function applyTextSettings(state, settings) {
        if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return false;

        const base = settings.baseStyle;
        if (base && typeof base === 'object' && !Array.isArray(base)) {
            if (typeof base.color === 'string') state.baseStyle.color = base.color;
            if (typeof base.bold === 'boolean') state.baseStyle.bold = base.bold;
            if (typeof base.italic === 'boolean') state.baseStyle.italic = base.italic;
            if (typeof base.underline === 'boolean') state.baseStyle.underline = base.underline;
            if (typeof base.strike === 'boolean') state.baseStyle.strike = base.strike;
            if (Number.isFinite(base.size)) state.baseStyle.size = Math.max(1, base.size);
            if (typeof base.font === 'string') state.baseStyle.font = base.font;
        }
        if (settings.align === 'left' || settings.align === 'center' || settings.align === 'right' || settings.align === 'justify') {
            state.align = settings.align;
        }
        if (typeof settings.smoothing === 'boolean') state.smoothing = settings.smoothing;
        if (typeof settings.resetCharTransformsOnText === 'boolean') state.resetCharTransformsOnText = settings.resetCharTransformsOnText;
        if (Number.isFinite(settings.letterSpacing)) state.letterSpacing = settings.letterSpacing;
        if (Number.isFinite(settings.lineSpacing)) state.lineSpacing = Math.max(0, settings.lineSpacing);
        if (settings.typingSpeeds && typeof settings.typingSpeeds === 'object' && !Array.isArray(settings.typingSpeeds)) {
            for (const group of ['default', 'symbols', 'punctuation', 'numbers']) {
                if (Number.isFinite(settings.typingSpeeds[group])) {
                    state.typingSpeeds[group] = Math.max(0, settings.typingSpeeds[group]);
                }
            }
        }
        if (settings.customTypingSpeeds && typeof settings.customTypingSpeeds === 'object' && !Array.isArray(settings.customTypingSpeeds)) {
            state.customTypingSpeeds = {};
            for (const char in settings.customTypingSpeeds) {
                if (Number.isFinite(settings.customTypingSpeeds[char])) {
                    state.customTypingSpeeds[char] = Math.max(0, settings.customTypingSpeeds[char]);
                }
            }
        }
        if (settings.maxWidth === null || Number.isFinite(settings.maxWidth)) state.maxWidth = settings.maxWidth;
        if (settings.maxHeight === null || Number.isFinite(settings.maxHeight)) state.maxHeight = settings.maxHeight;

        const copySettings = (source, target, keys) => {
            if (!source || typeof source !== 'object' || Array.isArray(source)) return;
            for (const key of keys) {
                if (typeof target[key] === 'boolean' && typeof source[key] === 'boolean') {
                    target[key] = source[key];
                } else if (typeof target[key] === 'number' && Number.isFinite(source[key])) {
                    target[key] = source[key];
                } else if (typeof target[key] === 'string' && typeof source[key] === 'string') {
                    target[key] = source[key];
                }
            }
        };

        copySettings(settings.textShadow, state.textShadow, ['enabled', 'color', 'opacity', 'blur', 'offsetX', 'offsetY']);
        copySettings(settings.textBackground, state.textBackground, ['enabled', 'color', 'opacity', 'radius', 'padding']);
        copySettings(settings.textBorder, state.textBorder, ['enabled', 'color', 'opacity', 'size']);
        state.shapeKey = null;
        state.layoutKey = null;
        state.layout = null;
        state.paintDirty = true;
        state.paintFingerprint = null;
        return true;
    }

    function getCharOverride(state, index) {
        if (!state.charOverrides[index]) {
            state.charOverrides[index] = {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1
            };
            state.charOverridesVersion++;
        }
        return state.charOverrides[index];
    }

    function resetCharacterTransformsState(state) {
        if (!Object.keys(state.charOverrides).length) return;
        state.charOverrides = {};
        state.charOverridesVersion++;
    }

    const SVG_NS = 'http://www.w3.org/2000/svg';
    let measureSvg = null;

    function getMeasureSvg() {
        if (measureSvg && document.body.contains(measureSvg)) return measureSvg;
        measureSvg = document.createElementNS(SVG_NS, 'svg');
        measureSvg.setAttribute('width', '0');
        measureSvg.setAttribute('height', '0');
        measureSvg.style.position = 'absolute';
        measureSvg.style.visibility = 'hidden';
        measureSvg.style.pointerEvents = 'none';
        document.body.appendChild(measureSvg);
        return measureSvg;
    }

    const GLYPH_OVERSAMPLE = 3;
    const GLYPH_PADDING_EM = 0.35;
    const glyphCache = new Map();
    const glyphMeasureCanvas = document.createElement('canvas');
    const glyphMeasureCtx = glyphMeasureCanvas.getContext('2d', {
        willReadFrequently: false
    });
    try {
        glyphMeasureCtx.textRendering = 'optimizeLegibility';
    } catch (e) {}

    const GLYPH_CACHE_LIMIT = 2000;
    const TINT_CACHE_LIMIT = 512;

    function glyphCacheKey(char, fontFamily, size, weight, style) {
        return char + '\u0001' + fontFamily + '\u0001' + size + '\u0001' +
            weight + '\u0001' + style;
    }

    function rasterizeGlyph(char, fontFamily, size, weight, style) {
        const px = Math.max(1, Math.round(size * GLYPH_OVERSAMPLE));
        const pad = Math.max(2, Math.round(size * GLYPH_PADDING_EM * GLYPH_OVERSAMPLE));
        const fontStr = `${style} ${weight} ${px}px ${fontFamily}`;

        glyphMeasureCtx.font = fontStr;
        glyphMeasureCtx.textBaseline = 'alphabetic';
        const metrics = glyphMeasureCtx.measureText(char);
        const ascent = Math.ceil(
            (typeof metrics.fontBoundingBoxAscent === 'number' ? metrics.fontBoundingBoxAscent : null) ??
            metrics.actualBoundingBoxAscent ?? (px * 0.9)
        );
        const descent = Math.ceil(
            (typeof metrics.fontBoundingBoxDescent === 'number' ? metrics.fontBoundingBoxDescent : null) ??
            metrics.actualBoundingBoxDescent ?? (px * 0.3)
        );
        const leftBearing = Math.ceil(Math.max(0, metrics.actualBoundingBoxLeft || 0));
        const rightBearing = Math.ceil(Math.max(
            metrics.actualBoundingBoxRight || 0,
            metrics.width || 0
        ));
        const advance = metrics.width;

        const canvasW = leftBearing + rightBearing + pad * 2;
        const canvasH = ascent + descent + pad * 2;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, canvasW);
        canvas.height = Math.max(1, canvasH);
        const ctx = canvas.getContext('2d');
        ctx.font = fontStr;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#ffffff';
        try {
            ctx.textRendering = 'optimizeLegibility';
        } catch (e) {}
        const baselineX = pad + leftBearing;
        const baselineY = pad + ascent;
        ctx.fillText(char, baselineX, baselineY);

        return {
            canvas,
            tinted: new Map(),
            advance: advance / GLYPH_OVERSAMPLE,
            baselineOriginXEm: baselineX / GLYPH_OVERSAMPLE,
            baselineOriginYEm: baselineY / GLYPH_OVERSAMPLE,
            fontAscentEm: ascent / GLYPH_OVERSAMPLE,
            fontDescentEm: descent / GLYPH_OVERSAMPLE
        };
    }

    function getGlyphShape(char, fontFamily, size, weight, style) {
        const key = glyphCacheKey(char, fontFamily, size, weight, style);
        let entry = glyphCache.get(key);
        if (!entry) {
            if (glyphCache.size >= GLYPH_CACHE_LIMIT) {
                glyphCache.delete(glyphCache.keys().next().value);
            }
            entry = rasterizeGlyph(char, fontFamily, size, weight, style);
            glyphCache.set(key, entry);
        }
        return entry;
    }

    function tintGlyph(shape, color) {
        let tintedCanvas = shape.tinted.get(color);
        if (tintedCanvas) return tintedCanvas;

        tintedCanvas = document.createElement('canvas');
        tintedCanvas.width = shape.canvas.width;
        tintedCanvas.height = shape.canvas.height;
        const tctx = tintedCanvas.getContext('2d');
        tctx.fillStyle = color;
        tctx.fillRect(0, 0, tintedCanvas.width, tintedCanvas.height);
        tctx.globalCompositeOperation = 'destination-in';
        tctx.drawImage(shape.canvas, 0, 0);

        if (shape.tinted.size >= TINT_CACHE_LIMIT) {
            shape.tinted.delete(shape.tinted.keys().next().value);
        }
        shape.tinted.set(color, tintedCanvas);
        return tintedCanvas;
    }

    function getGlyphBitmap(char, fontFamily, size, weight, style, color) {
        const shape = getGlyphShape(char, fontFamily, size, weight, style);
        const canvas = tintGlyph(shape, color);
        return {
            canvas,
            advance: shape.advance,
            baselineOriginXEm: shape.baselineOriginXEm,
            baselineOriginYEm: shape.baselineOriginYEm,
            fontAscentEm: shape.fontAscentEm,
            fontDescentEm: shape.fontDescentEm
        };
    }

    function strokeUnderline(ctx, glyph, glyphX, glyphY, startX, endX, y, lineWidth) {
        const stroke = (x1, x2) => {
            if (x2 <= x1) return;
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
        };

        try {
            const image = glyph.canvas.getContext('2d').getImageData(0, 0, glyph.canvas.width, glyph.canvas.height);
            const rowStart = Math.max(0, Math.floor(y - glyphY - lineWidth / 2));
            const rowEnd = Math.min(glyph.canvas.height - 1, Math.ceil(y - glyphY + lineWidth / 2));
            const columnStart = Math.max(0, Math.floor(startX - glyphX));
            const columnEnd = Math.min(glyph.canvas.width - 1, Math.ceil(endX - glyphX));
            const ink = new Uint8Array(glyph.canvas.width);

            for (let py = rowStart; py <= rowEnd; py++) {
                for (let px = columnStart; px <= columnEnd; px++) {
                    if (image.data[(py * glyph.canvas.width + px) * 4 + 3] > 16) ink[px] = 1;
                }
            }

            const padding = Math.max(1, Math.ceil(lineWidth / 2) + 1);
            let segmentStart = startX;
            let px = columnStart;
            while (px <= columnEnd) {
                if (!ink[px]) {
                    px++;
                    continue;
                }
                const inkStart = px;
                while (px <= columnEnd && ink[px]) px++;
                const skipStart = Math.max(startX, glyphX + inkStart - padding);
                const skipEnd = Math.min(endX, glyphX + px + padding);
                stroke(segmentStart, skipStart);
                segmentStart = Math.max(segmentStart, skipEnd);
            }
            stroke(segmentStart, endX);
        } catch (e) {
            stroke(startX, endX);
        }
    }

    function invalidateGlyphCacheForFamily(fontFamily) {
        for (const key of glyphCache.keys()) {
            if (key.indexOf('\u0001' + fontFamily + '\u0001') !== -1) glyphCache.delete(key);
        }
    }

    function svgFontStyle(style) {
        const fontFamily = cssFontFamily(style.font);
        const fontWeight = style.bold ? 'bold' : 'normal';
        const fontStyle = style.italic ? 'italic' : 'normal';
        const styleHash = ((hashString(fontFamily) * 33) ^ hashString(fontWeight) * 33 ^ hashString(fontStyle)) | 0;
        return {
            'font-family': fontFamily,
            'font-size': style.size,
            'font-weight': fontWeight,
            'font-style': fontStyle,
            'styleHash': styleHash
        };
    }

    function setAttrs(el, attrs) {
        for (const key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    function sameShapingStyle(a, b) {
        return a.font === b.font && a.size === b.size &&
            a.bold === b.bold && a.italic === b.italic &&
            a.color === b.color && a.underline === b.underline && a.strike === b.strike;
    }

    const _hasOwn = Object.prototype.hasOwnProperty;

    function splitShapingRuns(line, charOverrides, startGlobalIndex) {
        const runs = [];
        let current = null;
        let globalIndex = startGlobalIndex;

        for (const rc of line) {
            const hasOverride = _hasOwn.call(charOverrides, globalIndex);
            const breaksRun = !current || hasOverride || current.hasOverride ||
                !sameShapingStyle(current.style, rc);

            if (breaksRun) {
                current = {
                    chars: [],
                    style: rc,
                    startIndex: globalIndex,
                    hasOverride
                };
                runs.push(current);
            }
            current.chars.push(rc);
            globalIndex += 1;
        }
        return runs;
    }

    function measureShapedRuns(svg, runs, letterSpacing) {
        const textEl = document.createElementNS(SVG_NS, 'text');
        const tspans = [];
        for (const run of runs) {
            const tspan = document.createElementNS(SVG_NS, 'tspan');
            run.fontStyle = svgFontStyle(run.style);
            run.text = run.chars.map(rc => (rc.char === ' ' ? '\u00A0' : rc.char)).join('');
            setAttrs(tspan, run.fontStyle);
            if (letterSpacing) tspan.setAttribute('letter-spacing', letterSpacing);
            tspan.textContent = run.text;
            textEl.appendChild(tspan);
            tspans.push(tspan);
        }
        svg.appendChild(textEl);

        let globalOffset = 0;
        for (let r = 0; r < runs.length; r++) {
            const run = runs[r];
            const n = run.chars.length;
            const positions = new Array(n);
            const runOrigin = n > 0 ?
                (safeStartX(textEl, globalOffset)) :
                0;
            for (let i = 0; i < n; i++) {
                const idx = globalOffset + i;
                let shapedX = 0;
                let advance;
                try {
                    shapedX = textEl.getStartPositionOfChar(idx).x - runOrigin;
                    advance = textEl.getExtentOfChar(idx).width;
                } catch (e) {
                    const before = i === 0 ? 0 : tspans[r].getSubStringLength(0, i);
                    const upTo = tspans[r].getSubStringLength(0, i + 1);
                    shapedX = before;
                    advance = upTo - before;
                }
                positions[i] = {
                    shapedX,
                    advance
                };
            }
            run.positions = positions;
            run.runWidth = tspans[r].getComputedTextLength();
            globalOffset += n;
        }

        svg.removeChild(textEl);
    }

    function safeStartX(textEl, idx) {
        try {
            return textEl.getStartPositionOfChar(idx).x;
        } catch (e) {
            return 0;
        }
    }

    function measureRichText(svg, richChars, state) {
        const hardLines = [
            []
        ];
        for (const rc of richChars) {
            if (rc.char === '\n') {
                hardLines.push([]);
            } else {
                hardLines[hardLines.length - 1].push(rc);
            }
        }

        let globalIndex = 0;
        for (const line of hardLines) {
            const runs = splitShapingRuns(line, state.charOverrides, globalIndex);
            if (runs.length) measureShapedRuns(svg, runs, state.letterSpacing);
            for (const run of runs) {
                for (let i = 0; i < run.chars.length; i++) {
                    run.chars[i]._width = run.positions[i].advance;
                }
            }
            globalIndex += line.length + 1;
        }

        const lines = [];
        const lineWidths = [];
        const lineRuns = [];
        const charsByTag = new Map();

        let maxWidth = 0;
        const wrapLimit = state.maxWidth && state.maxWidth > 0 ? state.maxWidth : Infinity;

        for (const hardLine of hardLines) {
            let currentLine = [];
            let currentLineWidth = 0;

            for (let i = 0; i < hardLine.length; i++) {
                const rc = hardLine[i];
                const w = rc._width;

                if (currentLineWidth + w > wrapLimit && currentLine.length > 0) {
                    let spaceIdx = -1;
                    for (let j = currentLine.length - 1; j >= 0; j--) {
                        if (currentLine[j].char === ' ' || currentLine[j].char === '-') {
                            spaceIdx = j;
                            break;
                        }
                    }

                    if (spaceIdx !== -1 && spaceIdx < currentLine.length - 1) {
                        const nextLineInitial = currentLine.splice(spaceIdx + 1);
                        currentLineWidth = currentLine.reduce((sum, c) => sum + c._width, 0);

                        lines.push([...currentLine]);
                        lineWidths.push(currentLineWidth);
                        if (currentLineWidth > maxWidth) maxWidth = currentLineWidth;

                        currentLine = nextLineInitial;
                        currentLineWidth = currentLine.reduce((sum, c) => sum + c._width, 0);
                    } else {
                        lines.push([...currentLine]);
                        lineWidths.push(currentLineWidth);
                        if (currentLineWidth > maxWidth) maxWidth = currentLineWidth;

                        currentLine = [];
                        currentLineWidth = 0;
                    }
                }

                currentLine.push(rc);
                currentLineWidth += w;
            }

            if (currentLine.length > 0) {
                lines.push(currentLine);
                lineWidths.push(currentLineWidth);
                if (currentLineWidth > maxWidth) maxWidth = currentLineWidth;
            } else if (hardLine.length === 0) {
                lines.push([]);
                lineWidths.push(0);
            }
        }

        globalIndex = 0;
        let hardLineIndex = 0;
        let charsProcessed = 0;

        for (let li = 0; li < lines.length; li++) {
            const line = lines[li];
            const runs = splitShapingRuns(line, state.charOverrides, globalIndex);

            let runStartX = 0;
            for (const run of runs) {
                run.fontStyle = svgFontStyle(run.style);
                run.runStartX = runStartX;
                run.positions = [];
                let charX = 0;
                for (let i = 0; i < run.chars.length; i++) {
                    const w = run.chars[i]._width;
                    run.positions.push({
                        shapedX: charX,
                        advance: w
                    });
                    addTagIndex(charsByTag, run.startIndex + i, run.chars[i].tags);
                    charX += w;
                    runStartX += w;
                }
                run.runWidth = runStartX - run.runStartX;
            }

            lineRuns.push(runs);
            globalIndex += line.length;
            charsProcessed += line.length;

            if (charsProcessed >= hardLines[hardLineIndex].length) {
                globalIndex++;
                charsProcessed = 0;
                hardLineIndex++;
            }
        }

        return {
            lines,
            lineWidths,
            maxWidth,
            lineRuns,
            charsByTag
        };
    }

    function fingerprintPaintOps(paintOps, docW, docH) {
        let hash = (docW * 2654435761) ^ (docH * 40503);
        hash = (hash * 33) ^ paintOps.length;
        for (let i = 0; i < paintOps.length; i++) {
            const op = paintOps[i];
            hash = (hash * 33) ^ hashString(op.text);
            hash = (hash * 33) ^ ((op.x * 100) | 0);
            hash = (hash * 33) ^ ((op.y * 100) | 0);
            hash = (hash * 33) ^ ((op.rotation * 100) | 0);
            hash = (hash * 33) ^ ((op.opacity * 1000) | 0);
            hash = (hash * 33) ^ hashString(op.color);
            hash = (hash * 33) ^ op.font.styleHash;
            hash = (hash * 33) ^ ((op.font['font-size'] * 100) | 0);
            hash = (hash * 33) ^ ((op.letterSpacing * 100) | 0);
            hash = (hash * 33) ^ (op.underline ? 1 : 0);
            hash = (hash * 33) ^ (op.strike ? 1 : 0);
        }
        return hash | 0;
    }

    function hashString(str) {
        if (!str) return 0;
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        }
        return h;
    }

    const pendingRenderTargets = new Set();
    let renderFlushScheduled = false;

    function requestRenderFlush() {
        if (renderFlushScheduled) return;
        renderFlushScheduled = true;
        Promise.resolve().then(flushPendingRenders);
    }

    function scheduleRender(target) {
        pendingRenderTargets.add(target);
        requestRenderFlush();
    }

    function flushPendingRenders() {
        renderFlushScheduled = false;
        const renderTargets = new Set(pendingRenderTargets);
        for (const target of renderTargets) {
            pendingRenderTargets.delete(target);
            const state = getState(target);
            if (state.visible) renderTarget(target);
        }
        if (pendingRenderTargets.size) requestRenderFlush();
    }

    function flushRenderIfDirty(target) {
        if (!pendingRenderTargets.has(target)) return;
        pendingRenderTargets.delete(target);
        const state = getState(target);
        if (state.visible) renderTarget(target);
        if (pendingRenderTargets.size) requestRenderFlush();
    }

    function scheduleTextRender(target) {
        scheduleRender(target);
    }

    function schedulePaint(target, state) {
        state.paintDirty = true;
        state.paintFingerprint = null;
        if (state.visible) scheduleRender(target);
    }

    function getLayoutKey(state) {
        return getShapeKey(state) + '\u0002' + state.charOverridesVersion;
    }

    const EMPTY_OVERRIDE = {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1
    };

    function addTagIndex(charsByTag, index, tags) {
        if (!tags || !tags.length) return;
        for (let t = 0; t < tags.length; t++) {
            const tag = tags[t];
            let list = charsByTag.get(tag);
            if (!list) {
                list = [];
                charsByTag.set(tag, list);
            }
            list.push(index);
        }
    }

    function renderTarget(target) {
        const state = getState(target);
        if (!state.visible) return;

        const shapeKey = getShapeKey(state);
        let layout = state.layout;
        if (state.shapeKey !== shapeKey || !layout) {
            const richChars = parseRichText(state.rawText, state.baseStyle);
            applyCharacterStyleOverrides(richChars, state.charStyleOverrides);
            for (const family of new Set(richChars.map(rc => rc.font))) {
                ensureDocumentFont(family);
            }
            const svg = getMeasureSvg();
            const measured = measureRichText(svg, richChars, state);
            layout = measured;
            state.shapeKey = shapeKey;
            state.layout = layout;
        }
        state.layoutKey = getLayoutKey(state);
        const {
            lines,
            lineWidths,
            maxWidth,
            lineRuns
        } = layout;

        const lineHeight = state.baseStyle.size * state.lineSpacing;
        const totalHeight = lines.length * lineHeight;

        const decorationPad = Math.max(
            0,
            Number(state.textBackground.padding) || 0,
            Number(state.textBorder.size) || 0,
            (Number(state.textShadow.blur) || 0) + Math.abs(Number(state.textShadow.offsetX) || 0),
            (Number(state.textShadow.blur) || 0) + Math.abs(Number(state.textShadow.offsetY) || 0)
        );
        const pad = Math.max(64, state.baseStyle.size * 2, decorationPad + state.baseStyle.size);

        const effectiveMaxWidth = state.maxWidth && state.maxWidth > 0 ? state.maxWidth : maxWidth;
        const effectiveMaxHeight = state.maxHeight && state.maxHeight > 0 ? state.maxHeight : totalHeight;

        const docW = Math.ceil(effectiveMaxWidth + pad * 2);
        const docH = Math.ceil(effectiveMaxHeight + pad * 2);

        const originX = docW / 2;
        const originY = docH / 2;

        let charBoxes = state.charBoxes;
        if (state.charBoxesLayout !== layout) {
            charBoxes = [];
            state.charBoxes = charBoxes;
            state.charBoxesLayout = layout;
        }
        const charsByTag = layout.charsByTag;
        const paintOps = [];
        const letterSpacing = state.letterSpacing || 0;

        for (let li = 0; li < lines.length; li++) {
            const line = lines[li];
            const runs = lineRuns[li];
            const lineW = lineWidths[li];
            const justifySpaceCount = state.align === 'justify' && li < lines.length - 1 &&
                effectiveMaxWidth > lineW ?
                line.filter(rc => rc.char === ' ').length : 0;
            const justifyExtra = justifySpaceCount > 0 ?
                (effectiveMaxWidth - lineW) / justifySpaceCount : 0;
            let lineX;

            if (state.align === 'left') {
                lineX = originX - effectiveMaxWidth / 2;
            } else if (state.align === 'right') {
                lineX = originX + effectiveMaxWidth / 2 - lineW;
            } else if (state.align === 'justify') {
                lineX = originX - effectiveMaxWidth / 2;
            } else {
                lineX = originX - lineW / 2;
            }

            const textStartY = originY - totalHeight / 2;
            const baseCenterY = textStartY + (li * lineHeight) + lineHeight * 0.5;

            let spacesBefore = 0;
            for (const run of runs) {
                const rc0 = run.chars[0];

                const underline = !!rc0.underline;
                const strike = !!rc0.strike;
                const style = run.fontStyle;
                const runOriginX = lineX + run.runStartX;

                for (let i = 0; i < run.chars.length; i++) {
                    const rc = run.chars[i];
                    const pos = run.positions[i];
                    const index = run.startIndex + i;
                    const o = run.hasOverride ?
                        (state.charOverrides[index] || EMPTY_OVERRIDE) :
                        EMPTY_OVERRIDE;

                    const charCenterX = runOriginX + pos.shapedX + pos.advance / 2 +
                        spacesBefore * justifyExtra + o.x;
                    const charCenterY = baseCenterY - o.y;
                    const rotation = o.rotation || 0;
                    const opacity = o.opacity == null ? 1 : o.opacity;
                    const ch = rc.char === ' ' ? '\u00A0' : rc.char;

                    paintOps.push({
                        text: ch,
                        x: charCenterX,
                        y: charCenterY,
                        rotation,
                        opacity,
                        color: rc.color,
                        font: style,
                        rawFontFamily: rc0.font,
                        letterSpacing,
                        underline,
                        strike,
                        width: pos.advance
                    });

                    if (rc.char === ' ') spacesBefore++;

                    let box = charBoxes[index];
                    if (!box) {
                        box = {
                            index,
                            char: rc.char,
                            tags: rc.tags,
                            width: pos.advance,
                            height: rc.size,
                            style: characterStyleSnapshot(rc)
                        };
                        charBoxes[index] = box;
                    }
                    box.style = characterStyleSnapshot(rc);
                    box.x = charCenterX - originX;
                    box.y = originY - charCenterY;
                }
            }
        }

        state.charBoxes = charBoxes;
        state.charsByTag = charsByTag;
        state.drawableWidth = docW;
        state.drawableHeight = docH;

        const fingerprint = fingerprintPaintOps(paintOps, docW, docH);
        if (fingerprint === state.paintFingerprint && state.skinId !== null) {
            state.paintDirty = false;
            return;
        }
        state.paintFingerprint = fingerprint;

        const canvas = compositeGlyphsToCanvas(state, paintOps, docW, docH, effectiveMaxWidth, totalHeight, originX, originY);
        pushCanvasToDrawable(target, canvas, docW, docH);
        state.paintDirty = false;
    }

    const loadedDocumentFonts = new Set();
    const pendingDocumentFonts = new Map();

    function rerenderVisibleTextTargets() {
        for (const candidate of runtime.targets) {
            const state = candidate.getCustomState(STATE_KEY);
            if (!state || !state.visible) continue;
            state.shapeKey = null;
            state.layoutKey = null;
            state.layout = null;
            state.paintFingerprint = null;
            scheduleRender(candidate);
        }
    }

    function ensureDocumentFont(fontId) {
        if (!document.fonts || loadedDocumentFonts.has(fontId) || pendingDocumentFonts.has(fontId)) return;
        const promise = document.fonts.load(`16px ${cssFontFamily(fontId)}`, 'M')
            .then(() => {
                loadedDocumentFonts.add(fontId);
                invalidateGlyphCacheForFamily(cssFontFamily(fontId));
                rerenderVisibleTextTargets();
            })
            .catch(() => {})
            .finally(() => {
                pendingDocumentFonts.delete(fontId);
            });
        pendingDocumentFonts.set(fontId, promise);
    }

    const DEST_SCALE = GLYPH_OVERSAMPLE;

    function compositeGlyphsToCanvas(state, paintOps, docW, docH, textWidth, textHeight, originX, originY) {
        let canvas = state.paintCanvas;
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.reusable = false;
            state.paintCanvas = canvas;
            state.paintCtx = canvas.getContext('2d');
        }
        const pixelW = Math.max(1, Math.round(docW * DEST_SCALE));
        const pixelH = Math.max(1, Math.round(docH * DEST_SCALE));
        if (canvas.width !== pixelW || canvas.height !== pixelH) {
            canvas.width = pixelW;
            canvas.height = pixelH;
        }
        const ctx = state.paintCtx;
        ctx.imageSmoothingEnabled = !!state.smoothing;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, pixelW, pixelH);
        ctx.textBaseline = 'alphabetic';

        const background = state.textBackground;
        if (background.enabled) {
            const padding = Math.max(0, Number(background.padding) || 0) * DEST_SCALE;
            const width = textWidth * DEST_SCALE + padding * 2;
            const height = textHeight * DEST_SCALE + padding * 2;
            const x = originX * DEST_SCALE - width / 2;
            const y = originY * DEST_SCALE - height / 2;
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(100, Number(background.opacity) || 0)) / 100;
            ctx.fillStyle = background.color;
            const radius = Math.min(Math.max(0, Number(background.radius) || 0) * DEST_SCALE, width / 2, height / 2);
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            ctx.fill();
            ctx.restore();
        }

        for (let i = 0; i < paintOps.length; i++) {
            const op = paintOps[i];
            if (op.text === '\u00A0' || op.text === '') continue;

            const fontFamily = op.font['font-family'];
            const fontSize = op.font['font-size'];
            const fontWeight = op.font['font-weight'];
            const fontStyle = op.font['font-style'];

            const glyph = getGlyphBitmap(op.text, fontFamily, fontSize, fontWeight, fontStyle, op.color);

            const advanceCenterXEm = glyph.baselineOriginXEm + glyph.advance / 2;
            const baselineYFromLineCenter = (glyph.fontAscentEm - glyph.fontDescentEm) / 2;
            const drawXEm = op.x - advanceCenterXEm;
            const drawYEm = (op.y + baselineYFromLineCenter) - glyph.baselineOriginYEm;

            const hasOpacity = op.opacity != null && op.opacity !== 1;
            const hasRotation = !!op.rotation;

            const drawGlyph = (drawX, drawY) => {
                ctx.drawImage(glyph.canvas, drawX, drawY);
            };

            if (state.textShadow.enabled) {
                ctx.save();
                ctx.globalAlpha = (hasOpacity ? op.opacity : 1) * Math.max(0, Math.min(100, Number(state.textShadow.opacity) || 0)) / 100;
                ctx.shadowColor = state.textShadow.color;
                ctx.shadowBlur = Math.max(0, Number(state.textShadow.blur) || 0) * DEST_SCALE;
                ctx.shadowOffsetX = (Number(state.textShadow.offsetX) || 0) * DEST_SCALE;
                ctx.shadowOffsetY = (Number(state.textShadow.offsetY) || 0) * DEST_SCALE;
                if (!hasRotation) {
                    drawGlyph(drawXEm * DEST_SCALE, drawYEm * DEST_SCALE);
                } else {
                    const cx = op.x * DEST_SCALE;
                    const cy = op.y * DEST_SCALE;
                    ctx.translate(cx, cy);
                    ctx.rotate(-op.rotation * Math.PI / 180);
                    ctx.translate(-cx, -cy);
                    drawGlyph(drawXEm * DEST_SCALE, drawYEm * DEST_SCALE);
                }
                ctx.restore();
            }

            if (op.underline || op.strike) {
                ctx.save();
                if (hasOpacity) ctx.globalAlpha = op.opacity;
                ctx.strokeStyle = op.color;
                ctx.lineWidth = Math.max(1, fontSize * 0.06) * DEST_SCALE;
                if (op.strike) {
                    const sy = op.y * DEST_SCALE;
                    ctx.beginPath();
                    ctx.moveTo((op.x - op.width / 2) * DEST_SCALE, sy);
                    ctx.lineTo((op.x + op.width / 2) * DEST_SCALE, sy);
                    ctx.stroke();
                }
                ctx.restore();
            }

            if (state.textBorder.enabled && Number(state.textBorder.size) > 0) {
                const shape = getGlyphShape(op.text, fontFamily, fontSize, fontWeight, fontStyle);
                const borderGlyph = tintGlyph(shape, state.textBorder.color);
                ctx.save();
                ctx.globalAlpha = (hasOpacity ? op.opacity : 1) * Math.max(0, Math.min(100, Number(state.textBorder.opacity) || 0)) / 100;
                const borderSize = Math.max(0, Number(state.textBorder.size) || 0) * DEST_SCALE;
                const borderOffsets = [[-borderSize, 0], [borderSize, 0], [0, -borderSize], [0, borderSize], [-borderSize, -borderSize], [borderSize, -borderSize], [-borderSize, borderSize], [borderSize, borderSize]];
                for (const [offsetX, offsetY] of borderOffsets) {
                    if (!hasRotation) {
                        ctx.drawImage(borderGlyph, drawXEm * DEST_SCALE + offsetX, drawYEm * DEST_SCALE + offsetY);
                    } else {
                        const cx = op.x * DEST_SCALE;
                        const cy = op.y * DEST_SCALE;
                        ctx.save();
                        ctx.translate(cx, cy);
                        ctx.rotate(-op.rotation * Math.PI / 180);
                        ctx.translate(-cx, -cy);
                        ctx.drawImage(borderGlyph, drawXEm * DEST_SCALE + offsetX, drawYEm * DEST_SCALE + offsetY);
                        ctx.restore();
                    }
                }
                ctx.restore();
            }

            if (!hasRotation) {
                const px = Math.round(drawXEm * DEST_SCALE);
                const py = Math.round(drawYEm * DEST_SCALE);
                if (hasOpacity) {
                    ctx.save();
                    ctx.globalAlpha = op.opacity;
                    ctx.drawImage(glyph.canvas, px, py);
                    ctx.restore();
                } else {
                    ctx.drawImage(glyph.canvas, px, py);
                }
            } else {
                ctx.save();
                if (hasOpacity) ctx.globalAlpha = op.opacity;
                const cx = op.x * DEST_SCALE;
                const cy = op.y * DEST_SCALE;
                ctx.translate(cx, cy);
                ctx.rotate(-op.rotation * Math.PI / 180);
                ctx.translate(-cx, -cy);
                ctx.drawImage(glyph.canvas, drawXEm * DEST_SCALE, drawYEm * DEST_SCALE);
                ctx.restore();
            }

            if (op.underline) {
                ctx.save();
                if (hasOpacity) ctx.globalAlpha = op.opacity;
                ctx.strokeStyle = op.color;
                const lineWidth = Math.max(1, fontSize * 0.06) * DEST_SCALE;
                ctx.lineWidth = lineWidth;
                const uy = (op.y + baselineYFromLineCenter + fontSize * 0.06) * DEST_SCALE;
                const startX = (op.x - op.width / 2) * DEST_SCALE;
                const endX = (op.x + op.width / 2) * DEST_SCALE;
                if (hasRotation) {
                    ctx.beginPath();
                    ctx.moveTo(startX, uy);
                    ctx.lineTo(endX, uy);
                    ctx.stroke();
                } else {
                    strokeUnderline(ctx, glyph, Math.round(drawXEm * DEST_SCALE), Math.round(drawYEm * DEST_SCALE), startX, endX, uy, lineWidth);
                }
                ctx.restore();
            }

        }

        return canvas;
    }

    function installLinearFiltering(skin, state) {
        skin.useNearest = function(scale) {
            if (!state.smoothing) return true;
            const s = Math.max(Math.abs(scale[0]), Math.abs(scale[1]));
            return s >= (DEST_SCALE * 100 - 5);
        };
    }

    function pushCanvasToDrawable(target, canvas, width, height) {
        const state = getState(target);
        const renderer = runtime.renderer;
        if (!renderer) return;
        const rotationCenter = [width / 2, height / 2];

        if (state.skinId === null) {
            const BitmapSkin = renderer.exports.BitmapSkin;
            const skinId = renderer._nextSkinId++;
            const skin = new BitmapSkin(skinId, renderer);
            installLinearFiltering(skin, state);
            skin.setBitmap(canvas, DEST_SCALE, rotationCenter);
            renderer._allSkins[skinId] = skin;
            state.skinId = skinId;
        } else {
            renderer.updateBitmapSkin(state.skinId, canvas, DEST_SCALE, rotationCenter);
            const current = renderer._allSkins[state.skinId];
            if (current && !Object.prototype.hasOwnProperty.call(current, 'useNearest')) {
                installLinearFiltering(current, state);
            }
        }
        renderer.updateDrawableSkinId(target.drawableID, state.skinId);
        runtime.requestRedraw();
    }

    function clearTarget(target) {
        const state = getState(target);
        state.visible = false;
        state.revealToken++;
        state.paintDirty = true;
        state.paintFingerprint = null;
        const costume = target.getCostumes()[target.currentCostume];
        if (costume && runtime.renderer) {
            runtime.renderer.updateDrawableSkinId(target.drawableID, costume.skinId);
            runtime.requestRedraw();
        }
    }

    function startTypingCharacterHat(target, char, index) {
        const current = {
            char,
            index
        };
        target._irisTypingChar = current;
        const threads = runtime.startHats('irisText_onCharacterType', null, target);
        if (Array.isArray(threads)) {
            for (const thread of threads) {
                thread._irisChar = current;
            }
        }
        target._irisTypingChar = null;
    }

    function taggedCharacterIndices(target, tag) {
        const state = getState(target);
        const chars = parseRichText(state.rawText, state.baseStyle);
        const indices = [];
        for (let index = 0; index < chars.length; index++) {
            if (chars[index].tags.includes(tag)) indices.push(index);
        }
        return indices;
    }

    class IrisText {
        constructor() {
            this._onTargetRemoved = this._onTargetRemoved.bind(this);
            runtime.on('targetWasRemoved', this._onTargetRemoved);
            runtime.on('PROJECT_STOP_ALL', () => {
                runtime.targets.forEach(t => clearTarget(t));
            });
            runtime.ext_irisText = this;
            if (typeof runtime.registerCompiledExtensionBlocks === 'function') {
                runtime.registerCompiledExtensionBlocks('irisText', this.getCompileInfo());
            }
        }

        *_repeatCompiledTag(tagInput, func, thread, target, stage) {
            const tag = Scratch.Cast.toString(tagInput).toLowerCase();
            const indices = taggedCharacterIndices(target, tag);
            const rootFrame = thread.stackFrames[0];
            rootFrame.irisTagCharacterNumber = 0;

            for (const index of indices) {
                rootFrame.irisTagCharacterNumber = index + 1;
                yield* func(thread, target, runtime, stage);
            }
        }

        getCompileInfo() {
            return {
                ir: {
                    repeatForTag: (generator, block) => ({
                        kind: 'stack',
                        tag: generator.descendInputOfBlock(block, 'TAG'),
                        substack: generator.descendSubstack(block, 'SUBSTACK')
                    }),
                    currentCharValue: () => ({
                        kind: 'input'
                    }),
                    currentCharIndex: () => ({
                        kind: 'input'
                    })
                },
                js: {
                    repeatForTag: (node, compiler, imports) => {
                        const temp = compiler.source;
                        compiler.source = '(function*(thread, target, runtime, stage) {\n';
                        if (node.substack) {
                            compiler.descendStack(node.substack, new imports.Frame(false));
                        }
                        compiler.source += '})';
                        const funcExpr = compiler.source;
                        compiler.source = temp;
                        compiler.source += `yield* runtime.ext_irisText._repeatCompiledTag(${compiler.descendInput(node.tag).asString()}, ${funcExpr}, thread, target, stage);\n`;
                    },
                    currentCharValue: (node, compiler, imports) => {
                        return new imports.TypedInput('(thread && thread._irisChar ? thread._irisChar.char : (target && target._irisTypingChar ? target._irisTypingChar.char : ""))', imports.TYPE_STRING);
                    },
                    currentCharIndex: (node, compiler, imports) => {
                        return new imports.TypedInput('(thread && thread.stackFrames[0] && thread.stackFrames[0].irisTagCharacterNumber !== undefined ? thread.stackFrames[0].irisTagCharacterNumber : (thread && thread._irisChar ? thread._irisChar.index + 1 : (target && target._irisTypingChar ? target._irisTypingChar.index + 1 : 0)))', imports.TYPE_NUMBER);
                    }
                }
            };
        }

        _onTargetRemoved(target) {
            const state = target.getCustomState(STATE_KEY);
            if (state && state.skinId !== null && runtime.renderer) {
                runtime.renderer.destroySkin(state.skinId);
                state.skinId = null;
            }
        }

        getInfo() {
            return {
                id: 'g1nxIrisText',
                name: 'Iris Text',
                color1: COLOR_PRIMARY,
                color2: COLOR_SECONDARY,
                color3: COLOR_TERTIARY,
                blockIconURI: blockIconURI,
                blocks: [{
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Display'
                    },
                    {
                        opcode: 'setText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'show text [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: DEFAULT_TEXT
                            }
                        }
                    },
					{
                        opcode: 'addLine',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add line [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "This is another line!"
                            }
                        }
                    },
                    {
                        opcode: 'clearText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'show sprite (hide text)'
                    },
                    {
                        opcode: 'renderNow',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'refresh text'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Style'
                    },
                    {
                        opcode: 'setBaseColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text color to [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: 'setBaseSize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text size to [SIZE]',
                        arguments: {
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 32
                            }
                        }
                    },
                    {
                        opcode: 'setFont',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set font to [FONT]',
                        arguments: {
                            FONT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FONT',
                                defaultValue: HANDWRITING_ID
                            }
                        }
                    },
                    {
                        opcode: 'setAlign',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'align text [ALIGN]',
                        arguments: {
                            ALIGN: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ALIGN',
                                defaultValue: 'center'
                            }
                        }
                    },
                    {
                        opcode: 'setSmoothing',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'smoothing [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'on'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Typing'
                    },
                    {
                        opcode: 'typeText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'type [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: DEFAULT_TEXT
                            }
                        }
                    },
                    {
                        opcode: 'typeNewLine',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'type new line [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: DEFAULT_TEXT
                            }
                        }
                    },
                    {
                        opcode: 'skipTyping',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'skip typing'
                    },
                    {
                        opcode: 'stopTyping',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop typing'
                    },
                    {
                        opcode: 'setTypingSpeed',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set typing speed for [GROUP] characters to [SECONDS] seconds',
                        arguments: {
                            GROUP: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'TYPING_GROUP',
                                defaultValue: 'default'
                            },
                            SECONDS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.05
                            }
                        }
                    },
                    {
                        opcode: 'setCustomTypingSpeed',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set typing speed for custom characters [CHARS] to [SECONDS] seconds',
                        arguments: {
                            CHARS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '…'
                            },
                            SECONDS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.2
                            }
                        }
                    },
                    {
                        opcode: 'onCharacterType',
                        blockType: Scratch.BlockType.EVENT,
                        isEdgeActivated: false,
                        shouldRestartExistingThreads: false,
                        text: 'on character type'
                    },
                    {
                        opcode: 'currentCharValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'character'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Text Shadow'
                    },
                    {
                        opcode: 'setTextShadowEnabled',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'text shadow [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'on'
                            }
                        }
                    },
                    {
                        opcode: 'setTextShadowColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set shadow color to [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: 'setTextShadowOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set shadow opacity to [PCT] %',
                        arguments: {
                            PCT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            }
                        }
                    },
                    {
                        opcode: 'setTextShadowBlur',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set shadow blur to [BLUR]',
                        arguments: {
                            BLUR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 8
                            }
                        }
                    },
                    {
                        opcode: 'setTextShadowOffset',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set shadow offset x [X] y [Y]',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Text Background'
                    },
                    {
                        opcode: 'setTextBackgroundEnabled',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'text background [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'on'
                            }
                        }
                    },
                    {
                        opcode: 'setTextBackgroundColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text background color to [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: 'setTextBackgroundOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text background opacity to [PCT] %',
                        arguments: {
                            PCT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            }
                        }
                    },
                    {
                        opcode: 'setTextBackgroundRadius',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text background radius to [RADIUS]',
                        arguments: {
                            RADIUS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 8
                            }
                        }
                    },
                    {
                        opcode: 'setTextBackgroundPadding',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text background padding to [PADDING]',
                        arguments: {
                            PADDING: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 8
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Text Border'
                    },
                    {
                        opcode: 'setTextBorderEnabled',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'text border [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'on'
                            }
                        }
                    },
                    {
                        opcode: 'setTextBorderColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text border color to [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: 'setTextBorderOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text border opacity to [PCT] %',
                        arguments: {
                            PCT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'setTextBorderSize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set text border size to [SIZE]',
                        arguments: {
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Size Constraints'
                    },
                    {
                        opcode: 'setMaxWidth',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set max width to [WIDTH]',
                        arguments: {
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    },
                    {
                        opcode: 'setMaxHeight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set max height to [HEIGHT]',
                        arguments: {
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    },
                    {
                        opcode: 'setMaxDimensions',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set max width to [WIDTH] and max height to [HEIGHT]',
                        arguments: {
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    },
                    {
                        opcode: 'clearMaxDimensions',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove max width and height bounds'
                    },
                    {
                        opcode: 'setLetterSpacing',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set letter spacing to [SPACE]',
                        arguments: {
                            SPACE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Settings'
                    },
                    {
                        opcode: 'exportSettings',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'export settings as JSON'
                    },
                    {
                        opcode: 'applyExportSettings',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'apply JSON export settings [SETTINGS] to [SPRITE]',
                        arguments: {
                            SETTINGS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"version":1}'
                            },
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'SPRITE',
                                defaultValue: '_myself_'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Tag Loops'
                    },
                    {
                        opcode: 'repeatForTag',
                        blockType: Scratch.BlockType.LOOP,
                        text: 'repeat for blocks in tag [TAG] [CHAR]',
                        branchCount: 1,
                        arguments: {
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'shake'
                            },
                            CHAR: {
                                type: Scratch.ArgumentType.STRING,
                                fillIn: 'currentCharIndex'
                            }
                        }
                    },
                    {
                        opcode: 'currentCharIndex',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'character #',
                        canDragDuplicate: true,
                        hideFromPalette: true
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Character Transforms'
                    },
                    {
                        opcode: 'setResetCharTransformsOnText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset character transforms on show/type text [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'on'
                            }
                        }
                    },
                    {
                        opcode: 'setCharPos',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [INDEX] position to x: [X] y: [Y]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'changeCharPos',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change character [INDEX] position by x: [X] y: [Y]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setCharAxisPos',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [INDEX] [AXIS] to [VALUE]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            AXIS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'AXIS',
                                defaultValue: 'x'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setCharRotation',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [INDEX] rotation to [DEG] degrees',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            DEG: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'changeCharRotation',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change character [INDEX] rotation by [DEG] degrees',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            DEG: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setCharOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [INDEX] opacity to [PCT] %',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PCT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'resetCharTransform',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset character [INDEX] transform',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'resetAllCharTransforms',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset all character transforms'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Character Style'
                    },
                    {
                        opcode: 'getCharacterStyle',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'style of character [INDEX] as JSON',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'setCharacterStyle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set style of character [INDEX] to JSON [STYLE]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            STYLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"color":"#9966ff","bold":false,"italic":false,"underline":false,"strike":false,"size":32,"font":"Handwriting","tags":[]}'
                            }
                        }
                    },
                    {
                        opcode: 'resetCharacterStyle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset style of character [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Text Info'
                    },
                    {
                        opcode: 'getCharX',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'x position of character [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getCharY',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'y position of character [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getCharAt',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'character [INDEX] of the text',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getCharCount',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'number of characters'
                    },
                    {
                        opcode: 'getPlainText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'displayed text (no markup)'
                    },
                    {
                        opcode: 'getFinalText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'total final text (no markup)'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Markup Helpers'
                    },
                    {
                        opcode: 'colorMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'color [TEXT] as [COLOR]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'rainbow'
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: 'styleMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'style [TEXT] as [STYLE]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'important'
                            },
                            STYLE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'STYLE',
                                defaultValue: 'bold'
                            }
                        }
                    },
                    {
                        opcode: 'sizeMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'size [TEXT] as [SIZE]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'BIG'
                            },
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 48
                            }
                        }
                    },
                    {
                        opcode: 'fontMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'font [TEXT] as [FONT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'different'
                            },
                            FONT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FONT',
                                defaultValue: HANDWRITING_ID
                            }
                        }
                    },
                    {
                        opcode: 'tagMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'tag [TEXT] as [TAG]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'wobble'
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'shake'
                            }
                        }
                    },
                    {
                        opcode: 'waitMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'wait [SECONDS] seconds',
                        arguments: {
                            SECONDS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            }
                        }
                    }
                ],
                menus: {
                    ONOFF: {
                        items: ['on', 'off']
                    },
                    ALIGN: {
                        items: ['left', 'center', 'right', 'justify']
                    },
                    STYLE: {
                        items: ['bold', 'italic', 'underline', 'strikethrough']
                    },
                    TYPING_GROUP: {
                        items: ['default', 'symbols', 'punctuation', 'numbers']
                    },
                    FONT: {
                        items: 'getFontMenuItems',
                        isTypeable: true
                    },
                    SPRITE: {
                        items: 'getSpriteMenuItems'
                    },
                    AXIS: {
                        items: ['x', 'y']
                    }
                }
            };
        }

        setText(args, util) {
            const state = getState(util.target);
            const frame = util.stackFrame;

            if (frame.irisStages === undefined) {
                state.rawText = Scratch.Cast.toString(args.TEXT);
                state.finalText = stripMarkup(state.rawText);
                state.visible = true;
                if (state.resetCharTransformsOnText) resetCharacterTransformsState(state);
                frame.irisStages = splitWaitStages(state.rawText);
                frame.irisStageIndex = 0;
                frame.irisToken = ++state.revealToken;
                frame.irisWaitUntil = null;
            }

            if (state.revealToken !== frame.irisToken) return;

            if (frame.irisWaitUntil !== null) {
                if (Date.now() < frame.irisWaitUntil) {
                    util.yieldTick();
                    return;
                }
                frame.irisWaitUntil = null;
            }

            const stage = frame.irisStages[frame.irisStageIndex];
            state.rawText = stage.text;
            state.paintDirty = true;
            scheduleTextRender(util.target);

            frame.irisStageIndex++;
            if (frame.irisStageIndex >= frame.irisStages.length) return;

            frame.irisWaitUntil = Date.now() + stage.waitAfter * 1000;
            util.yieldTick();
        }
		
		addLine(args, util) {
            const state = getState(util.target);
            const text = Scratch.Cast.toString(args.TEXT);
            const existingText = state.visible ? state.rawText : '';
            const linePrefix = existingText ? '\n' : '';
            if (state.resetCharTransformsOnText) resetCharacterTransformsState(state);
            state.revealToken++;
            state.typingControl = null;
            state.rawText = existingText + linePrefix + text;
            state.finalText = stripMarkup(state.rawText);
            state.visible = true;
            schedulePaint(util.target, state);
        }

        _typeText(args, util, appendLine) {
            const state = getState(util.target);
            const frame = util.stackFrame;

            if (frame.irisTypingSteps === undefined) {
                const text = Scratch.Cast.toString(args.TEXT);
                const existingText = appendLine && state.visible ? state.rawText : '';
                const linePrefix = appendLine && existingText ? '\n' : '';
                state.rawText = existingText + linePrefix;
                state.finalText = stripMarkup(state.rawText + text);
                state.visible = true;
                if (state.resetCharTransformsOnText) resetCharacterTransformsState(state);
                state.revealToken++;
                state.typingControl = null;
                frame.irisTypingSteps = splitTypingSteps(text);
                frame.irisTypingStepIndex = 0;
                frame.irisTypingCharIndex = stripMarkup(existingText + linePrefix).length;
                frame.irisTypedText = state.rawText;
                frame.irisTypingToken = state.revealToken;
                frame.irisTypingWaitUntil = null;
            }

            if (state.revealToken !== frame.irisTypingToken) return;

            if (state.typingControl === 'stop') {
                state.typingControl = null;
                state.finalText = stripMarkup(state.rawText);
                return;
            }

            if (state.typingControl === 'skip') {
                while (frame.irisTypingStepIndex < frame.irisTypingSteps.length) {
                    frame.irisTypedText += frame.irisTypingSteps[frame.irisTypingStepIndex++].content;
                }
                state.rawText = frame.irisTypedText;
                state.typingControl = null;
                schedulePaint(util.target, state);
                flushRenderIfDirty(util.target);
                return;
            }

            if (frame.irisTypingWaitUntil !== null) {
                if (Date.now() < frame.irisTypingWaitUntil) {
                    util.yieldTick();
                    return;
                }
                frame.irisTypingWaitUntil = null;
            }

            while (frame.irisTypingStepIndex < frame.irisTypingSteps.length) {
                const step = frame.irisTypingSteps[frame.irisTypingStepIndex++];
                frame.irisTypedText += step.content;
                if (step.char === null) continue;

                state.rawText = frame.irisTypedText;
                schedulePaint(util.target, state);
                flushRenderIfDirty(util.target);
                startTypingCharacterHat(util.target, step.char, frame.irisTypingCharIndex++);

                const delay = Math.max(0, Number(typingDelayForCharacter(state, step.char)) || 0);
                if (delay > 0) {
                    frame.irisTypingWaitUntil = Date.now() + delay * 1000;
                    util.yieldTick();
                    return;
                }
            }

            state.rawText = frame.irisTypedText;
            schedulePaint(util.target, state);
        }

        typeText(args, util) {
            this._typeText(args, util, false);
        }

        typeNewLine(args, util) {
            this._typeText(args, util, true);
        }

        skipTyping(args, util) {
            getState(util.target).typingControl = 'skip';
        }

        stopTyping(args, util) {
            getState(util.target).typingControl = 'stop';
        }

        clearText(args, util) {
            clearTarget(util.target);
        }

        renderNow(args, util) {
            const state = getState(util.target);
            if (!state.visible) return;
            scheduleTextRender(util.target);
        }

        setBaseColor(args, util) {
            const state = getState(util.target);
            const color = Scratch.Cast.toString(args.COLOR);
            if (state.baseStyle.color === color) return;
            state.baseStyle.color = color;
            schedulePaint(util.target, state);
        }

        setBaseSize(args, util) {
            const state = getState(util.target);
            const size = Math.max(1, Scratch.Cast.toNumber(args.SIZE));
            if (state.baseStyle.size === size) return;
            state.baseStyle.size = size;
            schedulePaint(util.target, state);
        }

        setFont(args, util) {
            const state = getState(util.target);
            const requested = Scratch.Cast.toString(args.FONT);
            const font = requested === RANDOM_ID ?
                randomFontOtherThan(state.baseStyle.font) :
                requested;
            if (state.baseStyle.font === font) return;
            state.baseStyle.font = font;
            schedulePaint(util.target, state);
        }

        getFontMenuItems() {
            return buildFontMenuItems();
        }

        getSpriteMenuItems() {
            const items = [{
                text: 'myself',
                value: '_myself_'
            }];
            const names = new Set();
            for (const target of runtime.targets) {
                if (target.isStage || target.isOriginal === false) continue;
                const name = target.getName();
                if (!names.has(name)) {
                    names.add(name);
                    items.push({
                        text: name,
                        value: name
                    });
                }
            }
            return items;
        }

        exportSettings(args, util) {
            return exportTextSettings(getState(util.target));
        }

        applyExportSettings(args, util) {
            let settings;
            try {
                settings = JSON.parse(Scratch.Cast.toString(args.SETTINGS));
            } catch (e) {
                return;
            }
            const sprite = Scratch.Cast.toString(args.SPRITE);
            const target = sprite === '_myself_' ?
                util.target :
                runtime.getSpriteTargetByName(sprite);
            if (!target || !applyTextSettings(getState(target), settings)) return;
            schedulePaint(target, getState(target));
        }

        setAlign(args, util) {
            const state = getState(util.target);
            const align = Scratch.Cast.toString(args.ALIGN);
            if (state.align === align) return;
            state.align = align;
            schedulePaint(util.target, state);
        }

        setSmoothing(args, util) {
            const state = getState(util.target);
            const smoothing = Scratch.Cast.toString(args.ENABLED).toLowerCase() === 'on';
            if (state.smoothing === smoothing) return;
            state.smoothing = smoothing;
            schedulePaint(util.target, state);
        }

        setTypingSpeed(args, util) {
            const state = getState(util.target);
            const group = Scratch.Cast.toString(args.GROUP);
            if (!_hasOwn.call(state.typingSpeeds, group)) return;
            state.typingSpeeds[group] = Math.max(0, Scratch.Cast.toNumber(args.SECONDS));
        }

        setCustomTypingSpeed(args, util) {
            const state = getState(util.target);
            const delay = Math.max(0, Scratch.Cast.toNumber(args.SECONDS));
            for (const char of Array.from(Scratch.Cast.toString(args.CHARS))) {
                state.customTypingSpeeds[char] = delay;
            }
        }

        setMaxWidth(args, util) {
            const state = getState(util.target);
            const width = Scratch.Cast.toNumber(args.WIDTH);
            if (state.maxWidth === width) return;
            state.maxWidth = width;
            schedulePaint(util.target, state);
        }

        setMaxHeight(args, util) {
            const state = getState(util.target);
            const height = Scratch.Cast.toNumber(args.HEIGHT);
            if (state.maxHeight === height) return;
            state.maxHeight = height;
            schedulePaint(util.target, state);
        }

        setMaxDimensions(args, util) {
            const state = getState(util.target);
            const width = Scratch.Cast.toNumber(args.WIDTH);
            const height = Scratch.Cast.toNumber(args.HEIGHT);
            if (state.maxWidth === width && state.maxHeight === height) return;
            state.maxWidth = width;
            state.maxHeight = height;
            schedulePaint(util.target, state);
        }

        clearMaxDimensions(args, util) {
            const state = getState(util.target);
            if (state.maxWidth == null && state.maxHeight == null) return;
            state.maxWidth = null;
            state.maxHeight = null;
            schedulePaint(util.target, state);
        }

        setLetterSpacing(args, util) {
            const state = getState(util.target);
            const letterSpacing = Scratch.Cast.toNumber(args.SPACE);
            if (state.letterSpacing === letterSpacing) return;
            state.letterSpacing = letterSpacing;
            schedulePaint(util.target, state);
        }

        setTextShadowEnabled(args, util) {
            const state = getState(util.target);
            state.textShadow.enabled = Scratch.Cast.toString(args.ENABLED).toLowerCase() === 'on';
            schedulePaint(util.target, state);
        }

        setTextShadowColor(args, util) {
            const state = getState(util.target);
            const color = Scratch.Cast.toString(args.COLOR);
            if (state.textShadow.color === color) return;
            state.textShadow.color = color;
            schedulePaint(util.target, state);
        }

        setTextShadowOpacity(args, util) {
            const state = getState(util.target);
            state.textShadow.opacity = Math.max(0, Math.min(100, Scratch.Cast.toNumber(args.PCT)));
            schedulePaint(util.target, state);
        }

        setTextShadowBlur(args, util) {
            const state = getState(util.target);
            state.textShadow.blur = Math.max(0, Scratch.Cast.toNumber(args.BLUR));
            schedulePaint(util.target, state);
        }

        setTextShadowOffset(args, util) {
            const state = getState(util.target);
            state.textShadow.offsetX = Scratch.Cast.toNumber(args.X);
            state.textShadow.offsetY = Scratch.Cast.toNumber(args.Y);
            schedulePaint(util.target, state);
        }

        setTextBackgroundEnabled(args, util) {
            const state = getState(util.target);
            state.textBackground.enabled = Scratch.Cast.toString(args.ENABLED).toLowerCase() === 'on';
            schedulePaint(util.target, state);
        }

        setTextBackgroundColor(args, util) {
            const state = getState(util.target);
            const color = Scratch.Cast.toString(args.COLOR);
            if (state.textBackground.color === color) return;
            state.textBackground.color = color;
            schedulePaint(util.target, state);
        }

        setTextBackgroundOpacity(args, util) {
            const state = getState(util.target);
            state.textBackground.opacity = Math.max(0, Math.min(100, Scratch.Cast.toNumber(args.PCT)));
            schedulePaint(util.target, state);
        }

        setTextBackgroundRadius(args, util) {
            const state = getState(util.target);
            state.textBackground.radius = Math.max(0, Scratch.Cast.toNumber(args.RADIUS));
            schedulePaint(util.target, state);
        }

        setTextBackgroundPadding(args, util) {
            const state = getState(util.target);
            state.textBackground.padding = Math.max(0, Scratch.Cast.toNumber(args.PADDING));
            schedulePaint(util.target, state);
        }

        setTextBorderEnabled(args, util) {
            const state = getState(util.target);
            state.textBorder.enabled = Scratch.Cast.toString(args.ENABLED).toLowerCase() === 'on';
            schedulePaint(util.target, state);
        }

        setTextBorderColor(args, util) {
            const state = getState(util.target);
            const color = Scratch.Cast.toString(args.COLOR);
            if (state.textBorder.color === color) return;
            state.textBorder.color = color;
            schedulePaint(util.target, state);
        }

        setTextBorderOpacity(args, util) {
            const state = getState(util.target);
            state.textBorder.opacity = Math.max(0, Math.min(100, Scratch.Cast.toNumber(args.PCT)));
            schedulePaint(util.target, state);
        }

        setTextBorderSize(args, util) {
            const state = getState(util.target);
            state.textBorder.size = Math.max(0, Scratch.Cast.toNumber(args.SIZE));
            schedulePaint(util.target, state);
        }

        repeatForTag(args, util) {
            const frame = util.stackFrame;
            const rootFrame = util.thread.stackFrames[0];
            let loop = frame.irisTagLoop;

            if (!loop) {
                const tag = Scratch.Cast.toString(args.TAG).toLowerCase();
                loop = {
                    indices: taggedCharacterIndices(util.target, tag),
                    position: 0
                };
                frame.irisTagLoop = loop;
                rootFrame.irisTagCharacterNumber = 0;
            }

            if (loop.position >= loop.indices.length) return;
            rootFrame.irisTagCharacterNumber = loop.indices[loop.position] + 1;
            loop.position++;
            util.startBranch(1, true);
        }

        currentCharValue(args, util) {
            const cur = (util.thread && util.thread._irisChar) || util.target._irisTypingChar;
            return cur ? cur.char : '';
        }

        currentCharIndex(args, util) {
            const rootFrame = util.thread && util.thread.stackFrames[0];
            if (rootFrame && rootFrame.irisTagCharacterNumber !== undefined) {
                return rootFrame.irisTagCharacterNumber;
            }
            const cur = (util.thread && util.thread._irisChar) || util.target._irisTypingChar;
            return cur ? cur.index + 1 : 0;
        }

        setResetCharTransformsOnText(args, util) {
            const state = getState(util.target);
            state.resetCharTransformsOnText = Scratch.Cast.toString(args.ENABLED).toLowerCase() === 'on';
        }

        setCharPos(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && o.x === x && o.y === y) return;
            o.x = x;
            o.y = y;
            schedulePaint(util.target, state);
        }

        changeCharPos(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && x === 0 && y === 0) return;
            o.x += x;
            o.y += y;
            schedulePaint(util.target, state);
        }

        setCharAxisPos(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const axis = Scratch.Cast.toString(args.AXIS) === 'y' ? 'y' : 'x';
            const value = Scratch.Cast.toNumber(args.VALUE);
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && o[axis] === value) return;
            o[axis] = value;
            schedulePaint(util.target, state);
        }

        setCharRotation(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const rotation = Scratch.Cast.toNumber(args.DEG);
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && o.rotation === rotation) return;
            o.rotation = rotation;
            schedulePaint(util.target, state);
        }

        changeCharRotation(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const rotation = Scratch.Cast.toNumber(args.DEG);
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && rotation === 0) return;
            o.rotation += rotation;
            schedulePaint(util.target, state);
        }

        setCharOpacity(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const opacity = Math.max(0, Math.min(100, Scratch.Cast.toNumber(args.PCT))) / 100;
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && o.opacity === opacity) return;
            o.opacity = opacity;
            schedulePaint(util.target, state);
        }

        resetCharTransform(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            if (state.charOverrides[idx]) {
                delete state.charOverrides[idx];
                state.charOverridesVersion++;
                schedulePaint(util.target, state);
            }
        }

        resetAllCharTransforms(args, util) {
            const state = getState(util.target);
            if (Object.keys(state.charOverrides).length) {
                state.charOverrides = {};
                state.charOverridesVersion++;
                schedulePaint(util.target, state);
            }
        }

        getCharacterStyle(args, util) {
            const state = getState(util.target);
            flushRenderIfDirty(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const box = state.charBoxes[idx];
            return box && box.style ? JSON.stringify(box.style) : '';
        }

        setCharacterStyle(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            flushRenderIfDirty(util.target);
            const box = state.charBoxes[idx];
            if (!box || !box.style) return;

            let input;
            try {
                input = JSON.parse(Scratch.Cast.toString(args.STYLE));
            } catch (e) {
                return;
            }
            const style = characterStyleFromJSON(input, box.style);
            if (!style) return;
            state.charStyleOverrides[idx] = style;
            state.charStyleOverridesVersion++;
            state.shapeKey = null;
            state.layout = null;
            state.paintFingerprint = null;
            schedulePaint(util.target, state);
        }

        resetCharacterStyle(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            if (!state.charStyleOverrides[idx]) return;
            delete state.charStyleOverrides[idx];
            state.charStyleOverridesVersion++;
            state.shapeKey = null;
            state.layout = null;
            state.paintFingerprint = null;
            schedulePaint(util.target, state);
        }

        getCharX(args, util) {
            const state = getState(util.target);
            flushRenderIfDirty(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const box = state.charBoxes[idx];
            return box ? box.x : 0;
        }

        getCharY(args, util) {
            const state = getState(util.target);
            flushRenderIfDirty(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const box = state.charBoxes[idx];
            return box ? box.y : 0;
        }

        getCharAt(args, util) {
            const state = getState(util.target);
            const plain = stripMarkup(state.rawText);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            return plain[idx] || '';
        }

        getCharCount(args, util) {
            const state = getState(util.target);
            return stripMarkup(state.rawText).length;
        }

        getPlainText(args, util) {
            const state = getState(util.target);
            return stripMarkup(state.rawText);
        }

        getFinalText(args, util) {
            const state = getState(util.target);
            return state.finalText;
        }

        colorMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const color = Scratch.Cast.toString(args.COLOR);
            return `[color=${color}]${text}[/color]`;
        }

        styleMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const map = {
                bold: 'b',
                italic: 'i',
                underline: 'u',
                strikethrough: 's'
            };
            const tag = map[args.STYLE] || 'b';
            return `[${tag}]${text}[/${tag}]`;
        }

        sizeMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const size = Scratch.Cast.toNumber(args.SIZE);
            return `[size=${size}]${text}[/size]`;
        }

        fontMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const requested = Scratch.Cast.toString(args.FONT);
            const font = requested === RANDOM_ID ? randomFontOtherThan(RANDOM_ID) : requested;
            return `[font=${font}]${text}[/font]`;
        }

        tagMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const tag = Scratch.Cast.toString(args.TAG).toLowerCase().replace(/[^a-z0-9_-]/g, '');
            if (!tag) return text;
            return `[${tag}]${text}[/${tag}]`;
        }

        waitMarkup(args) {
            const seconds = Math.max(0, Scratch.Cast.toNumber(args.SECONDS));
            return `[wait=${seconds}]`;
        }
    }

    Scratch.extensions.register(new IrisText());
})(Scratch);
