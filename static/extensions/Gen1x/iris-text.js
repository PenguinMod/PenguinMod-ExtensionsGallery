/*
Iris Text by Gen1x - 2026

Code inspiration:
- Animated Text (PenguinMod version)
- Tween Extension by JeremyGamer13

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

    const WIPE_DIRECTION_BOTTOM_UP = 'bottom-up';
    const WIPE_DIRECTION_LEFT_RIGHT = 'left-right';
    const WIPE_DIRECTION_UP_DOWN = 'up-down';
    const WIPE_DIRECTION_RIGHT_LEFT = 'right-left';

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
        Array.from(document.fonts).forEach(face => {
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
        const families = new Set([base.font]);
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
                families.add(style.font);
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
                            top.size = Scratch.Cast.toNumber(value) || top.size;
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
        out.families = families;
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

    function styleSnapshotMatches(snapshot, style) {
        if (!snapshot) return false;
        if (snapshot.color !== style.color) return false;
        if (snapshot.bold !== style.bold) return false;
        if (snapshot.italic !== style.italic) return false;
        if (snapshot.underline !== style.underline) return false;
        if (snapshot.strike !== style.strike) return false;
        if (snapshot.size !== style.size) return false;
        if (snapshot.font !== style.font) return false;
        const tags = Array.isArray(style.tags) ? style.tags : null;
        const snapTags = snapshot.tags;
        if (!tags) return snapTags.length === 0;
        if (tags.length !== snapTags.length) return false;
        for (let i = 0; i < tags.length; i++) {
            if (tags[i] !== snapTags[i]) return false;
        }
        return true;
    }

    function applyCharacterStyleOverrides(chars, overrides) {
        const families = chars.families;
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
            if (families) families.add(override.font);
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

    let stripMarkupCacheKey = null;
    let stripMarkupCacheValue = null;

    function stripMarkup(text) {
        if (text === stripMarkupCacheKey) return stripMarkupCacheValue;
        TAG_RE_STRIP.lastIndex = 0;
        const result = text.replace(TAG_RE_STRIP, '');
        stripMarkupCacheKey = text;
        stripMarkupCacheValue = result;
        return result;
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

    let splitWaitStagesCacheKey = null;
    let splitWaitStagesCacheValue = null;

    function splitWaitStages(text) {
        if (text === splitWaitStagesCacheKey) return splitWaitStagesCacheValue;
        WAIT_RE.lastIndex = 0;
        const stages = [];
        let i = 0;
        let match;
        let textSoFar = '';
        while ((match = WAIT_RE.exec(text)) !== null) {
            textSoFar += text.slice(i, match.index);
            stages.push({
                text: textSoFar,
                waitAfter: Math.max(0, Scratch.Cast.toNumber(match[1]) || 0)
            });
            i = match.index + match[0].length;
        }
        textSoFar += text.slice(i);
        stages.push({
            text: textSoFar,
            waitAfter: 0
        });
        splitWaitStagesCacheKey = text;
        splitWaitStagesCacheValue = stages;
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
                offsetX: 0,
                offsetY: 0
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
            charMasks: {},
            charMasksVersion: 0,
            charMaskGeometryVersion: 0,
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
            paintOps: null,
            paintOpsKey: null,
            paintOpsGeometryKey: null,
            paintOpsLayout: null,
            paintDirty: true,
            paintFingerprint: null,
            renderInFlight: false,
            renderQueued: false,
            maskBatchCanvas: null,
            lastFamiliesKey: null,
            lastFontDefs: '',
            revealToken: 0,
            fontsPendingAtMeasure: false,
            hasPaintedOnce: false,
            taggedIndicesCache: null,
            taggedIndicesCacheKey: null,
            paintOpPool: []
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
        } else if (!state.iiMigrated) {
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
            state.iiMigrated = true;
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
                opacity: 1,
                scale: 1,
                color: null
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

    function setCharMaskForIndex(state, index, mask) {
        state.charMasks[index] = mask;
        state.charMasksVersion++;
        state.charMaskGeometryVersion++;
    }

    function clearCharMaskForIndex(state, index) {
        if (!state.charMasks[index]) return false;
        delete state.charMasks[index];
        state.charMasksVersion++;
        state.charMaskGeometryVersion++;
        return true;
    }

    function indexRange(startArg, endArg) {
        let start = Math.round(startArg) - 1;
        let end = Math.round(endArg) - 1;
        if (end < start) {
            const tmp = start;
            start = end;
            end = tmp;
        }
        return {
            start,
            end
        };
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

    const glyphShapeCanvasPool = [];
    const tintedCanvasPool = [];
    const stencilCanvasPool = [];
    const GENERIC_POOL_LIMIT = 256;

    function acquirePooledCanvas(pool, w, h) {
        const canvas = pool.pop() || document.createElement('canvas');
        if (canvas.width !== w) canvas.width = w;
        if (canvas.height !== h) canvas.height = h;
        return canvas;
    }

    function releasePooledCanvas(pool, canvas) {
        if (canvas && pool.length < GENERIC_POOL_LIMIT) pool.push(canvas);
    }

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
        const canvas = acquirePooledCanvas(glyphShapeCanvasPool, Math.max(1, canvasW), Math.max(1, canvasH));
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            shadows: new Map(),
            advance: advance / GLYPH_OVERSAMPLE,
            baselineOriginXEm: baselineX / GLYPH_OVERSAMPLE,
            baselineOriginYEm: baselineY / GLYPH_OVERSAMPLE,
            fontAscentEm: ascent / GLYPH_OVERSAMPLE,
            fontDescentEm: descent / GLYPH_OVERSAMPLE
        };
    }

    const SHADOW_CACHE_LIMIT = 512;
    const GLOBAL_SHADOW_CANVAS_LIMIT = 256;
    const shadowCanvasPool = [];
    const globalShadowLRU = new Map();
    let shadowGlobalKeySeq = 1;

    function acquireShadowCanvas(w, h) {
        const reused = shadowCanvasPool.pop();
        const canvas = reused || document.createElement('canvas');
        if (canvas.width !== w) canvas.width = w;
        if (canvas.height !== h) canvas.height = h;
        return canvas;
    }

    function evictOldestGlobalShadow() {
        const oldestKey = globalShadowLRU.keys().next().value;
        if (oldestKey === undefined) return;
        const oldest = globalShadowLRU.get(oldestKey);
        globalShadowLRU.delete(oldestKey);
        oldest.shape.shadows.delete(oldest.key);
        if (shadowCanvasPool.length < 64) shadowCanvasPool.push(oldest.entry.canvas);
    }

    function getShadowGlyphBitmap(shape, color, blurPx) {
        const key = color + '\u0001' + blurPx;
        let entry = shape.shadows.get(key);
        if (entry) {
            const globalKey = entry.globalKey;
            globalShadowLRU.delete(globalKey);
            globalShadowLRU.set(globalKey, {
                shape,
                key,
                entry
            });
            return entry;
        }

        const padPx = Math.ceil(blurPx * 3) + 2;
        const w = shape.canvas.width + padPx * 2;
        const h = shape.canvas.height + padPx * 2;
        const canvas = acquireShadowCanvas(w, h);
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.shadowColor = color;
        ctx.shadowBlur = blurPx;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.drawImage(shape.canvas, padPx, padPx);

        const globalKey = shadowGlobalKeySeq++;
        entry = {
            canvas,
            offsetX: -padPx,
            offsetY: -padPx,
            globalKey
        };
        if (shape.shadows.size >= SHADOW_CACHE_LIMIT) {
            const evictedKey = shape.shadows.keys().next().value;
            const evicted = shape.shadows.get(evictedKey);
            shape.shadows.delete(evictedKey);
            globalShadowLRU.delete(evicted.globalKey);
            releasePooledCanvas(shadowCanvasPool, evicted.canvas);
        }
        shape.shadows.set(key, entry);

        if (globalShadowLRU.size >= GLOBAL_SHADOW_CANVAS_LIMIT) evictOldestGlobalShadow();
        globalShadowLRU.set(globalKey, {
            shape,
            key,
            entry
        });
        return entry;
    }

    function releaseGlyphOwnedCanvases(shape) {
        releasePooledCanvas(glyphShapeCanvasPool, shape.canvas);
        if (shape.tinted) {
            for (const tintedCanvas of shape.tinted.values()) {
                releasePooledCanvas(tintedCanvasPool, tintedCanvas);
            }
        }
        if (shape.shadows) {
            for (const shadowEntry of shape.shadows.values()) {
                globalShadowLRU.delete(shadowEntry.globalKey);
                releasePooledCanvas(shadowCanvasPool, shadowEntry.canvas);
            }
        }
        const stencil = maskGlyphStencilCache.get(shape);
        if (stencil) {
            maskGlyphStencilCache.delete(shape);
            releasePooledCanvas(stencilCanvasPool, stencil);
        }
    }

    function getGlyphShape(char, fontFamily, size, weight, style) {
        const key = glyphCacheKey(char, fontFamily, size, weight, style);
        let entry = glyphCache.get(key);
        if (!entry) {
            if (glyphCache.size >= GLYPH_CACHE_LIMIT) {
                const evictedKey = glyphCache.keys().next().value;
                const evictedShape = glyphCache.get(evictedKey);
                glyphCache.delete(evictedKey);
                if (evictedShape) releaseGlyphOwnedCanvases(evictedShape);
            }
            entry = rasterizeGlyph(char, fontFamily, size, weight, style);
            glyphCache.set(key, entry);
        }
        return entry;
    }

    const maskGlyphStencilCache = new Map();
    const STENCIL_CACHE_LIMIT = 400;
    const maskScratchCanvasPool = [];
    const CANVAS_SIZE_BUCKET = 32;

    function bucketSize(n) {
        return Math.max(CANVAS_SIZE_BUCKET, Math.ceil(n / CANVAS_SIZE_BUCKET) * CANVAS_SIZE_BUCKET);
    }

    const sharedPatternSurface = (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return {
            canvas,
            ctx: canvas.getContext('2d'),
            cacheKey: null,
            pattern: null,
            capW: canvas.width,
            capH: canvas.height
        };
    })();

    function sampleMaskPattern(texture, matrix, w, h) {
        const surface = sharedPatternSurface;
        let patternDirty = surface.cacheKey !== texture.cacheKey;
        if (surface.capW < w || surface.capH < h) {
            surface.capW = Math.max(surface.capW, bucketSize(w));
            surface.capH = Math.max(surface.capH, bucketSize(h));
            surface.canvas.width = surface.capW;
            surface.canvas.height = surface.capH;
            patternDirty = true;
        }
        if (patternDirty) {
            surface.pattern = surface.ctx.createPattern(texture.canvas, 'repeat');
            surface.cacheKey = texture.cacheKey;
        }
        if (!surface.pattern) return null;

        surface.pattern.setTransform(matrix);
        surface.ctx.setTransform(1, 0, 0, 1, 0, 0);
        surface.ctx.globalAlpha = 1;
        surface.ctx.globalCompositeOperation = 'source-over';
        surface.ctx.clearRect(0, 0, w, h);
        surface.ctx.fillStyle = surface.pattern;
        surface.ctx.fillRect(0, 0, w, h);

        return surface.canvas;
    }

    function getMaskGlyphStencil(shape) {
        let stencil = maskGlyphStencilCache.get(shape);
        if (stencil) return stencil;
        stencil = acquirePooledCanvas(stencilCanvasPool, shape.canvas.width, shape.canvas.height);
        const sctx = stencil.getContext('2d');
        sctx.setTransform(1, 0, 0, 1, 0, 0);
        sctx.globalCompositeOperation = 'source-over';
        sctx.clearRect(0, 0, stencil.width, stencil.height);
        sctx.fillStyle = '#ffffff';
        sctx.fillRect(0, 0, stencil.width, stencil.height);
        sctx.globalCompositeOperation = 'destination-in';
        sctx.drawImage(shape.canvas, 0, 0);
        if (maskGlyphStencilCache.size >= STENCIL_CACHE_LIMIT) {
            const evictedShape = maskGlyphStencilCache.keys().next().value;
            releasePooledCanvas(stencilCanvasPool, maskGlyphStencilCache.get(evictedShape));
            maskGlyphStencilCache.delete(evictedShape);
        }
        maskGlyphStencilCache.set(shape, stencil);
        return stencil;
    }

    function acquireMaskScratchCanvas(w, h) {
        let best = -1;
        let bestArea = Infinity;
        for (let i = 0; i < maskScratchCanvasPool.length; i++) {
            const c = maskScratchCanvasPool[i];
            if (c.width >= w && c.height >= h) {
                const area = c.width * c.height;
                if (area < bestArea) {
                    bestArea = area;
                    best = i;
                }
            }
        }
        let canvas;
        if (best !== -1) {
            canvas = maskScratchCanvasPool.splice(best, 1)[0];
        } else {
            canvas = maskScratchCanvasPool.length ? maskScratchCanvasPool.pop() : document.createElement('canvas');
            const cw = Math.max(canvas.width, bucketSize(w));
            const ch = Math.max(canvas.height, bucketSize(h));
            if (canvas.width !== cw) canvas.width = cw;
            if (canvas.height !== ch) canvas.height = ch;
        }
        canvas.usedW = w;
        canvas.usedH = h;
        return canvas;
    }

    function releaseMaskScratchCanvas(canvas) {
        if (maskScratchCanvasPool.length < 64) maskScratchCanvasPool.push(canvas);
    }

    function drawMaskedGlyph(destCtx, char, fontFamily, size, weight, style, mask, texture, worldDrawX, worldDrawY, spanW, spanH, spanOriginX, spanOriginY, destX, destY, alpha) {
        const coverage = Math.max(0, Math.min(100, Number(mask.coverage) || 0)) / 100;
        if (coverage <= 0) return;

        const shape = getGlyphShape(char, fontFamily, size, weight, style);
        const w = shape.canvas.width;
        const h = shape.canvas.height;

        const zoom = Math.max(0.01, (Number(mask.zoom) || 100) / 100);
        const rotation = Number(mask.rotation) || 0;
        const anchorX = (mask.x || 0) * DEST_SCALE - destX;
        const anchorY = -(mask.y || 0) * DEST_SCALE - destY;

        const matrix = new DOMMatrix();
        matrix.translateSelf(anchorX, anchorY);
        if (rotation !== 0) matrix.rotateSelf(rotation);
        matrix.scaleSelf(zoom, zoom);

        const sampled = sampleMaskPattern(texture, matrix, w, h);
        if (!sampled) return;

        const scratch = acquireMaskScratchCanvas(w, h);
        const sctx = scratch.getContext('2d');
        sctx.setTransform(1, 0, 0, 1, 0, 0);
        sctx.clearRect(0, 0, w, h);
        sctx.globalAlpha = 1;
        sctx.globalCompositeOperation = 'source-over';
        sctx.drawImage(sampled, 0, 0, w, h, 0, 0, w, h);

        const stencil = getMaskGlyphStencil(shape);
        sctx.globalCompositeOperation = 'destination-in';
        sctx.drawImage(stencil, 0, 0);
        sctx.globalCompositeOperation = 'source-over';

        if (coverage < 1) {
            const seamless = !!mask.seamless;
            const localOffsetX = seamless ? (worldDrawX - spanOriginX) : 0;
            const localOffsetY = seamless ? (worldDrawY - spanOriginY) : 0;
            const effSpanW = seamless && spanW ? spanW : w;
            const effSpanH = seamless && spanH ? spanH : h;
            const blurPx = Math.max(0, Number(mask.blur) || 0) * DEST_SCALE;
            const direction = mask.direction || WIPE_DIRECTION_BOTTOM_UP;
            const bandHalf = Math.max(0.5, blurPx / 2);

            let revealEdge, axisIsX, growsPositive;
            if (direction === WIPE_DIRECTION_LEFT_RIGHT) {
                revealEdge = effSpanW * coverage - localOffsetX;
                axisIsX = true;
                growsPositive = true;
            } else if (direction === WIPE_DIRECTION_RIGHT_LEFT) {
                revealEdge = effSpanW - effSpanW * coverage - localOffsetX;
                axisIsX = true;
                growsPositive = false;
            } else if (direction === WIPE_DIRECTION_UP_DOWN) {
                revealEdge = effSpanH * coverage - localOffsetY;
                axisIsX = false;
                growsPositive = true;
            } else {
                revealEdge = effSpanH - effSpanH * coverage - localOffsetY;
                axisIsX = false;
                growsPositive = false;
            }

            const axisSize = axisIsX ? w : h;
            const gradStart = growsPositive ? revealEdge - bandHalf : revealEdge + bandHalf;
            const gradEnd = growsPositive ? revealEdge + bandHalf : revealEdge - bandHalf;
            const bandFrom = Math.min(gradStart, gradEnd);
            const bandTo = Math.max(gradStart, gradEnd);

            if (bandTo <= 0) {
                if (growsPositive) {
                    releaseMaskScratchCanvas(scratch);
                    return;
                }
            } else if (bandFrom >= axisSize) {
                if (!growsPositive) {
                    releaseMaskScratchCanvas(scratch);
                    return;
                }
            } else {
                sctx.globalCompositeOperation = 'destination-in';
                const gradient = axisIsX ?
                    sctx.createLinearGradient(gradStart, 0, gradEnd, 0) :
                    sctx.createLinearGradient(0, gradStart, 0, gradEnd);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                sctx.fillStyle = gradient;
                sctx.fillRect(0, 0, w, h);
                sctx.globalCompositeOperation = 'source-over';
            }
        }

        destCtx.save();
        destCtx.globalAlpha = alpha;
        destCtx.drawImage(scratch, 0, 0, w, h, destX, destY, w, h);
        destCtx.restore();

        releaseMaskScratchCanvas(scratch);
    }

    function maskBatchKey(mask, alpha) {
        return mask.targetName + '\u0001' + mask.costumeName + '\u0001' +
            (mask.direction || WIPE_DIRECTION_BOTTOM_UP) + '\u0001' +
            (Number(mask.coverage) || 0) + '\u0001' +
            (Number(mask.blur) || 0) + '\u0001' +
            (Number(mask.x) || 0) + '\u0001' +
            (Number(mask.y) || 0) + '\u0001' +
            (Number(mask.zoom) || 100) + '\u0001' +
            (Number(mask.rotation) || 0) + '\u0001' + alpha;
    }

    function collectBatchedMaskGroups(paintOps) {
        const groups = [];
        const batchedOps = new Set();
        let group = null;

        const flushGroup = () => {
            if (group && group.items.length > 1) {
                groups.push(group);
                for (let i = 0; i < group.items.length; i++) batchedOps.add(group.items[i].op);
            }
            group = null;
        };

        for (let i = 0; i < paintOps.length; i++) {
            const op = paintOps[i];
            const mask = op.mask;
            const maskOpacity = mask ? Math.max(0, Math.min(100, Number(mask.opacity != null ? mask.opacity : 100))) / 100 : 0;
            const alpha = (op.opacity == null ? 1 : op.opacity) * maskOpacity;
            const canBatch = mask && mask.seamless && !op.rotation && (op.scale == null || op.scale === 1) &&
                Math.max(0, Math.min(100, Number(mask.coverage) || 0)) > 0 && alpha > 0;
            if (!canBatch) {
                flushGroup();
                continue;
            }

            const key = maskBatchKey(mask, alpha);
            if (!group || group.key !== key) {
                flushGroup();
                const texture = getMaskTexture(mask.targetName, mask.costumeName);
                if (!texture) continue;
                group = {
                    key,
                    mask,
                    alpha,
                    texture,
                    items: [],
                    minX: Infinity,
                    minY: Infinity,
                    maxX: -Infinity,
                    maxY: -Infinity
                };
            }

            if (op.text === '\u00A0' || op.text === '') continue;

            const fontFamily = op.font['font-family'];
            const fontSize = op.font['font-size'];
            const fontWeight = op.font['font-weight'];
            const fontStyle = op.font['font-style'];
            const glyph = getGlyphBitmap(op.text, fontFamily, fontSize, fontWeight, fontStyle, op.color);
            const drawXEm = op.x - (glyph.baselineOriginXEm + glyph.advance / 2);
            const drawYEm = (op.y + (glyph.fontAscentEm - glyph.fontDescentEm) / 2) - glyph.baselineOriginYEm;
            const px = Math.round(drawXEm * DEST_SCALE);
            const py = Math.round(drawYEm * DEST_SCALE);
            group.items.push({op, glyph, px, py});
            group.minX = Math.min(group.minX, px);
            group.minY = Math.min(group.minY, py);
            group.maxX = Math.max(group.maxX, px + glyph.canvas.width);
            group.maxY = Math.max(group.maxY, py + glyph.canvas.height);
        }
        flushGroup();

        return {groups, batchedOps};
    }

    function drawBatchedMaskGroups(ctx, state, groups, pixelW, pixelH) {
        if (!groups.length) return;
        let canvas = state.maskBatchCanvas;
        if (!canvas) {
            canvas = document.createElement('canvas');
            state.maskBatchCanvas = canvas;
        }
        if (canvas.width !== pixelW || canvas.height !== pixelH) {
            canvas.width = pixelW;
            canvas.height = pixelH;
        }
        const batchCtx = canvas.getContext('2d');

        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const mask = group.mask;
            batchCtx.setTransform(1, 0, 0, 1, 0, 0);
            batchCtx.globalAlpha = 1;
            batchCtx.globalCompositeOperation = 'source-over';
            batchCtx.clearRect(0, 0, pixelW, pixelH);
            const pattern = batchCtx.createPattern(group.texture.canvas, 'repeat');
            if (!pattern) continue;
            const matrix = new DOMMatrix();
            matrix.translateSelf((Number(mask.x) || 0) * DEST_SCALE, -(Number(mask.y) || 0) * DEST_SCALE);
            const rotation = Number(mask.rotation) || 0;
            if (rotation !== 0) matrix.rotateSelf(rotation);
            const zoom = Math.max(0.01, (Number(mask.zoom) || 100) / 100);
            matrix.scaleSelf(zoom, zoom);
            pattern.setTransform(matrix);
            batchCtx.fillStyle = pattern;
            batchCtx.fillRect(0, 0, pixelW, pixelH);

            batchCtx.globalCompositeOperation = 'destination-in';
            for (let j = 0; j < group.items.length; j++) {
                const item = group.items[j];
                batchCtx.globalAlpha = group.alpha;
                batchCtx.drawImage(item.glyph.shape.canvas, item.px, item.py);
            }
            batchCtx.globalAlpha = 1;

            const coverage = Math.max(0, Math.min(100, Number(mask.coverage) || 0)) / 100;
            if (coverage < 1) {
                const blurPx = Math.max(0, Number(mask.blur) || 0) * DEST_SCALE;
                const bandHalf = Math.max(0.5, blurPx / 2);
                const direction = mask.direction || WIPE_DIRECTION_BOTTOM_UP;
                const axisIsX = direction === WIPE_DIRECTION_LEFT_RIGHT || direction === WIPE_DIRECTION_RIGHT_LEFT;
                const growsPositive = direction === WIPE_DIRECTION_LEFT_RIGHT || direction === WIPE_DIRECTION_UP_DOWN;
                const axisStart = axisIsX ? group.minX : group.minY;
                const axisSize = axisIsX ? group.maxX - group.minX : group.maxY - group.minY;
                const revealEdge = growsPositive ? axisStart + axisSize * coverage : axisStart + axisSize - axisSize * coverage;
                const gradStart = growsPositive ? revealEdge - bandHalf : revealEdge + bandHalf;
                const gradEnd = growsPositive ? revealEdge + bandHalf : revealEdge - bandHalf;
                const gradient = axisIsX ?
                    batchCtx.createLinearGradient(gradStart, 0, gradEnd, 0) :
                    batchCtx.createLinearGradient(0, gradStart, 0, gradEnd);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                batchCtx.fillStyle = gradient;
                batchCtx.fillRect(0, 0, pixelW, pixelH);
            }

            ctx.drawImage(canvas, 0, 0);
        }
    }

    function tintGlyph(shape, color) {
        let tintedCanvas = shape.tinted.get(color);
        if (tintedCanvas) return tintedCanvas;

        tintedCanvas = acquirePooledCanvas(tintedCanvasPool, shape.canvas.width, shape.canvas.height);
        const tctx = tintedCanvas.getContext('2d');
        tctx.setTransform(1, 0, 0, 1, 0, 0);
        tctx.globalCompositeOperation = 'source-over';
        tctx.clearRect(0, 0, tintedCanvas.width, tintedCanvas.height);
        tctx.fillStyle = color;
        tctx.fillRect(0, 0, tintedCanvas.width, tintedCanvas.height);
        tctx.globalCompositeOperation = 'destination-in';
        tctx.drawImage(shape.canvas, 0, 0);

        if (shape.tinted.size >= TINT_CACHE_LIMIT) {
            const evictedColor = shape.tinted.keys().next().value;
            releasePooledCanvas(tintedCanvasPool, shape.tinted.get(evictedColor));
            shape.tinted.delete(evictedColor);
            if (shape.bitmaps) shape.bitmaps.delete(evictedColor);
        }
        shape.tinted.set(color, tintedCanvas);
        return tintedCanvas;
    }

    function getGlyphBitmap(char, fontFamily, size, weight, style, color) {
        const shape = getGlyphShape(char, fontFamily, size, weight, style);
        let bitmap = shape.bitmaps && shape.bitmaps.get(color);
        if (bitmap) return bitmap;
        const canvas = tintGlyph(shape, color);
        bitmap = {
            canvas,
            advance: shape.advance,
            baselineOriginXEm: shape.baselineOriginXEm,
            baselineOriginYEm: shape.baselineOriginYEm,
            fontAscentEm: shape.fontAscentEm,
            fontDescentEm: shape.fontDescentEm,
            shape
        };
        if (!shape.bitmaps) shape.bitmaps = new Map();
        if (shape.bitmaps.size >= TINT_CACHE_LIMIT) {
            shape.bitmaps.delete(shape.bitmaps.keys().next().value);
        }
        shape.bitmaps.set(color, bitmap);
        return bitmap;
    }

    const READBACK_CANVAS = document.createElement('canvas');
    const READBACK_CTX = READBACK_CANVAS.getContext('2d', {
        willReadFrequently: true
    });

    function getGlyphInkColumns(glyph) {
        if (glyph.inkColumns) return glyph.inkColumns;
        const w = glyph.canvas.width;
        const h = glyph.canvas.height;
        if (READBACK_CANVAS.width !== w) READBACK_CANVAS.width = w;
        if (READBACK_CANVAS.height !== h) READBACK_CANVAS.height = h;
        READBACK_CTX.setTransform(1, 0, 0, 1, 0, 0);
        READBACK_CTX.clearRect(0, 0, w, h);
        READBACK_CTX.drawImage(glyph.canvas, 0, 0);
        const image = READBACK_CTX.getImageData(0, 0, w, h);
        const inkColumns = new Uint8Array(w * h);
        for (let i = 0; i < inkColumns.length; i++) {
            inkColumns[i] = image.data[i * 4 + 3] > 16 ? 1 : 0;
        }
        glyph.inkColumns = inkColumns;
        return inkColumns;
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
            const w = glyph.canvas.width;
            const inkData = getGlyphInkColumns(glyph);
            const rowStart = Math.max(0, Math.floor(y - glyphY - lineWidth / 2));
            const rowEnd = Math.min(glyph.canvas.height - 1, Math.ceil(y - glyphY + lineWidth / 2));
            const columnStart = Math.max(0, Math.floor(startX - glyphX));
            const columnEnd = Math.min(w - 1, Math.ceil(endX - glyphX));
            const ink = new Uint8Array(w);

            for (let py = rowStart; py <= rowEnd; py++) {
                for (let px = columnStart; px <= columnEnd; px++) {
                    if (inkData[py * w + px]) ink[px] = 1;
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
        const evictedKeys = [];
        for (const key of glyphCache.keys()) {
            if (key.indexOf('\u0001' + fontFamily + '\u0001') !== -1) {
                glyphCache.delete(key);
                evictedKeys.push(key);
            }
        }
        if (evictedKeys.length && renderWorker) {
            for (const key of evictedKeys) workerKnownGlyphKeys.delete(key);
            renderWorker.postMessage({
                type: 'evict-glyphs',
                glyphKeys: evictedKeys
            });
        }
    }

    const MASK_TEXTURE_RASTER_SIZE = 512;
    const maskTextureCache = new Map();
    const maskTexturePending = new Map();

    function maskCostumeKey(targetName, costume) {
        return targetName + '\u0001' + costume.name + '\u0001' + (costume.assetId || costume.skinId || '');
    }

    function findCostumeByRef(targetName, costumeName) {
        for (const target of runtime.targets) {
            if (target.isOriginal === false) continue;
            const name = target.isStage ? 'Stage' : target.getName();
            if (name !== targetName) continue;
            const costumes = target.getCostumes();
            for (const costume of costumes) {
                if (costume.name === costumeName) return costume;
            }
        }
        return null;
    }

    function rasterizeCostumeFromSkin(costume, targetName) {
        if (!runtime.renderer || typeof costume.skinId !== 'number') return null;
        const renderer = runtime.renderer;
        const skin = renderer._allSkins && renderer._allSkins[costume.skinId];
        if (!skin) return null;

        let source = null;
        if (skin._silhouette && skin._silhouette._lazyData) {
            source = skin._silhouette._lazyData;
        } else if (skin._svgImage && skin._svgImageLoaded) {
            source = skin._svgImage;
        } else if (skin._image) {
            source = skin._image;
        } else if (skin.canvas) {
            source = skin.canvas;
        } else if (skin._canvas) {
            source = skin._canvas;
        } else if (skin._svgRenderer && skin._svgRenderer._cachedImage) {
            source = skin._svgRenderer._cachedImage;
        } else if (skin._svgRenderer && skin._svgRenderer.canvas) {
            source = skin._svgRenderer.canvas;
        }
        if (!source) return null;

        const silhouetteW = skin._silhouette && skin._silhouette._width;
        const silhouetteH = skin._silhouette && skin._silhouette._height;
        const nativeW = source.naturalWidth || source.width || silhouetteW || (skin.size && skin.size[0]) || 1;
        const nativeH = source.naturalHeight || source.height || silhouetteH || (skin.size && skin.size[1]) || 1;
        if (!nativeW || !nativeH) return null;
        const aspect = nativeW / nativeH;
        let canvasW, canvasH;
        if (aspect >= 1) {
            canvasW = MASK_TEXTURE_RASTER_SIZE;
            canvasH = Math.max(1, Math.round(MASK_TEXTURE_RASTER_SIZE / aspect));
        } else {
            canvasH = MASK_TEXTURE_RASTER_SIZE;
            canvasW = Math.max(1, Math.round(MASK_TEXTURE_RASTER_SIZE * aspect));
        }
        const canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext('2d');
        try {
            ctx.drawImage(source, 0, 0, canvasW, canvasH);
        } catch (e) {
            return null;
        }
        return { canvas, width: canvasW, height: canvasH };
    }

    function rasterizeCostumeToCanvas(costume, targetName) {
        return new Promise((resolve) => {
            const asset = costume.asset;
            if (!asset) {
                const fromSkin = rasterizeCostumeFromSkin(costume, targetName);
                resolve(fromSkin);
                return;
            }
            let url;
            let revoke = false;
            try {
                if (costume.dataFormat === 'svg') {
                    const svgText = asset.decodeText();
                    url = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgText);
                } else {
                    url = asset.encodeDataURI();
                }
            } catch (e) {
                const fromSkin = rasterizeCostumeFromSkin(costume, targetName);
                resolve(fromSkin);
                return;
            }

            const img = new Image();
            img.onload = () => {
                const nativeW = img.naturalWidth || img.width || 1;
                const nativeH = img.naturalHeight || img.height || 1;
                const aspect = nativeW / nativeH;
                let canvasW, canvasH;
                if (aspect >= 1) {
                    canvasW = MASK_TEXTURE_RASTER_SIZE;
                    canvasH = Math.max(1, Math.round(MASK_TEXTURE_RASTER_SIZE / aspect));
                } else {
                    canvasH = MASK_TEXTURE_RASTER_SIZE;
                    canvasW = Math.max(1, Math.round(MASK_TEXTURE_RASTER_SIZE * aspect));
                }
                const canvas = document.createElement('canvas');
                canvas.width = canvasW;
                canvas.height = canvasH;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvasW, canvasH);
                if (revoke) URL.revokeObjectURL(url);
                resolve({
                    canvas,
                    width: canvasW,
                    height: canvasH
                });
            };
            img.onerror = () => {
                if (revoke) URL.revokeObjectURL(url);
                const fromSkin = rasterizeCostumeFromSkin(costume, targetName);
                resolve(fromSkin);
            };
            img.src = url;
        });
    }

    const maskRefRetryCounts = new Map();
    const MASK_REF_MAX_RETRIES = 20;
    const MASK_REF_RETRY_DELAY_MS = 150;

    function getMaskTexture(targetName, costumeName) {
        const refKey = targetName + '\u0001' + costumeName;
        const costume = findCostumeByRef(targetName, costumeName);
        if (!costume) {
            const attempts = maskRefRetryCounts.get(refKey) || 0;
            if (attempts < MASK_REF_MAX_RETRIES) {
                maskRefRetryCounts.set(refKey, attempts + 1);
                setTimeout(() => {
                    getMaskTexture(targetName, costumeName);
                }, MASK_REF_RETRY_DELAY_MS);
            }
            return null;
        }
        maskRefRetryCounts.delete(refKey);
        const key = maskCostumeKey(targetName, costume);
        const cached = maskTextureCache.get(key);
        if (cached) return cached;

        if (!maskTexturePending.has(key)) {
            const promise = rasterizeCostumeToCanvas(costume, targetName).then((result) => {
                maskTexturePending.delete(key);
                if (result) {
                    result.cacheKey = key;
                    maskTextureCache.set(key, result);
                    repaintAllTargetsUsingMasks();
                } else {
                    const attempts = maskRefRetryCounts.get(refKey) || 0;
                    if (attempts < MASK_REF_MAX_RETRIES) {
                        maskRefRetryCounts.set(refKey, attempts + 1);
                        setTimeout(() => {
                            getMaskTexture(targetName, costumeName);
                        }, MASK_REF_RETRY_DELAY_MS);
                    } else if (typeof console !== 'undefined' && console.warn) {
                        const skin = runtime.renderer && runtime.renderer._allSkins && runtime.renderer._allSkins[costume.skinId];
                        console.warn('[iris-text] mask texture failed to load after retries:', targetName, costumeName,
                            'costume.asset present:', !!costume.asset,
                            'dataFormat:', costume.dataFormat,
                            'skinId:', costume.skinId,
                            'skin found:', !!skin,
                            'silhouette lazyData present:', !!(skin && skin._silhouette && skin._silhouette._lazyData),
                            'skin keys:', skin ? Object.keys(skin) : null);
                    }
                }
                return result;
            });
            maskTexturePending.set(key, promise);
        }
        return null;
    }

    function repaintAllTargetsUsingMasks() {
        for (const candidate of runtime.targets) {
            const state = candidate.getCustomState(STATE_KEY);
            if (!state || !state.visible) continue;
            if (!state.charMasks || !Object.keys(state.charMasks).length) continue;
            state.paintFingerprint = null;
            schedulePaint(candidate, state);
        }
    }

    function shapingFontStyleKey(style) {
        return style.font + '\u0001' + style.size + '\u0001' + (style.bold ? 1 : 0) + '\u0001' + (style.italic ? 1 : 0);
    }

    const shapingFontStyleCache = new Map();
    const SHAPING_FONT_STYLE_CACHE_LIMIT = 500;

    function shapingFontStyle(style) {
        const key = shapingFontStyleKey(style);
        let cached = shapingFontStyleCache.get(key);
        if (cached) return cached;
        const fontFamily = cssFontFamily(style.font);
        const fontWeight = style.bold ? 'bold' : 'normal';
        const fontStyle = style.italic ? 'italic' : 'normal';
        const styleHash = ((hashString(fontFamily) * 33) ^ hashString(fontWeight) * 33 ^ hashString(fontStyle)) | 0;
        cached = {
            'font-family': fontFamily,
            'font-size': style.size,
            'font-weight': fontWeight,
            'font-style': fontStyle,
            'styleHash': styleHash
        };
        if (shapingFontStyleCache.size >= SHAPING_FONT_STYLE_CACHE_LIMIT) {
            shapingFontStyleCache.delete(shapingFontStyleCache.keys().next().value);
        }
        shapingFontStyleCache.set(key, cached);
        return cached;
    }

    function canvasFontString(fontStyle) {
        return `${fontStyle['font-style']} ${fontStyle['font-weight']} ${fontStyle['font-size']}px ${fontStyle['font-family']}`;
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

    const charAdvanceCache = new Map();
    const CHAR_ADVANCE_CACHE_LIMIT = 4000;

    function charAdvanceCacheKey(fontStyle, letterSpacing, char) {
        return fontStyle.styleHash + '\u0001' + fontStyle['font-size'] + '\u0001' +
            (letterSpacing || 0) + '\u0001' + char;
    }

    function measureCharsIndividually(measureCtx, run, letterSpacing) {
        const missing = [];
        for (let i = 0; i < run.chars.length; i++) {
            const ch = run.chars[i].char === ' ' ? '\u00A0' : run.chars[i].char;
            const key = charAdvanceCacheKey(run.fontStyle, letterSpacing, ch);
            if (!charAdvanceCache.has(key)) missing.push({
                i,
                ch,
                key
            });
        }

        if (missing.length) {
            measureCtx.font = canvasFontString(run.fontStyle);
            measureCtx.textBaseline = 'alphabetic';
            const spacing = letterSpacing || 0;
            for (let m = 0; m < missing.length; m++) {
                const advance = measureCtx.measureText(missing[m].ch).width + spacing;
                if (charAdvanceCache.size >= CHAR_ADVANCE_CACHE_LIMIT) {
                    charAdvanceCache.delete(charAdvanceCache.keys().next().value);
                }
                charAdvanceCache.set(missing[m].key, advance);
            }
        }

        const positions = new Array(run.chars.length);
        let x = 0;
        for (let i = 0; i < run.chars.length; i++) {
            const ch = run.chars[i].char === ' ' ? '\u00A0' : run.chars[i].char;
            const key = charAdvanceCacheKey(run.fontStyle, letterSpacing, ch);
            const advance = charAdvanceCache.get(key);
            positions[i] = {
                shapedX: x,
                advance
            };
            x += advance;
        }
        run.positions = positions;
        run.runWidth = x;
    }

    function measureShapedRuns(measureCtx, runs, letterSpacing) {
        for (const run of runs) {
            run.fontStyle = shapingFontStyle(run.style);
            run.text = run.chars.map(rc => (rc.char === ' ' ? '\u00A0' : rc.char)).join('');
            measureCharsIndividually(measureCtx, run, letterSpacing);
        }
    }

    function measureRichText(measureCtx, richChars, state) {
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

        const hardLineRunsCache = [];
        let globalIndex = 0;
        for (const line of hardLines) {
            const runs = splitShapingRuns(line, state.charOverrides, globalIndex);
            if (runs.length) measureShapedRuns(measureCtx, runs, state.letterSpacing);
            for (const run of runs) {
                for (let i = 0; i < run.chars.length; i++) {
                    run.chars[i]._width = run.positions[i].advance;
                }
            }
            hardLineRunsCache.push(runs);
            globalIndex += line.length + 1;
        }

        const lines = [];
        const lineWidths = [];
        const lineRuns = [];
        const charsByTag = new Map();

        let maxWidth = 0;
        const wrapLimit = state.maxWidth && state.maxWidth > 0 ? state.maxWidth : Infinity;
        const wrappedLineSourceHardLine = [];

        for (let hardLineIndex = 0; hardLineIndex < hardLines.length; hardLineIndex++) {
            const hardLine = hardLines[hardLineIndex];
            const linesBeforeThisHardLine = lines.length;
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
                        let nextLineWidth = 0;
                        for (let k = 0; k < nextLineInitial.length; k++) nextLineWidth += nextLineInitial[k]._width;
                        currentLineWidth -= nextLineWidth;

                        lines.push(currentLine);
                        lineWidths.push(currentLineWidth);
                        if (currentLineWidth > maxWidth) maxWidth = currentLineWidth;

                        currentLine = nextLineInitial;
                        currentLineWidth = nextLineWidth;
                    } else {
                        lines.push(currentLine);
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

            if (lines.length - linesBeforeThisHardLine === 1) {
                wrappedLineSourceHardLine[linesBeforeThisHardLine] = hardLineIndex;
            }
        }

        globalIndex = 0;
        let hardLineIndex = 0;
        let charsProcessed = 0;

        for (let li = 0; li < lines.length; li++) {
            const line = lines[li];
            const sourceHardLine = wrappedLineSourceHardLine[li];
            const runs = sourceHardLine !== undefined ?
                hardLineRunsCache[sourceHardLine] :
                splitShapingRuns(line, state.charOverrides, globalIndex);

            let runStartX = 0;
            for (const run of runs) {
                run.fontStyle = shapingFontStyle(run.style);
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
            hash = (hash * 33) ^ ((op.scale * 1000) | 0);
            hash = (hash * 33) ^ hashString(op.color);
            hash = (hash * 33) ^ op.font.styleHash;
            hash = (hash * 33) ^ ((op.font['font-size'] * 100) | 0);
            hash = (hash * 33) ^ ((op.letterSpacing * 100) | 0);
            hash = (hash * 33) ^ (op.underline ? 1 : 0);
            hash = (hash * 33) ^ (op.strike ? 1 : 0);
            hash = fingerprintMaskInto(hash, op.mask);
        }
        return hash | 0;
    }

    function fingerprintMaskOps(paintOps, docW, docH) {
        let hash = (docW * 2654435761) ^ (docH * 40503);
        hash = (hash * 33) ^ paintOps.length;
        for (let i = 0; i < paintOps.length; i++) {
            hash = (hash * 33) ^ i;
            hash = fingerprintMaskInto(hash, paintOps[i].mask);
        }
        return hash | 0;
    }

    function fingerprintMaskInto(hash, mask) {
        if (mask) {
            hash = (hash * 33) ^ hashString(mask.targetName);
            hash = (hash * 33) ^ hashString(mask.costumeName);
            hash = (hash * 33) ^ ((mask.coverage * 100) | 0);
            hash = (hash * 33) ^ ((mask.opacity != null ? mask.opacity : 100) * 100 | 0);
            hash = (hash * 33) ^ ((mask.blur * 100) | 0);
            hash = (hash * 33) ^ ((mask.x * 100) | 0);
            hash = (hash * 33) ^ ((mask.y * 100) | 0);
            hash = (hash * 33) ^ ((mask.zoom != null ? mask.zoom : 100) * 100 | 0);
            hash = (hash * 33) ^ ((mask.rotation != null ? mask.rotation : 0) * 100 | 0);
        } else {
            hash = (hash * 33) ^ 0x5a5a;
        }
        return hash;
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

    const charAnimations = new Map();
    const charAnimationsByTarget = new Map();
    let animationTickerInstalled = false;

    function addCharAnimation(targetId, key, anim) {
        charAnimations.set(key, anim);
        let set = charAnimationsByTarget.get(targetId);
        if (!set) {
            set = new Set();
            charAnimationsByTarget.set(targetId, set);
        }
        set.add(key);
    }

    function deleteCharAnimation(targetId, key) {
        if (!charAnimations.delete(key)) return false;
        const set = charAnimationsByTarget.get(targetId);
        if (set) {
            set.delete(key);
            if (!set.size) charAnimationsByTarget.delete(targetId);
        }
        return true;
    }

    function clearCharAnimationsForTarget(targetId) {
        const set = charAnimationsByTarget.get(targetId);
        if (!set || !set.size) return;
        for (const key of set) charAnimations.delete(key);
        charAnimationsByTarget.delete(targetId);
    }

    function clearCharAnimationsForTargetIndex(targetId, idx) {
        const set = charAnimationsByTarget.get(targetId);
        if (!set || !set.size) return;
        const prefix = targetId + '\u0001' + idx + '\u0001';
        for (const key of Array.from(set)) {
            if (key.startsWith(prefix)) {
                charAnimations.delete(key);
                set.delete(key);
            }
        }
        if (!set.size) charAnimationsByTarget.delete(targetId);
    }

    function nowMs() {
        return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    }

    const linear = x => x;
    const sine = (x, dir) => {
        switch (dir) {
            case "in": return 1 - Math.cos((x * Math.PI) / 2);
            case "out": return Math.sin((x * Math.PI) / 2);
            case "in out": return -(Math.cos(Math.PI * x) - 1) / 2;
            default: return 0;
        }
    };
    const quad = (x, dir) => {
        switch (dir) {
            case "in": return x * x;
            case "out": return 1 - (1 - x) * (1 - x);
            case "in out": return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
            default: return 0;
        }
    };
    const cubic = (x, dir) => {
        switch (dir) {
            case "in": return x * x * x;
            case "out": return 1 - Math.pow(1 - x, 3);
            case "in out": return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
            default: return 0;
        }
    };
    const quart = (x, dir) => {
        switch (dir) {
            case "in": return x * x * x * x;
            case "out": return 1 - Math.pow(1 - x, 4);
            case "in out": return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
            default: return 0;
        }
    };
    const quint = (x, dir) => {
        switch (dir) {
            case "in": return x * x * x * x * x;
            case "out": return 1 - Math.pow(1 - x, 5);
            case "in out": return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
            default:
            return 0;
        }
    };
    const expo = (x, dir) => {
        switch (dir) {
            case "in": return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
            case "out": return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            case "in out": return x === 0 ? 0 : x === 1 ? 1 : x < 0.5
                ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
            default: return 0;
        }
    };
    const circ = (x, dir) => {
        switch (dir) {
            case "in": return 1 - Math.sqrt(1 - Math.pow(x, 2));
            case "out": return Math.sqrt(1 - Math.pow(x - 1, 2));
            case "in out": return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
            default: return 0;
        }
    };
    const back = (x, dir) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        const c3 = c1 + 1;
        switch (dir) {
            case "in": return c3 * x * x * x - c1 * x * x;
            case "out": return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            case "in out": return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            default: return 0;
        }
    };
    const elastic = (x, dir) => {
        const c4 = (2 * Math.PI) / 3;
        const c5 = (2 * Math.PI) / 4.5;
        switch (dir) {
            case "in": return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
            case "out": return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
            case "in out": return x === 0 ? 0 : x === 1 ? 1 : x < 0.5
                ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
            default: return 0;
        }
    };
    const bounce = (x, dir) => {
        switch (dir) {
            case "in": return 1 - bounce(1 - x, "out");
            case "out": {
                const n1 = 7.5625, d1 = 2.75;
                if (x < 1 / d1) return n1 * x * x;
                else if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
                else if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
                return n1 * (x -= 2.625 / d1) * x + 0.984375;
            }
            case "in out": return x < 0.5 ? (1 - bounce(1 - 2 * x, "out")) / 2 : (1 + bounce(2 * x - 1, "out")) / 2;
            default: return 0;
        }
    };
    const EasingMethods = {
        linear, sine, quad, cubic, quart,
        quint, expo, circ, back, elastic, bounce
    };

    function applyEasing(name, dir, x) {
        const fn = EasingMethods[name] || linear;
        if (fn === linear) return linear(x);
        return fn(x, dir);
    }

    let animationsDirtyThisFrame = false;

    function ensureAnimationTicker() {
        if (animationTickerInstalled) return;
        animationTickerInstalled = true;
        runtime.on('BEFORE_EXECUTE', tickCharAnimations);
    }

    function tickCharAnimations() {
        if (!charAnimations.size) return;
        if (animationsDirtyThisFrame) return;
        animationsDirtyThisFrame = true;
        requestAnimationFrame(computeCharAnimationsFrame);
    }

    function computeCharAnimationsFrame() {
        animationsDirtyThisFrame = false;
        if (!charAnimations.size) return;
        const t = nowMs();
        const dirtyStates = new Set();
        for (const [key, anim] of charAnimations) {
            const state = getState(anim.target);
            const o = getCharOverride(state, anim.index);
            const elapsed = t - anim.startTime;
            const rawProgress = anim.duration > 0 ? Math.min(1, elapsed / anim.duration) : 1;
            const progress = applyEasing(anim.easing, anim.direction, rawProgress);
            o[anim.property] = anim.from + (anim.to - anim.from) * progress;
            dirtyStates.add(anim.target);
            if (rawProgress >= 1) {
                o[anim.property] = anim.to;
                deleteCharAnimation(anim.target.id, key);
            }
        }
        for (const target of dirtyStates) {
            schedulePaint(target, getState(target));
        }
    }

    let renderFlushLoopRunning = false;

    function renderFlushLoop() {
        flushPendingRenders();
        if (pendingRenderTargets.size) {
            requestAnimationFrame(renderFlushLoop);
        } else {
            renderFlushLoopRunning = false;
        }
    }

    function ensureRenderFlushTicker() {
        if (renderFlushLoopRunning) return;
        renderFlushLoopRunning = true;
        requestAnimationFrame(renderFlushLoop);
    }

    function requestRenderFlush() {
        ensureRenderFlushTicker();
    }

    function scheduleRender(target) {
        pendingRenderTargets.add(target);
        requestRenderFlush();
    }

    function flushPendingRenders() {
        if (!pendingRenderTargets.size) return;
        const renderTargets = Array.from(pendingRenderTargets);
        pendingRenderTargets.clear();
        for (const target of renderTargets) {
            const state = getState(target);
            if (state.visible) renderTarget(target);
        }
    }

    function flushRenderIfDirty(target) {
        if (!pendingRenderTargets.has(target)) return Promise.resolve();
        pendingRenderTargets.delete(target);
        const state = getState(target);
        const promise = state.visible ? renderTarget(target) : Promise.resolve();
        if (pendingRenderTargets.size) requestRenderFlush();
        return promise || Promise.resolve();
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

    function getPaintOpsGeometryKey(state, layoutKey) {
        return layoutKey + '\u0004' + state.align;
    }

    function getPaintOpsKey(state, layoutKey) {
        return getPaintOpsGeometryKey(state, layoutKey) + '\u0004' + state.charMasksVersion;
    }

    const EMPTY_OVERRIDE = {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        color: null
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
        if (state.renderInFlight) {
            state.renderQueued = true;
            return state.renderPromise || Promise.resolve();
        }

        const shapeKey = getShapeKey(state);
        const layoutKey = getLayoutKey(state);
        let layout = state.layout;
        if (state.shapeKey !== shapeKey || state.layoutKey !== layoutKey || !layout || state.fontsPendingAtMeasure) {
            const richChars = parseRichText(state.rawText, state.baseStyle);
            applyCharacterStyleOverrides(richChars, state.charStyleOverrides);
            const families = richChars.families;
            let fontsPending = false;
            for (const family of families) {
                if (!loadedDocumentFonts.has(family)) fontsPending = true;
                ensureDocumentFont(family);
            }
            if (fontsPending && !state.hasPaintedOnce) {
                return;
            }
            const measured = measureRichText(glyphMeasureCtx, richChars, state);
            layout = measured;
            state.shapeKey = shapeKey;
            state.layout = layout;
            state.fontsPendingAtMeasure = fontsPending;
        }
        state.layoutKey = layoutKey;
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

        const geometryKey = getPaintOpsGeometryKey(state, layoutKey) + '\u0004' + docW + '\u0004' + docH;
        const paintOpsKey = geometryKey + '\u0004' + state.charMasksVersion;
        let paintOps = state.paintOps;
        let charBoxes = state.charBoxes;

        const geometryUnchanged = state.paintOpsGeometryKey === geometryKey &&
            state.paintOpsLayout === layout && !!paintOps;

        if (geometryUnchanged && state.paintOpsKey !== paintOpsKey) {
            for (let i = 0; i < paintOps.length; i++) {
                const op = paintOps[i];
                op.mask = state.charMasks[op.charIndex] || null;
            }
            state.paintOpsKey = paintOpsKey;

            const fingerprint = fingerprintMaskOps(paintOps, docW, docH);
            if (fingerprint === state.paintFingerprint && state.skinId !== null) {
                state.paintDirty = false;
                return;
            }
            state.paintFingerprint = fingerprint;
        } else if (state.paintOpsKey !== paintOpsKey || state.paintOpsLayout !== layout || !paintOps) {
            if (state.charBoxesLayout !== layout) {
                charBoxes = [];
                state.charBoxesLayout = layout;
            }
            const charsByTag = layout.charsByTag;
            const prevPaintOps = paintOps;
            const opPool = state.paintOpPool || (state.paintOpPool = []);
            if (prevPaintOps) {
                for (let i = prevPaintOps.length - 1; i >= 0; i--) opPool.push(prevPaintOps[i]);
            }
            paintOps = [];
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
                        const scale = o.scale == null ? 1 : o.scale;
                        const ch = rc.char === ' ' ? '\u00A0' : rc.char;
                        const mask = state.charMasks[index] || null;

                        const op = opPool.length ? opPool.pop() : {};
                        op.text = ch;
                        op.x = charCenterX;
                        op.y = charCenterY;
                        op.rotation = rotation;
                        op.opacity = opacity;
                        op.scale = scale;
                        op.color = o.color || rc.color;
                        op.font = style;
                        op.rawFontFamily = rc0.font;
                        op.letterSpacing = letterSpacing;
                        op.underline = underline;
                        op.strike = strike;
                        op.width = pos.advance;
                        op.mask = mask;
                        op.charIndex = index;
                        paintOps.push(op);

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
                        } else if (!styleSnapshotMatches(box.style, rc)) {
                            box.style = characterStyleSnapshot(rc);
                        }
                        box.x = charCenterX - originX;
                        box.y = originY - charCenterY;
                    }
                }
            }

            state.paintOps = paintOps;
            state.paintOpsKey = paintOpsKey;
            state.paintOpsGeometryKey = geometryKey;
            state.paintOpsLayout = layout;
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
        } else {
            if (state.paintFingerprint !== null && state.skinId !== null) {
                state.paintDirty = false;
                return;
            }
        }

        state.renderInFlight = true;
        state.renderQueued = false;
        const paintedPromise = compositeGlyphsAndPush(target, state, paintOps, docW, docH, effectiveMaxWidth, totalHeight, originX, originY);
        state.paintDirty = false;
        state.renderPromise = Promise.resolve(paintedPromise).then(() => {
            state.hasPaintedOnce = true;
        }).finally(() => {
            state.renderInFlight = false;
            state.renderPromise = null;
            if (state.renderQueued) {
                state.renderQueued = false;
                scheduleRender(target);
            }
        });
        return state.renderPromise;
    }

    function compositeGlyphsAndPush(target, state, paintOps, docW, docH, effectiveMaxWidth, totalHeight, originX, originY) {
        if (!renderWorkerFailed && supportsRenderWorker()) {
            const workerPromise = compositeGlyphsViaWorker(state, paintOps, docW, docH, effectiveMaxWidth, totalHeight, originX, originY);
            if (workerPromise) {
                return workerPromise.then((result) => {
                    pushImageBitmapToDrawable(target, result.bitmap, result.pixelW, result.pixelH, docW, docH);
                }).catch((err) => {
                    renderWorkerFailed = true;
                    console.log('[Iris Text] Render worker request failed (' + (err && err.message ? err.message : err) + ') — falling back to main-thread rendering.');
                    const canvas = compositeGlyphsToCanvas(state, paintOps, docW, docH, effectiveMaxWidth, totalHeight, originX, originY);
                    pushCanvasToDrawable(target, canvas, docW, docH);
                });
            }
        }
        const canvas = compositeGlyphsToCanvas(state, paintOps, docW, docH, effectiveMaxWidth, totalHeight, originX, originY);
        pushCanvasToDrawable(target, canvas, docW, docH);
        return Promise.resolve();
    }

    const loadedDocumentFonts = new Set();
    const pendingDocumentFonts = new Map();
    const FONT_LOAD_MAX_RETRIES = 8;
    const FONT_LOAD_RETRY_DELAY_MS = 150;

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

    let rerenderVisibleTextTargetsQueued = false;

    function requestRerenderVisibleTextTargets() {
        if (rerenderVisibleTextTargetsQueued) return;
        rerenderVisibleTextTargetsQueued = true;
        Promise.resolve().then(() => {
            rerenderVisibleTextTargetsQueued = false;
            rerenderVisibleTextTargets();
        });
    }

    const FONT_PROBE_TEXT = 'AaBbGgQqWwZz01@#';
    const FONT_PROBE_CONTROL_FAMILIES = ['serif', 'sans-serif', 'monospace'];
    let fontProbeCtx = null;
    let fontProbeControlWidths = null;

    function getFontProbeCtx() {
        if (fontProbeCtx) return fontProbeCtx;
        const canvas = document.createElement('canvas');
        fontProbeCtx = canvas.getContext('2d');
        return fontProbeCtx;
    }

    function measureFontProbeWidth(fontFamilyCss) {
        const ctx = getFontProbeCtx();
        ctx.font = `16px ${fontFamilyCss}`;
        return ctx.measureText(FONT_PROBE_TEXT).width;
    }

    function getFontProbeControlWidths() {
        if (fontProbeControlWidths) return fontProbeControlWidths;
        fontProbeControlWidths = FONT_PROBE_CONTROL_FAMILIES.map(measureFontProbeWidth);
        return fontProbeControlWidths;
    }

    function isFontActuallyRendering(fontId) {
        const rawFamily = `"${fontId}"`;
        const controlWidths = getFontProbeControlWidths();
        const testedWidths = FONT_PROBE_CONTROL_FAMILIES.map(fallback =>
            measureFontProbeWidth(`${rawFamily}, ${fallback}`)
        );
        for (let i = 0; i < testedWidths.length; i++) {
            if (Math.abs(testedWidths[i] - controlWidths[i]) > 0.5) return true;
        }
        return false;
    }

    function ensureDocumentFont(fontId, attempt) {
        attempt = attempt || 0;
        if (!document.fonts || loadedDocumentFonts.has(fontId) || pendingDocumentFonts.has(fontId)) return;
        const fontSpec = `16px ${cssFontFamily(fontId)}`;
        const promise = document.fonts.load(fontSpec, 'M')
            .catch(() => [])
            .then(() => {
                pendingDocumentFonts.delete(fontId);
                const apiReady = typeof document.fonts.check === 'function' ? document.fonts.check(fontSpec, 'M') : true;
                const ready = apiReady && isFontActuallyRendering(fontId);
                if (ready) {
                    loadedDocumentFonts.add(fontId);
                    invalidateGlyphCacheForFamily(cssFontFamily(fontId));
                    requestRerenderVisibleTextTargets();
                } else if (attempt < FONT_LOAD_MAX_RETRIES) {
                    setTimeout(() => ensureDocumentFont(fontId, attempt + 1), FONT_LOAD_RETRY_DELAY_MS);
                } else {
                    loadedDocumentFonts.add(fontId);
                }
            });
        pendingDocumentFonts.set(fontId, promise);
    }

    const DEST_SCALE = GLYPH_OVERSAMPLE;

    const WORKER_SOURCE = `
const WIPE_DIRECTION_BOTTOM_UP = 'bottom-up';
const WIPE_DIRECTION_LEFT_RIGHT = 'left-right';
const WIPE_DIRECTION_UP_DOWN = 'up-down';
const WIPE_DIRECTION_RIGHT_LEFT = 'right-left';

const DEST_SCALE = 3;
const TINT_CACHE_LIMIT = 512;
const SHADOW_CACHE_LIMIT = 512;
const STENCIL_CACHE_LIMIT = 400;
const CANVAS_SIZE_BUCKET = 32;
const GLYPH_CACHE_LIMIT = 2000;

const glyphShapesByKey = new Map();

const glyphShapeCanvasPool = [];
const tintedCanvasPool = [];
const stencilCanvasPool = [];
const GENERIC_POOL_LIMIT = 256;

function acquirePooledCanvas(pool, w, h) {
    const canvas = pool.pop() || new OffscreenCanvas(w, h);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    return canvas;
}

function releasePooledCanvas(pool, canvas) {
    if (canvas && pool.length < GENERIC_POOL_LIMIT) pool.push(canvas);
}

function bucketSize(n) {
    return Math.max(CANVAS_SIZE_BUCKET, Math.ceil(n / CANVAS_SIZE_BUCKET) * CANVAS_SIZE_BUCKET);
}

function releaseGlyphOwnedCanvases(shape) {
    releasePooledCanvas(glyphShapeCanvasPool, shape.canvas);
    if (shape.tinted) {
        for (const tintedCanvas of shape.tinted.values()) {
            releasePooledCanvas(tintedCanvasPool, tintedCanvas);
        }
    }
    if (shape.shadows) {
        for (const shadowEntry of shape.shadows.values()) {
            globalShadowLRU.delete(shadowEntry.globalKey);
            releasePooledCanvas(shadowCanvasPool, shadowEntry.canvas);
        }
    }
    const stencil = maskGlyphStencilCache.get(shape);
    if (stencil) {
        maskGlyphStencilCache.delete(shape);
        releasePooledCanvas(stencilCanvasPool, stencil);
    }
}

function getGlyphShape(glyphKey) {
    return glyphShapesByKey.get(glyphKey) || null;
}

function tintGlyph(shape, color) {
    let tintedCanvas = shape.tinted.get(color);
    if (tintedCanvas) return tintedCanvas;

    tintedCanvas = acquirePooledCanvas(tintedCanvasPool, shape.canvas.width, shape.canvas.height);
    const tctx = tintedCanvas.getContext('2d');
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.globalCompositeOperation = 'source-over';
    tctx.clearRect(0, 0, tintedCanvas.width, tintedCanvas.height);
    tctx.fillStyle = color;
    tctx.fillRect(0, 0, tintedCanvas.width, tintedCanvas.height);
    tctx.globalCompositeOperation = 'destination-in';
    tctx.drawImage(shape.canvas, 0, 0);

    if (shape.tinted.size >= TINT_CACHE_LIMIT) {
        const evictedColor = shape.tinted.keys().next().value;
        releasePooledCanvas(tintedCanvasPool, shape.tinted.get(evictedColor));
        shape.tinted.delete(evictedColor);
        if (shape.bitmaps) shape.bitmaps.delete(evictedColor);
    }
    shape.tinted.set(color, tintedCanvas);
    return tintedCanvas;
}

function getGlyphBitmap(glyphKey, color) {
    const shape = getGlyphShape(glyphKey);
    if (!shape) return null;
    let bitmap = shape.bitmaps.get(color);
    if (bitmap) return bitmap;
    const canvas = tintGlyph(shape, color);
    bitmap = {
        canvas,
        advance: shape.advance,
        baselineOriginXEm: shape.baselineOriginXEm,
        baselineOriginYEm: shape.baselineOriginYEm,
        fontAscentEm: shape.fontAscentEm,
        fontDescentEm: shape.fontDescentEm,
        shape
    };
    if (shape.bitmaps.size >= TINT_CACHE_LIMIT) {
        shape.bitmaps.delete(shape.bitmaps.keys().next().value);
    }
    shape.bitmaps.set(color, bitmap);
    return bitmap;
}

const GLOBAL_SHADOW_CANVAS_LIMIT = 256;
const shadowCanvasPool = [];
const globalShadowLRU = new Map();
let shadowGlobalKeySeq = 1;

function acquireShadowCanvas(w, h) {
    const reused = shadowCanvasPool.pop();
    const canvas = reused || new OffscreenCanvas(w, h);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    return canvas;
}

function evictOldestGlobalShadow() {
    const oldestKey = globalShadowLRU.keys().next().value;
    if (oldestKey === undefined) return;
    const oldest = globalShadowLRU.get(oldestKey);
    globalShadowLRU.delete(oldestKey);
    oldest.shape.shadows.delete(oldest.key);
    if (shadowCanvasPool.length < 64) shadowCanvasPool.push(oldest.entry.canvas);
}

function getShadowGlyphBitmap(shape, color, blurPx) {
    const key = color + '\u0001' + blurPx;
    let entry = shape.shadows.get(key);
    if (entry) {
        const globalKey = entry.globalKey;
        globalShadowLRU.delete(globalKey);
        globalShadowLRU.set(globalKey, {
            shape,
            key,
            entry
        });
        return entry;
    }

    const padPx = Math.ceil(blurPx * 3) + 2;
    const w = shape.canvas.width + padPx * 2;
    const h = shape.canvas.height + padPx * 2;
    const canvas = acquireShadowCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.shadowColor = color;
    ctx.shadowBlur = blurPx;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(shape.canvas, padPx, padPx);

    const globalKey = shadowGlobalKeySeq++;
    entry = {
        canvas,
        offsetX: -padPx,
        offsetY: -padPx,
        globalKey
    };
    if (shape.shadows.size >= SHADOW_CACHE_LIMIT) {
        const evictedKey = shape.shadows.keys().next().value;
        const evicted = shape.shadows.get(evictedKey);
        shape.shadows.delete(evictedKey);
        globalShadowLRU.delete(evicted.globalKey);
        releasePooledCanvas(shadowCanvasPool, evicted.canvas);
    }
    shape.shadows.set(key, entry);

    if (globalShadowLRU.size >= GLOBAL_SHADOW_CANVAS_LIMIT) evictOldestGlobalShadow();
    globalShadowLRU.set(globalKey, {
        shape,
        key,
        entry
    });
    return entry;
}

const maskGlyphStencilCache = new Map();
const maskScratchCanvasPool = [];

const sharedPatternSurface = (() => {
    const canvas = new OffscreenCanvas(1, 1);
    return {
        canvas,
        ctx: canvas.getContext('2d'),
        cacheKey: null,
        pattern: null,
        capW: canvas.width,
        capH: canvas.height
    };
})();

function sampleMaskPattern(texture, matrix, w, h) {
    const surface = sharedPatternSurface;
    let patternDirty = surface.cacheKey !== texture.cacheKey;
    if (surface.capW < w || surface.capH < h) {
        surface.capW = Math.max(surface.capW, bucketSize(w));
        surface.capH = Math.max(surface.capH, bucketSize(h));
        surface.canvas.width = surface.capW;
        surface.canvas.height = surface.capH;
        patternDirty = true;
    }
    if (patternDirty) {
        surface.pattern = surface.ctx.createPattern(texture.canvas, 'repeat');
        surface.cacheKey = texture.cacheKey;
    }
    if (!surface.pattern) return null;

    surface.pattern.setTransform(matrix);
    surface.ctx.setTransform(1, 0, 0, 1, 0, 0);
    surface.ctx.globalAlpha = 1;
    surface.ctx.globalCompositeOperation = 'source-over';
    surface.ctx.clearRect(0, 0, w, h);
    surface.ctx.fillStyle = surface.pattern;
    surface.ctx.fillRect(0, 0, w, h);

    return surface.canvas;
}

function getMaskGlyphStencil(shape) {
    let stencil = maskGlyphStencilCache.get(shape);
    if (stencil) return stencil;
    stencil = acquirePooledCanvas(stencilCanvasPool, shape.canvas.width, shape.canvas.height);
    const sctx = stencil.getContext('2d');
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.globalCompositeOperation = 'source-over';
    sctx.clearRect(0, 0, stencil.width, stencil.height);
    sctx.fillStyle = '#ffffff';
    sctx.fillRect(0, 0, stencil.width, stencil.height);
    sctx.globalCompositeOperation = 'destination-in';
    sctx.drawImage(shape.canvas, 0, 0);
    if (maskGlyphStencilCache.size >= STENCIL_CACHE_LIMIT) {
        const evictedShape = maskGlyphStencilCache.keys().next().value;
        releasePooledCanvas(stencilCanvasPool, maskGlyphStencilCache.get(evictedShape));
        maskGlyphStencilCache.delete(evictedShape);
    }
    maskGlyphStencilCache.set(shape, stencil);
    return stencil;
}

function acquireMaskScratchCanvas(w, h) {
    let best = -1;
    let bestArea = Infinity;
    for (let i = 0; i < maskScratchCanvasPool.length; i++) {
        const c = maskScratchCanvasPool[i];
        if (c.width >= w && c.height >= h) {
            const area = c.width * c.height;
            if (area < bestArea) {
                bestArea = area;
                best = i;
            }
        }
    }
    let canvas;
    if (best !== -1) {
        canvas = maskScratchCanvasPool.splice(best, 1)[0];
    } else {
        canvas = maskScratchCanvasPool.length ? maskScratchCanvasPool.pop() : new OffscreenCanvas(1, 1);
        const cw = Math.max(canvas.width, bucketSize(w));
        const ch = Math.max(canvas.height, bucketSize(h));
        if (canvas.width !== cw) canvas.width = cw;
        if (canvas.height !== ch) canvas.height = ch;
    }
    return canvas;
}

function releaseMaskScratchCanvas(canvas) {
    if (maskScratchCanvasPool.length < 64) maskScratchCanvasPool.push(canvas);
}

function drawMaskedGlyph(destCtx, glyphKey, mask, texture, worldDrawX, worldDrawY, spanW, spanH, spanOriginX, spanOriginY, destX, destY, alpha) {
    const coverage = Math.max(0, Math.min(100, Number(mask.coverage) || 0)) / 100;
    if (coverage <= 0) return;

    const shape = getGlyphShape(glyphKey);
    if (!shape) return;
    const w = shape.canvas.width;
    const h = shape.canvas.height;

    const zoom = Math.max(0.01, (Number(mask.zoom) || 100) / 100);
    const rotation = Number(mask.rotation) || 0;
    const anchorX = (mask.x || 0) * DEST_SCALE - destX;
    const anchorY = -(mask.y || 0) * DEST_SCALE - destY;

    const matrix = new DOMMatrix();
    matrix.translateSelf(anchorX, anchorY);
    if (rotation !== 0) matrix.rotateSelf(rotation);
    matrix.scaleSelf(zoom, zoom);

    const sampled = sampleMaskPattern(texture, matrix, w, h);
    if (!sampled) return;

    const scratch = acquireMaskScratchCanvas(w, h);
    const sctx = scratch.getContext('2d');
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.clearRect(0, 0, w, h);
    sctx.globalAlpha = 1;
    sctx.globalCompositeOperation = 'source-over';
    sctx.drawImage(sampled, 0, 0, w, h, 0, 0, w, h);

    const stencil = getMaskGlyphStencil(shape);
    sctx.globalCompositeOperation = 'destination-in';
    sctx.drawImage(stencil, 0, 0);
    sctx.globalCompositeOperation = 'source-over';

    if (coverage < 1) {
        const seamless = !!mask.seamless;
        const localOffsetX = seamless ? (worldDrawX - spanOriginX) : 0;
        const localOffsetY = seamless ? (worldDrawY - spanOriginY) : 0;
        const effSpanW = seamless && spanW ? spanW : w;
        const effSpanH = seamless && spanH ? spanH : h;
        const blurPx = Math.max(0, Number(mask.blur) || 0) * DEST_SCALE;
        const direction = mask.direction || WIPE_DIRECTION_BOTTOM_UP;
        const bandHalf = Math.max(0.5, blurPx / 2);

        let revealEdge, axisIsX, growsPositive;
        if (direction === WIPE_DIRECTION_LEFT_RIGHT) {
            revealEdge = effSpanW * coverage - localOffsetX;
            axisIsX = true;
            growsPositive = true;
        } else if (direction === WIPE_DIRECTION_RIGHT_LEFT) {
            revealEdge = effSpanW - effSpanW * coverage - localOffsetX;
            axisIsX = true;
            growsPositive = false;
        } else if (direction === WIPE_DIRECTION_UP_DOWN) {
            revealEdge = effSpanH * coverage - localOffsetY;
            axisIsX = false;
            growsPositive = true;
        } else {
            revealEdge = effSpanH - effSpanH * coverage - localOffsetY;
            axisIsX = false;
            growsPositive = false;
        }

        const axisSize = axisIsX ? w : h;
        const gradStart = growsPositive ? revealEdge - bandHalf : revealEdge + bandHalf;
        const gradEnd = growsPositive ? revealEdge + bandHalf : revealEdge - bandHalf;
        const bandFrom = Math.min(gradStart, gradEnd);
        const bandTo = Math.max(gradStart, gradEnd);

        if (bandTo <= 0) {
            if (growsPositive) {
                releaseMaskScratchCanvas(scratch);
                return;
            }
        } else if (bandFrom >= axisSize) {
            if (!growsPositive) {
                releaseMaskScratchCanvas(scratch);
                return;
            }
        } else {
            sctx.globalCompositeOperation = 'destination-in';
            const gradient = axisIsX ?
                sctx.createLinearGradient(gradStart, 0, gradEnd, 0) :
                sctx.createLinearGradient(0, gradStart, 0, gradEnd);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            sctx.fillStyle = gradient;
            sctx.fillRect(0, 0, w, h);
            sctx.globalCompositeOperation = 'source-over';
        }
    }

    destCtx.save();
    destCtx.globalAlpha = alpha;
    destCtx.drawImage(scratch, 0, 0, w, h, destX, destY, w, h);
    destCtx.restore();

    releaseMaskScratchCanvas(scratch);
}

function maskBatchKey(mask, alpha) {
    return mask.targetName + '\u0001' + mask.costumeName + '\u0001' +
        (mask.direction || WIPE_DIRECTION_BOTTOM_UP) + '\u0001' +
        (Number(mask.coverage) || 0) + '\u0001' +
        (Number(mask.blur) || 0) + '\u0001' +
        (Number(mask.x) || 0) + '\u0001' +
        (Number(mask.y) || 0) + '\u0001' +
        (Number(mask.zoom) || 100) + '\u0001' +
        (Number(mask.rotation) || 0) + '\u0001' + alpha;
}

function collectBatchedMaskGroups(paintOps, maskTextures) {
    const groups = [];
    const batchedOps = new Set();
    let group = null;

    const flushGroup = () => {
        if (group && group.items.length > 1) {
            groups.push(group);
            for (let i = 0; i < group.items.length; i++) batchedOps.add(group.items[i].op);
        }
        group = null;
    };

    for (let i = 0; i < paintOps.length; i++) {
        const op = paintOps[i];
        const mask = op.mask;
        const maskOpacity = mask ? Math.max(0, Math.min(100, Number(mask.opacity != null ? mask.opacity : 100))) / 100 : 0;
        const alpha = (op.opacity == null ? 1 : op.opacity) * maskOpacity;
        const canBatch = mask && mask.seamless && !op.rotation && (op.scale == null || op.scale === 1) &&
            Math.max(0, Math.min(100, Number(mask.coverage) || 0)) > 0 && alpha > 0;
        if (!canBatch) {
            flushGroup();
            continue;
        }

        const key = maskBatchKey(mask, alpha);
        if (!group || group.key !== key) {
            flushGroup();
            const texture = maskTextures.get(mask.targetName + '\u0001' + mask.costumeName);
            if (!texture) continue;
            group = {
                key,
                mask,
                alpha,
                texture,
                items: [],
                minX: Infinity,
                minY: Infinity,
                maxX: -Infinity,
                maxY: -Infinity
            };
        }

        if (op.text === '\u00A0' || op.text === '') continue;

        const glyph = getGlyphBitmap(op.glyphKey, op.color);
        if (!glyph) {
            flushGroup();
            continue;
        }
        const drawXEm = op.x - (glyph.baselineOriginXEm + glyph.advance / 2);
        const drawYEm = (op.y + (glyph.fontAscentEm - glyph.fontDescentEm) / 2) - glyph.baselineOriginYEm;
        const px = Math.round(drawXEm * DEST_SCALE);
        const py = Math.round(drawYEm * DEST_SCALE);
        group.items.push({op, glyph, px, py});
        group.minX = Math.min(group.minX, px);
        group.minY = Math.min(group.minY, py);
        group.maxX = Math.max(group.maxX, px + glyph.canvas.width);
        group.maxY = Math.max(group.maxY, py + glyph.canvas.height);
    }
    flushGroup();

    return {groups, batchedOps};
}

const maskBatchCanvasesByState = new Map();

function drawBatchedMaskGroups(ctx, stateId, groups, pixelW, pixelH) {
    if (!groups.length) return;
    let canvas = maskBatchCanvasesByState.get(stateId);
    if (!canvas) {
        canvas = new OffscreenCanvas(pixelW, pixelH);
        maskBatchCanvasesByState.set(stateId, canvas);
    }
    if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
    }
    const batchCtx = canvas.getContext('2d');

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const mask = group.mask;
        batchCtx.setTransform(1, 0, 0, 1, 0, 0);
        batchCtx.globalAlpha = 1;
        batchCtx.globalCompositeOperation = 'source-over';
        batchCtx.clearRect(0, 0, pixelW, pixelH);
        const pattern = batchCtx.createPattern(group.texture.canvas, 'repeat');
        if (!pattern) continue;
        const matrix = new DOMMatrix();
        matrix.translateSelf((Number(mask.x) || 0) * DEST_SCALE, -(Number(mask.y) || 0) * DEST_SCALE);
        const rotation = Number(mask.rotation) || 0;
        if (rotation !== 0) matrix.rotateSelf(rotation);
        const zoom = Math.max(0.01, (Number(mask.zoom) || 100) / 100);
        matrix.scaleSelf(zoom, zoom);
        pattern.setTransform(matrix);
        batchCtx.fillStyle = pattern;
        batchCtx.fillRect(0, 0, pixelW, pixelH);

        batchCtx.globalCompositeOperation = 'destination-in';
        for (let j = 0; j < group.items.length; j++) {
            const item = group.items[j];
            batchCtx.globalAlpha = group.alpha;
            batchCtx.drawImage(item.glyph.shape.canvas, item.px, item.py);
        }
        batchCtx.globalAlpha = 1;

        const coverage = Math.max(0, Math.min(100, Number(mask.coverage) || 0)) / 100;
        if (coverage < 1) {
            const blurPx = Math.max(0, Number(mask.blur) || 0) * DEST_SCALE;
            const bandHalf = Math.max(0.5, blurPx / 2);
            const direction = mask.direction || WIPE_DIRECTION_BOTTOM_UP;
            const axisIsX = direction === WIPE_DIRECTION_LEFT_RIGHT || direction === WIPE_DIRECTION_RIGHT_LEFT;
            const growsPositive = direction === WIPE_DIRECTION_LEFT_RIGHT || direction === WIPE_DIRECTION_UP_DOWN;
            const axisStart = axisIsX ? group.minX : group.minY;
            const axisSize = axisIsX ? group.maxX - group.minX : group.maxY - group.minY;
            const revealEdge = growsPositive ? axisStart + axisSize * coverage : axisStart + axisSize - axisSize * coverage;
            const gradStart = growsPositive ? revealEdge - bandHalf : revealEdge + bandHalf;
            const gradEnd = growsPositive ? revealEdge + bandHalf : revealEdge - bandHalf;
            const gradient = axisIsX ?
                batchCtx.createLinearGradient(gradStart, 0, gradEnd, 0) :
                batchCtx.createLinearGradient(0, gradStart, 0, gradEnd);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            batchCtx.fillStyle = gradient;
            batchCtx.fillRect(0, 0, pixelW, pixelH);
        }

        ctx.drawImage(canvas, 0, 0);
    }
}

const READBACK_CANVAS = new OffscreenCanvas(1, 1);
const READBACK_CTX = READBACK_CANVAS.getContext('2d', {
    willReadFrequently: true
});

function getGlyphInkColumns(glyph) {
    if (glyph.inkColumns) return glyph.inkColumns;
    const w = glyph.canvas.width;
    const h = glyph.canvas.height;
    if (READBACK_CANVAS.width !== w) READBACK_CANVAS.width = w;
    if (READBACK_CANVAS.height !== h) READBACK_CANVAS.height = h;
    READBACK_CTX.setTransform(1, 0, 0, 1, 0, 0);
    READBACK_CTX.clearRect(0, 0, w, h);
    READBACK_CTX.drawImage(glyph.canvas, 0, 0);
    const image = READBACK_CTX.getImageData(0, 0, w, h);
    const inkColumns = new Uint8Array(w * h);
    for (let i = 0; i < inkColumns.length; i++) {
        inkColumns[i] = image.data[i * 4 + 3] > 16 ? 1 : 0;
    }
    glyph.inkColumns = inkColumns;
    return inkColumns;
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
        const w = glyph.canvas.width;
        const inkData = getGlyphInkColumns(glyph);
        const rowStart = Math.max(0, Math.floor(y - glyphY - lineWidth / 2));
        const rowEnd = Math.min(glyph.canvas.height - 1, Math.ceil(y - glyphY + lineWidth / 2));
        const columnStart = Math.max(0, Math.floor(startX - glyphX));
        const columnEnd = Math.min(w - 1, Math.ceil(endX - glyphX));
        const ink = new Uint8Array(w);

        for (let py = rowStart; py <= rowEnd; py++) {
            for (let px = columnStart; px <= columnEnd; px++) {
                if (inkData[py * w + px]) ink[px] = 1;
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

function maskGroupKey(mask) {
    return mask.targetName + '\u0001' + mask.costumeName + '\u0001' +
        (mask.direction || WIPE_DIRECTION_BOTTOM_UP) + '\u0001' +
        Math.round(mask.x * 4) + '\u0001' + Math.round(mask.y * 4);
}

function computeSeamlessMaskSpansByIndex(paintOps) {
    const spans = new Map();
    let groupIndices = null;
    let groupKey = null;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    const flushGroup = () => {
        if (!groupIndices || !groupIndices.length) return;
        if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) return;
        const spanW = Math.max(1, maxX - minX);
        const spanH = Math.max(1, maxY - minY);
        for (const gi of groupIndices) {
            spans.set(gi, {
                spanW,
                spanH,
                originX: minX,
                originY: minY
            });
        }
    };

    for (let i = 0; i < paintOps.length; i++) {
        const op = paintOps[i];
        if (!op.mask || !op.mask.seamless) {
            flushGroup();
            groupIndices = null;
            groupKey = null;
            continue;
        }

        const key = maskGroupKey(op.mask);
        if (groupKey !== key) {
            flushGroup();
            groupIndices = [];
            groupKey = key;
            minX = Infinity;
            maxX = -Infinity;
            minY = Infinity;
            maxY = -Infinity;
        }
        groupIndices.push(op.charIndex);

        if (op.text === '\u00A0' || op.text === '') continue;

        const shape = getGlyphShape(op.glyphKey);
        if (!shape) continue;
        const advanceCenterXEm = shape.baselineOriginXEm + shape.advance / 2;
        const baselineYFromLineCenter = (shape.fontAscentEm - shape.fontDescentEm) / 2;
        const drawXEm = op.x - advanceCenterXEm;
        const drawYEm = (op.y + baselineYFromLineCenter) - shape.baselineOriginYEm;
        const px = Math.round(drawXEm * DEST_SCALE);
        const py = Math.round(drawYEm * DEST_SCALE);
        const w = shape.canvas.width;
        const h = shape.canvas.height;

        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px + w);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py + h);
    }
    flushGroup();

    return spans;
}

const maskSpansCacheByState = new Map();

function getSeamlessMaskSpans(stateId, paintOps, layoutDocKey, geometryVersion) {
    const cacheKey = layoutDocKey + '\u0003' + geometryVersion;
    let entry = maskSpansCacheByState.get(stateId);
    if (entry && entry.cacheKey === cacheKey) return entry.spans;
    const spans = computeSeamlessMaskSpansByIndex(paintOps);
    maskSpansCacheByState.set(stateId, { cacheKey, spans });
    return spans;
}

const paintCanvasByState = new Map();

function compositeGlyphsToCanvas(stateId, settings, paintOps, docW, docH, textWidth, textHeight, originX, originY, maskTextures) {
    let canvas = paintCanvasByState.get(stateId);
    const pixelW = Math.max(1, Math.round(docW * DEST_SCALE));
    const pixelH = Math.max(1, Math.round(docH * DEST_SCALE));
    if (!canvas) {
        canvas = new OffscreenCanvas(pixelW, pixelH);
        paintCanvasByState.set(stateId, canvas);
    }
    if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
    }
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = !!settings.smoothing;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, pixelW, pixelH);
    ctx.textBaseline = 'alphabetic';

    const background = settings.textBackground;
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

    const maskSpansByIndex = getSeamlessMaskSpans(stateId, paintOps, settings.layoutKey + '\u0003' + docW + '\u0003' + docH, settings.charMaskGeometryVersion);
    const batchedMasks = collectBatchedMaskGroups(paintOps, maskTextures);

    const applyCharTransformOp = (op, hasRotation, hasScale) => {
        const cx = op.x * DEST_SCALE;
        const cy = op.y * DEST_SCALE;
        ctx.translate(cx, cy);
        if (hasRotation) ctx.rotate(-op.rotation * Math.PI / 180);
        if (hasScale) ctx.scale(op.scale, op.scale);
        ctx.translate(-cx, -cy);
    };
    const resetTransform = () => ctx.setTransform(1, 0, 0, 1, 0, 0);

    for (let i = 0; i < paintOps.length; i++) {
        const op = paintOps[i];
        if (op.text === '\u00A0' || op.text === '') continue;

        const glyph = getGlyphBitmap(op.glyphKey, op.color);
        if (!glyph) continue;
        const fontSize = op.fontSize;

        const advanceCenterXEm = glyph.baselineOriginXEm + glyph.advance / 2;
        const baselineYFromLineCenter = (glyph.fontAscentEm - glyph.fontDescentEm) / 2;
        const drawXEm = op.x - advanceCenterXEm;
        const drawYEm = (op.y + baselineYFromLineCenter) - glyph.baselineOriginYEm;

        const hasOpacity = op.opacity != null && op.opacity !== 1;
        const hasRotation = !!op.rotation;
        const hasScale = op.scale != null && op.scale !== 1;
        const hasTransform = hasRotation || hasScale;

        if (hasTransform) applyCharTransformOp(op, hasRotation, hasScale);

        if (settings.textShadow.enabled) {
            const shadowShape = glyph.shape;
            const shadowBlurPx = Math.max(0, Number(settings.textShadow.blur) || 0) * DEST_SCALE;
            const shadowBitmap = getShadowGlyphBitmap(shadowShape, settings.textShadow.color, shadowBlurPx);
            const shadowOffsetX = (Number(settings.textShadow.offsetX) || 0) * DEST_SCALE + shadowBitmap.offsetX;
            const shadowOffsetY = (Number(settings.textShadow.offsetY) || 0) * DEST_SCALE + shadowBitmap.offsetY;
            ctx.globalAlpha = (hasOpacity ? op.opacity : 1) * Math.max(0, Math.min(100, Number(settings.textShadow.opacity) || 0)) / 100;
            ctx.drawImage(shadowBitmap.canvas, drawXEm * DEST_SCALE + shadowOffsetX, drawYEm * DEST_SCALE + shadowOffsetY);
            ctx.globalAlpha = 1;
        }

        if (op.strike) {
            if (hasOpacity) ctx.globalAlpha = op.opacity;
            ctx.strokeStyle = op.color;
            ctx.lineWidth = Math.max(1, fontSize * 0.06) * DEST_SCALE;
            const sy = op.y * DEST_SCALE;
            ctx.beginPath();
            ctx.moveTo((op.x - op.width / 2) * DEST_SCALE, sy);
            ctx.lineTo((op.x + op.width / 2) * DEST_SCALE, sy);
            ctx.stroke();
            if (hasOpacity) ctx.globalAlpha = 1;
        }

        if (settings.textBorder.enabled && Number(settings.textBorder.size) > 0) {
            const shape = glyph.shape;
            const borderGlyph = tintGlyph(shape, settings.textBorder.color);
            ctx.globalAlpha = (hasOpacity ? op.opacity : 1) * Math.max(0, Math.min(100, Number(settings.textBorder.opacity) || 0)) / 100;
            const borderSize = Math.max(0, Number(settings.textBorder.size) || 0) * DEST_SCALE;
            const borderOffsets = [[-borderSize, 0], [borderSize, 0], [0, -borderSize], [0, borderSize], [-borderSize, -borderSize], [borderSize, -borderSize], [-borderSize, borderSize], [borderSize, borderSize]];
            for (const [offsetX, offsetY] of borderOffsets) {
                ctx.drawImage(borderGlyph, drawXEm * DEST_SCALE + offsetX, drawYEm * DEST_SCALE + offsetY);
            }
            ctx.globalAlpha = 1;
        }

        if (!hasTransform) {
            const px = Math.round(drawXEm * DEST_SCALE);
            const py = Math.round(drawYEm * DEST_SCALE);
            if (hasOpacity) {
                ctx.globalAlpha = op.opacity;
                ctx.drawImage(glyph.canvas, px, py);
                ctx.globalAlpha = 1;
            } else {
                ctx.drawImage(glyph.canvas, px, py);
            }
        } else {
            if (hasOpacity) ctx.globalAlpha = op.opacity;
            ctx.drawImage(glyph.canvas, drawXEm * DEST_SCALE, drawYEm * DEST_SCALE);
            if (hasOpacity) ctx.globalAlpha = 1;
        }

        if (op.mask && !batchedMasks.batchedOps.has(op)) {
            const texture = maskTextures.get(op.mask.targetName + '\u0001' + op.mask.costumeName);
            if (texture) {
                const px = Math.round(drawXEm * DEST_SCALE);
                const py = Math.round(drawYEm * DEST_SCALE);
                const span = maskSpansByIndex.get(op.charIndex);
                const maskOpacity = Math.max(0, Math.min(100, Number(op.mask.opacity != null ? op.mask.opacity : 100))) / 100;
                const combinedAlpha = (hasOpacity ? op.opacity : 1) * maskOpacity;
                if (combinedAlpha > 0) {
                    if (!hasTransform) {
                        drawMaskedGlyph(
                            ctx, op.glyphKey,
                            op.mask, texture, px, py,
                            span ? span.spanW : 0, span ? span.spanH : 0,
                            span ? span.originX : 0, span ? span.originY : 0,
                            px, py, combinedAlpha
                        );
                    } else {
                        drawMaskedGlyph(
                            ctx, op.glyphKey,
                            op.mask, texture, px, py,
                            span ? span.spanW : 0, span ? span.spanH : 0,
                            span ? span.originX : 0, span ? span.originY : 0,
                            drawXEm * DEST_SCALE, drawYEm * DEST_SCALE, combinedAlpha
                        );
                    }
                }
            }
        }

        if (op.underline) {
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
            if (hasOpacity) ctx.globalAlpha = 1;
        }

        if (hasTransform) resetTransform();
    }

    drawBatchedMaskGroups(ctx, stateId, batchedMasks.groups, pixelW, pixelH);

    return canvas;
}

const maskTexturesByKey = new Map();

self.onmessage = async (event) => {
    const msg = event.data;
    if (!msg) return;

    if (msg.type === 'composite') {
        try {
            for (const [key, bitmap] of msg.glyphUpdates) {
                const canvas = acquirePooledCanvas(glyphShapeCanvasPool, bitmap.width, bitmap.height);
                const gctx = canvas.getContext('2d');
                gctx.setTransform(1, 0, 0, 1, 0, 0);
                gctx.clearRect(0, 0, canvas.width, canvas.height);
                gctx.drawImage(bitmap, 0, 0);
                bitmap.close();
                const meta = msg.glyphMeta.get(key);
                if (glyphShapesByKey.size >= GLYPH_CACHE_LIMIT && !glyphShapesByKey.has(key)) {
                    const evictedKey = glyphShapesByKey.keys().next().value;
                    const evictedShape = glyphShapesByKey.get(evictedKey);
                    glyphShapesByKey.delete(evictedKey);
                    if (evictedShape) releaseGlyphOwnedCanvases(evictedShape);
                }
                glyphShapesByKey.set(key, {
                    canvas,
                    tinted: new Map(),
                    shadows: new Map(),
                    bitmaps: new Map(),
                    advance: meta.advance,
                    baselineOriginXEm: meta.baselineOriginXEm,
                    baselineOriginYEm: meta.baselineOriginYEm,
                    fontAscentEm: meta.fontAscentEm,
                    fontDescentEm: meta.fontDescentEm
                });
            }

            for (const [key, bitmap] of msg.maskTextureUpdates) {
                if (bitmap === null) {
                    maskTexturesByKey.delete(key);
                    continue;
                }
                const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                canvas.getContext('2d').drawImage(bitmap, 0, 0);
                bitmap.close();
                maskTexturesByKey.set(key, { canvas, cacheKey: key });
            }

            const canvas = compositeGlyphsToCanvas(
                msg.stateId, msg.settings, msg.paintOps,
                msg.docW, msg.docH, msg.textWidth, msg.textHeight,
                msg.originX, msg.originY, maskTexturesByKey
            );

            const resultBitmap = canvas.transferToImageBitmap ?
                canvas.transferToImageBitmap() :
                await createImageBitmap(canvas);

            self.postMessage({
                type: 'composite-result',
                requestId: msg.requestId,
                stateId: msg.stateId,
                bitmap: resultBitmap,
                pixelW: canvas.width,
                pixelH: canvas.height
            }, [resultBitmap]);
        } catch (err) {
            self.postMessage({
                type: 'composite-error',
                requestId: msg.requestId,
                stateId: msg.stateId,
                message: err && err.message ? err.message : String(err)
            });
        }
    } else if (msg.type === 'evict-glyphs') {
        for (const key of msg.glyphKeys) {
            const shape = glyphShapesByKey.get(key);
            glyphShapesByKey.delete(key);
            if (shape) releaseGlyphOwnedCanvases(shape);
        }
    } else if (msg.type === 'dispose-state') {
        paintCanvasByState.delete(msg.stateId);
        maskBatchCanvasesByState.delete(msg.stateId);
        maskSpansCacheByState.delete(msg.stateId);
    }
};
`;

    let renderWorker = null;
    let renderWorkerFailed = false;
    let renderWorkerRequestId = 0;
    const renderWorkerPending = new Map();
    const workerKnownGlyphKeys = new Set();
    const workerKnownMaskKeys = new Set();
    const stateWorkerIds = new WeakMap();
    let nextStateWorkerId = 1;

    function supportsRenderWorker() {
        return typeof Worker !== 'undefined' &&
            typeof OffscreenCanvas !== 'undefined' &&
            typeof createImageBitmap !== 'undefined';
    }

    function getStateWorkerId(state) {
        let id = stateWorkerIds.get(state);
        if (!id) {
            id = nextStateWorkerId++;
            stateWorkerIds.set(state, id);
        }
        return id;
    }

    function handleRenderWorkerMessage(event) {
        const msg = event.data;
        if (!msg) return;
        const pending = renderWorkerPending.get(msg.requestId);
        if (!pending) return;
        renderWorkerPending.delete(msg.requestId);
        if (msg.type === 'composite-result') {
            pending.resolve({
                bitmap: msg.bitmap,
                pixelW: msg.pixelW,
                pixelH: msg.pixelH
            });
        } else {
            pending.reject(new Error(msg.message || 'render worker error'));
        }
    }

    function ensureRenderWorker() {
        if (renderWorker || renderWorkerFailed) return renderWorker;
        if (!supportsRenderWorker()) {
            renderWorkerFailed = true;
            console.log('[Iris Text] SOMEHOW, the render worker is not supported in this environment (wow!). falling back to the main thread.');
            return null;
        }
        try {
            const blob = new Blob([WORKER_SOURCE], {
                type: 'text/javascript'
            });
            const url = URL.createObjectURL(blob);
            renderWorker = new Worker(url);
            renderWorker.onmessage = handleRenderWorkerMessage;
            renderWorker.onerror = () => {
                renderWorkerFailed = true;
                console.log('[Iris Text] uh-oh, the render crashed... falling back to the main thread.');
                for (const pending of renderWorkerPending.values()) {
                    pending.reject(new Error('render worker crashed'));
                }
                renderWorkerPending.clear();
                if (renderWorker) {
                    renderWorker.terminate();
                    renderWorker = null;
                }
            };
            console.log('[Iris Text] the render worker has started. using worker rendering.');
        } catch (e) {
            renderWorkerFailed = true;
            renderWorker = null;
            console.log('[Iris Text] render worker failed to start (' + (e && e.message ? e.message : e) + '). using main-thread rendering.');
        }
        return renderWorker;
    }

    function disposeStateFromWorker(state) {
        const id = stateWorkerIds.get(state);
        if (id === undefined || !renderWorker) return;
        renderWorker.postMessage({
            type: 'dispose-state',
            stateId: id
        });
    }

    async function compositeGlyphsViaWorker(state, paintOps, docW, docH, textWidth, textHeight, originX, originY) {
        const worker = ensureRenderWorker();
        if (!worker) return null;

        const glyphJobs = [];
        const neededMaskKeys = new Set();

        for (let i = 0; i < paintOps.length; i++) {
            const op = paintOps[i];
            if (op.text === '\u00A0' || op.text === '') continue;
            const fontFamily = op.font['font-family'];
            const fontSize = op.font['font-size'];
            const fontWeight = op.font['font-weight'];
            const fontStyle = op.font['font-style'];
            const key = glyphCacheKey(op.text, fontFamily, fontSize, fontWeight, fontStyle);
            op.glyphKey = key;
            op.fontSize = fontSize;
            if (!workerKnownGlyphKeys.has(key) && !glyphJobs.some(j => j.key === key)) {
                const shape = getGlyphShape(op.text, fontFamily, fontSize, fontWeight, fontStyle);
                glyphJobs.push({ key, shape });
                workerKnownGlyphKeys.add(key);
            }
            if (op.mask) {
                neededMaskKeys.add(op.mask.targetName + '\u0001' + op.mask.costumeName);
            }
        }

        const maskJobs = [];
        for (const maskKey of neededMaskKeys) {
            if (workerKnownMaskKeys.has(maskKey)) continue;
            const [targetName, costumeName] = maskKey.split('\u0001');
            const texture = getMaskTexture(targetName, costumeName);
            if (!texture) continue;
            maskJobs.push({ maskKey, texture });
            workerKnownMaskKeys.add(maskKey);
        }

        const [glyphBitmaps, maskBitmaps] = await Promise.all([
            Promise.all(glyphJobs.map(j => createImageBitmap(j.shape.canvas))),
            Promise.all(maskJobs.map(j => createImageBitmap(j.texture.canvas)))
        ]);

        const glyphUpdates = glyphJobs.map((j, idx) => [j.key, glyphBitmaps[idx]]);
        const glyphMeta = glyphJobs.map(j => [j.key, {
            advance: j.shape.advance,
            baselineOriginXEm: j.shape.baselineOriginXEm,
            baselineOriginYEm: j.shape.baselineOriginYEm,
            fontAscentEm: j.shape.fontAscentEm,
            fontDescentEm: j.shape.fontDescentEm
        }]);
        const maskTextureUpdates = maskJobs.map((j, idx) => [j.maskKey, maskBitmaps[idx]]);

        const stateId = getStateWorkerId(state);
        const requestId = ++renderWorkerRequestId;

        const settings = {
            smoothing: state.smoothing,
            textBackground: state.textBackground,
            textShadow: state.textShadow,
            textBorder: state.textBorder,
            layoutKey: state.layoutKey,
            charMaskGeometryVersion: state.charMaskGeometryVersion
        };

        const transferList = glyphUpdates.map(([, bitmap]) => bitmap)
            .concat(maskTextureUpdates.map(([, bitmap]) => bitmap));

        const resultPromise = new Promise((resolve, reject) => {
            renderWorkerPending.set(requestId, { resolve, reject });
        });

        worker.postMessage({
            type: 'composite',
            requestId,
            stateId,
            settings,
            paintOps,
            docW,
            docH,
            textWidth,
            textHeight,
            originX,
            originY,
            glyphUpdates,
            glyphMeta: new Map(glyphMeta),
            maskTextureUpdates
        }, transferList);

        return resultPromise;
    }

    function maskGroupKey(mask) {
        return mask.targetName + '\u0001' + mask.costumeName + '\u0001' +
            (mask.direction || WIPE_DIRECTION_BOTTOM_UP) + '\u0001' +
            Math.round(mask.x * 4) + '\u0001' + Math.round(mask.y * 4);
    }

    function computeSeamlessMaskSpansByIndex(paintOps) {
        const spans = new Map();
        let groupIndices = null;
        let groupKey = null;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

        const flushGroup = () => {
            if (!groupIndices || !groupIndices.length) return;
            if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) return;
            const spanW = Math.max(1, maxX - minX);
            const spanH = Math.max(1, maxY - minY);
            for (const gi of groupIndices) {
                spans.set(gi, {
                    spanW,
                    spanH,
                    originX: minX,
                    originY: minY
                });
            }
        };

        for (let i = 0; i < paintOps.length; i++) {
            const op = paintOps[i];
            if (!op.mask || !op.mask.seamless) {
                flushGroup();
                groupIndices = null;
                groupKey = null;
                continue;
            }

            const key = maskGroupKey(op.mask);
            if (groupKey !== key) {
                flushGroup();
                groupIndices = [];
                groupKey = key;
                minX = Infinity;
                maxX = -Infinity;
                minY = Infinity;
                maxY = -Infinity;
            }
            groupIndices.push(op.charIndex);

            if (op.text === '\u00A0' || op.text === '') continue;

            const fontFamily = op.font['font-family'];
            const fontSize = op.font['font-size'];
            const fontWeight = op.font['font-weight'];
            const fontStyle = op.font['font-style'];
            const shape = getGlyphShape(op.text, fontFamily, fontSize, fontWeight, fontStyle);
            const advanceCenterXEm = shape.baselineOriginXEm + shape.advance / 2;
            const baselineYFromLineCenter = (shape.fontAscentEm - shape.fontDescentEm) / 2;
            const drawXEm = op.x - advanceCenterXEm;
            const drawYEm = (op.y + baselineYFromLineCenter) - shape.baselineOriginYEm;
            const px = Math.round(drawXEm * DEST_SCALE);
            const py = Math.round(drawYEm * DEST_SCALE);
            const w = shape.canvas.width;
            const h = shape.canvas.height;

            minX = Math.min(minX, px);
            maxX = Math.max(maxX, px + w);
            minY = Math.min(minY, py);
            maxY = Math.max(maxY, py + h);
        }
        flushGroup();

        return spans;
    }

    function getSeamlessMaskSpans(state, paintOps, layoutDocKey) {
        const cacheKey = layoutDocKey + '\u0003' + state.charMaskGeometryVersion;
        if (state.maskSpansCacheKey === cacheKey && state.maskSpansCache) {
            return state.maskSpansCache;
        }
        const spans = computeSeamlessMaskSpansByIndex(paintOps);
        state.maskSpansCacheKey = cacheKey;
        state.maskSpansCache = spans;
        return spans;
    }

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

        const maskSpansByIndex = getSeamlessMaskSpans(state, paintOps, state.layoutKey + '\u0003' + docW + '\u0003' + docH);
        const batchedMasks = collectBatchedMaskGroups(paintOps);

        const applyCharTransformOp = (op, hasRotation, hasScale) => {
            const cx = op.x * DEST_SCALE;
            const cy = op.y * DEST_SCALE;
            ctx.translate(cx, cy);
            if (hasRotation) ctx.rotate(-op.rotation * Math.PI / 180);
            if (hasScale) ctx.scale(op.scale, op.scale);
            ctx.translate(-cx, -cy);
        };
        const resetTransform = () => ctx.setTransform(1, 0, 0, 1, 0, 0);

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
            const hasScale = op.scale != null && op.scale !== 1;
            const hasTransform = hasRotation || hasScale;

            if (hasTransform) applyCharTransformOp(op, hasRotation, hasScale);

            if (state.textShadow.enabled) {
                const shadowShape = glyph.shape || getGlyphShape(op.text, fontFamily, fontSize, fontWeight, fontStyle);
                const shadowBlurPx = Math.max(0, Number(state.textShadow.blur) || 0) * DEST_SCALE;
                const shadowBitmap = getShadowGlyphBitmap(shadowShape, state.textShadow.color, shadowBlurPx);
                const shadowOffsetX = (Number(state.textShadow.offsetX) || 0) * DEST_SCALE + shadowBitmap.offsetX;
                const shadowOffsetY = (Number(state.textShadow.offsetY) || 0) * DEST_SCALE + shadowBitmap.offsetY;
                ctx.globalAlpha = (hasOpacity ? op.opacity : 1) * Math.max(0, Math.min(100, Number(state.textShadow.opacity) || 0)) / 100;
                ctx.drawImage(shadowBitmap.canvas, drawXEm * DEST_SCALE + shadowOffsetX, drawYEm * DEST_SCALE + shadowOffsetY);
                ctx.globalAlpha = 1;
            }

            if (op.strike) {
                if (hasOpacity) ctx.globalAlpha = op.opacity;
                ctx.strokeStyle = op.color;
                ctx.lineWidth = Math.max(1, fontSize * 0.06) * DEST_SCALE;
                const sy = op.y * DEST_SCALE;
                ctx.beginPath();
                ctx.moveTo((op.x - op.width / 2) * DEST_SCALE, sy);
                ctx.lineTo((op.x + op.width / 2) * DEST_SCALE, sy);
                ctx.stroke();
                if (hasOpacity) ctx.globalAlpha = 1;
            }

            if (state.textBorder.enabled && Number(state.textBorder.size) > 0) {
                const shape = glyph.shape || getGlyphShape(op.text, fontFamily, fontSize, fontWeight, fontStyle);
                const borderGlyph = tintGlyph(shape, state.textBorder.color);
                ctx.globalAlpha = (hasOpacity ? op.opacity : 1) * Math.max(0, Math.min(100, Number(state.textBorder.opacity) || 0)) / 100;
                const borderSize = Math.max(0, Number(state.textBorder.size) || 0) * DEST_SCALE;
                const borderOffsets = [[-borderSize, 0], [borderSize, 0], [0, -borderSize], [0, borderSize], [-borderSize, -borderSize], [borderSize, -borderSize], [-borderSize, borderSize], [borderSize, borderSize]];
                for (const [offsetX, offsetY] of borderOffsets) {
                    ctx.drawImage(borderGlyph, drawXEm * DEST_SCALE + offsetX, drawYEm * DEST_SCALE + offsetY);
                }
                ctx.globalAlpha = 1;
            }

            if (!hasTransform) {
                const px = Math.round(drawXEm * DEST_SCALE);
                const py = Math.round(drawYEm * DEST_SCALE);
                if (hasOpacity) {
                    ctx.globalAlpha = op.opacity;
                    ctx.drawImage(glyph.canvas, px, py);
                    ctx.globalAlpha = 1;
                } else {
                    ctx.drawImage(glyph.canvas, px, py);
                }
            } else {
                if (hasOpacity) ctx.globalAlpha = op.opacity;
                ctx.drawImage(glyph.canvas, drawXEm * DEST_SCALE, drawYEm * DEST_SCALE);
                if (hasOpacity) ctx.globalAlpha = 1;
            }

            if (op.mask && !batchedMasks.batchedOps.has(op)) {
                const texture = getMaskTexture(op.mask.targetName, op.mask.costumeName);
                if (texture) {
                    const px = Math.round(drawXEm * DEST_SCALE);
                    const py = Math.round(drawYEm * DEST_SCALE);
                    const span = maskSpansByIndex.get(op.charIndex);
                    const maskOpacity = Math.max(0, Math.min(100, Number(op.mask.opacity != null ? op.mask.opacity : 100))) / 100;
                    const combinedAlpha = (hasOpacity ? op.opacity : 1) * maskOpacity;
                    if (combinedAlpha > 0) {
                        if (!hasTransform) {
                            drawMaskedGlyph(
                                ctx, op.text, fontFamily, fontSize, fontWeight, fontStyle,
                                op.mask, texture, px, py,
                                span ? span.spanW : 0, span ? span.spanH : 0,
                                span ? span.originX : 0, span ? span.originY : 0,
                                px, py, combinedAlpha
                            );
                        } else {
                            drawMaskedGlyph(
                                ctx, op.text, fontFamily, fontSize, fontWeight, fontStyle,
                                op.mask, texture, px, py,
                                span ? span.spanW : 0, span ? span.spanH : 0,
                                span ? span.originX : 0, span ? span.originY : 0,
                                drawXEm * DEST_SCALE, drawYEm * DEST_SCALE, combinedAlpha
                            );
                        }
                    }
                }
            }

            if (op.underline) {
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
                if (hasOpacity) ctx.globalAlpha = 1;
            }

            if (hasTransform) resetTransform();
        }

        drawBatchedMaskGroups(ctx, state, batchedMasks.groups, pixelW, pixelH);

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
        const drawable = renderer._allDrawables[target.drawableID];
        const skin = renderer._allSkins[state.skinId];
        if (!drawable || drawable.skin !== skin) {
            renderer.updateDrawableSkinId(target.drawableID, state.skinId);
        }
        runtime.requestRedraw();
    }

    function pushImageBitmapToDrawable(target, bitmap, pixelW, pixelH, docW, docH) {
        const state = getState(target);
        let scratch = state.workerResultCanvas;
        if (!scratch) {
            scratch = document.createElement('canvas');
            scratch.reusable = false;
            state.workerResultCanvas = scratch;
        }
        if (scratch.width !== pixelW || scratch.height !== pixelH) {
            scratch.width = pixelW;
            scratch.height = pixelH;
        }
        const sctx = scratch.getContext('2d');
        sctx.setTransform(1, 0, 0, 1, 0, 0);
        sctx.clearRect(0, 0, pixelW, pixelH);
        sctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        pushCanvasToDrawable(target, scratch, docW, docH);
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
        const threads = runtime.startHats('g1nxIrisText_onCharacterType', null, target);
        if (Array.isArray(threads)) {
            for (const thread of threads) {
                thread._irisChar = current;
            }
        }
        target._irisTypingChar = null;
    }

    function startTypingFinishedHat(target) {
        runtime.startHats('g1nxIrisText_onTypingFinished', null, target);
    }

    function taggedCharacterIndices(target, tag) {
        const state = getState(target);
        const shapeKey = getShapeKey(state);
        let cache = state.taggedIndicesCache;
        if (!cache || state.taggedIndicesCacheKey !== shapeKey) {
            cache = new Map();
            state.taggedIndicesCache = cache;
            state.taggedIndicesCacheKey = shapeKey;
        }
        let indices = cache.get(tag);
        if (indices) return indices;

        const chars = parseRichText(state.rawText, state.baseStyle);
        indices = [];
        for (let index = 0; index < chars.length; index++) {
            if (chars[index].tags.includes(tag)) indices.push(index);
        }
        cache.set(tag, indices);
        return indices;
    }

    class IrisText {
        constructor() {
            this._onTargetRemoved = this._onTargetRemoved.bind(this);
            runtime.on('targetWasRemoved', this._onTargetRemoved);
            runtime.on('PROJECT_STOP_ALL', () => {
                runtime.targets.forEach(t => clearTarget(t));
                charAnimations.clear();
                charAnimationsByTarget.clear();
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
            if (state) disposeStateFromWorker(state);
            clearCharAnimationsForTarget(target.id);
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
					'---',
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
					'---',
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
					'---',
                    {
                        opcode: 'onCharacterType',
                        blockType: Scratch.BlockType.EVENT,
                        isEdgeActivated: false,
                        shouldRestartExistingThreads: false,
                        text: 'on character type'
                    },
                    {
                        opcode: 'onTypingFinished',
                        blockType: Scratch.BlockType.EVENT,
                        isEdgeActivated: false,
                        shouldRestartExistingThreads: false,
                        text: 'when typing finishes'
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
                    '---',
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
                    '---',
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
                        opcode: 'repeatForEachChar',
                        blockType: Scratch.BlockType.LOOP,
                        text: 'repeat for each character [CHAR]',
                        branchCount: 1,
                        arguments: {
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
                    '---',
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
                    '---',
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
                    '---',
                    {
                        opcode: 'setCharScale',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [INDEX] scale to [PCT] %',
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
                    '---',
                    {
                        opcode: 'setCharColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [INDEX] color to [COLOR]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: 'clearCharColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear character [INDEX] color override',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'animateChar',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'animate character [INDEX] [PROPERTY] to [VALUE] over [SECS] secs easing [EASING] [DIRECTION]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ANIMATE_PROPERTY',
                                defaultValue: 'y'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SECS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            EASING: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EASING',
                                defaultValue: 'linear'
                            },
                            DIRECTION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EASING_DIRECTION',
                                defaultValue: 'out'
                            }
                        }
                    },
                    {
                        opcode: 'stopCharAnimations',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop animations for character [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    '---',
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
                        text: 'Character Mask'
                    },
                    {
                        opcode: 'setCharacterMask',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask to costume [COSTUME]',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            COSTUME: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MASK_COSTUME'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'setCharacterMaskCoverage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask coverage to [COVERAGE] %',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            COVERAGE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'setCharacterMaskDirection',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask direction to [DIRECTION]',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            DIRECTION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'WIPE_DIRECTION'
                            }
                        }
                    },
                    {
                        opcode: 'setCharacterMaskSeamless',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask seamless [SEAMLESS]',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            SEAMLESS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'setCharacterMaskOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask opacity to [OPACITY] %',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            OPACITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'setCharacterMaskBlur',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask blur to [BLUR]',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            BLUR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'setCharacterMaskPosition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask position to x [X] y [Y]',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
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
                        opcode: 'changeCharacterMaskPosition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change character [START] to [END] mask position by x [X] y [Y]',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
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
                        opcode: 'setCharacterMaskZoom',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask zoom to [ZOOM] %',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            ZOOM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'setCharacterMaskRotation',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [START] to [END] mask rotation to [ROTATION]',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            ROTATION: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'clearCharacterMask',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear character [START] to [END] mask',
                        arguments: {
                            START: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            END: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'clearAllCharacterMasks',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear all character masks'
                    },
                    {
                        opcode: 'characterHasMask',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'character [INDEX] has a mask?',
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
					'---',
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
                    MASK_COSTUME: {
                        items: 'getMaskCostumeMenuItems'
                    },
                    WIPE_DIRECTION: {
                        items: [WIPE_DIRECTION_BOTTOM_UP, WIPE_DIRECTION_LEFT_RIGHT, WIPE_DIRECTION_UP_DOWN, WIPE_DIRECTION_RIGHT_LEFT]
                    },
                    AXIS: {
                        items: ['x', 'y']
                    },
                    ANIMATE_PROPERTY: {
                        items: ['x', 'y', 'rotation', 'opacity', 'scale']
                    },
                    EASING: {
                        items: ['linear', 'sine', 'quad', 'cubic', 'quart', 'quint', 'expo', 'circ', 'back', 'elastic', 'bounce']
                    },
                    EASING_DIRECTION: {
                        items: ['in', 'out', 'in out']
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
            if (state.rawText !== stage.text) {
                state.rawText = stage.text;
                state.paintDirty = true;
            }
            if (state.paintDirty || !state.hasPaintedOnce) {
                scheduleTextRender(util.target);
            }

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
                startTypingFinishedHat(util.target);
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
            startTypingFinishedHat(util.target);
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
            if (!state.paintDirty && !pendingRenderTargets.has(util.target)) return;
            return flushRenderIfDirty(util.target);
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

        getMaskCostumeMenuItems() {
            const items = [];
            const seen = new Set();
            for (const target of runtime.targets) {
                if (target.isOriginal === false) continue;
                const targetName = target.isStage ? 'Stage' : target.getName();
                const costumes = target.getCostumes ? target.getCostumes() : [];
                for (const costume of costumes) {
                    const value = targetName + ': ' + costume.name;
                    if (seen.has(value)) continue;
                    seen.add(value);
                    items.push({
                        text: value,
                        value
                    });
                }
            }
            if (!items.length) {
                items.push({
                    text: '(no costumes found)',
                    value: ''
                });
            }
            return items;
        }

        exportSettings(args, util) {
            return exportTextSettings(getState(util.target));
        }

        applyExportSettings(args, util) {
            let settings = args.SETTINGS;
            if (typeof settings === 'string') {
                try {
                    settings = JSON.parse(settings);
                } catch (e) {
                    return;
                }
            }
            if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return;
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

        repeatForEachChar(args, util) {
            const frame = util.stackFrame;
            const rootFrame = util.thread.stackFrames[0];
            let loop = frame.irisEachCharLoop;

            if (!loop) {
                const state = getState(util.target);
                loop = {
                    count: stripMarkup(state.rawText).length,
                    position: 0
                };
                frame.irisEachCharLoop = loop;
                rootFrame.irisTagCharacterNumber = 0;
            }

            if (loop.position >= loop.count) return;
            rootFrame.irisTagCharacterNumber = loop.position + 1;
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

        setCharColor(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const color = Scratch.Cast.toString(args.COLOR);
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && o.color === color) return;
            o.color = color;
            schedulePaint(util.target, state);
        }

        clearCharColor(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const o = state.charOverrides[idx];
            if (!o || o.color === null) return;
            o.color = null;
            schedulePaint(util.target, state);
        }

        setCharScale(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const scale = Math.max(0, Scratch.Cast.toNumber(args.PCT)) / 100;
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && o.scale === scale) return;
            o.scale = scale;
            schedulePaint(util.target, state);
        }

        animateChar(args, util) {
            const target = util.target;
            const state = getState(target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const property = Scratch.Cast.toString(args.PROPERTY);
            const validProps = ['x', 'y', 'rotation', 'opacity', 'scale'];
            if (!validProps.includes(property)) return;
            let targetValue = Scratch.Cast.toNumber(args.VALUE);
            if (property === 'opacity') targetValue = Math.max(0, Math.min(100, targetValue)) / 100;
            if (property === 'scale') targetValue = Math.max(0, targetValue) / 100;
            const duration = Math.max(0, Scratch.Cast.toNumber(args.SECS));
            const easingName = Scratch.Cast.toString(args.EASING);
            const easing = Object.prototype.hasOwnProperty.call(EasingMethods, easingName) ? easingName : 'linear';
            const direction = Scratch.Cast.toString(args.DIRECTION);
            const o = getCharOverride(state, idx);

            const key = target.id + '\u0001' + idx + '\u0001' + property;
            if (duration <= 0) {
                deleteCharAnimation(target.id, key);
                o[property] = targetValue;
                schedulePaint(target, state);
                return;
            }

            addCharAnimation(target.id, key, {
                target,
                state,
                index: idx,
                property,
                easing,
                direction,
                from: o[property] == null ? (property === 'scale' || property === 'opacity' ? 1 : 0) : o[property],
                to: targetValue,
                startTime: nowMs(),
                duration: duration * 1000
            });
            ensureAnimationTicker();
        }

        stopCharAnimations(args, util) {
            const target = util.target;
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            clearCharAnimationsForTargetIndex(target.id, idx);
        }

        resetCharTransform(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            this.stopCharAnimations(args, util);
            if (state.charOverrides[idx]) {
                delete state.charOverrides[idx];
                state.charOverridesVersion++;
                schedulePaint(util.target, state);
            }
        }

        resetAllCharTransforms(args, util) {
            const state = getState(util.target);
            const target = util.target;
            clearCharAnimationsForTarget(target.id);
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

        setCharacterMask(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const ref = Scratch.Cast.toString(args.COSTUME);
            const sepIndex = ref.indexOf(': ');
            if (sepIndex === -1) return;
            const targetName = ref.slice(0, sepIndex);
            const costumeName = ref.slice(sepIndex + 2);
            if (!targetName || !costumeName) return;

            getMaskTexture(targetName, costumeName);

            let paintNeeded = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (existing && existing.targetName === targetName && existing.costumeName === costumeName) {
                    continue;
                }
                setCharMaskForIndex(state, idx, {
                    targetName,
                    costumeName,
                    coverage: existing ? existing.coverage : 100,
                    opacity: existing ? existing.opacity : 100,
                    blur: existing ? existing.blur : 2,
                    x: existing ? existing.x : 0,
                    y: existing ? existing.y : 0,
                    zoom: existing ? existing.zoom : 100,
                    rotation: existing ? existing.rotation : 0,
                    direction: existing ? existing.direction : WIPE_DIRECTION_BOTTOM_UP,
                    seamless: existing ? existing.seamless : false
                });
                paintNeeded = true;
            }
            if (paintNeeded) schedulePaint(util.target, state);
        }

        setCharacterMaskCoverage(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const coverage = Scratch.Cast.toNumber(args.COVERAGE);
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing) continue;
                if (existing.coverage === coverage) continue;
                existing.coverage = coverage;
                changed = true;
            }
            if (changed) {
                state.charMasksVersion++;
                schedulePaint(util.target, state);
            }
        }

        setCharacterMaskOpacity(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const opacity = Scratch.Cast.toNumber(args.OPACITY);
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing) continue;
                if (existing.opacity === opacity) continue;
                existing.opacity = opacity;
                changed = true;
            }
            if (changed) {
                state.charMasksVersion++;
                schedulePaint(util.target, state);
            }
        }

        setCharacterMaskBlur(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const blur = Scratch.Cast.toNumber(args.BLUR);
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing) continue;
                if (existing.blur === blur) continue;
                existing.blur = blur;
                changed = true;
            }
            if (changed) {
                state.charMasksVersion++;
                schedulePaint(util.target, state);
            }
        }

        setCharacterMaskPosition(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);
            let changed = false;
            let geometryChanged = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing) continue;
                if (existing.x === x && existing.y === y) continue;
                geometryChanged = true;
                existing.x = x;
                existing.y = y;
                changed = true;
            }
            if (changed) {
                state.charMasksVersion++;
                if (geometryChanged) state.charMaskGeometryVersion++;
                schedulePaint(util.target, state);
            }
        }

        changeCharacterMaskPosition(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const dx = Scratch.Cast.toNumber(args.X);
            const dy = Scratch.Cast.toNumber(args.Y);
            let changed = false;
            if (dx !== 0 || dy !== 0) {
                for (let idx = start; idx <= end; idx++) {
                    const existing = state.charMasks[idx];
                    if (!existing) continue;
                    existing.x = (existing.x || 0) + dx;
                    existing.y = (existing.y || 0) + dy;
                    changed = true;
                }
            }
            if (changed) {
                state.charMasksVersion++;
                schedulePaint(util.target, state);
            }
        }

        setCharacterMaskZoom(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const zoom = Scratch.Cast.toNumber(args.ZOOM);
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing) continue;
                if (existing.zoom === zoom) continue;
                existing.zoom = zoom;
                changed = true;
            }
            if (changed) {
                state.charMasksVersion++;
                schedulePaint(util.target, state);
            }
        }

        setCharacterMaskRotation(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const rotation = Scratch.Cast.toNumber(args.ROTATION);
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing) continue;
                if (existing.rotation === rotation) continue;
                existing.rotation = rotation;
                changed = true;
            }
            if (changed) {
                state.charMasksVersion++;
                schedulePaint(util.target, state);
            }
        }

        setCharacterMaskDirection(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const direction = Scratch.Cast.toString(args.DIRECTION) || WIPE_DIRECTION_BOTTOM_UP;
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing) continue;
                if (existing.direction === direction) continue;
                existing.direction = direction;
                changed = true;
            }
            if (changed) {
                state.charMasksVersion++;
                state.charMaskGeometryVersion++;
                schedulePaint(util.target, state);
            }
        }

        setCharacterMaskSeamless(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            const seamless = Scratch.Cast.toString(args.SEAMLESS) === 'on';
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing) continue;
                if (existing.seamless === seamless) continue;
                existing.seamless = seamless;
                changed = true;
            }
            if (changed) {
                state.charMasksVersion++;
                state.charMaskGeometryVersion++;
                schedulePaint(util.target, state);
            }
        }

        clearCharacterMask(args, util) {
            const state = getState(util.target);
            const {
                start,
                end
            } = indexRange(Scratch.Cast.toNumber(args.START), Scratch.Cast.toNumber(args.END));
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                if (clearCharMaskForIndex(state, idx)) changed = true;
            }
            if (changed) schedulePaint(util.target, state);
        }

        clearAllCharacterMasks(args, util) {
            const state = getState(util.target);
            if (!Object.keys(state.charMasks).length) return;
            state.charMasks = {};
            state.charMasksVersion++;
            state.charMaskGeometryVersion++;
            schedulePaint(util.target, state);
        }

        characterHasMask(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            return !!state.charMasks[idx];
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
