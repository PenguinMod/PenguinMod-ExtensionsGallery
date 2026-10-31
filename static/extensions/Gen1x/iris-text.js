/*
Iris Text by Gen1x - 2026

Code inspiration:
- Animated Text (PenguinMod version)
- Tween Extension by JeremyGamer13

Special thanks to SharkPool for helping me find bugs!

Enjoy!! :D
*/

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Iris Text must run unsandboxed!');
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;

    let rendererMaxTextureSize = 0;
    let rendererMaxTextureGl = null;

    function refreshRendererMaxTextureSize() {
        const gl = runtime.renderer && runtime.renderer.gl;
        if (!gl || gl === rendererMaxTextureGl || gl.isContextLost()) return rendererMaxTextureSize;
        rendererMaxTextureGl = gl;
        rendererMaxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
        return rendererMaxTextureSize;
    }

    refreshRendererMaxTextureSize();

    const stateKey = 'irisText';
    const defaultText = 'Hello world!';

    const perf = {
        enabled: false,
        stats: new Map()
    };

    function perfStart() {
        return perf.enabled ? performance.now() : 0;
    }

    function perfRecord(name, elapsed) {
        if (!perf.enabled) return;
        let entry = perf.stats.get(name);
        if (!entry) {
            entry = {
                count: 0,
                total: 0,
                max: 0
            };
            perf.stats.set(name, entry);
        }
        entry.count++;
        entry.total += elapsed;
        if (elapsed > entry.max) entry.max = elapsed;
    }

    function perfEnd(name, startTime) {
        if (!startTime) return;
        perfRecord(name, performance.now() - startTime);
    }

    function perfReport() {
        const report = {};
        for (const [name, entry] of perf.stats) {
            report[name] = {
                count: entry.count,
                totalMs: +entry.total.toFixed(2),
                avgMs: +(entry.total / entry.count).toFixed(3),
                maxMs: +entry.max.toFixed(2)
            };
        }
        return report;
    }

    function runWhenIdle(callback, timeout) {
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(callback, {
                timeout
            });
        } else {
            setTimeout(callback, 60);
        }
    }

    const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfqCAwUATlcnNTYAAAXWElEQVR42tWbeZBd1X3nP+fc/d33ul9v6tYugTYkIpAsEAbMADY4rkkFFw4zIYPjZVI2YyfUxKmamsnsnsQwA3YywDhVTsoeZ/EyKTvBnomNGAzGIIODoBEIEGq1ltbS3a+7X/db73rO/HHfk7pb3eoWECfzq3ol9X33vnu+3/M7v/M7v/M9gnfJbn7s5YUudwGbgV3A1cBWYC3QA/iA1bovBurAJDACHAYGgZeBI0B5/g8/fceud6Xd4p08fOv3DqC0XAj0NcBtwA3AptY189xLxYWv1VrPv5S0gA8BzwFPAH87nwwpFD/65ff8/AlYoMc3AXe2PjsBD0BKiZQSwzCQhoGUEiFE9mmDbxGglUIpRZqmpEqh0nQ2MU3gIPDd1mdo9svfrkdcMgELAL8c+CRwN7CxDdq0LCzLyoC3QF+Kaa1RaUqSpsRxTJokKKXaXx8Dvgl8FTj6Toi4pFbNA18Efh34TbJxjmma2I6DZVlIKS/lp5e0NE2Jo4goikjTtH35CPAo8KfA9NshYVkE3PLYS+i5t+4F/hNwOyBN08RxXSzLuuSevlRTShFFEVEYtolQwL5We15o3ye14kcfXjo2LNnaeb1uAZ8A/gOwWkqJ67rYjvN3DnwhIsIgIAzDdpw4DXwe+BrZrAIs7Q0XbfU88J3Avydzece2bVzPwzCMnyvw+RbHMUGzSZIkACHZkPgvwMxySFiUgHng+4AvAfcIIXBdF8d1f+69vpgppWg2m0Rh2L7058DngNJSJCyIYN6Y7wP+B3CXlBLP87Ad5x01WC9y/Z3QqbUmCALCIGgPib8EPtsmQaB56o7dFzxnLvhj55vSSdbzd0kpyfk+lmVxqaYBCRhSYhoS0zAwpDjnQUppUqVIUkWiFKlS6EskRAiB53kIIQiaTbTWd5ENid8EZvQiv3bB1VmubwH3A7/zdsC3QdumSc6xyTkWjmViSokU4oLho7Um1ZokTQmihHoY0Yxi4vNT3rItCAKajUb7zy8C/4ZWYJw/FOa0Yt64/xTwsBDCyfk+tm1fUm/kbIvOnIfv2JiGRLC46y/UIA1ESUo1CKk0mgRxckkkNBsNgiCAzAvuA77S/m42CeYiz+8lm+oc13UvCbxrmXTnfQqegyHEOdDLAT//Pts06Mnn6PRcZhpNyvXmsj3C9bx2zuC0sLzCrDxhPuGze79Ilmb+om3b5Hx/WdFeCEHR9+jJ57ANY9mAL8WCOKFUqVELwmXdr9KUWq3WTph+SJauT8N5L5CQrepm2a8Dt0spcVtBZSkzpWSgs0B/ZwFrKfB69kfM+1z8PZ5lsqqrk5788jpFGsZsDLe3sDEbswnMXtJeThY1peu6y0pyTEMyUOyg4C4wNWoAgVbZRyUaFStUqkijGJ2m6Fa4FwJM18WwDKQpESYIoRGyxVaLH0MK+jrzGIZgolJH6YuzZts2cRwThaFsYfs/wNE25vkx4JPA5vaiZikz5ALgNWgtUbEgacY0pqapj40zM3KMmTPHqY2OEDfqhNUp0jhEpylCSBDg967CLfaS6+mnuG4T+YFV+L195Pq6sXImwlAZKQJ68j5oKFXrC9US5pjruiRxjFJqcwvjv21/J2aN/U1ki4qNfj6/ZOATQjDQWaDoey3QAhVLwkqT8rHjTBw+xJnB5ygPH6JeOk1UK6OSGCUE2jDBMKD9b5IgkhiRppDGCCExbBfL7yTX3U/fFXtYtetGVuy4is61q7ByBtLUaBTjlRpTtQZL2axZ4RjZcBia7wF3AhtN01zWfN/le3TmPLQSpKGgcqrEqZ89y8mf7mP0tecJp0ukUYC2bXR3P2rr1aiuFaj1W1H5Tsh3gGGiTQuUQoRNRH0GOXYKefYkxtnjJKUzNIfOMjk0yJHH/4L8yg2suupGLrv5l+m/6ipy3T49uTxBqGkEEYi0FdUWGAqOQxRFKKU2trD+t9ke0AX8ANib832cJdzftUzWdHUhU4vpk6Mce/pxjuz7FhNDB0nCJn6hQLRqI8G6rSTrt6LXb0V39oDng2VnAc9s9bwh6fJsmomiqQXEETSq0Kgjj7+B+eoLmMOvISfHoFkHIXA6ull51U1s//An6Nt6JRMjxxgdO0Nx5y8g/cXrEI16nTBbL7wAfAgotz3gGmCnlHLJ3hcIutwC4UTIsaf/hkN/9SdMvHWAJI5Yu24d//hDt+Nf8z7+sF4kyhXBzYPjstKzuabXY1PB4mAl5fmqohZrul2DDw24vDwdc6iaIJRCxCF5S1Jbv5no6huJS2eQp45i/uxJnMMvEVSmOP6Tv2bs0PN0rLyMZnmMdR/8GGLnLtCKbHZvzSxoEAoEWLZNFEVorXe2MO9rE3Ab4JlLVHK0Bk+41A6f5OA3vszxnzxG1KhS7OrmV+76KJ/6jU/grN/Ex/afoOoYyEIXOcfhV/ot/uUai205iS2hnmq+N5Hy745FuK5FpyXpdi1oglSKXb0e6zyDfSWfWr6I7ugm7e4nvWwHG+pnuXLwCfb/6CmmJ87QmDqLm+/GL3QhYoEOLFQQEk3PEE6O4a5YgbumB4TGNE2klKRp6rUw7zNb7n8DcPHe1wIRGky98iJvfP0BJo4exLJtbr7lZn7rvs/y/vffgmFZfGb/MfaXmrByA45rc+96h99dKekyz8/beUPwa/0mUsDXJgWJgg4TZJqyJmeyu8OkFCmiRGW9WOgCywHXY6S/n9/5pVu492OH+PIffYWnnv4xYX2Gwf/5H+k7+BxmoZP6mWEaZ4/hr9rElk/+q5Y3aIQQmJbVToxuALpMsnrepnbldkFTAt0UlJ59mqG/eJDq6DG6e3r4zGc+zac+9c/p6ekB4JnxGn95fAr8IhgmpoDbC8wBP9vu6DUZBd4MICcFK2zJnmL23FioEGjWOIJ1eYuZ1OF1w6QxPsIfn6jyww+8n69fdy3f/Ob/4tFH/4hjx45z6sffBjRucRV9uz7Emtt+FadnAFVL0CpB+iamadLKIzcBm40Nd9/7S8BHDMOQCxY5NOim5OwTP+StP/sCjcnTbN++nQcffICPf/yj+L4PQKo1v/d6if1nK5DvBDfHClPz26ttuq2FCbAEDNeavDQd4hgGmztseh2BEDAVaTYXLPb0OKxyDaopjAQa3agyPlNja9Fj70CR9+zZzU3/6H3MVCocHRomSVPc4gCmm2dm6AATL/+E0Wf+hrhcoWPzdoSdVZG01g7wskm2Y2MahrEgeGKTqQMvcvRbXySYHmfvddfx0EMPsGvXVXNuHalHPH2qDLk8VkcRwxCkQtC4SI6igR+9MMhfDQ7TXexgx44r2HL5RhzTYEeHgQBSDW9UU16cjlEIyHeRNOo8fnqaezZ2YQrBjh3beeSRP2Dv3mv54hf/kFMjh6mPHkEgMLwCxa17KO7YjXQMtNRIKVFKmcDVJtl2FXIh91cGtSMnGPrGQwTTY9z6/lt58MH72bp1ywW3vlhuMhKk0DNAr+9xXdEErZlQi+fsk42AwVNjpLUapWqFH4+corR7Fze89xosw6Aca16cjjnZTMEw8QyDQBTRQZ39pTpDtZhthSxh832fT3/6N7jiim3c/4X/ynPP7Se/7hfY8qv/mo4d2zCLDsgUgZgd6LdKsr26C6O/kkRjNYa//SjTwwe58cYbePjhLy0IHuDNSkisBdgupTDhSD3BkILn6oKx5EI30MBXXzrCwZFx2qsgnaa8fuAAg6+/RS2B001FwYAP9jvc2W9yR7/Jmg4H/AJng5Sh2oWrwptuupE//bOv8bGPf5S0WqJ29ijB+Cj1Y6cIz5ZBzSFgrQn0iPkVGg2qCSPf/wajP3ucPXvew4MPPcCGDesX7c3RIM1WNCol0RavVRJONBVTsQkY/GKnZoOlIYoYma7zndeGeWT/IeJUgVKgsnW+jmLeeu0QGzZtZnPexDWyoRBqONFUVJOsgUmSUGrGC7alr6+XL3zh91g5MMDDjz7I8e95+Ks3s+nX7sMZ6J6Ntcck26WdS4AyqA0Nc/rH32Hj+rXc/8Dvc+WVOxYFH2vN6XoIqaJoCrZ1WUgJzUQTKTgawNcTwczYKIPP7udsucJEI+RcOUIpkEZGgtYE9ToyCfHzJpUY3qymDDcSxiKd1SuTBK0U1TBetE2FQp777vssh159hZ8OldnwT36bju2bQSqEPIfVN2ltUZ+7pEE1Uk49/i2MoMzn/vP9XH/9dSxlQmtwPITt0GNBlyXQSPKmwGmFlxP1mFdHy1m21nZDTfb/9r6faaGkQaqzvxUQao1vCDbmJKVE0Cx0kpRL1OOLV4fyhQLX7r2W042/xc+5rYbOQWtdWBLTkmCsxNShn/JP77qTe+65e0nwhhB0mNmivhzE/GCkiWVZOLbJJt9kT9HEMaCY8zBclzQMs95WKhs2hpGRIAQohd/Zge+6pAo8Cdd2ZblBrOBoQ/NMLSUBOtylS3XrN2zAqH2f8KmvIPK/hbl+xZzvTbJqqX0uTKUG1cOv0uOkXH/9e5e1MpRAr+9AWIEwxLRM1vgWWwoW/Y7AAJIUVvZ1s2btak68eTgD267v2U5GiBBgO2y7YgsdnoXQUIo0B6ZThIAwUdSihLA8gSM1G3Lmkm0rFotZglefgiignRW2LDaButba1lqDFqhqhHnqVVau6MLL5ZZ8Qdu2d7oInWKIlOtXdrG9YGAAsYZAgUFW5Nx19U4mz45SK5eznp8TexSrN2/kyi2XIwClod8WbM5JXpqOmYhUtloMA3pci00d7kXbpJKEk8eOo1SKObAN2dMPQs0uoNRNMllKl1YKYkly+ADO5GFSQ1Kv15ZNwDU9Pv0FjzEhGY0FqqaoJ5rpRJMoxc3dFiSC3p4ebrrtAwy+9DLjp0+TRBFohZvPs3HrVnZftQPHskhSKIWKRgprXEmu22JfKaSRSJAGO7ss1vqLD4Gg0eS5p55i8MABZNdarOvuQHS6INLZZbRJk0yTs0kphVaKdPglCKuAoDReImw0MSwTc4mhsDlvc/0Kn+9WFEeamsP1FITEFZo9BQPXEGidZXZr+vsY+OAHGC9PM1OrY5uS3s4OCvk8lhTZpCBgOlY8OxnTaWXPBkEESQw64YNr+sgZC69ca5UKzzzxJG8ceo24cw3OzvdhblyHMLMhp86X1keMDXffex2wR0oDy3LQsURXy5AmVMtlahMTHH/rLcZOnSZNEnK+vyAZphD4huSxo6NESITtYku4qdvkirykmmhKkcY3BZYE1xR0+R4rujrp6cjqipYUhAoqqcaRgg5LMpnAyVpMLW257tQYmx3N569eTbd9YfY6MznFvu//b4aHhmgW13Ny062ka/oRjmoNfz17//Bxk0yNlaQqNTFTrJ27MDZsQ01NMNOo8qyUdE+W6B55g1cGB+kfGGDn7t1cvnUrbs6b8/JbVvjc1uvy2FgJ7eVZ6dn0mfD8VMxwI6XDNljpSoSAmViTMwRSwGSo0Wh6bEmQap6eiFjjSHZ2WlzdYVKOUiabCYQBNKr8syvWcnn+QvcfO32GZ598kpMnTjKZX8/wqmtpdvtIK52Vcqi21CYBBo0Nd99rAHeitW/bFtIWyJyF0VNErOin0d1LubiWsrsSlERNneHM8WFGT51Gpyn5jgJWq4BqS8FlBYcnzsww0whJpcFwJBiup4QK9nZbrLAFg9WU58sxq1wD3xQ8X054fSZibc7EloKhasLhRko1yUgJU02pPA2VSd43UOCB3aspmOfdX6Upr79ykP/7gx8wXpqgVLiMoXXXEvXkkJaaswEYxzFxFNGKfV8yNtx9b4OsPrbWMAxM02xVlDRCKoSpsyWk71POryb1VuCmEc2J05wcHubMyRFQipzvYzsOq3MWHY7JkyfGqdWbNL1OAAqWZE+nyZlA8+xUTJhqVrkGSsGhasxEIuh3DQYcwdlmwkQzYSrWDNcTJksl1MQom3OCR65bz/ZZ0b9SLvP8Mz/hhWefo9KMOdWzkxPrdpMUHcQ88ADheWnNQeARY8Pd9wbANuB6hFi4HC5AGBptQ1joRq/YQmr4yEaZ6uQox48e5ehbQ5CmeF6OPQNFiq7F/vEqYaIgaOBKUKbN4ExMI05QStNjGwgEb1YjEiGoJ5oVjsFkAuPNBLRGBU3UxFm2dHl8+b0buHlFPuvJMOTNV1/jqR/uY3joCA2zg2P9ezizdhuqQyLMCxdgSimC8+P/28D32lXh24G/FlJ6hUJhyR2hXr9Ap5FDj0/hnXyV/OQQRmMSyzQodnWzcvUqVm/cyNNxjoeOTHO8kWQlrWIf+B2twiWsK7j0eQYvV9IsMscJedciSVKCRgNq0xA1uaHH4b/vXc97ujzCRpMzJ0/y6uAgJ44dI0ig1ruFE33bme4oIF0FcuEiRBRF1Gs1yDSHHwb2XVAW9zwP1/MuSoBlGKzpLmJLi7ihYbKMN/I63vhbeHEFFQdYlkXez3PKyjOocpywOhh1O5nu6CdGkhgm2iuAZWUJkVZQmYEkypKd+gwrRMxHNvbwL9bn8RsznDl1mpMnTjA9OUmiJUF+gJlVV1HqWcWEDsBIF1dVaE2tXm+P/wvK4mUy9eXeKIqwHeei1eE4TSlVa6zq6sQpCFSum6D3BprTO7FKZ/DG38KpnCGu1ihS4VYhCBHUhMXUWYfIzlEzbKpeEZ3roGZ7EIdQm8FBY8cBbhKy3VVsOvImz/1simazmeURpkvUfTmNgW1EfauJfJtKY/rccnoxS9KUJD63evxuCzMLbo15uRyue/E0E7L9ub7OfEa6BqUEaQyqniAqFazyGE5lDKM2gWhMIcMqlk7xbKuVj2fClaiVmCilssqtYaCUJlIKwy2QmB6h10VQGCDqWYPu7ccoWGhDMTozQy1ceru8XqsRZb0/Z2tMwBxtwO8Dv2sYBvlCYUm1pxCCvg4/26ic623ZbnAMKtboMIFmgKzPIMMAIwkxkxCiJsQhQivaIlhhOQjbJTVsYstF+50oL4/2XIRrYthgGJoUzdhMlZlGc0nwcRxTr9Xawe8LtDZHn75j1wW7w18F7krTdHMYBEsuhrTWTFTqoKE7nztXVBGtWUMagAM6b4IqoHQBrQSJ1sSqFQuVPq8LEIDMqsJIEFIgpcaQ2VY5IvOYRCnGZmrLAj8v8zvSwnjOTMgk56398qNkQsM/CMNQtgXPFzOlNaVqnUQpegs+ppRzdQ6i5WaGJptbFojQswmY8/3cewUQJAnjM8tXiYRhSJyNfdXCdrSN+dwrYWGJjGma+Pn8soXPOcemr+CTc5avKVqOiRbRlWbIRLVOlCxPMJUkCfVarZ36LiiRWUwlthf4DrDadhxyudyyJCmaTC7TmXMp+h6OaS5bHbYocKAZxZRrDapBuKQYom1KKeq1WltCexr4CC2R1HJUYi+QCY8fjsLQaStEl9PgVCmmag2qzZCC51BwHVzbyrSBs4ha7Pn294lSNKOYSiOgHkYkSi1bOKm1ptFozNYPf54FFGKz33nOFhJKCiFwPW9ZU+OchpDVCx3LJGfbuLaJbRoYbbFk6/UajVJZ4SRMEppRTDOKiZKseHEpitE2+Fm64eULJRcgoZMscNzzdkloE9F+mSEFUkhkWyqrzxOQKoXS+pJlshcB/+e0pLILgYdFhoDUCiUkrQc/Bzha67uajQZaqWXL5xZiOVWalBTSecF/qV5ZwpRSNBqNdqoLmVj6c23wYpGBd8lyecikZ57nLbyf+PdgSZLQPD/m4Z3K5RchYc6BCaMlQrwUGe27bVprwjAkDIL2VPfuHZhYhIQ5R2aEEFi2zXJFle+mxXFMEASzFzjv/pGZti11aEpKiW3b2I7zd0qE1po0TQmDoC1ygEUOTS12QOJtEdC2pY7NtVVmlm1jmua7dqRGKUWSJERRRHIeOPy8js1dhARY4OCkEALZqi+apnnJhydnH5pMkoQkSWbX8uHv6+DkEkQseHQWzh+fbX/EfDK0zkC3gLdL1/PS3n8YR2dn29s9PL1M+4d9eHq+/f96fP7/AVA/+mtM7QhMAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTA4LTEyVDIwOjAxOjQ1KzAwOjAwrxRBGQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0wOC0xMlQyMDowMTo0NSswMDowMN5J+aUAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjYtMDgtMTJUMjA6MDE6NTcrMDA6MDDSacnNAAAAAElFTkSuQmCC';

    const colorPrimary = '#17B9C7';
    const colorSecondary = '#149DA9';
    const colorTertiary = '#0F808A';

    const wipeDirectionBottomUp = 'bottom-up';
    const wipeDirectionLeftRight = 'left-right';
    const wipeDirectionUpDown = 'up-down';
    const wipeDirectionRightLeft = 'right-left';

    function clampPercent(value) {
        return Math.max(0, Math.min(100, value));
    }

    function clampPercentToUnit(value) {
        return clampPercent(value) / 100;
    }

    const gradientTypeLinear = 'linear';
    const gradientTypeRadial = 'radial';
    const gradientTypeConic = 'conic';

    /* stolen from PM's animated text extension code :3 */
    const sansSerifId = 'Sans Serif';
    const serifId = 'Serif';
    const handwritingId = 'Handwriting';
    const markerId = 'Marker';
    const curlyId = 'Curly';
    const pixelId = 'Pixel';

    const playfulId = 'Playful';
    const bubblyId = 'Bubbly';
    const bitsAndBytesId = 'Bits and Bytes';
    const technologicalId = 'Technological';
    const arcadeId = 'Arcade';
    const archivoId = 'Archivo';
    const archivoBlackId = 'Archivo Black';
    const scratchId = 'Scratch';

    const randomId = 'Random';

    const fontIds = [
        sansSerifId, serifId, handwritingId, markerId, curlyId, pixelId,
        playfulId, bubblyId, arcadeId, bitsAndBytesId, technologicalId,
        scratchId, archivoId, archivoBlackId
    ];

    // in case the rendering screws up:
    const fontFallbacks = {
        [sansSerifId]: 'sans-serif',
        [serifId]: 'serif',
        [handwritingId]: 'cursive',
        [markerId]: 'fantasy',
        [curlyId]: 'cursive',
        [pixelId]: 'monospace',
        [playfulId]: 'cursive',
        [bubblyId]: 'cursive',
        [bitsAndBytesId]: 'monospace',
        [technologicalId]: 'sans-serif',
        [arcadeId]: 'monospace',
        [archivoId]: 'sans-serif',
        [archivoBlackId]: 'sans-serif',
        [scratchId]: 'sans-serif'
    };

    const emojiFontStack = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

    function cssFontFamily(fontId) {
        const fallback = fontFallbacks[fontId] || 'sans-serif';
        return `"${fontId}", ${emojiFontStack}, ${fallback}`;
    }

    const emojiCharRe = /\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Regional_Indicator}|[#*0-9]\uFE0F?\u20E3/u;

    function isEmojiChar(char) {
        if (!char) return false;
        emojiCharRe.lastIndex = 0;
        return emojiCharRe.test(char);
    }

    function randomFontOtherThan(currentFont) {
        const others = fontIds.filter(id => id !== currentFont);
        return others[Math.floor(Math.random() * others.length)];
    }

    function buildFontMenuItems() {
        const builtIns = [{
                text: 'Sans Serif',
                value: sansSerifId
            },
            {
                text: 'Serif',
                value: serifId
            },
            {
                text: 'Handwriting',
                value: handwritingId
            },
            {
                text: 'Marker',
                value: markerId
            },
            {
                text: 'Curly',
                value: curlyId
            },
            {
                text: 'Pixel',
                value: pixelId
            },
            {
                text: 'Playful',
                value: playfulId
            },
            {
                text: 'Bubbly',
                value: bubblyId
            },
            {
                text: 'Arcade',
                value: arcadeId
            },
            {
                text: 'Bits and Bytes',
                value: bitsAndBytesId
            },
            {
                text: 'Technological',
                value: technologicalId
            },
            {
                text: 'Scratch',
                value: scratchId
            },
            {
                text: 'Archivo',
                value: archivoId
            },
            {
                text: 'Archivo Black',
                value: archivoBlackId
            }
        ];

        const customFonts = [];
        Array.from(document.fonts).forEach(face => {
            const family = face.family.replace(/^["']|["']$/g, '');
            if (!fontIds.includes(family) && !customFonts.some(f => f.value === family)) {
                customFonts.push({
                    text: family,
                    value: family
                });
            }
        });

        return [
            ...builtIns,
            ...customFonts,
            {
                text: 'random font',
                value: randomId
            }
        ];
    }

    const knownTags = ['color', 'b', 'i', 'u', 's', 'size', 'font', 'gradient', 'blur', 'shadow', 'border', 'layer', 'effect', 'perspective'];
    const selfClosingTags = ['wait'];
    const tagRe = /(?<!\\)\[(\/?)([a-z0-9_-]+)(?:=([^\]]+))?\]/gi;
    const tagReStrip = /(?<!\\)\[(\/?)([a-z0-9_-]+)(?:=([^\]]+))?\]/gi;
    const escapedTagRe = /\\(?=[\[\]])/g;

    function unescapeTagEscapes(text) {
        return text.replace(escapedTagRe, '');
    }

    function normalizeGradientType(value) {
        const t = (value || '').toString().toLowerCase().trim();
        if (t === gradientTypeRadial) return gradientTypeRadial;
        if (t === gradientTypeConic) return gradientTypeConic;
        return gradientTypeLinear;
    }

    function parseGradientValue(value) {
        if (!value) return null;
        const parts = value.split('|');
        const colorsPart = parts[0] || '';
        const anglePart = parts.length > 1 ? parts[1] : '';
        const typePart = parts.length > 2 ? parts[2] : '';
        const colors = colorsPart.split(',')
            .map(c => c.trim())
            .filter(c => c.length > 0);
        if (colors.length < 2) return null;
        const angle = Scratch.Cast.toNumber(anglePart.trim());
        const type = normalizeGradientType(typePart.trim());
        return {
            colors,
            angle,
            type
        };
    }

    function parseShadowValue(value) {
        if (!value) return null;
        const parts = value.split('|');
        const color = (parts[0] || '').trim();
        if (!color) return null;
        const opacity = clampPercent(Scratch.Cast.toNumber(parts.length > 1 ? parts[1] : ''));
        const blur = Math.max(0, Scratch.Cast.toNumber(parts.length > 2 ? parts[2] : ''));
        const offsetX = Scratch.Cast.toNumber(parts.length > 3 ? parts[3] : '');
        const offsetY = Scratch.Cast.toNumber(parts.length > 4 ? parts[4] : '');
        return {
            color,
            opacity,
            blur,
            offsetX,
            offsetY
        };
    }

    function parseBorderValue(value) {
        if (!value) return null;
        const parts = value.split('|');
        const color = (parts[0] || '').trim();
        if (!color) return null;
        const opacity = clampPercent(Scratch.Cast.toNumber(parts.length > 1 ? parts[1] : ''));
        const size = Math.max(0, Scratch.Cast.toNumber(parts.length > 2 ? parts[2] : ''));
        return {
            color,
            opacity,
            size
        };
    }

    function parseLayerValue(value, fallback) {
        if (value === undefined || value === null || String(value).trim() === '') return fallback || 0;
        const layer = Scratch.Cast.toNumber(value);
        return Number.isFinite(layer) ? layer : (fallback || 0);
    }

    function parsePerspectiveValue(value) {
        if (!value) return null;
        const parts = value.split('|');
        if (parts.length !== 4) return null;
        const values = parts.map(part => Scratch.Cast.toNumber(part));
        if (!values.every(Number.isFinite)) return null;
        return {
            x: values[0],
            y: values[1],
            rotation: values[2],
            scaleStrength: 1 / Math.sqrt(Math.max(0.01, values[3] / 100)) - 1
        };
    }

    const effectNames = ['color', 'fisheye', 'whirl', 'pixelate', 'mosaic', 'brightness', 'saturation', 'red', 'green', 'blue', 'opaque'];
    const effectNameSet = new Set(effectNames);
    const effectBits = {
        color: 1,
        fisheye: 2,
        whirl: 4,
        pixelate: 8,
        mosaic: 16,
        brightness: 32,
        saturation: 64,
        red: 128,
        green: 256,
        blue: 512,
        opaque: 1024
    };
    const effectStateCache = new Map();
    const effectStateCacheLimit = 512;

    function clampRange(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    function normalizeEffectName(raw) {
        const name = String(raw === undefined || raw === null ? '' : raw).trim().toLowerCase();
        return effectNameSet.has(name) ? name : null;
    }

    function parseEffectValue(value) {
        if (!value) return null;
        const parts = value.split('|');
        const name = normalizeEffectName(parts[0]);
        if (!name) return null;
        const amount = Scratch.Cast.toNumber(parts.length > 1 ? parts[1] : '');
        return {
            name,
            amount: Number.isFinite(amount) ? amount : 0
        };
    }

    function addEffectAmount(effects, name, amount) {
        const next = Object.assign({}, effects);
        next[name] = (next[name] || 0) + amount;
        return next;
    }

    function buildEffectState(effects, key) {
        const read = name => {
            const amount = effects[name];
            return Number.isFinite(amount) ? amount : 0;
        };
        let mask = 0;
        for (const name in effectBits) {
            if (read(name)) mask |= effectBits[name];
        }
        return {
            key,
            hash: hashString(key),
            mask,
            hue: (read('color') / 200) % 1,
            fisheye: Math.max(0, (read('fisheye') + 100) / 100),
            whirl: -read('whirl') * Math.PI / 180,
            pixelate: Math.abs(read('pixelate')) / 10,
            mosaic: clampRange(Math.round((Math.abs(read('mosaic')) + 10) / 10), 1, 512),
            brightness: clampRange(read('brightness'), -100, 100) / 100,
            saturation: read('saturation') / 100 + 1,
            red: clampRange(read('red'), -100, 100) / 100 * 4 + 1,
            green: clampRange(read('green'), -100, 100) / 100 * 4 + 1,
            blue: clampRange(read('blue'), -100, 100) / 100 * 4 + 1,
            opaque: clampRange(Math.ceil(read('opaque')), 1, 100)
        };
    }

    function resolveEffectState(base, override) {
        if (!base && !override) return null;
        let merged = base || {};
        if (override) {
            merged = Object.assign({}, base);
            for (const name in override) merged[name] = override[name];
        }
        let key = '';
        for (let i = 0; i < effectNames.length; i++) {
            const amount = merged[effectNames[i]];
            if (amount && Number.isFinite(amount)) key += effectNames[i] + ':' + amount + ';';
        }
        if (!key) return null;
        let state = effectStateCache.get(key);
        if (state === undefined) {
            state = buildEffectState(merged, key);
            if (state.mask === 0) state = null;
            if (effectStateCache.size >= effectStateCacheLimit) effectStateCache.clear();
            effectStateCache.set(key, state);
        }
        return state;
    }

    let gradientSpanIdSeq = 1;

    const graphemeSegmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function' ?
        new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;

    function splitGraphemes(str) {
        if (!str) return [];
        if (graphemeSegmenter) {
            const out = [];
            for (const seg of graphemeSegmenter.segment(str)) out.push(seg.segment);
            return out;
        }
        return Array.from(str);
    }

    function parseRichText(text, base) {
        const families = new Set([base.font]);
        const stack = [Object.assign({
            customTags: [],
            gradientOccurrenceIndex: -1,
            shadow: null,
            border: null,
            layer: 0,
            effects: null,
            perspectives: []
        }, base)];
        const out = [];
        tagRe.lastIndex = 0;
        let i = 0;
        let match;
        let gradientOccurrenceSeq = 0;
        while ((match = tagRe.exec(text)) !== null || i < text.length) {
            const tagStart = match ? match.index : text.length;
            if (i < tagStart) {
                const segment = unescapeTagEscapes(text.slice(i, tagStart));
                const graphemes = splitGraphemes(segment);
                for (const g of graphemes) {
                    const style = stack[stack.length - 1];
                    out.push({
                        char: g,
                        color: style.color,
                        bold: style.bold,
                        italic: style.italic,
                        underline: style.underline,
                        strike: style.strike,
                        size: style.size,
                        font: style.font,
                        blur: style.blur,
                        tags: style.customTags,
                        gradient: style.gradient,
                        gradientSpanId: style.gradientSpanId,
                        gradientOccurrenceIndex: style.gradientOccurrenceIndex,
                        shadow: style.shadow,
                        border: style.border,
                        layer: style.layer || 0,
                        effects: style.effects || null,
                        perspectives: style.perspectives || []
                    });
                    families.add(style.font);
                }
                i = tagStart;
            }
            if (!match) break;
            const closing = match[1] === '/';
            const tag = match[2].toLowerCase();
            const value = match[3];
            if (selfClosingTags.indexOf(tag) !== -1) {
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
                    blur: prev.blur,
                    customTags: prev.customTags,
                    gradient: prev.gradient,
                    gradientSpanId: prev.gradientSpanId,
                    gradientOccurrenceIndex: prev.gradientOccurrenceIndex,
                    shadow: prev.shadow,
                    border: prev.border,
                    layer: prev.layer || 0,
                    effects: prev.effects || null,
                    perspectives: prev.perspectives || []
                };
                if (knownTags.indexOf(tag) !== -1) {
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
                            top.font = value === randomId ?
                                randomFontOtherThan(prev.font) :
                                (value || top.font);
                            break;
                        case 'gradient': {
                            const parsed = parseGradientValue(value);
                            top.gradient = parsed || top.gradient;
                            top.gradientSpanId = parsed ? gradientSpanIdSeq++ : top.gradientSpanId;
                            top.gradientOccurrenceIndex = parsed ? gradientOccurrenceSeq++ : top.gradientOccurrenceIndex;
                            break;
                        }
                        case 'blur':
                            top.blur = clampPercent(Scratch.Cast.toNumber(value));
                            break;
                        case 'shadow': {
                            const parsedShadow = parseShadowValue(value);
                            top.shadow = parsedShadow || top.shadow;
                            break;
                        }
                        case 'border': {
                            const parsedBorder = parseBorderValue(value);
                            top.border = parsedBorder || top.border;
                            break;
                        }
                        case 'layer':
                            top.layer = parseLayerValue(value, top.layer);
                            break;
                        case 'effect': {
                            const parsedEffect = parseEffectValue(value);
                            if (parsedEffect) top.effects = addEffectAmount(top.effects, parsedEffect.name, parsedEffect.amount);
                            break;
                        }
                        case 'perspective': {
                            const parsedPerspective = parsePerspectiveValue(value);
                            if (parsedPerspective) top.perspectives = top.perspectives.concat([parsedPerspective]);
                            break;
                        }
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
            blur: style.blur,
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
        if (snapshot.blur !== style.blur) return false;
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
            char.blur = override.blur;
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
        if (Number.isFinite(value.blur)) style.blur = clampPercent(value.blur);
        if (Array.isArray(value.tags) && value.tags.every(tag => typeof tag === 'string')) {
            style.tags = value.tags.slice();
        }
        return style;
    }

    let stripMarkupCacheKey = null;
    let stripMarkupCacheValue = null;

    function stripMarkup(text) {
        if (text === stripMarkupCacheKey) return stripMarkupCacheValue;
        tagReStrip.lastIndex = 0;
        const result = unescapeTagEscapes(text.replace(tagReStrip, ''));
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
            font: handwritingId,
            blur: 0,
            customTags: [],
            gradient: null,
            gradientSpanId: null,
            shadow: null,
            border: null,
            layer: 0,
            effects: null
        };
    }

    const waitRe = /(?<!\\)\[wait=([0-9]*\.?[0-9]+)\]/gi;

    let splitWaitStagesCacheKey = null;
    let splitWaitStagesCacheValue = null;

    function splitWaitStages(text) {
        if (text === splitWaitStagesCacheKey) return splitWaitStagesCacheValue;
        waitRe.lastIndex = 0;
        const stages = [];
        let i = 0;
        let match;
        let textSoFar = '';
        while ((match = waitRe.exec(text)) !== null) {
            textSoFar += text.slice(i, match.index);
            stages.push({
                text: textSoFar,
                waitAfter: Math.max(0, Scratch.Cast.toNumber(match[1]))
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
            cullOffscreen: true,
            cullRegion: null,
            cullBounds: null,
            emojiMode: 1,
            growDownwardOnly: false,
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
            textBackgroundBorder: {
                color: '#000000',
                size: 0,
                roundness: 100
            },
            textBorder: {
                enabled: false,
                color: '#000000',
                opacity: 100,
                size: 2
            },
            charOverrides: {},
            charOverridesVersion: 0,
            charEffects: {},
            charTransformsVersion: 0,
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
            paintOpsTransformsVersion: 0,
            paintOpsMasksVersion: 0,
            paintOpsLayout: null,
            paintDirty: true,
            paintFingerprint: null,
            renderInFlight: false,
            renderQueued: false,
            lastFamiliesKey: null,
            lastFontDefs: '',
            revealToken: 0,
            fontsPendingAtMeasure: false,
            hasPaintedOnce: false,
            taggedIndicesCache: null,
            taggedIndicesCacheKey: null,
            charLineIndicesCache: null,
            charLineIndicesCacheKey: null,
            wordSpansCache: null,
            wordSpansCacheKey: null,
            paintOpPool: [],
            typingFullRaw: null,
            typingBoxKey: null,
            typingBoxWidth: 0,
            typingBoxHeight: 0,
            typingBoxLineWidths: null,
            typingBoxGradientSpans: null,
            isTyping: false
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
        let state = target.getCustomState(stateKey);
        if (!state) {
            state = defaultState();
            target.setCustomState(stateKey, state);
        } else if (!state.iiMigrated) {
            const defaults = defaultState();
            state.textShadow = Object.assign(defaults.textShadow, state.textShadow || {});
            state.textBackground = Object.assign(defaults.textBackground, state.textBackground || {});
            state.textBackgroundBorder = Object.assign(defaults.textBackgroundBorder, state.textBackgroundBorder || {});
            state.textBorder = Object.assign(defaults.textBorder, state.textBorder || {});
            state.typingSpeeds = Object.assign(defaults.typingSpeeds, state.typingSpeeds || {});
            state.customTypingSpeeds = Object.assign({}, state.customTypingSpeeds || {});
            state.smoothing = state.smoothing === undefined ? defaults.smoothing : Scratch.Cast.toBoolean(state.smoothing);
            state.cullOffscreen = state.cullOffscreen === undefined ? defaults.cullOffscreen : Scratch.Cast.toBoolean(state.cullOffscreen);
            if (state.emojiMode !== 1 && state.emojiMode !== 2) state.emojiMode = defaults.emojiMode;
            state.growDownwardOnly = state.growDownwardOnly === undefined ? defaults.growDownwardOnly : Scratch.Cast.toBoolean(state.growDownwardOnly);
            state.charStyleOverrides = Object.assign({}, state.charStyleOverrides || {});
            state.resetCharTransformsOnText = state.resetCharTransformsOnText === undefined ? defaults.resetCharTransformsOnText : Scratch.Cast.toBoolean(state.resetCharTransformsOnText);
            if (typeof state.charStyleOverridesVersion !== 'number') state.charStyleOverridesVersion = 0;
            if (typeof state.charTransformsVersion !== 'number') state.charTransformsVersion = 0;
            if (typeof state.paintOpsTransformsVersion !== 'number') state.paintOpsTransformsVersion = 0;
            if (typeof state.paintOpsMasksVersion !== 'number') state.paintOpsMasksVersion = 0;
            if (state.typingControl !== 'skip' && state.typingControl !== 'stop') state.typingControl = null;
            state.iiMigrated = true;
        }
        return state;
    }

    const typingPunctuation = '.,!?;:…';
    const typingSymbols = '@#$%^&*+=<>/\\|~`_-()[]{}';

    function typingGroupForCharacter(char) {
        if (/^[0-9]$/.test(char)) return 'numbers';
        if (typingPunctuation.includes(char)) return 'punctuation';
        if (typingSymbols.includes(char)) return 'symbols';
        return 'default';
    }

    function typingDelayForCharacter(state, char) {
        if (_hasOwn.call(state.customTypingSpeeds, char)) return state.customTypingSpeeds[char];
        return state.typingSpeeds[typingGroupForCharacter(char)];
    }

    function splitTypingSteps(text) {
        const steps = [];
        tagRe.lastIndex = 0;
        let lastIndex = 0;
        let match;

        const addCharacters = value => {
            for (const char of splitGraphemes(value)) {
                steps.push({
                    content: char,
                    char
                });
            }
        };

        while ((match = tagRe.exec(text)) !== null) {
            addCharacters(text.slice(lastIndex, match.index));
            const tag = match[2].toLowerCase();
            const value = match[3];
            if (selfClosingTags.indexOf(tag) !== -1) {
                if (tag === 'wait') {
                    steps.push({
                        content: '',
                        char: null,
                        wait: Math.max(0, Scratch.Cast.toNumber(value))
                    });
                } else {
                    steps.push({
                        content: match[0],
                        char: null
                    });
                }
            } else {
                steps.push({
                    content: match[0],
                    char: null
                });
            }
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
            cullOffscreen: state.cullOffscreen,
            emojiMode: state.emojiMode,
            growDownwardOnly: state.growDownwardOnly,
            resetCharTransformsOnText: state.resetCharTransformsOnText,
            letterSpacing: state.letterSpacing,
            lineSpacing: state.lineSpacing,
            typingSpeeds: Object.assign({}, state.typingSpeeds),
            customTypingSpeeds: Object.assign({}, state.customTypingSpeeds),
            maxWidth: state.maxWidth,
            maxHeight: state.maxHeight,
            textShadow: Object.assign({}, state.textShadow),
            textBackground: Object.assign({}, state.textBackground),
            textBackgroundBorder: Object.assign({}, state.textBackgroundBorder),
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
        if (settings.smoothing !== undefined) state.smoothing = Scratch.Cast.toBoolean(settings.smoothing);
        if (settings.cullOffscreen !== undefined) state.cullOffscreen = Scratch.Cast.toBoolean(settings.cullOffscreen);
        if (settings.emojiMode === 1 || settings.emojiMode === 2) state.emojiMode = settings.emojiMode;
        if (settings.growDownwardOnly !== undefined) state.growDownwardOnly = Scratch.Cast.toBoolean(settings.growDownwardOnly);
        if (settings.resetCharTransformsOnText !== undefined) state.resetCharTransformsOnText = Scratch.Cast.toBoolean(settings.resetCharTransformsOnText);
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
        copySettings(settings.textBackgroundBorder, state.textBackgroundBorder, ['color', 'size', 'roundness']);
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
            state.charTransformsVersion++;
        }
        return state.charOverrides[index];
    }

    function resetCharacterTransformsState(state) {
        const hasEffects = !!state.charEffects && Object.keys(state.charEffects).length > 0;
        if (!Object.keys(state.charOverrides).length && !hasEffects) return;
        state.charOverrides = {};
        state.charEffects = {};
        state.charOverridesVersion++;
        state.charTransformsVersion++;
        state.paintDirty = true;
        state.paintFingerprint = null;
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

    function emptyAABB() {
        return { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
    }

    function aabbIsFinite(box) {
        return Number.isFinite(box.minX) && Number.isFinite(box.maxX) &&
            Number.isFinite(box.minY) && Number.isFinite(box.maxY);
    }

    function expandAABBToPoint(box, x, y) {
        box.minX = Math.min(box.minX, x);
        box.maxX = Math.max(box.maxX, x);
        box.minY = Math.min(box.minY, y);
        box.maxY = Math.max(box.maxY, y);
        return box;
    }

    function pointsToAABB(points) {
        const box = emptyAABB();
        for (const [x, y] of points) expandAABBToPoint(box, x, y);
        return box;
    }

    function charLocalAABB(state, startIdx, endIdx) {
        const box = emptyAABB();
        let found = false;
        for (let idx = startIdx; idx <= endIdx; idx++) {
            const charBox = state.charBoxes[idx];
            if (!charBox) continue;
            found = true;
            const halfW = charBox.width / 2;
            const halfH = charBox.height / 2;
            expandAABBToPoint(box, charBox.x - halfW, charBox.y - halfH);
            expandAABBToPoint(box, charBox.x + halfW, charBox.y + halfH);
        }
        if (!found) return null;
        return box;
    }

    function localAABBToStageAABB(local, target) {
        const scale = (Number.isFinite(target.size) ? target.size : 100) / 100;
        const corners = [
            [local.minX * scale, local.minY * scale],
            [local.maxX * scale, local.minY * scale],
            [local.maxX * scale, local.maxY * scale],
            [local.minX * scale, local.maxY * scale]
        ];
        const rotationStyle = target.rotationStyle;
        if (rotationStyle === 'all around' || rotationStyle === undefined) {
            const angle = ((90 - target.direction) * Math.PI) / 180;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            for (let i = 0; i < corners.length; i++) {
                const [x, y] = corners[i];
                corners[i] = [x * cos - y * sin, x * sin + y * cos];
            }
        } else if (rotationStyle === 'left-right' && target.direction < 0) {
            for (let i = 0; i < corners.length; i++) {
                corners[i][0] = -corners[i][0];
            }
        }
        const box = pointsToAABB(corners);
        return {
            left: target.x + box.minX,
            right: target.x + box.maxX,
            bottom: target.y + box.minY,
            top: target.y + box.maxY
        };
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

    const glyphOversample = 3;
    const glyphCache = new Map();
    let framePinnedGlyphKeys = null;
    let framePinnedGlyphKeysRefCount = 0;
    const glyphMeasureCanvas = document.createElement('canvas');
    const glyphMeasureCtx = glyphMeasureCanvas.getContext('2d', {
        willReadFrequently: false
    });
    try {
        glyphMeasureCtx.textRendering = 'optimizeLegibility';
    } catch (e) {}

    const glyphCacheLimit = 2000;
    const glyphCacheByteLimit = 192 * 1024 * 1024;
    let glyphCacheBytes = 0;
    const tintCacheLimit = 512;

    const glyphShapeCanvasPool = [];
    const tintedCanvasPool = [];
    const stencilCanvasPool = [];
    const genericPoolLimit = 256;

    function acquirePooledCanvas(pool, w, h) {
        const canvas = pool.pop() || document.createElement('canvas');
        if (canvas.width !== w) canvas.width = w;
        if (canvas.height !== h) canvas.height = h;
        return canvas;
    }

    function releasePooledCanvas(pool, canvas) {
        if (!canvas) return;
        if (typeof ImageBitmap !== 'undefined' && canvas instanceof ImageBitmap) {
            canvas.close();
            return;
        }
        if (pool.length < genericPoolLimit) pool.push(canvas);
    }

    function glyphCacheKey(char, fontFamily, size, weight, style) {
        return char + '\u0001' + fontFamily + '\u0001' + size + '\u0001' +
            weight + '\u0001' + style;
    }

    function computeGlyphBox(m, px, isColorGlyph) {
        const fontAscent = typeof m.fontBoundingBoxAscent === 'number' ? m.fontBoundingBoxAscent : null;
        const fontDescent = typeof m.fontBoundingBoxDescent === 'number' ? m.fontBoundingBoxDescent : null;
        const ascent = Math.ceil(fontAscent ?? m.actualBoundingBoxAscent ?? (px * 0.9));
        const descent = Math.ceil(fontDescent ?? m.actualBoundingBoxDescent ?? (px * 0.3));
        const leftBearing = isColorGlyph ? 0 : Math.ceil(Math.max(0, m.actualBoundingBoxLeft || 0));
        const rightBearing = isColorGlyph ? Math.ceil(Math.max(m.width || 0, 1)) : Math.ceil(Math.max(
            m.actualBoundingBoxRight || 0,
            m.width || 0
        ));
        const inkAscent = isColorGlyph ? 0 : Math.max(0, m.actualBoundingBoxAscent || 0);
        const inkDescent = isColorGlyph ? 0 : Math.max(0, m.actualBoundingBoxDescent || 0);
        const overshoot = Math.max(0, inkAscent - ascent, inkDescent - descent);
        const pad = Math.max(2, Math.round(px * (isColorGlyph ? 0.35 : 0.15) + overshoot));
        return {
            ascent,
            descent,
            leftBearing,
            rightBearing,
            pad,
            canvasW: Math.max(1, leftBearing + rightBearing + pad * 2),
            canvasH: Math.max(1, ascent + descent + pad * 2),
            baselineX: pad + leftBearing,
            baselineY: pad + ascent,
            advance: m.width
        };
    }

    function buildGlyphShape(canvas, box, isColorGlyph) {
        return {
            canvas,
            tinted: new Map(),
            shadows: new Map(),
            blurred: new Map(),
            advance: box.advance / glyphOversample,
            baselineOriginXEm: box.baselineX / glyphOversample,
            baselineOriginYEm: box.baselineY / glyphOversample,
            fontAscentEm: box.ascent / glyphOversample,
            fontDescentEm: box.descent / glyphOversample,
            isColorGlyph,
            bytes: canvas.width * canvas.height * 4
        };
    }

    function rasterizeGlyph(char, fontFamily, size, weight, style) {
        const startTime = perfStart();
        const px = Math.max(1, Math.round(size * glyphOversample));
        const fontStr = `${style} ${weight} ${px}px ${fontFamily}`;
        const isColorGlyph = isEmojiChar(char);

        glyphMeasureCtx.font = fontStr;
        glyphMeasureCtx.textBaseline = 'alphabetic';
        const box = computeGlyphBox(glyphMeasureCtx.measureText(char), px, isColorGlyph);

        const canvas = acquirePooledCanvas(glyphShapeCanvasPool, box.canvasW, box.canvasH);
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontStr;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#ffffff';
        try {
            ctx.textRendering = 'optimizeLegibility';
        } catch (e) {}
        ctx.fillText(char, box.baselineX, box.baselineY);

        const shape = buildGlyphShape(canvas, box, isColorGlyph);
        perfEnd('glyph.rasterize.main', startTime);
        return shape;
    }

    const shadowCacheLimit = 512;
    const globalShadowCanvasLimit = 256;
    const globalShadowLRU = new Map();
    let shadowGlobalKeySeq = 1;

    const sharedShadowSurface = (() => {
        const canvas = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(1, 1) : document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return {
            canvas,
            ctx: canvas.getContext('2d')
        };
    })();

    function releaseShadowCapture(capture) {
        if (capture && capture !== sharedShadowSurface.canvas && typeof capture.close === 'function') capture.close();
    }

    function evictGLTextureForShape(shape) {
        if (glCompositorInstance) glCompositorInstance.evictGlyphTexture(shape);
    }

    function evictOldestGlobalShadow() {
        const oldestKey = globalShadowLRU.keys().next().value;
        if (oldestKey === undefined) return;
        const oldest = globalShadowLRU.get(oldestKey);
        globalShadowLRU.delete(oldestKey);
        oldest.shape.shadows.delete(oldest.key);
        releaseShadowCapture(oldest.entry.canvas);
        evictGLTextureForShape(oldest.entry);
    }

    function getShadowGlyphBitmap(shape, color, blurPx, offsetXPx, offsetYPx) {
        const key = color + '\u0001' + blurPx + '\u0001' + offsetXPx + '\u0001' + offsetYPx;
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

        const padPx = Math.ceil(blurPx * 3) + Math.ceil(Math.max(Math.abs(offsetXPx), Math.abs(offsetYPx))) + 2;
        const w = shape.canvas.width + padPx * 2;
        const h = shape.canvas.height + padPx * 2;
        const surface = sharedShadowSurface;
        if (surface.canvas.width !== w) surface.canvas.width = w;
        if (surface.canvas.height !== h) surface.canvas.height = h;
        const ctx = surface.canvas.getContext('2d');
        surface.ctx = ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.shadowColor = color;
        ctx.shadowBlur = blurPx;
        ctx.shadowOffsetX = offsetXPx;
        ctx.shadowOffsetY = offsetYPx;
        ctx.drawImage(shape.canvas, padPx, padPx);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.drawImage(shape.canvas, padPx, padPx);
        ctx.globalCompositeOperation = 'source-over';

        const canSnapshot = typeof surface.canvas.transferToImageBitmap === 'function';
        const canvas = canSnapshot ? surface.canvas.transferToImageBitmap() : surface.canvas;
        entry = {
            canvas,
            offsetX: -padPx,
            offsetY: -padPx
        };
        if (!canSnapshot) return entry;

        const globalKey = shadowGlobalKeySeq++;
        entry.globalKey = globalKey;
        if (shape.shadows.size >= shadowCacheLimit) {
            const evictedKey = shape.shadows.keys().next().value;
            const evicted = shape.shadows.get(evictedKey);
            shape.shadows.delete(evictedKey);
            globalShadowLRU.delete(evicted.globalKey);
            releaseShadowCapture(evicted.canvas);
            evictGLTextureForShape(evicted);
        }
        shape.shadows.set(key, entry);

        if (globalShadowLRU.size >= globalShadowCanvasLimit) evictOldestGlobalShadow();
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
        if (shape.blurred) {
            for (const blurredEntry of shape.blurred.values()) {
                releasePooledCanvas(tintedCanvasPool, blurredEntry.canvas);
                evictGLTextureForShape(blurredEntry);
            }
        }
        if (shape.shadows) {
            for (const shadowEntry of shape.shadows.values()) {
                globalShadowLRU.delete(shadowEntry.globalKey);
                releaseShadowCapture(shadowEntry.canvas);
                evictGLTextureForShape(shadowEntry);
            }
        }
        const stencil = maskGlyphStencilCache.get(shape);
        if (stencil) {
            maskGlyphStencilCache.delete(shape);
            releasePooledCanvas(stencilCanvasPool, stencil);
        }
        evictGLTextureForShape(shape);
    }

    function pinGlyphKeysForFrame(keys) {
        if (!framePinnedGlyphKeys) framePinnedGlyphKeys = new Map();
        for (const key of keys) {
            framePinnedGlyphKeys.set(key, (framePinnedGlyphKeys.get(key) || 0) + 1);
        }
        framePinnedGlyphKeysRefCount++;
        return keys;
    }

    function unpinGlyphKeysForFrame(keys) {
        if (framePinnedGlyphKeys) {
            for (const key of keys) {
                const count = framePinnedGlyphKeys.get(key) || 0;
                if (count <= 1) {
                    framePinnedGlyphKeys.delete(key);
                } else {
                    framePinnedGlyphKeys.set(key, count - 1);
                }
            }
        }
        framePinnedGlyphKeysRefCount--;
        if (framePinnedGlyphKeysRefCount <= 0) {
            framePinnedGlyphKeysRefCount = 0;
            framePinnedGlyphKeys = null;
        }
    }

    function removeGlyphShape(key) {
        const shape = glyphCache.get(key);
        glyphCache.delete(key);
        if (shape) {
            glyphCacheBytes -= shape.bytes || 0;
            releaseGlyphOwnedCanvases(shape);
        }
    }

    function makeRoomInGlyphCache() {
        while (glyphCache.size >= glyphCacheLimit || glyphCacheBytes > glyphCacheByteLimit) {
            let evictedKey;
            for (const candidateKey of glyphCache.keys()) {
                if (!framePinnedGlyphKeys || !framePinnedGlyphKeys.has(candidateKey)) {
                    evictedKey = candidateKey;
                    break;
                }
            }
            if (evictedKey === undefined) return;
            removeGlyphShape(evictedKey);
        }
    }

    function getGlyphShape(char, fontFamily, size, weight, style) {
        const key = glyphCacheKey(char, fontFamily, size, weight, style);
        let entry = glyphCache.get(key);
        if (!entry) {
            makeRoomInGlyphCache();
            entry = rasterizeGlyph(char, fontFamily, size, weight, style);
            glyphCache.set(key, entry);
            glyphCacheBytes += entry.bytes;
        }
        return entry;
    }

    function glyphWorkerMain() {
        const measureCtx = new OffscreenCanvas(1, 1).getContext('2d');
        const rasterCanvas = new OffscreenCanvas(1, 1);
        const rasterCtx = rasterCanvas.getContext('2d');
        const genericFamilies = ['serif', 'sans-serif', 'monospace'];
        const probeText = 'AaBbGgQqWwZz01@#';
        try {
            measureCtx.textRendering = 'optimizeLegibility';
        } catch (e) {}

        function primaryFamily(css) {
            const match = /^"[^"]*"/.exec(css);
            return match ? match[0] : css;
        }

        function probeWidth(family) {
            measureCtx.font = '16px ' + family;
            return measureCtx.measureText(probeText).width;
        }

        function fontIsRendering(id) {
            const quoted = '"' + id + '"';
            for (const generic of genericFamilies) {
                if (Math.abs(probeWidth(quoted + ', ' + generic) - probeWidth(generic)) > 0.5) return true;
            }
            return false;
        }

        async function registerFont(message) {
            let added = 0;
            for (const face of message.faces) {
                try {
                    const fontFace = new FontFace(message.id, face.src, {
                        weight: face.weight,
                        style: face.style,
                        stretch: face.stretch,
                        unicodeRange: face.unicodeRange
                    });
                    fontFace.loaded.catch(() => {});
                    self.fonts.add(fontFace);
                    added++;
                } catch (e) {}
            }
            let ok = false;
            if (message.faces.length === 0) {
                ok = fontIsRendering(message.id);
            } else if (added > 0) {
                const spec = '16px "' + message.id + '"';
                try {
                    await self.fonts.load(spec, 'M');
                } catch (e) {}
                ok = self.fonts.check(spec, 'M') && fontIsRendering(message.id);
            }
            self.postMessage({
                t: 'fontStatus',
                id: message.id,
                ok
            });
        }

        async function rasterBatch(message) {
            const startedAt = performance.now();
            const results = [];
            const transfer = [];
            try {
                const loads = new Map();
                for (const item of message.items) {
                    const spec = item.style + ' ' + item.weight + ' 16px ' + primaryFamily(item.css);
                    loads.set(spec, (loads.get(spec) || '') + item.char);
                }
                const failedSpecs = new Set();
                await Promise.all(Array.from(loads, async ([spec, chars]) => {
                    try {
                        await self.fonts.load(spec, chars);
                    } catch (e) {
                        failedSpecs.add(spec);
                    }
                }));
                for (const item of message.items) {
                    const spec = item.style + ' ' + item.weight + ' 16px ' + primaryFamily(item.css);
                    if (failedSpecs.has(spec)) {
                        results.push({
                            key: item.key,
                            failed: true
                        });
                        continue;
                    }
                    const fontStr = item.style + ' ' + item.weight + ' ' + item.px + 'px ' + item.css;
                    measureCtx.font = fontStr;
                    measureCtx.textBaseline = 'alphabetic';
                    const box = computeGlyphBox(measureCtx.measureText(item.char), item.px, false);
                    rasterCanvas.width = box.canvasW;
                    rasterCanvas.height = box.canvasH;
                    rasterCtx.font = fontStr;
                    rasterCtx.textBaseline = 'alphabetic';
                    rasterCtx.fillStyle = '#ffffff';
                    try {
                        rasterCtx.textRendering = 'optimizeLegibility';
                    } catch (e) {}
                    rasterCtx.fillText(item.char, box.baselineX, box.baselineY);
                    const bitmap = rasterCanvas.transferToImageBitmap();
                    results.push({
                        key: item.key,
                        bitmap,
                        box
                    });
                    transfer.push(bitmap);
                }
            } catch (e) {
                results.length = 0;
                transfer.length = 0;
                for (const item of message.items) {
                    results.push({
                        key: item.key,
                        failed: true
                    });
                }
            }
            self.postMessage({
                t: 'rastered',
                id: message.id,
                results,
                elapsed: performance.now() - startedAt
            }, transfer);
        }

        self.onmessage = event => {
            const message = event.data;
            if (!message) return;
            if (message.t === 'font') registerFont(message);
            else if (message.t === 'raster') rasterBatch(message);
        };

        self.postMessage({
            t: 'ready',
            supported: typeof self.fonts !== 'undefined' && typeof FontFace === 'function'
        });
    }

    const glyphWorkerBatchMin = 24;
    const glyphWorkerChunk = 96;
    const glyphWorkerChunkCost = 1500000;
    const glyphWorkerCostMin = 270000;
    const glyphWorkerMaxDeferrals = 3;
    const glyphWorkerAnimationGapMs = 250;
    const glyphWorkerTimeoutMs = 10000;
    const glyphWorkerFailedKeyLimit = 4000;

    const glyphWorker = {
        worker: null,
        url: null,
        readyTimer: null,
        enabled: true,
        ready: false,
        failed: false,
        failReason: null,
        nextBatchId: 1,
        batches: new Map(),
        pendingKeys: new Set(),
        failedKeys: new Set(),
        fontStates: new Map(),
        waiters: new Map(),
        prewarmed: false
    };

    function glyphWorkerUsable() {
        return glyphWorker.enabled && glyphWorker.ready && !glyphWorker.failed;
    }

    function fontIdFromCss(css) {
        const match = /^"([^"]*)"/.exec(css);
        return match ? match[1] : null;
    }

    function glyphWorkerHasFont(css) {
        const id = fontIdFromCss(css);
        return id !== null && glyphWorker.fontStates.get(id) === 'ready';
    }

    function normalizeFontFamilyName(value) {
        return String(value || '').trim().replace(/^["']|["']$/g, '').toLowerCase();
    }

    function absoluteFontSource(src, baseHref) {
        return src.replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/g, (whole, doubleQuoted, singleQuoted, bare) => {
            const raw = doubleQuoted !== undefined ? doubleQuoted : (singleQuoted !== undefined ? singleQuoted : bare);
            try {
                return 'url("' + new URL(raw, baseHref).href + '")';
            } catch (e) {
                return whole;
            }
        });
    }

    function collectFontFaceDescriptors(fontId) {
        const wanted = normalizeFontFamilyName(fontId);
        const faces = [];
        const visited = new Set();
        const visitRules = (rules, baseHref) => {
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (typeof CSSFontFaceRule !== 'undefined' && rule instanceof CSSFontFaceRule) {
                    const style = rule.style;
                    if (normalizeFontFamilyName(style.getPropertyValue('font-family')) !== wanted) continue;
                    const faceSrc = style.getPropertyValue('src');
                    if (!faceSrc) continue;
                    faces.push({
                        src: absoluteFontSource(faceSrc, baseHref),
                        weight: style.getPropertyValue('font-weight') || 'normal',
                        style: style.getPropertyValue('font-style') || 'normal',
                        stretch: style.getPropertyValue('font-stretch') || 'normal',
                        unicodeRange: style.getPropertyValue('unicode-range') || 'U+0-10FFFF'
                    });
                } else if (typeof CSSImportRule !== 'undefined' && rule instanceof CSSImportRule) {
                    if (rule.styleSheet) visitSheet(rule.styleSheet);
                } else if (rule.cssRules) {
                    visitRules(rule.cssRules, baseHref);
                }
            }
        };
        const visitSheet = sheet => {
            if (!sheet || visited.has(sheet)) return;
            visited.add(sheet);
            let rules = null;
            try {
                rules = sheet.cssRules;
            } catch (e) {
                return;
            }
            if (rules) visitRules(rules, sheet.href || document.baseURI);
        };
        for (const sheet of Array.from(document.styleSheets)) visitSheet(sheet);
        if (document.adoptedStyleSheets) {
            for (const sheet of Array.from(document.adoptedStyleSheets)) visitSheet(sheet);
        }
        return faces;
    }

    function documentHasFontFace(fontId) {
        const wanted = normalizeFontFamilyName(fontId);
        try {
            return Array.from(document.fonts).some(face => normalizeFontFamilyName(face.family) === wanted);
        } catch (e) {
            return true;
        }
    }

    function registerWorkerFont(fontId) {
        if (!glyphWorkerUsable() || glyphWorker.fontStates.has(fontId)) return;
        const faces = collectFontFaceDescriptors(fontId);
        if (!faces.length && documentHasFontFace(fontId)) {
            glyphWorker.fontStates.set(fontId, 'unavailable');
            return;
        }
        glyphWorker.fontStates.set(fontId, 'pending');
        glyphWorker.worker.postMessage({
            t: 'font',
            id: fontId,
            faces
        });
    }

    function releaseGlyphWorkerResources() {
        clearTimeout(glyphWorker.readyTimer);
        glyphWorker.readyTimer = null;
        for (const batch of glyphWorker.batches.values()) clearTimeout(batch.timer);
        glyphWorker.batches.clear();
        glyphWorker.pendingKeys.clear();
        if (glyphWorker.worker) {
            glyphWorker.worker.onmessage = null;
            glyphWorker.worker.onerror = null;
            glyphWorker.worker.onmessageerror = null;
            glyphWorker.worker.terminate();
            glyphWorker.worker = null;
        }
        if (glyphWorker.url) {
            URL.revokeObjectURL(glyphWorker.url);
            glyphWorker.url = null;
        }
    }

    function flushAllGlyphWaiters() {
        const targets = Array.from(glyphWorker.waiters.keys());
        glyphWorker.waiters.clear();
        for (const target of targets) scheduleRender(target);
    }

    function failGlyphWorker(reason) {
        glyphWorker.failed = true;
        glyphWorker.ready = false;
        glyphWorker.failReason = reason;
        glyphWorker.fontStates.clear();
        releaseGlyphWorkerResources();
        flushAllGlyphWaiters();
    }

    function destroyGlyphWorker() {
        glyphWorker.enabled = false;
        glyphWorker.ready = false;
        glyphWorker.fontStates.clear();
        releaseGlyphWorkerResources();
        glyphWorker.waiters.clear();
    }

    function resolveGlyphWaiters(keys) {
        for (const [target, needed] of glyphWorker.waiters) {
            for (const key of keys) needed.delete(key);
            if (!needed.size) {
                glyphWorker.waiters.delete(target);
                scheduleRender(target);
            }
        }
    }

    function insertGlyphShape(key, shape) {
        makeRoomInGlyphCache();
        glyphCache.set(key, shape);
        glyphCacheBytes += shape.bytes;
    }

    const glyphUploadBudgetMs = 4;
    const glyphUploadQueue = [];
    let glyphUploadScheduled = false;

    function pumpGlyphUploads() {
        glyphUploadScheduled = false;
        const startTime = perfStart();
        const compositor = getGLCompositor();
        const deadline = performance.now() + glyphUploadBudgetMs;
        const doneKeys = [];
        while (glyphUploadQueue.length) {
            const entry = glyphUploadQueue.shift();
            if (compositor && glyphCache.get(entry.key) === entry.shape) compositor.getGlyphTexture(entry.shape);
            doneKeys.push(entry.key);
            if (performance.now() >= deadline) break;
        }
        perfEnd('glyph.upload', startTime);
        resolveGlyphWaiters(doneKeys);
        if (glyphUploadQueue.length) scheduleGlyphUploads();
    }

    function scheduleGlyphUploads() {
        if (glyphUploadScheduled) return;
        glyphUploadScheduled = true;
        requestAnimationFrame(pumpGlyphUploads);
    }

    function receiveWorkerGlyphs(message) {
        const batch = glyphWorker.batches.get(message.id);
        if (!batch) {
            for (const result of message.results) {
                if (result.bitmap) result.bitmap.close();
            }
            return;
        }
        clearTimeout(batch.timer);
        glyphWorker.batches.delete(message.id);
        perfEnd('glyph.worker.roundtrip', batch.startedAt);
        perfRecord('glyph.worker.raster', message.elapsed);
        const immediateKeys = [];
        let queued = false;
        for (const result of message.results) {
            glyphWorker.pendingKeys.delete(result.key);
            if (result.failed || !result.bitmap) {
                if (glyphWorker.failedKeys.size >= glyphWorkerFailedKeyLimit) glyphWorker.failedKeys.clear();
                glyphWorker.failedKeys.add(result.key);
                immediateKeys.push(result.key);
                continue;
            }
            if (glyphCache.has(result.key)) {
                result.bitmap.close();
                immediateKeys.push(result.key);
                continue;
            }
            const shape = buildGlyphShape(result.bitmap, result.box, false);
            insertGlyphShape(result.key, shape);
            glyphUploadQueue.push({
                key: result.key,
                shape
            });
            queued = true;
        }
        if (queued) scheduleGlyphUploads();
        if (immediateKeys.length) resolveGlyphWaiters(immediateKeys);
    }

    function onGlyphWorkerMessage(event) {
        const message = event.data;
        if (!message) return;
        if (message.t === 'ready') {
            clearTimeout(glyphWorker.readyTimer);
            glyphWorker.readyTimer = null;
            if (!message.supported) {
                failGlyphWorker('no-font-api');
                return;
            }
            glyphWorker.ready = true;
            for (const fontId of loadedDocumentFonts) registerWorkerFont(fontId);
        } else if (message.t === 'fontStatus') {
            glyphWorker.fontStates.set(message.id, message.ok ? 'ready' : 'unavailable');
            if (message.ok && message.id === defaultBaseStyle().font) prewarmDefaultGlyphs();
        } else if (message.t === 'rastered') {
            receiveWorkerGlyphs(message);
        }
    }

    function startGlyphWorker() {
        if (glyphWorker.worker || glyphWorker.failed) return;
        if (typeof Worker !== 'function' || typeof OffscreenCanvas !== 'function' || typeof Blob !== 'function' ||
            typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
            failGlyphWorker('unsupported');
            return;
        }
        try {
            const source = computeGlyphBox.toString() + '\n(' + glyphWorkerMain.toString() + ')();';
            glyphWorker.url = URL.createObjectURL(new Blob([source], {
                type: 'text/javascript'
            }));
            glyphWorker.worker = new Worker(glyphWorker.url);
        } catch (e) {
            failGlyphWorker('spawn');
            return;
        }
        glyphWorker.worker.onmessage = onGlyphWorkerMessage;
        glyphWorker.worker.onerror = () => failGlyphWorker('error');
        glyphWorker.worker.onmessageerror = () => failGlyphWorker('messageerror');
        glyphWorker.readyTimer = setTimeout(() => {
            if (!glyphWorker.ready) failGlyphWorker('timeout');
        }, glyphWorkerTimeoutMs);
    }

    function setGlyphWorkerEnabled(enabled) {
        glyphWorker.enabled = !!enabled;
        if (glyphWorker.enabled && glyphWorker.ready) {
            for (const fontId of loadedDocumentFonts) registerWorkerFont(fontId);
        }
    }

    function glyphWorkerStatus() {
        const fonts = {};
        for (const [id, state] of glyphWorker.fontStates) fonts[id] = state;
        return {
            hasWorker: !!glyphWorker.worker,
            enabled: glyphWorker.enabled,
            ready: glyphWorker.ready,
            failed: glyphWorker.failed,
            failReason: glyphWorker.failReason,
            fonts,
            pendingGlyphs: glyphWorker.pendingKeys.size,
            cachedGlyphs: glyphCache.size
        };
    }

    function glyphRasterCost(size) {
        const px = Math.max(1, Math.round(size * glyphOversample));
        return px * px * 1.3;
    }

    function chunkGlyphRequests(requests) {
        const chunks = [];
        let chunk = [];
        let cost = 0;
        for (const request of requests) {
            chunk.push(request);
            cost += glyphRasterCost(request.size);
            if (chunk.length >= glyphWorkerChunk || cost >= glyphWorkerChunkCost) {
                chunks.push(chunk);
                chunk = [];
                cost = 0;
            }
        }
        if (chunk.length) chunks.push(chunk);
        return chunks;
    }

    function dispatchGlyphRequests(requests) {
        if (!requests.length || !glyphWorkerUsable()) return;
        for (const chunk of chunkGlyphRequests(requests)) {
            const id = glyphWorker.nextBatchId++;
            const items = chunk.map(request => {
                glyphWorker.pendingKeys.add(request.key);
                return {
                    key: request.key,
                    char: request.char,
                    css: request.css,
                    px: Math.max(1, Math.round(request.size * glyphOversample)),
                    weight: request.weight,
                    style: request.style
                };
            });
            glyphWorker.batches.set(id, {
                keys: items.map(item => item.key),
                startedAt: perfStart(),
                timer: setTimeout(() => failGlyphWorker('timeout'), glyphWorkerTimeoutMs)
            });
            glyphWorker.worker.postMessage({
                t: 'raster',
                id,
                items
            });
        }
    }

    function prewarmDefaultGlyphs() {
        if (glyphWorker.prewarmed) return;
        glyphWorker.prewarmed = true;
        const base = defaultBaseStyle();
        const css = cssFontFamily(base.font);
        const requests = [];
        for (let code = 33; code <= 126; code++) {
            const char = String.fromCharCode(code);
            const key = glyphCacheKey(char, css, base.size, 'normal', 'normal');
            if (glyphCache.has(key) || glyphWorker.pendingKeys.has(key)) continue;
            requests.push({
                key,
                char,
                css,
                size: base.size,
                weight: 'normal',
                style: 'normal'
            });
        }
        dispatchGlyphRequests(requests);
    }

    function deferForWorkerGlyphs(target, state, paintOps, cull) {
        if (!glyphWorkerUsable()) return false;
        if (state.hasPaintedOnce && state.lastPaintAt && performance.now() - state.lastPaintAt < glyphWorkerAnimationGapMs) return false;
        if ((state.workerDeferrals || 0) >= glyphWorkerMaxDeferrals) return false;
        let requests = null;
        let needed = null;
        let cost = 0;
        for (let i = 0; i < paintOps.length; i++) {
            const op = paintOps[i];
            const char = op.text;
            if (char === '\u00A0' || char === '') continue;
            if (cull && (cull.empty || !opMayBeVisible(op, cull))) continue;
            const font = op.font;
            const key = glyphCacheKey(char, font['font-family'], font['font-size'], font['font-weight'], font['font-style']);
            if (glyphCache.has(key)) continue;
            if (glyphWorker.pendingKeys.has(key)) {
                if (!needed) needed = new Set();
                needed.add(key);
                continue;
            }
            if (glyphWorker.failedKeys.has(key) || isEmojiChar(char) || !glyphWorkerHasFont(font['font-family'])) continue;
            if (!requests) requests = new Map();
            if (!requests.has(key)) {
                cost += glyphRasterCost(font['font-size']);
                requests.set(key, {
                    key,
                    char,
                    css: font['font-family'],
                    size: font['font-size'],
                    weight: font['font-weight'],
                    style: font['font-style']
                });
            }
        }
        if (!requests && !needed) return false;
        if (!needed && requests.size < glyphWorkerBatchMin && cost < glyphWorkerCostMin) return false;
        state.workerDeferrals = (state.workerDeferrals || 0) + 1;
        if (requests) {
            if (!needed) needed = new Set();
            for (const key of requests.keys()) needed.add(key);
            dispatchGlyphRequests(Array.from(requests.values()));
        }
        glyphWorker.waiters.set(target, needed);
        return true;
    }

    const maskGlyphStencilCache = new Map();
    const stencilCacheLimit = 400;
    const maskScratchCanvasPool = [];
    const canvasSizeBucket = 32;

    function bucketSize(n) {
        return Math.max(canvasSizeBucket, Math.ceil(n / canvasSizeBucket) * canvasSizeBucket);
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
        if (maskGlyphStencilCache.size >= stencilCacheLimit) {
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
        const coverage = clampPercentToUnit(Scratch.Cast.toNumber(mask.coverage));
        if (coverage <= 0) return;

        const shape = getGlyphShape(char, fontFamily, size, weight, style);
        const w = shape.canvas.width;
        const h = shape.canvas.height;

        const zoom = Math.max(0.01, (Scratch.Cast.toNumber(mask.zoom) || 100) / 100);
        const rotation = Scratch.Cast.toNumber(mask.rotation);
        const anchorX = (mask.x || 0) * destScale - destX;
        const anchorY = -(mask.y || 0) * destScale - destY;

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
            const blurPx = Math.max(0, Scratch.Cast.toNumber(mask.blur)) * destScale;
            const direction = mask.direction || wipeDirectionBottomUp;
            const bandHalf = Math.max(0.5, blurPx / 2);

            let revealEdge, axisIsX, growsPositive;
            if (direction === wipeDirectionLeftRight) {
                revealEdge = effSpanW * coverage - localOffsetX;
                axisIsX = true;
                growsPositive = true;
            } else if (direction === wipeDirectionRightLeft) {
                revealEdge = effSpanW - effSpanW * coverage - localOffsetX;
                axisIsX = true;
                growsPositive = false;
            } else if (direction === wipeDirectionUpDown) {
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

    function tintGlyph(shape, color, emojiMode) {
        if (shape.isColorGlyph && emojiMode === 2) return shape.canvas;
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

        if (shape.tinted.size >= tintCacheLimit) {
            const evictedColor = shape.tinted.keys().next().value;
            releasePooledCanvas(tintedCanvasPool, shape.tinted.get(evictedColor));
            shape.tinted.delete(evictedColor);
            if (shape.bitmaps) shape.bitmaps.delete(evictedColor);
        }
        shape.tinted.set(color, tintedCanvas);
        return tintedCanvas;
    }

    const blurQuantumPx = 0.5;
    const blurMaxPx = 40;

    function quantizeBlurPx(blurPx) {
        const clamped = Math.min(blurMaxPx, blurPx);
        return Math.round(clamped / blurQuantumPx) * blurQuantumPx;
    }

    function getBlurredGlyphBitmap(shape, color, blurPxRaw) {
        const blurPx = quantizeBlurPx(blurPxRaw);
        const key = color + '\u0001' + blurPx;
        let entry = shape.blurred.get(key);
        if (entry) return entry;

        const source = tintGlyph(shape, color);
        const padPx = Math.ceil(blurPx * 3) + 2;
        const w = source.width + padPx * 2;
        const h = source.height + padPx * 2;
        const canvas = acquirePooledCanvas(tintedCanvasPool, w, h);
        const bctx = canvas.getContext('2d');
        bctx.setTransform(1, 0, 0, 1, 0, 0);
        bctx.clearRect(0, 0, w, h);
        bctx.filter = `blur(${blurPx}px)`;
        bctx.drawImage(source, padPx, padPx);
        bctx.filter = 'none';

        entry = {
            canvas,
            offsetX: -padPx,
            offsetY: -padPx
        };

        if (shape.blurred.size >= tintCacheLimit) {
            const evictedKey = shape.blurred.keys().next().value;
            const evicted = shape.blurred.get(evictedKey);
            releasePooledCanvas(tintedCanvasPool, evicted.canvas);
            evictGLTextureForShape(evicted);
            shape.blurred.delete(evictedKey);
        }
        shape.blurred.set(key, entry);
        return entry;
    }

    function buildGradientCanvasStyle(ctx, gradient, spanW, spanH, localOffsetXPx, localOffsetYPx) {
        const colors = gradient.colors;
        const last = colors.length - 1;
        const cx = spanW / 2 - localOffsetXPx;
        const cy = spanH / 2 - localOffsetYPx;
        const type = gradient.type || gradientTypeLinear;

        if (type === gradientTypeRadial) {
            const radius = Math.max(1, Math.sqrt(spanW * spanW + spanH * spanH) / 2);
            const canvasGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            for (let c = 0; c <= last; c++) {
                canvasGradient.addColorStop(last === 0 ? 0 : c / last, colors[c]);
            }
            return canvasGradient;
        }

        if (type === gradientTypeConic) {
            const startAngleRad = (gradient.angle || 0) * Math.PI / 180 - Math.PI / 2;
            const canvasGradient = ctx.createConicGradient(startAngleRad, cx, cy);
            for (let c = 0; c <= last; c++) {
                canvasGradient.addColorStop(last === 0 ? 0 : c / last, colors[c]);
            }
            return canvasGradient;
        }

        const angleRad = (gradient.angle || 0) * Math.PI / 180;
        const dx = Math.cos(angleRad);
        const dy = Math.sin(angleRad);
        const halfW = spanW / 2;
        const halfH = spanH / 2;
        const half = Math.abs(dx) * halfW + Math.abs(dy) * halfH;
        const x0 = cx - dx * half;
        const y0 = cy - dy * half;
        const x1 = cx + dx * half;
        const y1 = cy + dy * half;
        const canvasGradient = ctx.createLinearGradient(x0, y0, x1, y1);
        for (let c = 0; c <= last; c++) {
            canvasGradient.addColorStop(last === 0 ? 0 : c / last, colors[c]);
        }
        return canvasGradient;
    }

    function tintGlyphGradient(shape, gradient, spanW, spanH, localOffsetXPx, localOffsetYPx) {
        const scratchCanvas = acquirePooledCanvas(tintedCanvasPool, shape.canvas.width, shape.canvas.height);
        const tctx = scratchCanvas.getContext('2d');
        tctx.setTransform(1, 0, 0, 1, 0, 0);
        tctx.globalCompositeOperation = 'source-over';
        tctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        tctx.fillStyle = buildGradientCanvasStyle(tctx, gradient, spanW, spanH, localOffsetXPx, localOffsetYPx);
        tctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        tctx.globalCompositeOperation = 'destination-in';
        tctx.drawImage(shape.canvas, 0, 0);
        return scratchCanvas;
    }

    const borderOffsetsCache = new Map();

    function getBorderOffsets(borderSize) {
        const key = Math.round(borderSize * 4);
        let offsets = borderOffsetsCache.get(key);
        if (offsets) return offsets;

        const steps = Math.max(8, Math.ceil((Math.PI * 2 * borderSize) / 1.5));
        offsets = [];
        for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * Math.PI * 2;
            offsets.push([Math.cos(angle) * borderSize, Math.sin(angle) * borderSize]);
        }

        if (borderOffsetsCache.size >= 64) {
            const evictedKey = borderOffsetsCache.keys().next().value;
            borderOffsetsCache.delete(evictedKey);
        }
        borderOffsetsCache.set(key, offsets);
        return offsets;
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
        if (shape.bitmaps.size >= tintCacheLimit) {
            shape.bitmaps.delete(shape.bitmaps.keys().next().value);
        }
        shape.bitmaps.set(color, bitmap);
        return bitmap;
    }

    const readbackCanvas = document.createElement('canvas');
    const readbackCtx = readbackCanvas.getContext('2d', {
        willReadFrequently: true
    });

    function getGlyphInkBand(glyph, rowStart, rowEnd) {
        const w = glyph.canvas.width;
        const rows = rowEnd - rowStart + 1;
        if (rows <= 0 || w <= 0) return new Uint8Array(Math.max(0, w));
        const cacheKey = rowStart + ':' + rowEnd;
        let bands = glyph.inkBands;
        if (!bands) {
            bands = new Map();
            glyph.inkBands = bands;
        }
        let ink = bands.get(cacheKey);
        if (ink) return ink;
        if (readbackCanvas.width !== w) readbackCanvas.width = w;
        if (readbackCanvas.height !== rows) readbackCanvas.height = rows;
        readbackCtx.setTransform(1, 0, 0, 1, 0, 0);
        readbackCtx.clearRect(0, 0, w, rows);
        readbackCtx.drawImage(glyph.canvas, 0, rowStart, w, rows, 0, 0, w, rows);
        const data = readbackCtx.getImageData(0, 0, w, rows).data;
        ink = new Uint8Array(w);
        for (let y = 0; y < rows; y++) {
            const rowOffset = y * w * 4;
            for (let x = 0; x < w; x++) {
                if (data[rowOffset + x * 4 + 3] > 16) ink[x] = 1;
            }
        }
        if (bands.size >= 8) bands.delete(bands.keys().next().value);
        bands.set(cacheKey, ink);
        return ink;
    }

    function invalidateGlyphCacheForFamily(fontFamily) {
        for (const key of Array.from(glyphCache.keys())) {
            if (key.indexOf('\u0001' + fontFamily + '\u0001') !== -1) removeGlyphShape(key);
        }
        for (const key of glyphWorker.failedKeys) {
            if (key.indexOf('\u0001' + fontFamily + '\u0001') !== -1) glyphWorker.failedKeys.delete(key);
        }
    }

    const maskTextureRasterSize = 512;
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
            canvasW = maskTextureRasterSize;
            canvasH = Math.max(1, Math.round(maskTextureRasterSize / aspect));
        } else {
            canvasH = maskTextureRasterSize;
            canvasW = Math.max(1, Math.round(maskTextureRasterSize * aspect));
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
                    canvasW = maskTextureRasterSize;
                    canvasH = Math.max(1, Math.round(maskTextureRasterSize / aspect));
                } else {
                    canvasH = maskTextureRasterSize;
                    canvasW = Math.max(1, Math.round(maskTextureRasterSize * aspect));
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

    function getMaskTexture(targetName, costumeName) {
        const costume = findCostumeByRef(targetName, costumeName);
        if (!costume) return null;
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
                }
                return result;
            });
            maskTexturePending.set(key, promise);
        }
        return null;
    }

    function repaintAllTargetsUsingMasks() {
        for (const candidate of runtime.targets) {
            const state = candidate.getCustomState(stateKey);
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
    const shapingFontStyleCacheLimit = 500;

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
        if (shapingFontStyleCache.size >= shapingFontStyleCacheLimit) {
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
    const charAdvanceCacheLimit = 4000;

    function charAdvanceCacheKey(fontStyle, letterSpacing, prevChar, char) {
        return fontStyle.styleHash + '\u0001' + fontStyle['font-size'] + '\u0001' +
            (letterSpacing || 0) + '\u0001' + (prevChar === undefined ? '' : prevChar) + '\u0001' + char;
    }

    function brokenNbspSpaceAdvance(measureCtx) {
        const nbspAdvance = measureCtx.measureText('\u00A0').width;
        const spaceAdvance = measureCtx.measureText('M M').width - measureCtx.measureText('MM').width;
        return spaceAdvance > 0 && nbspAdvance < spaceAdvance * 0.5 ? spaceAdvance : null;
    }

    function measureCharsIndividually(measureCtx, run, letterSpacing) {
        const missing = [];
        for (let i = 0; i < run.chars.length; i++) {
            const ch = run.chars[i].char === ' ' ? '\u00A0' : run.chars[i].char;
            const prevCh = i > 0 ? (run.chars[i - 1].char === ' ' ? '\u00A0' : run.chars[i - 1].char) : undefined;
            const key = charAdvanceCacheKey(run.fontStyle, letterSpacing, prevCh, ch);
            if (!charAdvanceCache.has(key)) missing.push({
                i,
                prevCh,
                ch,
                key
            });
        }

        if (missing.length) {
            measureCtx.font = canvasFontString(run.fontStyle);
            measureCtx.textBaseline = 'alphabetic';
            const spacing = letterSpacing || 0;
            const soloWidths = new Map();
            let nbspReplacementAdvance;
            for (let m = 0; m < missing.length; m++) {
                const {
                    prevCh,
                    ch
                } = missing[m];
                let advance;
                if (ch === '\u00A0' && nbspReplacementAdvance === undefined) {
                    nbspReplacementAdvance = brokenNbspSpaceAdvance(measureCtx);
                }
                if (ch === '\u00A0' && nbspReplacementAdvance !== null) {
                    advance = nbspReplacementAdvance + spacing;
                } else if (prevCh === undefined) {
                    advance = measureCtx.measureText(ch).width + spacing;
                } else {
                    let prevWidth = soloWidths.get(prevCh);
                    if (prevWidth === undefined) {
                        prevWidth = measureCtx.measureText(prevCh).width;
                        soloWidths.set(prevCh, prevWidth);
                    }
                    const pairWidth = measureCtx.measureText(prevCh + ch).width;
                    advance = (pairWidth - prevWidth) + spacing;
                }
                if (charAdvanceCache.size >= charAdvanceCacheLimit) {
                    charAdvanceCache.delete(charAdvanceCache.keys().next().value);
                }
                charAdvanceCache.set(missing[m].key, advance);
            }
        }

        const positions = new Array(run.chars.length);
        let x = 0;
        for (let i = 0; i < run.chars.length; i++) {
            const ch = run.chars[i].char === ' ' ? '\u00A0' : run.chars[i].char;
            const prevCh = i > 0 ? (run.chars[i - 1].char === ' ' ? '\u00A0' : run.chars[i - 1].char) : undefined;
            const key = charAdvanceCacheKey(run.fontStyle, letterSpacing, prevCh, ch);
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
                        for (let k = 0; k < nextLineInitial.length; k++) {
                            nextLineWidth += nextLineInitial[k]._width;
                            if (nextLineInitial[k]._trailingCollapse) nextLineWidth += nextLineInitial[k]._trailingCollapse;
                        }
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
                if (rc._trailingCollapse) currentLineWidth += rc._trailingCollapse;
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
                    const rc = run.chars[i];
                    const w = rc._width;
                    run.positions.push({
                        shapedX: charX,
                        advance: w
                    });
                    addTagIndex(charsByTag, run.startIndex + i, rc.tags);
                    const cursorAdvance = rc._trailingCollapse ? w + rc._trailingCollapse : w;
                    charX += cursorAdvance;
                    runStartX += cursorAdvance;
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

        let maxShadowExtent = 0;
        for (const rc of richChars) {
            const charShadow = rc.shadow;
            if (!charShadow) continue;
            const extentX = Scratch.Cast.toNumber(charShadow.blur) + Math.abs(Scratch.Cast.toNumber(charShadow.offsetX));
            const extentY = Scratch.Cast.toNumber(charShadow.blur) + Math.abs(Scratch.Cast.toNumber(charShadow.offsetY));
            if (extentX > maxShadowExtent) maxShadowExtent = extentX;
            if (extentY > maxShadowExtent) maxShadowExtent = extentY;
        }

        let maxBorderExtent = 0;
        for (const rc of richChars) {
            const charBorder = rc.border;
            if (!charBorder) continue;
            const size = Scratch.Cast.toNumber(charBorder.size);
            if (size > maxBorderExtent) maxBorderExtent = size;
        }

        return {
            lines,
            lineWidths,
            maxWidth,
            lineRuns,
            charsByTag,
            maxShadowExtent,
            maxBorderExtent
        };
    }

    function clearTypingBox(state) {
        state.typingFullRaw = null;
        state.typingBoxKey = null;
        state.typingBoxWidth = 0;
        state.typingBoxHeight = 0;
        state.typingBoxLineWidths = null;
        state.typingBoxGradientSpans = null;
    }

    function shapeKeyForText(state, rawText) {
        const prev = state.rawText;
        state.rawText = rawText;
        const key = getShapeKey(state);
        state.rawText = prev;
        return key;
    }

    function getGlyphShapeForFontStyle(char, fontStyleObj) {
        return getGlyphShape(
            char,
            fontStyleObj['font-family'],
            fontStyleObj['font-size'],
            fontStyleObj['font-weight'],
            fontStyleObj['font-style']
        );
    }

    function computeFinalGradientSpans(state, measured) {
        const spans = new Map();
        if (!measured.lines.length) return spans;

        const lineHeight = state.baseStyle.size * state.lineSpacing;
        const totalHeight = measured.lines.length * lineHeight;
        const textStartY = -totalHeight / 2;

        let groupOccurrenceIndex = null;
        let groupChars = null;
        let box = emptyAABB();

        const flushGroup = () => {
            if (!groupChars || !groupChars.length) return;
            if (aabbIsFinite(box)) {
                const spanW = Math.max(1, box.maxX - box.minX);
                const spanH = Math.max(1, box.maxY - box.minY);
                for (const gc of groupChars) {
                    spans.set(gc.charIndex, {
                        spanW,
                        spanH,
                        localOffsetXPx: gc.px - box.minX,
                        localOffsetYPx: gc.py - box.minY
                    });
                }
            }
            groupOccurrenceIndex = null;
            groupChars = null;
            box = emptyAABB();
        };

        for (let li = 0; li < measured.lines.length; li++) {
            const runs = measured.lineRuns[li];
            const lineW = measured.lineWidths[li];
            let lineX;
            if (state.align === 'left' || state.align === 'justify') {
                lineX = 0;
            } else if (state.align === 'right') {
                lineX = -lineW;
            } else {
                lineX = -lineW / 2;
            }

            const baseCenterY = textStartY + (li * lineHeight) + lineHeight * 0.5;

            for (const run of runs) {
                const runOriginX = lineX + run.runStartX;

                for (let i = 0; i < run.chars.length; i++) {
                    const rc = run.chars[i];
                    const pos = run.positions[i];
                    const occurrenceIndex = rc.gradient ? rc.gradientOccurrenceIndex : -1;

                    if (occurrenceIndex == null || occurrenceIndex < 0) {
                        flushGroup();
                        continue;
                    }

                    if (groupOccurrenceIndex !== occurrenceIndex) {
                        flushGroup();
                        groupOccurrenceIndex = occurrenceIndex;
                        groupChars = [];
                    }

                    const ch = rc.char === ' ' ? '\u00A0' : rc.char;
                    const charIndex = run.startIndex + i;
                    if (ch === '\u00A0' || ch === '') {
                        groupChars.push({ charIndex, px: 0, py: 0 });
                        continue;
                    }

                    const shape = getGlyphShapeForFontStyle(ch, run.fontStyle);
                    if (!shape) continue;

                    const charCenterX = runOriginX + pos.shapedX + pos.advance / 2;
                    const charCenterY = baseCenterY;
                    const advanceCenterXEm = shape.baselineOriginXEm + shape.advance / 2;
                    const baselineYFromLineCenter = (shape.fontAscentEm - shape.fontDescentEm) / 2;
                    const drawXEm = charCenterX - advanceCenterXEm;
                    const drawYEm = (charCenterY + baselineYFromLineCenter) - shape.baselineOriginYEm;
                    const px = Math.round(drawXEm * destScale);
                    const py = Math.round(drawYEm * destScale);
                    const w = shape.canvas.width;
                    const h = shape.canvas.height;
                    const padYPx = Math.round((shape.baselineOriginYEm - shape.fontAscentEm) * destScale);
                    const inkTop = py + padYPx;
                    const inkBottom = py + h - padYPx;

                    groupChars.push({ charIndex, px, py });
                    expandAABBToPoint(box, px, inkTop);
                    expandAABBToPoint(box, px + w, inkBottom);
                }
            }
        }
        flushGroup();

        return spans;
    }

    function ensureTypingBox(state) {
        if (!state.typingFullRaw) return;
        const key = shapeKeyForText(state, state.typingFullRaw);
        if (state.typingBoxKey === key) return;
        const richChars = parseRichText(state.typingFullRaw, state.baseStyle);
        applyCharacterStyleOverrides(richChars, state.charStyleOverrides);
        const measured = measureRichText(glyphMeasureCtx, richChars, state);
        const lineHeight = state.baseStyle.size * state.lineSpacing;
        state.typingBoxKey = key;
        state.typingBoxWidth = measured.maxWidth;
        state.typingBoxHeight = measured.lines.length * lineHeight;
        state.typingBoxLineWidths = measured.lineWidths;
        state.typingBoxGradientSpans = computeFinalGradientSpans(state, measured);
    }

    function getExactTextDimensions(state) {
        const richChars = parseRichText(state.rawText, state.baseStyle);
        applyCharacterStyleOverrides(richChars, state.charStyleOverrides);
        const measured = measureRichText(glyphMeasureCtx, richChars, state);
        const lineHeight = state.baseStyle.size * state.lineSpacing;
        let width = measured.maxWidth;
        let height = measured.lines.length * lineHeight;

        ensureTypingBox(state);
        if (state.typingBoxWidth > width) width = state.typingBoxWidth;
        if (state.typingBoxHeight > height) height = state.typingBoxHeight;

        if (state.maxWidth && state.maxWidth > 0) width = Math.min(width, state.maxWidth);
        if (state.maxHeight && state.maxHeight > 0) height = Math.min(height, state.maxHeight);

        return {
            width,
            height
        };
    }

    function getExactTextDimensionsForTarget(target) {
        const state = getState(target);
        return getExactTextDimensions(state);
    }

    function fingerprintPaintOps(paintOps, docW, docH, align) {
        let hash = (docW * 2654435761) ^ (docH * 40503);
        hash = (hash * 33) ^ hashString(align);
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
            hash = (hash * 33) ^ ((op.blur * 100) | 0);
            hash = (hash * 33) ^ ((op.layer * 100) | 0);
            hash = (hash * 33) ^ (op.fx ? op.fx.hash : 0x7e7e);
            hash = fingerprintMaskInto(hash, op.mask);
            hash = fingerprintGradientInto(hash, op.gradient);
            hash = fingerprintShadowInto(hash, op.shadow);
            hash = fingerprintBorderInto(hash, op.border);
        }
        return hash | 0;
    }

    function fingerprintBorderInto(hash, border) {
        if (border) {
            hash = (hash * 33) ^ hashString(border.color);
            hash = (hash * 33) ^ ((border.opacity * 100) | 0);
            hash = (hash * 33) ^ ((border.size * 100) | 0);
        } else {
            hash = (hash * 33) ^ 0x3c3c;
        }
        return hash;
    }

    function fingerprintShadowInto(hash, shadow) {
        if (shadow) {
            hash = (hash * 33) ^ hashString(shadow.color);
            hash = (hash * 33) ^ ((shadow.opacity * 100) | 0);
            hash = (hash * 33) ^ ((shadow.blur * 100) | 0);
            hash = (hash * 33) ^ ((shadow.offsetX * 100) | 0);
            hash = (hash * 33) ^ ((shadow.offsetY * 100) | 0);
        } else {
            hash = (hash * 33) ^ 0x5a5a;
        }
        return hash;
    }

    function fingerprintGradientInto(hash, gradient) {
        if (gradient) {
            hash = (hash * 33) ^ ((gradient.angle * 100) | 0);
            hash = (hash * 33) ^ hashString(gradient.type || gradientTypeLinear);
            for (let c = 0; c < gradient.colors.length; c++) {
                hash = (hash * 33) ^ hashString(gradient.colors[c]);
            }
        } else {
            hash = (hash * 33) ^ 0xa5a5;
        }
        return hash;
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
    let charAnimTokenSeq = 1;

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
        if (!charAnimations.size) releaseAnimationTicker();
        return true;
    }

    function clearCharAnimationsForTarget(targetId) {
        const set = charAnimationsByTarget.get(targetId);
        if (!set || !set.size) return;
        for (const key of set) charAnimations.delete(key);
        charAnimationsByTarget.delete(targetId);
        if (!charAnimations.size) releaseAnimationTicker();
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
        if (!charAnimations.size) releaseAnimationTicker();
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
        const d = (dir || 'out').toString().toLowerCase().trim();
        const normalizedDir = (d === 'in' || d === 'out' || d === 'in out') ? d : 'out';
        const res = fn(x, normalizedDir);
        return Number.isFinite(res) ? res : x;
    }

    let animationFrameId = null;

    function ensureAnimationTicker() {
        if (animationFrameId !== null || !charAnimations.size) return;
        animationFrameId = requestAnimationFrame(stepCharAnimations);
    }

    function releaseAnimationTicker() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function stepCharAnimations() {
        animationFrameId = null;
        if (!charAnimations.size) return;
        computeCharAnimationsFrame();
        if (charAnimations.size && animationFrameId === null) {
            animationFrameId = requestAnimationFrame(stepCharAnimations);
        }
    }

    function computeCharAnimationsFrame() {
        if (!charAnimations.size) return;
        const t = nowMs();
        const dirtyStates = new Set();
        const finishedTargets = [];
        for (const [key, anim] of Array.from(charAnimations.entries())) {
            const state = getState(anim.target);
            const o = getCharOverride(state, anim.index);
            const elapsed = t - anim.startTime;
            const rawProgress = anim.duration > 0 ? Math.min(1, elapsed / anim.duration) : 1;
            const progress = applyEasing(anim.easing, anim.direction, rawProgress);
            o[anim.property] = anim.from + (anim.to - anim.from) * progress;
            state.charTransformsVersion++;
            dirtyStates.add(anim.target);
            if (rawProgress >= 1) {
                o[anim.property] = anim.to;
                deleteCharAnimation(anim.target.id, key);
                finishedTargets.push(anim.target);
            }
        }
        for (const target of dirtyStates) {
            schedulePaint(target, getState(target));
        }
        flushPendingRenders();
        for (const target of finishedTargets) {
            startCharAnimationFinishedHat(target);
        }
        if (!charAnimations.size) releaseAnimationTicker();
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

    let preDrawFlushActive = false;

    function ensurePreDrawHook() {
        const renderer = runtime.renderer;
        if (!renderer || typeof renderer.draw !== 'function') return false;
        if (!renderer.draw.irisTextWrapped) {
            const originalDraw = renderer.draw;
            const wrappedDraw = function () {
                const hook = renderer.irisTextPreDraw;
                if (hook) {
                    try {
                        hook();
                    } catch (e) {
                        console.error('[Iris Text]', e);
                    }
                }
                return originalDraw.apply(this, arguments);
            };
            wrappedDraw.irisTextWrapped = true;
            renderer.draw = wrappedDraw;
        }
        renderer.irisTextPreDraw = preDrawUpdate;
        preDrawFlushActive = true;
        return true;
    }

    function scheduleRender(target) {
        if (!preDrawFlushActive) ensurePreDrawHook();
        pendingRenderTargets.add(target);
        requestRenderFlush();
    }

    const cullEmpty = { empty: true };
    const cullMarginMin = 48;
    const cullMarginFactor = 0.35;
    const cullShapeEffects = ['horizontal_shear', 'vertical_shear', 'repeat_x', 'repeat_y'];
    let cullEmptyCanvas = null;

    function getStageBounds() {
        const renderer = runtime.renderer;
        const left = renderer ? renderer._xLeft : NaN;
        const right = renderer ? renderer._xRight : NaN;
        const bottom = renderer ? renderer._yBottom : NaN;
        const top = renderer ? renderer._yTop : NaN;
        if (Number.isFinite(left) && Number.isFinite(right) && Number.isFinite(bottom) && Number.isFinite(top) && right > left && top > bottom) {
            return { left, right, bottom, top };
        }
        const width = runtime.stageWidth > 0 ? runtime.stageWidth : 480;
        const height = runtime.stageHeight > 0 ? runtime.stageHeight : 360;
        return { left: -width / 2, right: width / 2, bottom: -height / 2, top: height / 2 };
    }

    function getDrawableTransform(target) {
        const renderer = runtime.renderer;
        if (!renderer || !renderer._allDrawables || target.drawableID === undefined || target.drawableID === null) return null;
        const drawable = renderer._allDrawables[target.drawableID];
        if (!drawable || !drawable._position || !drawable._scale || !Number.isFinite(drawable._direction)) return null;
        return {
            x: drawable._position[0],
            y: drawable._position[1],
            direction: drawable._direction,
            scaleX: drawable._scale[0],
            scaleY: drawable._scale[1],
            visible: drawable._visible !== false
        };
    }

    function hasShapeChangingEffects(target) {
        const effects = target.effects;
        if (!effects) return false;
        for (let i = 0; i < cullShapeEffects.length; i++) {
            if (effects[cullShapeEffects[i]]) return true;
        }
        return false;
    }

    function computeNeededDocRegion(target, anchorX, anchorY) {
        const transform = getDrawableTransform(target);
        if (!transform || hasShapeChangingEffects(target)) return null;
        const scaleX = transform.scaleX / 100;
        const scaleY = transform.scaleY / 100;
        if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY) || !Number.isFinite(transform.x) || !Number.isFinite(transform.y)) return null;
        if (Math.abs(scaleX) < 1e-9 || Math.abs(scaleY) < 1e-9) return cullEmpty;
        const stage = getStageBounds();
        const angle = -((90 - transform.direction) * Math.PI / 180);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let corner = 0; corner < 4; corner++) {
            const dx = (corner & 1 ? stage.right : stage.left) - transform.x;
            const dy = (corner & 2 ? stage.top : stage.bottom) - transform.y;
            const px = anchorX + (dx * cos - dy * sin) / scaleX;
            const py = anchorY - (dx * sin + dy * cos) / scaleY;
            if (px < minX) minX = px;
            if (px > maxX) maxX = px;
            if (py < minY) minY = py;
            if (py > maxY) maxY = py;
        }
        if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) return null;
        return { x0: minX, y0: minY, x1: maxX, y1: maxY, visible: transform.visible };
    }

    function shadowReach(settings) {
        if (!settings) return 0;
        const blur = Math.max(0, Scratch.Cast.toNumber(settings.blur));
        const offsetX = Scratch.Cast.toNumber(settings.offsetX);
        const offsetY = Scratch.Cast.toNumber(settings.offsetY);
        return blur * 2 + Math.hypot(offsetX, offsetY) + 2;
    }

    function borderReach(settings) {
        if (!settings) return 0;
        return Math.max(0, Scratch.Cast.toNumber(settings.size)) + 2;
    }

    function computeCull(target, state, docW, docH, anchorX, anchorY) {
        const needed = computeNeededDocRegion(target, anchorX, anchorY);
        if (needed === null) return { unknown: true, anchorX, anchorY, docW, docH };
        const region = {
            empty: false,
            x0: 0,
            y0: 0,
            x1: docW,
            y1: docH,
            docW,
            docH,
            anchorX,
            anchorY,
            globalShadowReach: state.textShadow.enabled ? shadowReach(state.textShadow) : 0,
            globalBorderReach: state.textBorder.enabled ? borderReach(state.textBorder) : 0
        };
        if (needed === cullEmpty || needed.x1 < 0 || needed.x0 > docW || needed.y1 < 0 || needed.y0 > docH) {
            region.empty = true;
            region.x1 = 0;
            region.y1 = 0;
            return region;
        }
        const margin = Math.max(cullMarginMin, cullMarginFactor * Math.max(needed.x1 - needed.x0, needed.y1 - needed.y0));
        region.x0 = Math.max(0, Math.floor(needed.x0 - margin));
        region.y0 = Math.max(0, Math.floor(needed.y0 - margin));
        region.x1 = Math.min(docW, Math.ceil(needed.x1 + margin));
        region.y1 = Math.min(docH, Math.ceil(needed.y1 + margin));
        if (region.x0 <= 0 && region.y0 <= 0 && region.x1 >= docW && region.y1 >= docH) return null;
        return region;
    }

    function opMayBeVisible(op, cull) {
        const size = op.font['font-size'];
        const scale = op.scale != null ? Math.abs(op.scale) : 1;
        let reach = Math.max(size * 1.3, Math.abs(op.width || 0)) * Math.max(1, scale);
        reach += op.shadow ? shadowReach(op.shadow) : cull.globalShadowReach;
        reach += op.border && Scratch.Cast.toNumber(op.border.size) > 0 ? borderReach(op.border) : cull.globalBorderReach;
        if (op.blur > 0) reach += (op.blur / 100) * size * 1.5;
        return op.x + reach >= cull.x0 && op.x - reach <= cull.x1 && op.y + reach >= cull.y0 && op.y - reach <= cull.y1;
    }

    function cullNeedsRerender(target, state) {
        const rendered = state.cullRegion;
        if (!rendered) return false;
        const needed = computeNeededDocRegion(target, rendered.anchorX, rendered.anchorY);
        if (rendered.unknown) return needed !== null;
        if (needed === null) return true;
        if (needed === cullEmpty || !needed.visible) return false;
        const x0 = Math.max(0, needed.x0);
        const y0 = Math.max(0, needed.y0);
        const x1 = Math.min(rendered.docW, needed.x1);
        const y1 = Math.min(rendered.docH, needed.y1);
        if (x1 < x0 || y1 < y0) return false;
        if (rendered.empty) return true;
        return x0 < rendered.x0 - 0.5 || y0 < rendered.y0 - 0.5 || x1 > rendered.x1 + 0.5 || y1 > rendered.y1 + 0.5;
    }

    function refreshCulledTargets() {
        const targets = runtime.targets;
        if (!targets) return;
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (typeof target.getCustomState !== 'function') continue;
            const state = target.getCustomState(stateKey);
            if (!state || !state.cullOffscreen || !state.visible || state.skinId === null || !state.cullRegion) continue;
            if (state.renderInFlight || glyphWorker.waiters.has(target) || pendingRenderTargets.has(target)) continue;
            if (!cullNeedsRerender(target, state)) continue;
            state.paintFingerprint = null;
            state.paintDirty = true;
            renderTarget(target);
        }
    }

    function preDrawUpdate() {
        flushPendingRenders();
        refreshCulledTargets();
    }

    function getEmptyCullCanvas() {
        if (!cullEmptyCanvas) {
            cullEmptyCanvas = document.createElement('canvas');
            cullEmptyCanvas.width = 1;
            cullEmptyCanvas.height = 1;
        }
        return cullEmptyCanvas;
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
        const state = getState(target);
        if (!state.visible) {
            pendingRenderTargets.delete(target);
            return;
        }
        if (preDrawFlushActive || ensurePreDrawHook()) {
            scheduleRender(target);
            return;
        }
        pendingRenderTargets.delete(target);
        renderTarget(target);
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
        return getPaintOpsGeometryKey(state, layoutKey) + '\u0004' + state.charMasksVersion + '\u0004' + state.charTransformsVersion;
    }

    const emptyOverride = {
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

    const emptyPerspectiveTransform = { offsetX: 0, offsetY: 0, rotation: 0, scale: 1 };
    const emptyPerspectiveGeometry = { maxShiftX: 0, maxShiftY: 0, maxCharacterExtent: 0 };

    function buildPerspectiveGeometry(lineRuns) {
        const lineGeometries = new Array(lineRuns.length);

        for (let lineIndex = 0; lineIndex < lineRuns.length; lineIndex++) {
            const lineGeometry = new Map();
            for (const run of lineRuns[lineIndex]) {
                for (let i = 0; i < run.chars.length; i++) {
                    const rc = run.chars[i];
                    if (!rc.perspectives || !rc.perspectives.length) continue;
                    const index = run.startIndex + i;
                    const advance = run.positions[i].advance;
                    for (const perspective of rc.perspectives) {
                        let geometry = lineGeometry.get(perspective);
                        if (!geometry) {
                            geometry = {
                                offsets: new Map(),
                                width: 0,
                                firstOffset: 0,
                                lastOffset: 0,
                                lastIndex: index,
                                lastAdvance: advance
                            };
                            lineGeometry.set(perspective, geometry);
                        }
                        const centerOffset = geometry.width + advance / 2;
                        if (geometry.offsets.size === 0) geometry.firstOffset = centerOffset;
                        geometry.lastOffset = centerOffset;
                        geometry.lastIndex = index;
                        geometry.lastAdvance = advance;
                        geometry.offsets.set(index, centerOffset);
                        geometry.width += advance;
                    }
                }
            }
            if (lineGeometry.size) lineGeometries[lineIndex] = lineGeometry;
        }

        if (!lineGeometries.some(Boolean)) return emptyPerspectiveGeometry;

        let maxShiftX = 0;
        let maxShiftY = 0;
        let maxCharacterExtent = 0;

        for (let lineIndex = 0; lineIndex < lineRuns.length; lineIndex++) {
            const lineGeometry = lineGeometries[lineIndex];
            if (!lineGeometry) continue;
            let lineShiftX = 0;
            let lineShiftY = 0;
            let trailingShiftX = 0;
            for (const run of lineRuns[lineIndex]) {
                for (let i = 0; i < run.chars.length; i++) {
                    const rc = run.chars[i];
                    const index = run.startIndex + i;
                    let shiftX = 0;
                    let shiftY = 0;
                    let perspectiveRotation = 0;
                    let scale = 1;
                    for (const perspective of rc.perspectives || []) {
                        const geometry = lineGeometry.get(perspective);
                        if (!geometry) continue;
                        const centerOffset = geometry.offsets.get(index);
                        if (!Number.isFinite(centerOffset)) continue;
                        const centerRange = geometry.lastOffset - geometry.firstOffset;
                        const progress = geometry.offsets.size > 1 && centerRange > 0 ?
                            (centerOffset - geometry.firstOffset) / centerRange : 1;
                        const projectedOffset = centerRange > 0 ?
                            centerRange * progress / (1 + perspective.scaleStrength * progress) :
                            0;
                        shiftX += projectedOffset - centerRange * progress +
                            perspective.x * progress;
                        shiftY += perspective.y * progress;
                        perspectiveRotation += perspective.rotation * progress;
                        scale *= 1 / Math.pow(1 + perspective.scaleStrength * progress, 2);
                    }
                    shiftX += trailingShiftX;
                    if (!Number.isFinite(shiftX) || !Number.isFinite(shiftY) ||
                        !Number.isFinite(perspectiveRotation) || !Number.isFinite(scale)) {
                        continue;
                    }
                    rc.perspectiveTransform = {
                        offsetX: shiftX,
                        offsetY: shiftY,
                        rotation: perspectiveRotation,
                        scale
                    };
                    lineShiftX = Math.max(lineShiftX, Math.abs(shiftX));
                    lineShiftY = Math.max(lineShiftY, Math.abs(shiftY));
                    maxCharacterExtent = Math.max(maxCharacterExtent, rc.size * scale);

                    let completedShiftX = 0;
                    for (const perspective of rc.perspectives || []) {
                        const geometry = lineGeometry.get(perspective);
                        if (!geometry || geometry.lastIndex !== index) continue;
                        const centerRange = geometry.lastOffset - geometry.firstOffset;
                        const endScale = 1 / Math.pow(1 + perspective.scaleStrength, 2);
                        const centerShift = (centerRange > 0 ?
                            centerRange / (1 + perspective.scaleStrength) - centerRange : 0) +
                            perspective.x;
                        completedShiftX += centerShift +
                            (endScale - 1) * geometry.lastAdvance / 2;
                    }
                    trailingShiftX += completedShiftX;
                }
            }
            maxShiftX = Math.max(maxShiftX, lineShiftX);
            maxShiftY = Math.max(maxShiftY, lineShiftY);
        }

        return { maxShiftX, maxShiftY, maxCharacterExtent };
    }

    function renderTarget(target) {
        const startTime = perfStart();
        try {
            return renderTargetNow(target);
        } finally {
            perfEnd('render.total', startTime);
        }
    }

    function renderTargetNow(target) {
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
            state.layoutFamilies = families;
            let fontsPending = false;
            for (const family of families) {
                if (!loadedDocumentFonts.has(family)) fontsPending = true;
                ensureDocumentFont(family);
            }
            if (fontsPending && !state.hasPaintedOnce) {
                return;
            }
            ensureFontCoverage(richChars);
            const layoutStart = perfStart();
            const measured = measureRichText(glyphMeasureCtx, richChars, state);
            perfEnd('render.layout', layoutStart);
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
            lineRuns,
            maxShadowExtent,
            maxBorderExtent
        } = layout;
        let perspectiveGeometry = layout.perspectiveGeometry;
        if (!perspectiveGeometry) {
            perspectiveGeometry = buildPerspectiveGeometry(lineRuns);
            layout.perspectiveGeometry = perspectiveGeometry;
        }

        const lineHeight = state.baseStyle.size * state.lineSpacing;
        const totalHeight = lines.length * lineHeight;

        const decorationPad = Math.max(
            0,
            Scratch.Cast.toNumber(state.textBackground.padding),
            Scratch.Cast.toNumber(state.textBackground.padding) + Scratch.Cast.toNumber(state.textBackgroundBorder.size),
            Scratch.Cast.toNumber(state.textBorder.size),
            Scratch.Cast.toNumber(state.textShadow.blur) + Math.abs(Scratch.Cast.toNumber(state.textShadow.offsetX)),
            Scratch.Cast.toNumber(state.textShadow.blur) + Math.abs(Scratch.Cast.toNumber(state.textShadow.offsetY)),
            maxShadowExtent || 0,
            maxBorderExtent || 0
        );
        const basePad = Math.max(
            64,
            state.baseStyle.size * 2,
            decorationPad + state.baseStyle.size
        );
        const padX = Math.max(
            basePad,
            perspectiveGeometry.maxShiftX + perspectiveGeometry.maxCharacterExtent + decorationPad
        );
        const padY = Math.max(
            basePad,
            perspectiveGeometry.maxShiftY + perspectiveGeometry.maxCharacterExtent + decorationPad
        );

        ensureTypingBox(state);
        let effectiveMaxWidth = state.maxWidth && state.maxWidth > 0 ? state.maxWidth : maxWidth;
        let effectiveMaxHeight = state.maxHeight && state.maxHeight > 0 ? state.maxHeight : totalHeight;
        if (state.typingBoxWidth > effectiveMaxWidth) effectiveMaxWidth = state.typingBoxWidth;
        if (state.typingBoxHeight > effectiveMaxHeight) effectiveMaxHeight = state.typingBoxHeight;

        const docW = Math.ceil(effectiveMaxWidth + padX * 2);
        const docH = Math.ceil(effectiveMaxHeight + padY * 2);

        const originX = docW / 2;
        const originY = state.growDownwardOnly ? (padY + totalHeight / 2) : docH / 2;
        const anchorY = state.growDownwardOnly ? (padY + lineHeight / 2) : originY;

        let textBoxOffsetX = 0;
        let textBoxWidth = maxWidth;
        if (lineWidths.length > 0) {
            const typingBoxLineWidths = state.typingBoxLineWidths;
            const isFinalTypingLine = !!typingBoxLineWidths && typingBoxLineWidths.length === lines.length;
            let textBoxMinX = Infinity;
            let textBoxMaxX = -Infinity;
            for (let li = 0; li < lineWidths.length; li++) {
                const lineW = lineWidths[li];
                const centerLineW = isFinalTypingLine ? typingBoxLineWidths[li] : lineW;
                let effectiveLineW = lineW;
                if (state.align === 'justify' && li < lineWidths.length - 1 && effectiveMaxWidth > lineW) {
                    effectiveLineW = effectiveMaxWidth;
                }
                let lineMinX;
                if (state.align === 'left' || state.align === 'justify') {
                    lineMinX = -effectiveMaxWidth / 2;
                } else if (state.align === 'right') {
                    lineMinX = effectiveMaxWidth / 2 - centerLineW;
                    effectiveLineW = lineW;
                } else {
                    lineMinX = -centerLineW / 2;
                    effectiveLineW = lineW;
                }
                textBoxMinX = Math.min(textBoxMinX, lineMinX);
                textBoxMaxX = Math.max(textBoxMaxX, lineMinX + effectiveLineW);
            }
            textBoxOffsetX = (textBoxMinX + textBoxMaxX) / 2;
            textBoxWidth = textBoxMaxX - textBoxMinX;
        }

        const geometryKey = getPaintOpsGeometryKey(state, layoutKey) + '\u0004' + docW + '\u0004' + docH + '\u0004' + (state.growDownwardOnly ? 1 : 0);
        const paintOpsKey = geometryKey + '\u0004' + state.charMasksVersion + '\u0004' + state.charTransformsVersion;
        let paintOps = state.paintOps;
        let charBoxes = state.charBoxes;

        const geometryUnchanged = state.paintOpsGeometryKey === geometryKey &&
            state.paintOpsLayout === layout && !!paintOps;
        const transformsUnchanged = state.paintOpsTransformsVersion === state.charTransformsVersion;

        if (geometryUnchanged && transformsUnchanged && state.paintOpsKey !== paintOpsKey) {
            for (let i = 0; i < paintOps.length; i++) {
                const op = paintOps[i];
                op.mask = state.charMasks[op.charIndex] || null;
            }
            state.paintOpsKey = paintOpsKey;
            state.paintOpsMasksVersion = state.charMasksVersion;

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
            const typingBoxLineWidths = state.typingBoxLineWidths;
            const isFinalTypingLine = !!typingBoxLineWidths && typingBoxLineWidths.length === lines.length;

            for (let li = 0; li < lines.length; li++) {
                const line = lines[li];
                const runs = lineRuns[li];
                const lineW = lineWidths[li];
                const centerLineW = isFinalTypingLine ? typingBoxLineWidths[li] : lineW;
                const justifySpaceCount = state.align === 'justify' && li < lines.length - 1 &&
                    effectiveMaxWidth > lineW ?
                    line.filter(rc => rc.char === ' ').length : 0;
                const justifyExtra = justifySpaceCount > 0 ?
                    (effectiveMaxWidth - lineW) / justifySpaceCount : 0;
                let lineX;

                if (state.align === 'left') {
                    lineX = originX - effectiveMaxWidth / 2;
                } else if (state.align === 'right') {
                    lineX = originX + effectiveMaxWidth / 2 - centerLineW;
                } else if (state.align === 'justify') {
                    lineX = originX - effectiveMaxWidth / 2;
                } else {
                    lineX = originX - centerLineW / 2;
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
                            (state.charOverrides[index] || emptyOverride) :
                            emptyOverride;

                        const perspective = rc.perspectiveTransform || emptyPerspectiveTransform;
                        const perspectiveX = perspective.offsetX;
                        const perspectiveY = perspective.offsetY;
                        const perspectiveRotation = perspective.rotation;
                        const perspectiveScale = perspective.scale;
                        const charCenterX = runOriginX + pos.shapedX + pos.advance / 2 +
                            spacesBefore * justifyExtra + o.x + perspectiveX;
                        const charCenterY = baseCenterY - o.y - perspectiveY;
                        const rotation = (o.rotation || 0) + perspectiveRotation;
                        const opacity = o.opacity == null ? 1 : o.opacity;
                        const scale = (o.scale == null ? 1 : o.scale) * perspectiveScale;
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
                        op.width = pos.advance * perspectiveScale;
                        op.mask = mask;
                        op.charIndex = index;
                        op.gradient = o.color ? null : (rc.gradient || null);
                        op.gradientSpanId = o.color ? null : (rc.gradientSpanId || null);
                        op.gradientOccurrenceIndex = o.color ? -1 : (rc.gradientOccurrenceIndex != null ? rc.gradientOccurrenceIndex : -1);
                        op.blur = rc.blur || 0;
                        op.shadow = rc.shadow || null;
                        op.border = rc.border || null;
                        op.layer = rc.layer || 0;
                        op.fx = resolveEffectState(rc.effects, state.charEffects ? state.charEffects[index] : null);
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
            state.paintOpsTransformsVersion = state.charTransformsVersion;
            state.paintOpsMasksVersion = state.charMasksVersion;
            state.charBoxes = charBoxes;
            state.charsByTag = charsByTag;
            state.drawableWidth = docW;
            state.drawableHeight = docH;

            const fingerprint = fingerprintPaintOps(paintOps, docW, docH, state.align);
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

        const cullInfo = state.cullOffscreen ? computeCull(target, state, docW, docH, originX, anchorY != null ? anchorY : originY) : null;
        const cull = cullInfo && !cullInfo.unknown ? cullInfo : null;
        if (deferForWorkerGlyphs(target, state, paintOps, cull)) {
            state.paintFingerprint = null;
            return;
        }
        glyphWorker.waiters.delete(target);

        state.renderQueued = false;
        state.cullRegion = cullInfo;
        state.cullBounds = cull ? { docW: cull.docW, docH: cull.docH, anchorX: cull.anchorX, anchorY: cull.anchorY } : null;
        const compositeStart = perfStart();
        compositeGlyphsAndPush(target, state, paintOps, docW, docH, textBoxWidth, totalHeight, textBoxOffsetX, originX, originY, anchorY, cull);
        perfEnd('render.composite', compositeStart);
        state.lastPaintAt = performance.now();
        state.workerDeferrals = 0;
        state.paintDirty = false;
        state.hasPaintedOnce = true;
        state.renderInFlight = false;
        state.renderPromise = null;
        if (state.renderQueued) {
            state.renderQueued = false;
            scheduleRender(target);
        }
        return Promise.resolve();
    }

    const lastCompositeCrop = {
        x: 0,
        y: 0,
        scale: glyphOversample
    };

    function compositeGlyphsAndPush(target, state, paintOps, docW, docH, textWidth, textHeight, textBoxOffsetX, originX, originY, anchorY, cull) {
        if (cull && cull.empty) {
            pushCanvasToDrawable(target, getEmptyCullCanvas(), docW, docH, originX, anchorY != null ? anchorY : originY, destScale);
            return;
        }
        const pinnedKeys = new Set();
        for (let i = 0; i < paintOps.length; i++) {
            const op = paintOps[i];
            if (op.text === '\u00A0' || op.text === '') continue;
            if (cull && !opMayBeVisible(op, cull)) continue;
            pinnedKeys.add(glyphCacheKey(op.text, op.font['font-family'], op.font['font-size'], op.font['font-weight'], op.font['font-style']));
        }
        pinGlyphKeysForFrame(pinnedKeys);
        let canvas;
        try {
            canvas = compositeGlyphsToCanvasWebGL2(state, paintOps, docW, docH, textWidth, textHeight, textBoxOffsetX, originX, originY, cull);
        } finally {
            unpinGlyphKeysForFrame(pinnedKeys);
        }
        if (!canvas) {
            if (!webglUnavailableLogged) {
                webglUnavailableLogged = true;
                console.error('[Iris Text] WebGL2 is not available in this environment; text cannot be rendered.');
            }
            return;
        }
        pushCanvasToDrawable(
            target, canvas, docW, docH,
            originX - lastCompositeCrop.x,
            (anchorY != null ? anchorY : originY) - lastCompositeCrop.y,
            lastCompositeCrop.scale
        );
    }

    const loadedDocumentFonts = new Set();
    const pendingDocumentFonts = new Map();
    const fontLoadMaxRetries = 8;
    const fontLoadRetryDelayMs = 150;

    function rerenderVisibleTextTargets(fonts) {
        for (const candidate of runtime.targets) {
            const state = candidate.getCustomState(stateKey);
            if (!state || !state.visible) continue;
            if (fonts && state.layoutFamilies instanceof Set) {
                let usesFont = false;
                for (const font of fonts) {
                    if (state.layoutFamilies.has(font)) {
                        usesFont = true;
                        break;
                    }
                }
                if (!usesFont) continue;
            }
            state.shapeKey = null;
            state.layoutKey = null;
            state.layout = null;
            state.paintFingerprint = null;
            scheduleRender(candidate);
        }
    }

    let rerenderVisibleTextTargetsQueued = false;
    let rerenderAllFonts = false;
    const pendingRerenderFonts = new Set();

    function requestRerenderVisibleTextTargets(fontId) {
        if (fontId === undefined) rerenderAllFonts = true;
        else pendingRerenderFonts.add(fontId);
        if (rerenderVisibleTextTargetsQueued) return;
        rerenderVisibleTextTargetsQueued = true;
        Promise.resolve().then(() => {
            rerenderVisibleTextTargetsQueued = false;
            const fonts = rerenderAllFonts ? null : new Set(pendingRerenderFonts);
            rerenderAllFonts = false;
            pendingRerenderFonts.clear();
            rerenderVisibleTextTargets(fonts);
        });
    }

    const fontProbeText = 'AaBbGgQqWwZz01@#';
    const fontProbeControlFamilies = ['serif', 'sans-serif', 'monospace'];
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
        return ctx.measureText(fontProbeText).width;
    }

    function getFontProbeControlWidths() {
        if (fontProbeControlWidths) return fontProbeControlWidths;
        fontProbeControlWidths = fontProbeControlFamilies.map(measureFontProbeWidth);
        return fontProbeControlWidths;
    }

    function isFontActuallyRendering(fontId) {
        const rawFamily = `"${fontId}"`;
        const controlWidths = getFontProbeControlWidths();
        const testedWidths = fontProbeControlFamilies.map(fallback =>
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
        const loadStart = perfStart();
        const promise = document.fonts.load(fontSpec, 'M')
            .catch(() => [])
            .then(loadedFaces => {
                perfEnd('font.load', loadStart);
                for (const face of loadedFaces) knownLoadedFontFaces.add(face);
                pendingDocumentFonts.delete(fontId);
                const apiReady = typeof document.fonts.check === 'function' ? document.fonts.check(fontSpec, 'M') : true;
                const ready = apiReady && isFontActuallyRendering(fontId);
                if (ready) {
                    loadedDocumentFonts.add(fontId);
                    invalidateGlyphCacheForFamily(cssFontFamily(fontId));
                    charAdvanceCache.clear();
                    requestRerenderVisibleTextTargets(fontId);
                    registerWorkerFont(fontId);
                } else if (attempt < fontLoadMaxRetries) {
                    setTimeout(() => ensureDocumentFont(fontId, attempt + 1), fontLoadRetryDelayMs);
                } else {
                    loadedDocumentFonts.add(fontId);
                }
            });
        pendingDocumentFonts.set(fontId, promise);
    }

    const fontCharsChecked = new Map();
    const knownLoadedFontFaces = new WeakSet();

    function ensureFontCoverage(richChars) {
        if (!document.fonts) return;
        let missing = null;
        for (let i = 0; i < richChars.length; i++) {
            const rc = richChars[i];
            const char = rc.char;
            if (char === '\n' || char === ' ' || char === '\u00A0') continue;
            if (!loadedDocumentFonts.has(rc.font)) continue;
            let seen = fontCharsChecked.get(rc.font);
            if (!seen) {
                seen = new Set();
                fontCharsChecked.set(rc.font, seen);
            }
            if (seen.has(char)) continue;
            seen.add(char);
            if (!missing) missing = new Map();
            missing.set(rc.font, (missing.get(rc.font) || '') + char);
        }
        if (!missing) return;
        for (const [fontId, chars] of missing) {
            document.fonts.load(`16px "${fontId}"`, chars)
                .catch(() => [])
                .then(faces => {
                    let discovered = false;
                    for (const face of faces) {
                        if (!knownLoadedFontFaces.has(face)) {
                            knownLoadedFontFaces.add(face);
                            discovered = true;
                        }
                    }
                    if (!discovered) return;
                    invalidateGlyphCacheForFamily(cssFontFamily(fontId));
                    charAdvanceCache.clear();
                    requestRerenderVisibleTextTargets(fontId);
                });
        }
    }

    function preloadBuiltInFonts() {
        if (!document.fonts) return;
        const defaultFont = defaultBaseStyle().font;
        if (documentHasFontFace(defaultFont)) ensureDocumentFont(defaultFont);
        const connection = typeof navigator !== 'undefined' ? navigator.connection : null;
        if (connection && connection.saveData) return;
        const queue = fontIds.filter(id => id !== defaultFont);
        const loadNext = () => {
            while (queue.length) {
                const id = queue.shift();
                if (!documentHasFontFace(id)) continue;
                ensureDocumentFont(id);
                runWhenIdle(loadNext, 3000);
                return;
            }
        };
        runWhenIdle(loadNext, 3000);
    }

    function startupWarmup() {
        preloadBuiltInFonts();
        runWhenIdle(() => {
            getGLCompositor();
        }, 2000);
    }

    const destScale = glyphOversample;


    function maskGroupKey(mask) {
        return mask.targetName + '\u0001' + mask.costumeName + '\u0001' +
            (mask.direction || wipeDirectionBottomUp) + '\u0001' +
            Math.round(mask.x * 4) + '\u0001' + Math.round(mask.y * 4);
    }

    function glyphDrawRectPx(op, shape) {
        const advanceCenterXEm = shape.baselineOriginXEm + shape.advance / 2;
        const baselineYFromLineCenter = (shape.fontAscentEm - shape.fontDescentEm) / 2;
        const drawXEm = op.x - advanceCenterXEm;
        const drawYEm = (op.y + baselineYFromLineCenter) - shape.baselineOriginYEm;
        const px = Math.round(drawXEm * destScale);
        const py = Math.round(drawYEm * destScale);
        return { px, py, w: shape.canvas.width, h: shape.canvas.height };
    }

    function computeSeamlessMaskSpansByIndex(paintOps, areaW, areaH) {
        const spans = new Map();
        let groupIndices = null;
        let groupKey = null;
        let box = emptyAABB();

        const flushGroup = () => {
            if (!groupIndices || !groupIndices.length) return;
            if (!aabbIsFinite(box)) return;
            const spanW = areaW;
            const spanH = areaH;
            for (const gi of groupIndices) {
                spans.set(gi, {
                    spanW,
                    spanH,
                    originX: 0,
                    originY: 0
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
                box = emptyAABB();
            }
            groupIndices.push(op.charIndex);

            if (op.text === '\u00A0' || op.text === '') continue;

            const shape = getGlyphShapeForFontStyle(op.text, op.font);
            const rect = glyphDrawRectPx(op, shape);

            expandAABBToPoint(box, rect.px, rect.py);
            expandAABBToPoint(box, rect.px + rect.w, rect.py + rect.h);
        }
        flushGroup();

        return spans;
    }

    function getSeamlessMaskSpans(state, paintOps, layoutDocKey, areaW, areaH) {
        const cacheKey = layoutDocKey + '\u0003' + state.charMaskGeometryVersion;
        if (state.maskSpansCacheKey === cacheKey && state.maskSpansCache) {
            return state.maskSpansCache;
        }
        const spans = computeSeamlessMaskSpansByIndex(paintOps, areaW, areaH);
        state.maskSpansCacheKey = cacheKey;
        state.maskSpansCache = spans;
        return spans;
    }

    function computeGradientSpansByIndex(paintOps) {
        const spans = new Map();
        let groupIndices = null;
        let groupId = null;
        let box = emptyAABB();

        const flushGroup = () => {
            if (!groupIndices || !groupIndices.length) return;
            if (!aabbIsFinite(box)) return;
            const spanW = Math.max(1, box.maxX - box.minX);
            const spanH = Math.max(1, box.maxY - box.minY);
            for (const gi of groupIndices) {
                spans.set(gi, {
                    spanW,
                    spanH,
                    originX: box.minX,
                    originY: box.minY
                });
            }
        };

        for (let i = 0; i < paintOps.length; i++) {
            const op = paintOps[i];
            if (!op.gradient || !op.gradientSpanId) {
                flushGroup();
                groupIndices = null;
                groupId = null;
                continue;
            }

            if (groupId !== op.gradientSpanId) {
                flushGroup();
                groupIndices = [];
                groupId = op.gradientSpanId;
                box = emptyAABB();
            }
            groupIndices.push(op.charIndex);

            if (op.text === '\u00A0' || op.text === '') continue;

            const shape = getGlyphShapeForFontStyle(op.text, op.font);
            const rect = glyphDrawRectPx(op, shape);
            const padYPx = Math.round((shape.baselineOriginYEm - shape.fontAscentEm) * destScale);
            const inkTop = rect.py + padYPx;
            const inkBottom = rect.py + rect.h - padYPx;

            expandAABBToPoint(box, rect.px, inkTop);
            expandAABBToPoint(box, rect.px + rect.w, inkBottom);
        }
        flushGroup();

        return spans;
    }

    function getGradientSpans(state, paintOps, layoutDocKey) {
        const cacheKey = layoutDocKey + '\u0003' + state.charMaskGeometryVersion;
        if (state.gradientSpansCacheKey === cacheKey && state.gradientSpansCache) {
            return state.gradientSpansCache;
        }
        const spans = computeGradientSpansByIndex(paintOps);
        const finalSpans = state.typingBoxGradientSpans;
        if (finalSpans && finalSpans.size) {
            for (const [charIndex, finalSpan] of finalSpans) {
                spans.set(charIndex, finalSpan);
            }
        }
        state.gradientSpansCacheKey = cacheKey;
        state.gradientSpansCache = spans;
        return spans;
    }

    const glQuadVs = `#version 300 es
    layout(location=0) in vec2 a_corner;
    uniform vec2 u_canvasSize;
    uniform vec2 u_origin;
    uniform vec2 u_size;
    uniform vec2 u_pivot;
    uniform float u_rotation;
    uniform float u_scale;
    out vec2 v_uv;
    void main() {
        vec2 local = a_corner * u_size;
        vec2 rel = (a_corner * u_size) - u_pivot;
        float c = cos(u_rotation);
        float s = sin(u_rotation);
        vec2 rotated = vec2(rel.x * c - rel.y * s, rel.x * s + rel.y * c) * u_scale;
        vec2 pos = u_origin + u_pivot + rotated;
        vec2 clip = (pos / u_canvasSize) * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
        v_uv = a_corner;
    }`;

    const glFxSource = `
    uniform int u_fx;
    uniform vec2 u_fxA;
    uniform vec2 u_fxB;
    uniform vec2 u_fxSkin;
    uniform vec4 u_fxGeo;
    uniform vec4 u_fxCol;
    uniform vec3 u_fxRgb;

    const float fxEpsilon = 1e-3;

    vec3 fxRgb2Hsv(vec3 rgb) {
        const vec4 hueOffsets = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 temp1 = rgb.b > rgb.g ? vec4(rgb.bg, hueOffsets.wz) : vec4(rgb.gb, hueOffsets.xy);
        vec4 temp2 = rgb.r > temp1.x ? vec4(rgb.r, temp1.yzx) : vec4(temp1.xyw, rgb.r);
        float m = min(temp2.y, temp2.w);
        float C = temp2.x - m;
        float V = temp2.x;
        return vec3(
            abs(temp2.z + (temp2.w - temp2.y) / (6.0 * C + fxEpsilon)),
            C / (temp2.x + fxEpsilon),
            V
        );
    }

    vec3 fxHsv2Rgb(vec3 hsv) {
        float r = abs(hsv.x * 6.0 - 3.0) - 1.0;
        float g = 2.0 - abs(hsv.x * 6.0 - 2.0);
        float b = 2.0 - abs(hsv.x * 6.0 - 4.0);
        vec3 rgb = clamp(vec3(r, g, b), 0.0, 1.0);
        float c = hsv.z * hsv.y;
        return rgb * c + hsv.z - c;
    }

    vec2 fxWarpChar(vec2 c) {
        vec2 w = c;
        if (c.x >= 0.0 && c.x <= 1.0 && c.y >= 0.0 && c.y <= 1.0) {
            if ((u_fx & 16) != 0) {
                w = fract(u_fxGeo.x * w);
            }
            if ((u_fx & 8) != 0) {
                vec2 texel = u_fxSkin / u_fxGeo.y;
                w = (floor(w * texel) + vec2(0.5)) / texel;
            }
        }
        if ((u_fx & 4) != 0) {
            vec2 offset = w - vec2(0.5);
            float magnitude = length(offset);
            float factor = max(1.0 - (magnitude / 0.5), 0.0);
            float angle = u_fxGeo.z * factor * factor;
            float sinA = sin(angle);
            float cosA = cos(angle);
            mat2 rotation = mat2(cosA, -sinA, sinA, cosA);
            w = rotation * offset + vec2(0.5);
        }
        if ((u_fx & 2) != 0) {
            vec2 v = (w - vec2(0.5)) / vec2(0.5);
            float len = length(v);
            if (len > 0.0) {
                float r = pow(min(len, 1.0), u_fxGeo.w) * max(1.0, len);
                w = vec2(0.5) + r * (v / len) * vec2(0.5);
            }
        }
        return w;
    }

    vec2 fxWarp(vec2 uv) {
        if ((u_fx & 30) == 0) return uv;
        return (fxWarpChar(uv * u_fxA + u_fxB) - u_fxB) / u_fxA;
    }

    vec3 fxColor(vec3 rgb) {
        if ((u_fx & 993) == 0) return rgb;
        rgb = clamp(rgb, 0.0, 1.0);
        if ((u_fx & 1) != 0) {
            vec3 hsv = fxRgb2Hsv(rgb);
            const float minLightness = 0.11 / 2.0;
            const float minSaturation = 0.09;
            if (hsv.z < minLightness) hsv = vec3(0.0, 1.0, minLightness);
            else if (hsv.y < minSaturation) hsv = vec3(0.0, minSaturation, hsv.z);
            hsv.x = mod(hsv.x + u_fxCol.x, 1.0);
            if (hsv.x < 0.0) hsv.x += 1.0;
            rgb = fxHsv2Rgb(hsv);
        }
        if ((u_fx & 64) != 0) {
            vec3 hsv = fxRgb2Hsv(rgb);
            hsv.y = hsv.y * max(u_fxCol.z, 0.0);
            rgb = fxHsv2Rgb(hsv);
        }
        if ((u_fx & 32) != 0) {
            rgb = clamp(rgb + vec3(u_fxCol.y), 0.0, 1.0);
        }
        if ((u_fx & 128) != 0) rgb.r *= max(u_fxRgb.x, 0.0);
        if ((u_fx & 256) != 0) rgb.g *= max(u_fxRgb.y, 0.0);
        if ((u_fx & 512) != 0) rgb.b *= max(u_fxRgb.z, 0.0);
        return clamp(rgb, 0.0, 1.0);
    }

    float fxAlpha(float a) {
        return (u_fx & 1024) != 0 ? clamp(a * u_fxCol.w, 0.0, 1.0) : a;
    }
    `;

    const glGlyphFs = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform sampler2D u_tex;
    uniform vec4 u_tint;
    uniform float u_alpha;
    uniform int u_mode;
    uniform vec4 u_gradStops[8];
    uniform vec2 u_gradLocalOrigin;
    uniform vec2 u_gradGlyphSize;
    uniform int u_gradCount;
    uniform vec2 u_gradAxis0;
    uniform vec2 u_gradAxis1;
    uniform vec2 u_gradCenter;
    uniform float u_gradRadius;
    uniform int u_gradType;
    uniform float u_gradStartAngle;
    uniform vec4 u_fxRect;
    out vec4 fragColor;
    ${glFxSource}

    const float PI = 3.14159265358979;

    vec4 sampleGradient(vec2 posPx) {
        float t;
        if (u_gradType == 1) {
            t = clamp(distance(posPx, u_gradCenter) / max(u_gradRadius, 0.0001), 0.0, 1.0);
        } else if (u_gradType == 2) {
            vec2 d = posPx - u_gradCenter;
            float ang = atan(d.x, -d.y) - u_gradStartAngle;
            ang = mod(ang, 2.0 * PI);
            if (ang < 0.0) ang += 2.0 * PI;
            t = ang / (2.0 * PI);
        } else {
            vec2 d = posPx - u_gradAxis0;
            vec2 axis = u_gradAxis1 - u_gradAxis0;
            float len2 = dot(axis, axis);
            t = len2 > 0.0001 ? clamp(dot(d, axis) / len2, 0.0, 1.0) : 0.0;
        }
        int count = u_gradCount;
        if (count <= 1) return u_gradStops[0];
        float scaled = t * float(count - 1);
        int i0 = int(floor(scaled));
        i0 = clamp(i0, 0, count - 2);
        float frac = scaled - float(i0);
        vec4 c0 = u_gradStops[i0];
        vec4 c1 = u_gradStops[i0 + 1];
        return mix(c0, c1, frac);
    }

    void main() {
        bool fxOn = u_fx != 0;
        if (u_mode == 3) {
            vec2 w = fxOn ? fxWarpChar(v_uv * u_fxA + u_fxB) : v_uv;
            vec2 px = max(fwidth(v_uv), vec2(1e-6));
            vec2 d = min(w - u_fxRect.xy, u_fxRect.zw - w) / px;
            float coverage = clamp(min(d.x, d.y) + 0.5, 0.0, 1.0);
            if (fxOn) coverage = fxAlpha(coverage);
            vec3 lineRgb = fxOn ? fxColor(u_tint.rgb) : u_tint.rgb;
            float lineA = u_tint.a * coverage * u_alpha;
            fragColor = vec4(lineRgb * lineA, lineA);
            return;
        }
        vec2 tuv = fxOn ? fxWarp(v_uv) : v_uv;
        if (u_mode == 2) {
            vec4 src = texture(u_tex, tuv);
            float srcA = fxOn ? fxAlpha(src.a) : src.a;
            float outA = srcA * u_alpha;
            vec3 srcRgb = fxOn ? fxColor(src.rgb) : src.rgb;
            fragColor = vec4(srcRgb * outA, outA);
            return;
        }
        float a = texture(u_tex, tuv).a;
        if (fxOn) a = fxAlpha(a);
        vec4 base;
        if (u_mode == 1) {
            vec2 posPx = u_gradLocalOrigin + tuv * u_gradGlyphSize;
            base = sampleGradient(posPx);
        } else {
            base = u_tint;
        }
        vec3 baseRgb = fxOn ? fxColor(base.rgb) : base.rgb;
        float outA = base.a * a * u_alpha;
        fragColor = vec4(baseRgb * outA, outA);
    }`;

    const glSolidFs = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform vec4 u_color;
    out vec4 fragColor;
    void main() {
        fragColor = vec4(u_color.rgb * u_color.a, u_color.a);
    }`;

    const glEffectFs = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform sampler2D u_tex;
    out vec4 fragColor;
    void main() {
        fragColor = texture(u_tex, vec2(v_uv.x, 1.0 - v_uv.y));
    }`;

    const glRoundRectFs = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform vec2 u_size;
    uniform float u_radius;
    uniform vec4 u_color;
    out vec4 fragColor;
    void main() {
        vec2 p = (v_uv - 0.5) * u_size;
        vec2 halfSize = u_size * 0.5;
        vec2 q = abs(p) - halfSize + u_radius;
        float inner = min(max(q.x, q.y), 0.0);
        float outer = length(max(q, 0.0));
        float dist = inner + outer - u_radius;
        float aa = 1.0;
        float alpha = 1.0 - smoothstep(-aa, aa, dist);
        float outA = u_color.a * alpha;
        fragColor = vec4(u_color.rgb * outA, outA);
    }`;

    const glBorderedRoundRectFs = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform vec2 u_size;
    uniform float u_outerRadius;
    uniform float u_borderInset;
    uniform float u_innerRadius;
    uniform vec4 u_fillColor;
    uniform vec4 u_borderColor;
    out vec4 fragColor;
    float sdRoundRect(vec2 p, vec2 halfSize, float radius) {
        vec2 q = abs(p) - halfSize + radius;
        float inner = min(max(q.x, q.y), 0.0);
        float outer = length(max(q, 0.0));
        return inner + outer - radius;
    }
    void main() {
        vec2 p = (v_uv - 0.5) * u_size;
        vec2 outerHalf = u_size * 0.5;
        vec2 innerHalf = outerHalf - vec2(u_borderInset);
        float aa = 1.0;
        float outerDist = sdRoundRect(p, outerHalf, u_outerRadius);
        float outerAlpha = 1.0 - smoothstep(-aa, aa, outerDist);
        float innerDist = sdRoundRect(p, innerHalf, u_innerRadius);
        float fillCoverage = 1.0 - smoothstep(-aa, aa, innerDist);
        vec4 fillPremult = vec4(u_fillColor.rgb * u_fillColor.a, u_fillColor.a);
        vec4 borderPremult = vec4(u_borderColor.rgb * u_borderColor.a, u_borderColor.a);
        vec4 composited = mix(borderPremult, fillPremult, fillCoverage);
        composited *= outerAlpha;
        fragColor = composited;
    }`;

    const glMaskWipeFs = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform sampler2D u_glyphTex;
    uniform sampler2D u_patternTex;
    uniform mat3 u_patternMatrix;
    uniform vec2 u_texSizePx;
    uniform vec2 u_wipeOriginPx;
    uniform float u_alpha;
    uniform int u_hasWipe;
    uniform int u_wipeInvert;
    uniform vec2 u_wipeAxis;
    uniform float u_wipeStart;
    uniform float u_wipeEnd;
    out vec4 fragColor;
    ${glFxSource}
    void main() {
        bool fxOn = u_fx != 0;
        vec2 tuv = fxOn ? fxWarp(v_uv) : v_uv;
        float glyphA = texture(u_glyphTex, tuv).a;
        if (fxOn) glyphA = fxAlpha(glyphA);
        if (glyphA <= 0.0) { discard; }
        vec2 localPx = tuv * u_texSizePx;
        vec2 absPx = u_wipeOriginPx + localPx;
        vec3 sampledUv = u_patternMatrix * vec3(absPx, 1.0);
        vec4 patternColor = texture(u_patternTex, fract(sampledUv.xy));
        float wipeAlpha = 1.0;
        if (u_hasWipe == 1) {
            float t = dot(absPx, u_wipeAxis);
            float s = smoothstep(u_wipeStart, u_wipeEnd, t);
            wipeAlpha = u_wipeInvert == 1 ? s : (1.0 - s);
        }
        float outA = patternColor.a * glyphA * u_alpha * wipeAlpha;
        vec3 patternRgb = fxOn ? fxColor(patternColor.rgb) : patternColor.rgb;
        fragColor = vec4(patternRgb * outA, outA);
    }`;

    function glCompileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error('could not compile shader: ' + info);
        }
        return shader;
    }

    function glLinkProgram(gl, vsSource, fsSource) {
        const vs = glCompileShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = glCompileShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error('could not link program: ' + info);
        }
        return program;
    }

    function glUniformLocations(gl, program, names) {
        const locations = {};
        for (const name of names) locations[name] = gl.getUniformLocation(program, name);
        return locations;
    }

    let glCompositorInstance = null;
    let glCompositorFailed = false;
    let webglUnavailableLogged = false;

    function createGLCompositor() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const gl = canvas.getContext('webgl2', {
            alpha: true,
            premultipliedAlpha: true,
            antialias: false,
            preserveDrawingBuffer: false,
            depth: false,
            stencil: false
        });
        if (!gl) return null;

        const quadBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

        const quadVao = gl.createVertexArray();
        gl.bindVertexArray(quadVao);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);

        const glyphProgram = glLinkProgram(gl, glQuadVs, glGlyphFs);
        const solidProgram = glLinkProgram(gl, glQuadVs, glSolidFs);
        const roundRectProgram = glLinkProgram(gl, glQuadVs, glRoundRectFs);
        const borderedRoundRectProgram = glLinkProgram(gl, glQuadVs, glBorderedRoundRectFs);
        const maskWipeProgram = glLinkProgram(gl, glQuadVs, glMaskWipeFs);
        const effectProgram = glLinkProgram(gl, glQuadVs, glEffectFs);

        const glyphUniforms = glUniformLocations(gl, glyphProgram, [
            'u_canvasSize', 'u_origin', 'u_size', 'u_pivot', 'u_rotation', 'u_scale',
            'u_tex', 'u_tint', 'u_alpha', 'u_mode',
            'u_gradStops[0]', 'u_gradLocalOrigin', 'u_gradGlyphSize', 'u_gradCount',
            'u_gradAxis0', 'u_gradAxis1', 'u_gradCenter', 'u_gradRadius', 'u_gradType',
            'u_gradStartAngle',
            'u_fx', 'u_fxA', 'u_fxB', 'u_fxSkin', 'u_fxGeo', 'u_fxCol', 'u_fxRgb', 'u_fxRect'
        ]);
        glyphUniforms.u_gradStopsBase = gl.getUniformLocation(glyphProgram, 'u_gradStops[0]');

        const solidUniforms = glUniformLocations(gl, solidProgram, [
            'u_canvasSize', 'u_origin', 'u_size', 'u_pivot', 'u_rotation', 'u_scale', 'u_color'
        ]);
        const roundRectUniforms = glUniformLocations(gl, roundRectProgram, [
            'u_canvasSize', 'u_origin', 'u_size', 'u_pivot', 'u_rotation', 'u_scale', 'u_radius', 'u_color'
        ]);
        const borderedRoundRectUniforms = glUniformLocations(gl, borderedRoundRectProgram, [
            'u_canvasSize', 'u_origin', 'u_size', 'u_pivot', 'u_rotation', 'u_scale',
            'u_outerRadius', 'u_borderInset', 'u_innerRadius', 'u_fillColor', 'u_borderColor'
        ]);
        const maskWipeUniforms = glUniformLocations(gl, maskWipeProgram, [
            'u_canvasSize', 'u_origin', 'u_size', 'u_pivot', 'u_rotation', 'u_scale',
            'u_glyphTex', 'u_patternTex', 'u_patternMatrix', 'u_texSizePx', 'u_wipeOriginPx', 'u_alpha',
            'u_hasWipe', 'u_wipeInvert', 'u_wipeAxis', 'u_wipeStart', 'u_wipeEnd',
            'u_fx', 'u_fxA', 'u_fxB', 'u_fxSkin', 'u_fxGeo', 'u_fxCol', 'u_fxRgb'
        ]);

        const effectUniforms = glUniformLocations(gl, effectProgram, [
            'u_canvasSize', 'u_origin', 'u_size', 'u_pivot', 'u_rotation', 'u_scale', 'u_tex'
        ]);

        const viewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
        const detectedMaxSide = Math.min(
            gl.getParameter(gl.MAX_TEXTURE_SIZE) || Infinity,
            gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || Infinity,
            viewportDims ? Math.min(viewportDims[0], viewportDims[1]) : Infinity
        );
        const maxSide = Number.isFinite(detectedMaxSide) && detectedMaxSide > 0 ? detectedMaxSide : 2048;

        const glyphTextures = new WeakMap();
        const maskPatternTextures = new Map();

        function getGlyphTexture(shape, forceUpload) {
            let tex = glyphTextures.get(shape);
            if (!forceUpload && tex && tex.canvas === shape.canvas && tex.w === shape.canvas.width && tex.h === shape.canvas.height) {
                return tex.texture;
            }
            if (!tex) {
                tex = { texture: gl.createTexture() };
                glyphTextures.set(shape, tex);
            }
            gl.bindTexture(gl.TEXTURE_2D, tex.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, shape.canvas);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            tex.canvas = shape.canvas;
            tex.w = shape.canvas.width;
            tex.h = shape.canvas.height;
            return tex.texture;
        }

        function evictGlyphTexture(shape) {
            const tex = glyphTextures.get(shape);
            if (tex) {
                gl.deleteTexture(tex.texture);
                glyphTextures.delete(shape);
            }
        }

        function getMaskPatternTexture(maskTexture) {
            let entry = maskPatternTextures.get(maskTexture.cacheKey);
            if (entry && entry.canvas === maskTexture.canvas) return entry.texture;
            if (maskPatternTextures.size >= 64 && !entry) {
                const oldestKey = maskPatternTextures.keys().next().value;
                const oldest = maskPatternTextures.get(oldestKey);
                gl.deleteTexture(oldest.texture);
                maskPatternTextures.delete(oldestKey);
            }
            const texture = (entry && entry.texture) || gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskTexture.canvas);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            maskPatternTextures.set(maskTexture.cacheKey, { texture, canvas: maskTexture.canvas });
            return texture;
        }

        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = 1;
        outputCanvas.height = 1;
        outputCanvas.reusable = false;
        const outputCtx = outputCanvas.getContext('2d');

        return {
            gl, canvas, quadVao, outputCanvas, outputCtx, maxSide,
            renderRatio: 1,
            offX: 0, offY: 0,
            fx: null, fxX: 0, fxY: 0, fxW: 1, fxH: 1, fxShape: null,
            effectProgram, effectUniforms,
            effectFramebuffer: null, effectTexture: null, effectW: 0, effectH: 0,
            effectActive: false, effectBlendMax: false,
            glyphProgram, solidProgram, roundRectProgram, borderedRoundRectProgram, maskWipeProgram,
            glyphUniforms, solidUniforms, roundRectUniforms, borderedRoundRectUniforms, maskWipeUniforms,
            getGlyphTexture, evictGlyphTexture, getMaskPatternTexture
        };
    }

    const maxOutputSide = 16384;
    const maxOutputPixels = 16777216;

    function maxRenderSide(comp) {
        const side = Math.min(comp.maxSide, maxOutputSide);
        const rendererMax = refreshRendererMaxTextureSize();
        return rendererMax > 0 ? Math.min(side, rendererMax) : side;
    }

    function fitRenderScale(comp, docW, docH) {
        const side = maxRenderSide(comp);
        const fit = Math.min(
            destScale,
            side / docW,
            side / docH,
            Math.sqrt(maxOutputPixels / (docW * docH))
        );
        return fit > 0 && fit < destScale ? fit : destScale;
    }

    function getGLCompositor() {
        if (glCompositorFailed) return null;
        if (glCompositorInstance) return glCompositorInstance;
        const startTime = perfStart();
        try {
            glCompositorInstance = createGLCompositor();
        } catch (e) {
            glCompositorInstance = null;
        }
        if (!glCompositorInstance) glCompositorFailed = true;
        perfEnd('gl.compositor.create', startTime);
        return glCompositorInstance;
    }

    function hexToRgbaArray(color, alpha) {
        let r = 0, g = 0, b = 0, a = alpha == null ? 1 : alpha;
        if (typeof color === 'string' && color[0] === '#') {
            const hex = color.slice(1);
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16) / 255;
                g = parseInt(hex[1] + hex[1], 16) / 255;
                b = parseInt(hex[2] + hex[2], 16) / 255;
            } else if (hex.length === 6 || hex.length === 8) {
                r = parseInt(hex.slice(0, 2), 16) / 255;
                g = parseInt(hex.slice(2, 4), 16) / 255;
                b = parseInt(hex.slice(4, 6), 16) / 255;
                if (hex.length === 8) a *= parseInt(hex.slice(6, 8), 16) / 255;
            }
        } else if (typeof color === 'string') {
            const m = color.match(/rgba?\(([^)]+)\)/);
            if (m) {
                const parts = m[1].split(',').map(s => parseFloat(s));
                r = (parts[0] || 0) / 255;
                g = (parts[1] || 0) / 255;
                b = (parts[2] || 0) / 255;
                if (parts.length > 3) a *= parts[3];
            }
        }
        return [r * a, g * a, b * a, a];
    }

    function drawGLQuad(comp, program, uniforms, originX, originY, w, h, pivotX, pivotY, rotation, scale) {
        const gl = comp.gl;
        const ratio = comp.renderRatio;
        originX -= comp.offX;
        originY -= comp.offY;
        gl.useProgram(program);
        gl.bindVertexArray(comp.quadVao);
        gl.uniform2f(uniforms.u_canvasSize, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform2f(uniforms.u_origin, originX * ratio, originY * ratio);
        gl.uniform2f(uniforms.u_size, w * ratio, h * ratio);
        gl.uniform2f(uniforms.u_pivot, pivotX * ratio, pivotY * ratio);
        gl.uniform1f(uniforms.u_rotation, rotation || 0);
        gl.uniform1f(uniforms.u_scale, scale == null ? 1 : scale);
        const bounds = comp.bounds;
        if (bounds) {
            const quadRotation = rotation || 0;
            const quadScale = scale == null ? 1 : scale;
            const cos = Math.cos(quadRotation);
            const sin = Math.sin(quadRotation);
            for (let corner = 0; corner < 4; corner++) {
                const relX = (corner & 1 ? w : 0) - pivotX;
                const relY = (corner & 2 ? h : 0) - pivotY;
                const x = originX + pivotX + (relX * cos - relY * sin) * quadScale;
                const y = originY + pivotY + (relX * sin + relY * cos) * quadScale;
                if (x < bounds.minX) bounds.minX = x;
                if (x > bounds.maxX) bounds.maxX = x;
                if (y < bounds.minY) bounds.minY = y;
                if (y > bounds.maxY) bounds.maxY = y;
            }
        }
    }

    function setFxUniforms(comp, uni, quadX, quadY, quadW, quadH) {
        const gl = comp.gl;
        const fx = comp.fx;
        if (!fx) {
            if (uni.fxActive !== false) {
                gl.uniform1i(uni.u_fx, 0);
                uni.fxActive = false;
            }
            return;
        }
        uni.fxActive = true;
        gl.uniform1i(uni.u_fx, fx.mask);
        gl.uniform2f(uni.u_fxA, quadW / comp.fxW, quadH / comp.fxH);
        gl.uniform2f(uni.u_fxB, (quadX - comp.fxX) / comp.fxW, (quadY - comp.fxY) / comp.fxH);
        gl.uniform2f(uni.u_fxSkin, comp.fxW / destScale, comp.fxH / destScale);
        gl.uniform4f(uni.u_fxGeo, fx.mosaic, fx.pixelate, fx.whirl, fx.fisheye);
        gl.uniform4f(uni.u_fxCol, fx.hue, fx.brightness, fx.saturation, fx.opaque);
        gl.uniform3f(uni.u_fxRgb, fx.red, fx.green, fx.blue);
    }

    function useItemFx(comp, item) {
        const fx = item.fx;
        comp.fx = fx;
        if (!fx) return;
        comp.fxX = item.drawXPx;
        comp.fxY = item.drawYPx;
        comp.fxW = item.shape.canvas.width;
        comp.fxH = item.shape.canvas.height;
        comp.fxShape = item.shape;
    }

    function glDrawLineSegment(comp, x1, x2, y, lineWidth, color, alpha) {
        if (!comp.fx) {
            glDrawSolidRect(comp, (x1 + x2) / 2, y, x2 - x1, lineWidth, color, alpha);
            return;
        }
        const gl = comp.gl;
        const uni = comp.glyphUniforms;
        const w = comp.fxW;
        const h = comp.fxH;
        drawGLQuad(comp, comp.glyphProgram, uni, comp.fxX, comp.fxY, w, h, w / 2, h / 2, 0, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, comp.getGlyphTexture(comp.fxShape));
        gl.uniform1i(uni.u_tex, 0);
        gl.uniform1f(uni.u_alpha, alpha == null ? 1 : alpha);
        gl.uniform1i(uni.u_mode, 3);
        gl.uniform4fv(uni.u_tint, hexToRgbaArray(color, 1));
        gl.uniform4f(
            uni.u_fxRect,
            (x1 - comp.fxX) / w, (y - lineWidth / 2 - comp.fxY) / h,
            (x2 - comp.fxX) / w, (y + lineWidth / 2 - comp.fxY) / h
        );
        setFxUniforms(comp, uni, comp.fxX, comp.fxY, w, h);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function glDrawGlyph(comp, shape, drawX, drawY, tintColor, alpha, rotationRad, scaleAmt, gradient, gradSpan, passthrough, pivotOverrideX, pivotOverrideY) {
        const gl = comp.gl;
        const w = shape.canvas.width;
        const h = shape.canvas.height;
        const uni = comp.glyphUniforms;
        const pivotX = pivotOverrideX != null ? pivotOverrideX - drawX : w / 2;
        const pivotY = pivotOverrideY != null ? pivotOverrideY - drawY : h / 2;
        drawGLQuad(comp, comp.glyphProgram, uni, drawX, drawY, w, h, pivotX, pivotY, rotationRad, scaleAmt);
        const forceUpload = shape.canvas === sharedShadowSurface.canvas;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, comp.getGlyphTexture(shape, forceUpload));
        gl.uniform1i(uni.u_tex, 0);
        gl.uniform1f(uni.u_alpha, alpha);
        setFxUniforms(comp, uni, drawX, drawY, w, h);

        if (passthrough) {
            gl.uniform1i(uni.u_mode, 2);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            return;
        }

        if (gradient && gradSpan) {
            gl.uniform1i(uni.u_mode, 1);
            const colors = gradient.colors;
            const flat = new Float32Array(8 * 4);
            for (let i = 0; i < Math.min(colors.length, 8); i++) {
                const c = hexToRgbaArray(colors[i], 1);
                flat[i * 4] = c[0];
                flat[i * 4 + 1] = c[1];
                flat[i * 4 + 2] = c[2];
                flat[i * 4 + 3] = c[3];
            }
            gl.uniform4fv(uni.u_gradStopsBase, flat);
            gl.uniform1i(uni.u_gradCount, Math.max(1, Math.min(colors.length, 8)));
            gl.uniform2f(uni.u_gradLocalOrigin, drawX, drawY);
            gl.uniform2f(uni.u_gradGlyphSize, w, h);

            const type = gradient.type || 'linear';
            const spanW = gradSpan.spanW;
            const spanH = gradSpan.spanH;
            const cx = drawX + spanW / 2 - (gradSpan.localOffsetXPx || 0);
            const cy = drawY + spanH / 2 - (gradSpan.localOffsetYPx || 0);
            if (type === 'radial') {
                gl.uniform1i(uni.u_gradType, 1);
                gl.uniform2f(uni.u_gradCenter, cx, cy);
                gl.uniform1f(uni.u_gradRadius, Math.max(1, Math.sqrt(spanW * spanW + spanH * spanH) / 2));
            } else if (type === 'conic') {
                gl.uniform1i(uni.u_gradType, 2);
                gl.uniform2f(uni.u_gradCenter, cx, cy);
                gl.uniform1f(uni.u_gradStartAngle, (gradient.angle || 0) * Math.PI / 180);
            } else {
                gl.uniform1i(uni.u_gradType, 0);
                const angleRad = (gradient.angle || 0) * Math.PI / 180;
                const dx = Math.cos(angleRad);
                const dy = Math.sin(angleRad);
                const halfW = spanW / 2;
                const halfH = spanH / 2;
                const half = Math.abs(dx) * halfW + Math.abs(dy) * halfH;
                gl.uniform2f(uni.u_gradAxis0, cx - dx * half, cy - dy * half);
                gl.uniform2f(uni.u_gradAxis1, cx + dx * half, cy + dy * half);
            }
        } else {
            gl.uniform1i(uni.u_mode, 0);
            gl.uniform4fv(uni.u_tint, hexToRgbaArray(tintColor, 1));
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function beginEffectLayer(comp, width, height) {
        const gl = comp.gl;
        if (!comp.effectFramebuffer) {
            comp.effectFramebuffer = gl.createFramebuffer();
            comp.effectTexture = gl.createTexture();
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, comp.effectTexture);
        if (comp.effectW !== width || comp.effectH !== height) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            comp.effectW = width;
            comp.effectH = height;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, comp.effectFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, comp.effectTexture, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return false;
        }
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.blendEquation(gl.FUNC_ADD);
        comp.effectActive = true;
        comp.effectBlendMax = false;
        return true;
    }

    function endEffectLayer(comp, buffered) {
        if (!buffered) return;
        const gl = comp.gl;
        comp.effectActive = false;
        comp.effectBlendMax = false;
        gl.blendEquation(gl.FUNC_ADD);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        const savedBounds = comp.bounds;
        comp.bounds = null;
        const ratio = comp.renderRatio;
        drawGLQuad(comp, comp.effectProgram, comp.effectUniforms, comp.offX, comp.offY, comp.effectW / ratio, comp.effectH / ratio, 0, 0, 0, 1);
        comp.bounds = savedBounds;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, comp.effectTexture);
        gl.uniform1i(comp.effectUniforms.u_tex, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function setEffectBlend(comp, alpha) {
        if (!comp.effectActive) return;
        const useMax = alpha < 0.999;
        if (comp.effectBlendMax === useMax) return;
        comp.effectBlendMax = useMax;
        comp.gl.blendEquation(useMax ? comp.gl.MAX : comp.gl.FUNC_ADD);
    }

    function effectLayerAlpha(settings, opAlpha) {
        return opAlpha * clampPercentToUnit(Scratch.Cast.toNumber(settings.opacity));
    }

    function drawEffectLayer(comp, items, start, end, key, pixelW, pixelH, drawItem) {
        let count = 0;
        let translucent = false;
        for (let i = start; i < end; i++) {
            const settings = items[i][key];
            if (!settings) continue;
            count++;
            if (effectLayerAlpha(settings, items[i].opAlpha) < 0.999) translucent = true;
        }
        if (!count) return;
        const buffered = translucent && beginEffectLayer(comp, pixelW, pixelH);
        for (let i = start; i < end; i++) {
            if (items[i][key]) drawItem(items[i]);
        }
        endEffectLayer(comp, buffered);
    }

    function drawGlyphShadow(comp, shape, shadowSettings, drawXPx, drawYPx, opAlpha, rotationRad, scaleAmt) {
        const shadowBlurPx = Math.max(0, Scratch.Cast.toNumber(shadowSettings.blur)) * destScale;
        const shadowOffsetXPx = Scratch.Cast.toNumber(shadowSettings.offsetX) * destScale;
        const shadowOffsetYPx = Scratch.Cast.toNumber(shadowSettings.offsetY) * destScale;
        const shadowBitmap = getShadowGlyphBitmap(shape, shadowSettings.color, shadowBlurPx, shadowOffsetXPx, shadowOffsetYPx);
        const shadowAlpha = opAlpha * clampPercentToUnit(Scratch.Cast.toNumber(shadowSettings.opacity));
        setEffectBlend(comp, shadowAlpha);
        glDrawGlyph(comp, shadowBitmap, drawXPx + shadowBitmap.offsetX, drawYPx + shadowBitmap.offsetY, null, shadowAlpha, rotationRad, scaleAmt, null, null, true, null, null);
    }

    function drawGlyphBorder(comp, shape, borderSettings, drawXPx, drawYPx, opAlpha, rotationRad, scaleAmt, hasRotation, hasScale) {
        const borderAlpha = opAlpha * clampPercentToUnit(Scratch.Cast.toNumber(borderSettings.opacity));
        const borderSize = Math.max(0, Scratch.Cast.toNumber(borderSettings.size)) * destScale;
        const borderOffsets = getBorderOffsets(borderSize);
        setEffectBlend(comp, borderAlpha);
        for (const [offsetX, offsetY] of borderOffsets) {
            if (!hasRotation && !hasScale) {
                glDrawGlyph(comp, shape, drawXPx + offsetX, drawYPx + offsetY, borderSettings.color, borderAlpha, 0, 1, null, null);
            } else {
                glDrawGlyph(comp, shape, drawXPx + offsetX, drawYPx + offsetY, borderSettings.color, borderAlpha, rotationRad, scaleAmt, null, null, false, null, null);
            }
        }
    }

    function glDrawSolidRect(comp, cx, cy, w, h, color, alpha) {
        const gl = comp.gl;
        const uni = comp.solidUniforms;
        drawGLQuad(comp, comp.solidProgram, uni, cx - w / 2, cy - h / 2, w, h, 0, 0, 0, 1);
        const c = hexToRgbaArray(color, alpha == null ? 1 : alpha);
        gl.uniform4f(uni.u_color, c[0], c[1], c[2], c[3]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function glDrawRoundRect(comp, cx, cy, w, h, radius, color, alpha) {
        const gl = comp.gl;
        const uni = comp.roundRectUniforms;
        drawGLQuad(comp, comp.roundRectProgram, uni, cx - w / 2, cy - h / 2, w, h, 0, 0, 0, 1);
        gl.uniform1f(uni.u_radius, radius * comp.renderRatio);
        const c = hexToRgbaArray(color, alpha == null ? 1 : alpha);
        gl.uniform4f(uni.u_color, c[0], c[1], c[2], c[3]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function glDrawBorderedRoundRect(comp, cx, cy, borderWidth, borderHeight, outerRadius, borderInset, innerRadius, fillColor, fillAlpha, borderColor, borderAlpha) {
        const gl = comp.gl;
        const uni = comp.borderedRoundRectUniforms;
        drawGLQuad(comp, comp.borderedRoundRectProgram, uni, cx - borderWidth / 2, cy - borderHeight / 2, borderWidth, borderHeight, 0, 0, 0, 1);
        gl.uniform1f(uni.u_outerRadius, outerRadius * comp.renderRatio);
        gl.uniform1f(uni.u_borderInset, borderInset * comp.renderRatio);
        gl.uniform1f(uni.u_innerRadius, innerRadius * comp.renderRatio);
        const fc = hexToRgbaArray(fillColor, fillAlpha == null ? 1 : fillAlpha);
        gl.uniform4f(uni.u_fillColor, fc[0], fc[1], fc[2], fc[3]);
        const bc = hexToRgbaArray(borderColor, borderAlpha == null ? 1 : borderAlpha);
        gl.uniform4f(uni.u_borderColor, bc[0], bc[1], bc[2], bc[3]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function glDrawMaskWipe(comp, shape, drawX, drawY, maskTexture, matrixValues, wipeInfo, alpha, wipeOriginPx) {
        const gl = comp.gl;
        const w = shape.canvas.width;
        const h = shape.canvas.height;
        const uni = comp.maskWipeUniforms;
        drawGLQuad(comp, comp.maskWipeProgram, uni, drawX, drawY, w, h, 0, 0, 0, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, comp.getGlyphTexture(shape));
        gl.uniform1i(uni.u_glyphTex, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, comp.getMaskPatternTexture(maskTexture));
        gl.uniform1i(uni.u_patternTex, 1);
        gl.uniformMatrix3fv(uni.u_patternMatrix, false, matrixValues);
        gl.uniform2f(uni.u_texSizePx, w, h);
        gl.uniform1f(uni.u_alpha, alpha);
        setFxUniforms(comp, uni, drawX, drawY, w, h);
        if (wipeInfo) {
            gl.uniform1i(uni.u_hasWipe, 1);
            gl.uniform1i(uni.u_wipeInvert, wipeInfo.invert ? 1 : 0);
            gl.uniform2f(uni.u_wipeAxis, wipeInfo.axisX, wipeInfo.axisY);
            gl.uniform1f(uni.u_wipeStart, wipeInfo.start);
            gl.uniform1f(uni.u_wipeEnd, wipeInfo.end);
            gl.uniform2f(uni.u_wipeOriginPx, wipeOriginPx ? wipeOriginPx[0] : 0, wipeOriginPx ? wipeOriginPx[1] : 0);
        } else {
            gl.uniform1i(uni.u_hasWipe, 0);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function domMatrixToGl3x3(matrix, texW, texH) {
        const inv = matrix.inverse();
        return new Float32Array([
            inv.a / texW, inv.b / texH, 0,
            inv.c / texW, inv.d / texH, 0,
            inv.e / texW, inv.f / texH, 1
        ]);
    }
    function getLayeredPaintOps(state, paintOps) {
        if (state.layeredPaintOpsSource === paintOps && state.layeredPaintOps) return state.layeredPaintOps;
        let hasLayers = false;
        for (let i = 0; i < paintOps.length; i++) {
            if (paintOps[i].layer) {
                hasLayers = true;
                break;
            }
        }
        const ordered = hasLayers ?
            paintOps.slice().sort((a, b) => a.layer - b.layer) :
            paintOps;
        state.layeredPaintOpsSource = paintOps;
        state.layeredPaintOps = ordered;
        return ordered;
    }

    function compositeGlyphsToCanvasWebGL2(state, paintOps, docW, docH, textWidth, textHeight, textBoxOffsetX, originX, originY, cull) {
        const comp = getGLCompositor();
        if (!comp) return null;
        const gl = comp.gl;
        if (gl.isContextLost()) {
            glCompositorInstance = null;
            glCompositorFailed = true;
            return null;
        }

        const regionX = cull ? cull.x0 : 0;
        const regionY = cull ? cull.y0 : 0;
        const regionW = cull ? cull.x1 - cull.x0 : docW;
        const regionH = cull ? cull.y1 - cull.y0 : docH;
        comp.offX = regionX * destScale;
        comp.offY = regionY * destScale;
        const renderScale = fitRenderScale(comp, regionW, regionH);
        comp.renderRatio = renderScale / destScale;
        const pixelW = Math.max(1, Math.ceil(regionW * renderScale - 1e-6));
        const pixelH = Math.max(1, Math.ceil(regionH * renderScale - 1e-6));
        if (comp.canvas.width !== pixelW || comp.canvas.height !== pixelH) {
            comp.canvas.width = pixelW;
            comp.canvas.height = pixelH;
        }
        gl.viewport(0, 0, pixelW, pixelH);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendEquation(gl.FUNC_ADD);
        comp.effectActive = false;
        comp.effectBlendMax = false;
        comp.fx = null;
        comp.bounds = {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        };

        const background = state.textBackground;
        const backgroundBorderSize = Math.max(0, Scratch.Cast.toNumber(state.textBackgroundBorder.size)) * destScale;
        if (background.enabled || backgroundBorderSize > 0) {
            const padding = Math.max(0, Scratch.Cast.toNumber(background.padding)) * destScale;
            const width = textWidth * destScale + padding * 2;
            const height = textHeight * destScale + padding * 2;
            const x = (originX + textBoxOffsetX) * destScale - width / 2;
            const y = originY * destScale - height / 2;
            const rawRadius = Math.max(0, Scratch.Cast.toNumber(background.radius)) * destScale;
            const radius = Math.min(rawRadius, width / 2, height / 2);
            const borderRoundness = clampPercentToUnit(Scratch.Cast.toNumber(state.textBackgroundBorder.roundness));
            if (backgroundBorderSize > 0 && background.enabled) {
                const borderWidth = width + backgroundBorderSize * 2;
                const borderHeight = height + backgroundBorderSize * 2;
                const borderRadius = Math.min(rawRadius + backgroundBorderSize * borderRoundness, borderWidth / 2, borderHeight / 2);
                const opacity = clampPercentToUnit(Scratch.Cast.toNumber(background.opacity));
                glDrawBorderedRoundRect(
                    comp, x + width / 2, y + height / 2, borderWidth, borderHeight,
                    borderRadius, backgroundBorderSize, radius,
                    background.color, opacity, state.textBackgroundBorder.color, 1
                );
            } else if (backgroundBorderSize > 0) {
                const borderWidth = width + backgroundBorderSize * 2;
                const borderHeight = height + backgroundBorderSize * 2;
                const borderRadius = Math.min(rawRadius + backgroundBorderSize * borderRoundness, borderWidth / 2, borderHeight / 2);
                glDrawRoundRect(comp, x + width / 2, y + height / 2, borderWidth, borderHeight, borderRadius, state.textBackgroundBorder.color, 1);
            } else if (background.enabled) {
                const opacity = clampPercentToUnit(Scratch.Cast.toNumber(background.opacity));
                glDrawRoundRect(comp, x + width / 2, y + height / 2, width, height, radius, background.color, opacity);
            }
        }

        const maskSpansByIndex = getSeamlessMaskSpans(state, paintOps, state.layoutKey + '\u0003' + docW + '\u0003' + docH, docW * destScale, docH * destScale);
        const gradientSpansByIndex = getGradientSpans(state, paintOps, state.layoutKey + '\u0003' + docW + '\u0003' + docH);

        const drawOrder = getLayeredPaintOps(state, paintOps);
        const prepared = [];
        for (let i = 0; i < drawOrder.length; i++) {
            const op = drawOrder[i];
            if (op.text === '\u00A0' || op.text === '') continue;
            if (cull && !opMayBeVisible(op, cull)) continue;

            const shape = getGlyphShapeForFontStyle(op.text, op.font);
            const isColorEmoji = shape.isColorGlyph && state.emojiMode === 2;

            let gradSpan = null;
            if (op.gradient && !isColorEmoji) {
                const span = gradientSpansByIndex.get(op.charIndex);
                if (span) {
                    let localOffsetXPx, localOffsetYPx;
                    if (span.localOffsetXPx !== undefined) {
                        localOffsetXPx = span.localOffsetXPx;
                        localOffsetYPx = span.localOffsetYPx;
                    } else {
                        const advanceCenterXEmForSpan = shape.baselineOriginXEm + shape.advance / 2;
                        const baselineYFromLineCenterForSpan = (shape.fontAscentEm - shape.fontDescentEm) / 2;
                        const drawXEmForSpan = op.x - advanceCenterXEmForSpan;
                        const drawYEmForSpan = (op.y + baselineYFromLineCenterForSpan) - shape.baselineOriginYEm;
                        localOffsetXPx = Math.round(drawXEmForSpan * destScale) - span.originX;
                        localOffsetYPx = Math.round(drawYEmForSpan * destScale) - span.originY;
                    }
                    gradSpan = { spanW: span.spanW, spanH: span.spanH, localOffsetXPx, localOffsetYPx };
                }
            }

            const advanceCenterXEm = shape.baselineOriginXEm + shape.advance / 2;
            const baselineYFromLineCenter = (shape.fontAscentEm - shape.fontDescentEm) / 2;
            const drawXEm = op.x - advanceCenterXEm;
            const drawYEm = (op.y + baselineYFromLineCenter) - shape.baselineOriginYEm;
            const drawXPx = drawXEm * destScale;
            const drawYPx = drawYEm * destScale;

            const hasOpacity = op.opacity != null && op.opacity !== 1;
            const opAlpha = hasOpacity ? op.opacity : 1;
            const hasRotation = !!op.rotation;
            const hasScale = op.scale != null && op.scale !== 1;
            const rotationRad = hasRotation ? -op.rotation * Math.PI / 180 : 0;
            const scaleAmt = hasScale ? op.scale : 1;
            const blurPx = op.blur > 0 ? (op.blur / 100) * op.font['font-size'] * 0.5 * destScale : 0;

            const charShadow = op.shadow;
            const activeShadow = charShadow || (state.textShadow.enabled ? state.textShadow : null);

            const charBorder = op.border;
            const charBorderValid = charBorder && Scratch.Cast.toNumber(charBorder.size) > 0;
            const globalBorderValid = state.textBorder.enabled && Scratch.Cast.toNumber(state.textBorder.size) > 0;
            const activeBorder = charBorderValid ? charBorder : (globalBorderValid ? state.textBorder : null);

            prepared.push({
                fx: op.fx || null,
                op, shape, isColorEmoji, gradSpan, baselineYFromLineCenter,
                drawXPx, drawYPx, opAlpha, hasRotation, hasScale, rotationRad, scaleAmt, blurPx,
                shadow: activeShadow,
                border: !isColorEmoji && activeBorder ? activeBorder : null
            });
        }

        let groupStart = 0;
        while (groupStart < prepared.length) {
            const groupLayer = prepared[groupStart].op.layer || 0;
            let groupEnd = groupStart + 1;
            while (groupEnd < prepared.length && (prepared[groupEnd].op.layer || 0) === groupLayer) groupEnd++;

            drawEffectLayer(comp, prepared, groupStart, groupEnd, 'shadow', pixelW, pixelH, item => {
                useItemFx(comp, item);
                drawGlyphShadow(comp, item.shape, item.shadow, item.drawXPx, item.drawYPx, item.opAlpha, item.rotationRad, item.scaleAmt);
                comp.fx = null;
            });
            drawEffectLayer(comp, prepared, groupStart, groupEnd, 'border', pixelW, pixelH, item => {
                useItemFx(comp, item);
                drawGlyphBorder(comp, item.shape, item.border, item.drawXPx, item.drawYPx, item.opAlpha, item.rotationRad, item.scaleAmt, item.hasRotation, item.hasScale);
                comp.fx = null;
            });

            for (let i = groupStart; i < groupEnd; i++) {
                const {
                    op, shape, isColorEmoji, gradSpan, baselineYFromLineCenter,
                    drawXPx, drawYPx, opAlpha, hasRotation, rotationRad, scaleAmt, blurPx
                } = prepared[i];
                useItemFx(comp, prepared[i]);

                if (blurPx > 0 && !op.gradient && !isColorEmoji) {
                    const blurredBitmap = getBlurredGlyphBitmap(shape, op.color, blurPx);
                    glDrawGlyph(comp, blurredBitmap, drawXPx + blurredBitmap.offsetX, drawYPx + blurredBitmap.offsetY, null, opAlpha, rotationRad, scaleAmt, null, null, true, null, null);
                } else {
                    glDrawGlyph(
                        comp, shape, drawXPx, drawYPx,
                        op.color, opAlpha, rotationRad, scaleAmt,
                        isColorEmoji ? null : op.gradient, gradSpan,
                        isColorEmoji, null, null
                    );
                }

                if (op.mask && !op.gradient && !isColorEmoji) {
                    const texture = getMaskTexture(op.mask.targetName, op.mask.costumeName);
                    if (texture) {
                        const maskOpacity = clampPercentToUnit(Scratch.Cast.toNumber(op.mask.opacity != null ? op.mask.opacity : 100));
                        const combinedAlpha = opAlpha * maskOpacity;
                        if (combinedAlpha > 0) {
                            const span = maskSpansByIndex.get(op.charIndex);
                            const zoom = Math.max(0.01, (Scratch.Cast.toNumber(op.mask.zoom) || 100) / 100);
                            const rotation = Scratch.Cast.toNumber(op.mask.rotation);
                            const anchorX = (op.mask.x || 0) * destScale - drawXPx;
                            const anchorY = -(op.mask.y || 0) * destScale - drawYPx;
                            const matrix = new DOMMatrix();
                            matrix.translateSelf(anchorX, anchorY);
                            if (rotation !== 0) matrix.rotateSelf(rotation);
                            matrix.scaleSelf(zoom, zoom);
                            const glMatrix = domMatrixToGl3x3(matrix, texture.width, texture.height);

                            const coverage = clampPercentToUnit(Scratch.Cast.toNumber(op.mask.coverage != null ? op.mask.coverage : 100));
                            if (coverage > 0) {
                                let wipeInfo = null;
                                if (coverage < 1) {
                                    const seamless = !!op.mask.seamless;
                                    const w = shape.canvas.width;
                                    const h = shape.canvas.height;
                                    const localOffsetX = seamless && span ? (span.localOffsetXPx !== undefined ? span.localOffsetXPx : (drawXPx - span.originX)) : 0;
                                    const localOffsetY = seamless && span ? (span.localOffsetYPx !== undefined ? span.localOffsetYPx : (drawYPx - span.originY)) : 0;
                                    const effSpanW = seamless && span && span.spanW ? span.spanW : w;
                                    const effSpanH = seamless && span && span.spanH ? span.spanH : h;
                                    const blurPx = Math.max(0, Scratch.Cast.toNumber(op.mask.blur)) * destScale;
                                    const bandHalf = Math.max(0.5, blurPx / 2);
                                    const direction = op.mask.direction || wipeDirectionBottomUp;
                                    const axisIsX = direction === wipeDirectionLeftRight || direction === wipeDirectionRightLeft;
                                    const growsPositive = direction === wipeDirectionLeftRight || direction === wipeDirectionUpDown;
                                    let revealEdge;
                                    if (axisIsX && direction === wipeDirectionLeftRight) {
                                        revealEdge = effSpanW * coverage - localOffsetX;
                                    } else if (axisIsX) {
                                        revealEdge = effSpanW - effSpanW * coverage - localOffsetX;
                                    } else if (direction === wipeDirectionUpDown) {
                                        revealEdge = effSpanH * coverage - localOffsetY;
                                    } else {
                                        revealEdge = effSpanH - effSpanH * coverage - localOffsetY;
                                    }
                                    const bandStart = revealEdge - bandHalf;
                                    const bandEnd = revealEdge + bandHalf;
                                    wipeInfo = {
                                        axisX: axisIsX ? 1 : 0,
                                        axisY: axisIsX ? 0 : 1,
                                        start: Math.min(bandStart, bandEnd),
                                        end: Math.max(bandStart, bandEnd),
                                        invert: growsPositive ? 0 : 1
                                    };
                                    if (wipeInfo.end <= wipeInfo.start) {
                                        wipeInfo.end = wipeInfo.start + 0.0001;
                                    }
                                }

                                glDrawMaskWipe(comp, shape, drawXPx, drawYPx, texture, glMatrix, wipeInfo, combinedAlpha);
                            }
                        }
                    }
                }

                if (op.strike) {
                    const lineWidth = Math.max(1, op.font['font-size'] * 0.06) * destScale;
                    const sy = op.y * destScale;
                    const x0 = (op.x - op.width / 2) * destScale;
                    const x1 = (op.x + op.width / 2) * destScale;
                    if (x1 > x0) {
                        glDrawLineSegment(comp, x0, x1, sy, lineWidth, op.color, opAlpha);
                    }
                }

                if (op.underline) {
                    const lineWidth = Math.max(1, op.font['font-size'] * 0.06) * destScale;
                    const uy = (op.y + baselineYFromLineCenter + op.font['font-size'] * 0.06) * destScale;
                    const startX = (op.x - op.width / 2) * destScale;
                    const endX = (op.x + op.width / 2) * destScale;
                    if (hasRotation) {
                        if (endX > startX) glDrawLineSegment(comp, startX, endX, uy, lineWidth, op.color, opAlpha);
                    } else {
                        drawUnderlineSegmentsGL(comp, shape, Math.round(drawXPx), Math.round(drawYPx), startX, endX, uy, lineWidth, op.color, opAlpha);
                    }
                }

                comp.fx = null;
            }

            groupStart = groupEnd;
        }

        const ratio = comp.renderRatio;
        const fullW = regionW * destScale;
        const fullH = regionH * destScale;
        const bounds = comp.bounds;
        comp.bounds = null;
        let cropX = 0;
        let cropY = 0;
        let cropEndX = fullW;
        let cropEndY = fullH;
        if (bounds && bounds.maxX >= bounds.minX && bounds.maxY >= bounds.minY) {
            const x0 = Math.max(0, Math.floor((bounds.minX - 2) / destScale) * destScale);
            const y0 = Math.max(0, Math.floor((bounds.minY - 2) / destScale) * destScale);
            const x1 = Math.min(fullW, Math.ceil((bounds.maxX + 2) / destScale) * destScale);
            const y1 = Math.min(fullH, Math.ceil((bounds.maxY + 2) / destScale) * destScale);
            if (x1 > x0 && y1 > y0) {
                cropX = x0;
                cropY = y0;
                cropEndX = x1;
                cropEndY = y1;
            }
        }
        const srcX = Math.floor(cropX * ratio + 1e-6);
        const srcY = Math.floor(cropY * ratio + 1e-6);
        const srcEndX = Math.min(pixelW, Math.ceil(cropEndX * ratio - 1e-6));
        const srcEndY = Math.min(pixelH, Math.ceil(cropEndY * ratio - 1e-6));
        const outW = Math.max(1, srcEndX - srcX);
        const outH = Math.max(1, srcEndY - srcY);
        if (comp.outputCanvas.width !== outW || comp.outputCanvas.height !== outH) {
            comp.outputCanvas.width = outW;
            comp.outputCanvas.height = outH;
        }
        comp.outputCtx.setTransform(1, 0, 0, 1, 0, 0);
        comp.outputCtx.clearRect(0, 0, outW, outH);
        comp.outputCtx.drawImage(comp.canvas, srcX, srcY, outW, outH, 0, 0, outW, outH);
        lastCompositeCrop.x = regionX + srcX / renderScale;
        lastCompositeCrop.y = regionY + srcY / renderScale;
        lastCompositeCrop.scale = renderScale;
        return comp.outputCanvas;
    }

    function drawUnderlineSegmentsGL(comp, glyph, glyphX, glyphY, startX, endX, y, lineWidth, color, alpha) {
        const stroke = (x1, x2) => {
            if (x2 <= x1) return;
            glDrawLineSegment(comp, x1, x2, y, lineWidth, color, alpha);
        };
        try {
            const w = glyph.canvas.width;
            const rowStart = Math.max(0, Math.floor(y - glyphY - lineWidth / 2));
            const rowEnd = Math.min(glyph.canvas.height - 1, Math.ceil(y - glyphY + lineWidth / 2));
            const columnStart = Math.max(0, Math.floor(startX - glyphX));
            const columnEnd = Math.min(w - 1, Math.ceil(endX - glyphX));
            const ink = getGlyphInkBand(glyph, rowStart, rowEnd);
            const padding = Math.max(1, Math.ceil(lineWidth / 2) + 1);
            let segmentStart = startX;
            let px = columnStart;
            while (px <= columnEnd) {
                if (!ink[px]) { px++; continue; }
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

    function getVirtualTextBounds(state, drawable) {
        const info = state.cullBounds;
        if (!info || !drawable._position || !drawable._scale || !Number.isFinite(drawable._direction)) return null;
        const scaleX = drawable._scale[0] / 100;
        const scaleY = drawable._scale[1] / 100;
        if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY)) return null;
        const angle = (90 - drawable._direction) * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        let left = Infinity;
        let right = -Infinity;
        let bottom = Infinity;
        let top = -Infinity;
        for (let corner = 0; corner < 4; corner++) {
            const vx = ((corner & 1 ? info.docW : 0) - info.anchorX) * scaleX;
            const vy = -((corner & 2 ? info.docH : 0) - info.anchorY) * scaleY;
            const x = drawable._position[0] + vx * cos - vy * sin;
            const y = drawable._position[1] + vx * sin + vy * cos;
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < bottom) bottom = y;
            if (y > top) top = y;
        }
        if (!Number.isFinite(left) || !Number.isFinite(right) || !Number.isFinite(bottom) || !Number.isFinite(top)) return null;
        return { left, right, bottom, top };
    }

    function installCullFenceBounds(skin, state) {
        skin.getFenceBounds = function(drawable, result) {
            const rect = drawable.getAABB(result);
            const bounds = getVirtualTextBounds(state, drawable);
            if (bounds) rect.initFromBounds(bounds.left, bounds.right, bounds.bottom, bounds.top);
            return rect;
        };
    }

    // the reason this exists is because culling was interfering with the Scratch renderer. i couldnt find another way of fixing it... so this is what you get
    function installCullDrawableBounds(target, drawable) {
        if (drawable.irisCullBounds) return;
        const proto = Object.getPrototypeOf(drawable);
        if (!proto || typeof proto.getFastBounds !== 'function' || typeof proto.getAABB !== 'function') return;
        drawable.irisCullBounds = true;
        drawable.getFastBounds = function(result) {
            const state = target.getCustomState(stateKey);
            const bounds = state && state.cullBounds ? getVirtualTextBounds(state, this) : null;
            if (!bounds) return proto.getFastBounds.call(this, result);
            const rect = proto.getAABB.call(this, result);
            rect.initFromBounds(bounds.left, bounds.right, bounds.bottom, bounds.top);
            return rect;
        };
    }

    function installLinearFiltering(skin, state) {
        skin.useNearest = function(scale) {
            if (!state.smoothing) return true;
            const s = Math.max(Math.abs(scale[0]), Math.abs(scale[1]));
            return s >= ((skin._costumeResolution || destScale) * 100 - 5);
        };
    }

    function pushCanvasToDrawable(target, canvas, width, height, anchorX, anchorY, resolution) {
        const startTime = perfStart();
        try {
            pushCanvasToDrawableNow(target, canvas, width, height, anchorX, anchorY, resolution);
        } finally {
            perfEnd('render.pushSkin', startTime);
        }
    }

    function pushCanvasToDrawableNow(target, canvas, width, height, anchorX, anchorY, resolution) {
        const state = getState(target);
        const renderer = runtime.renderer;
        if (!renderer) return;
        const rotationCenter = [
            anchorX != null ? anchorX : width / 2,
            anchorY != null ? anchorY : height / 2
        ];

        if (state.skinId === null) {
            const BitmapSkin = renderer.exports.BitmapSkin;
            const skinId = renderer._nextSkinId++;
            const skin = new BitmapSkin(skinId, renderer);
            installLinearFiltering(skin, state);
            installCullFenceBounds(skin, state);
            skin.setBitmap(canvas, resolution || destScale, rotationCenter);
            renderer._allSkins[skinId] = skin;
            state.skinId = skinId;
        } else {
            renderer.updateBitmapSkin(state.skinId, canvas, resolution || destScale, rotationCenter);
            const current = renderer._allSkins[state.skinId];
            if (current && !Object.prototype.hasOwnProperty.call(current, 'useNearest')) {
                installLinearFiltering(current, state);
            }
            if (current && !Object.prototype.hasOwnProperty.call(current, 'getFenceBounds')) {
                installCullFenceBounds(current, state);
            }
        }
        const drawable = renderer._allDrawables[target.drawableID];
        if (drawable && state.cullBounds) installCullDrawableBounds(target, drawable);
        const skin = renderer._allSkins[state.skinId];
        if (!drawable || drawable.skin !== skin) {
            renderer.updateDrawableSkinId(target.drawableID, state.skinId);
        }
        runtime.requestRedraw();
    }

    function clearTarget(target) {
        const state = getState(target);
        state.visible = false;
        state.revealToken++;
        state.isTyping = false;
        clearTypingBox(state);
        state.paintDirty = true;
        state.paintFingerprint = null;
        state.charMasks = {};
        state.charMasksVersion++;
        state.charMaskGeometryVersion++;
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

    function startCharAnimationFinishedHat(target) {
        runtime.startHats('g1nxIrisText_onCharAnimationFinished', null, target);
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

    function charLineIndices(target) {
        const state = getState(target);
        const shapeKey = getShapeKey(state);
        if (state.charLineIndicesCache && state.charLineIndicesCacheKey === shapeKey) {
            return state.charLineIndicesCache;
        }
        const chars = parseRichText(state.rawText, state.baseStyle);
        const indices = [];
        let line = 1;
        for (let index = 0; index < chars.length; index++) {
            if (chars[index].char === '\n') {
                line++;
                continue;
            }
            indices.push({ charIndex: index, line });
        }
        state.charLineIndicesCache = indices;
        state.charLineIndicesCacheKey = shapeKey;
        return indices;
    }

    const wordSplitRe = /\S+/g;

    function wordSpans(target) {
        const state = getState(target);
        const shapeKey = getShapeKey(state);
        if (state.wordSpansCache && state.wordSpansCacheKey === shapeKey) {
            return state.wordSpansCache;
        }
        const plain = stripMarkup(state.rawText);
        const spans = [];
        wordSplitRe.lastIndex = 0;
        let match;
        while ((match = wordSplitRe.exec(plain)) !== null) {
            spans.push({ text: match[0], index: match.index, charIndex: match.index + 1 });
        }
        state.wordSpansCache = spans;
        state.wordSpansCacheKey = shapeKey;
        return spans;
    }

    class IrisText {
        constructor() {
            this._onTargetRemoved = this._onTargetRemoved.bind(this);
            this._onProjectStopAll = this._onProjectStopAll.bind(this);
            if (runtime.ext_irisText && runtime.ext_irisText !== this) {
                runtime.removeListener('targetWasRemoved', runtime.ext_irisText._onTargetRemoved);
                runtime.removeListener('PROJECT_STOP_ALL', runtime.ext_irisText._onProjectStopAll);
                if (typeof runtime.ext_irisText._destroyGlyphWorker === 'function') runtime.ext_irisText._destroyGlyphWorker();
            }
            runtime.on('targetWasRemoved', this._onTargetRemoved);
            runtime.on('PROJECT_STOP_ALL', this._onProjectStopAll);
            runtime.ext_irisText = this;
            if (typeof runtime.registerCompiledExtensionBlocks === 'function') {
                runtime.registerCompiledExtensionBlocks('irisText', this.getCompileInfo());
            }
            ensurePreDrawHook();
            startGlyphWorker();
            startupWarmup();
        }

        setPerfEnabled(enabled) {
            perf.enabled = !!enabled;
        }

        resetPerf() {
            perf.stats.clear();
        }

        getPerfReport() {
            return perfReport();
        }

        setGlyphWorkerEnabled(enabled) {
            setGlyphWorkerEnabled(enabled);
        }

        getGlyphWorkerStatus() {
            return glyphWorkerStatus();
        }

        _destroyGlyphWorker() {
            destroyGlyphWorker();
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

        *_repeatCompiledCharInLine(func, thread, target, stage) {
            const entries = charLineIndices(target);
            const rootFrame = thread.stackFrames[0];
            rootFrame.irisTagCharacterNumber = 0;
            rootFrame.irisLineNumber = 0;

            for (const entry of entries) {
                rootFrame.irisTagCharacterNumber = entry.charIndex + 1;
                rootFrame.irisLineNumber = entry.line;
                yield* func(thread, target, runtime, stage);
            }
        }

        *_repeatCompiledWord(func, thread, target, stage) {
            const words = wordSpans(target);
            const rootFrame = thread.stackFrames[0];
            rootFrame.irisWordNumber = 0;
            rootFrame.irisWordValue = '';
            rootFrame.irisTagCharacterNumber = 0;

            for (let i = 0; i < words.length; i++) {
                rootFrame.irisWordNumber = i + 1;
                rootFrame.irisWordValue = words[i].text;
                rootFrame.irisTagCharacterNumber = words[i].charIndex;
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
                    repeatForCharInLine: (generator, block) => ({
                        kind: 'stack',
                        substack: generator.descendSubstack(block, 'SUBSTACK')
                    }),
                    repeatForEachWord: (generator, block) => ({
                        kind: 'stack',
                        substack: generator.descendSubstack(block, 'SUBSTACK')
                    }),
                    currentCharValue: () => ({
                        kind: 'input'
                    }),
                    currentCharIndex: () => ({
                        kind: 'input'
                    }),
                    currentLineIndex: () => ({
                        kind: 'input'
                    }),
                    currentWordIndex: () => ({
                        kind: 'input'
                    }),
                    currentWordValue: () => ({
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
                    repeatForCharInLine: (node, compiler, imports) => {
                        const temp = compiler.source;
                        compiler.source = '(function*(thread, target, runtime, stage) {\n';
                        if (node.substack) {
                            compiler.descendStack(node.substack, new imports.Frame(false));
                        }
                        compiler.source += '})';
                        const funcExpr = compiler.source;
                        compiler.source = temp;
                        compiler.source += `yield* runtime.ext_irisText._repeatCompiledCharInLine(${funcExpr}, thread, target, stage);\n`;
                    },
                    repeatForEachWord: (node, compiler, imports) => {
                        const temp = compiler.source;
                        compiler.source = '(function*(thread, target, runtime, stage) {\n';
                        if (node.substack) {
                            compiler.descendStack(node.substack, new imports.Frame(false));
                        }
                        compiler.source += '})';
                        const funcExpr = compiler.source;
                        compiler.source = temp;
                        compiler.source += `yield* runtime.ext_irisText._repeatCompiledWord(${funcExpr}, thread, target, stage);\n`;
                    },
                    currentCharValue: (node, compiler, imports) => {
                        return new imports.TypedInput('(thread && thread._irisChar ? thread._irisChar.char : (target && target._irisTypingChar ? target._irisTypingChar.char : ""))', imports.TYPE_STRING);
                    },
                    currentCharIndex: (node, compiler, imports) => {
                        return new imports.TypedInput('(thread && thread.stackFrames[0] && thread.stackFrames[0].irisTagCharacterNumber !== undefined ? thread.stackFrames[0].irisTagCharacterNumber : (thread && thread._irisChar ? thread._irisChar.index + 1 : (target && target._irisTypingChar ? target._irisTypingChar.index + 1 : 0)))', imports.TYPE_NUMBER);
                    },
                    currentLineIndex: (node, compiler, imports) => {
                        return new imports.TypedInput('(thread && thread.stackFrames[0] && thread.stackFrames[0].irisLineNumber !== undefined ? thread.stackFrames[0].irisLineNumber : 0)', imports.TYPE_NUMBER);
                    },
                    currentWordIndex: (node, compiler, imports) => {
                        return new imports.TypedInput('(thread && thread.stackFrames[0] && thread.stackFrames[0].irisWordNumber !== undefined ? thread.stackFrames[0].irisWordNumber : 0)', imports.TYPE_NUMBER);
                    },
                    currentWordValue: (node, compiler, imports) => {
                        return new imports.TypedInput('(thread && thread.stackFrames[0] && thread.stackFrames[0].irisWordValue !== undefined ? thread.stackFrames[0].irisWordValue : "")', imports.TYPE_STRING);
                    }
                }
            };
        }

        _onTargetRemoved(target) {
            glyphWorker.waiters.delete(target);
            const state = target.getCustomState(stateKey);
            if (state && state.skinId !== null && runtime.renderer) {
                runtime.renderer.destroySkin(state.skinId);
                state.skinId = null;
            }
            clearCharAnimationsForTarget(target.id);
            if (!charAnimations.size) releaseAnimationTicker();
        }

        _onProjectStopAll() {
            runtime.targets.forEach(t => {
                const state = t.getCustomState(stateKey);
                if (state) state.isTyping = false;
            });
            charAnimations.clear();
            charAnimationsByTarget.clear();
            releaseAnimationTicker();
        }

        getInfo() {
            return {
                id: 'g1nxIrisText',
                name: 'Iris Text',
                docsURI: 'https://hackmd.io/@Gen1x01/iris-text',
                color1: colorPrimary,
                color2: colorSecondary,
                color3: colorTertiary,
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
                                defaultValue: defaultText
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
                                defaultValue: handwritingId
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
                        opcode: 'setSmoothingForThisSprite',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'turn smoothing [ENABLED] for [SPRITE]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'on'
                            },
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'SPRITE',
                                defaultValue: '_myself_'
                            }
                        }
                    },
                    {
                        opcode: 'setOffscreenCulling',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'offscreen culling (experimental) [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'off'
                            }
                        }
                    },
                    {
                        opcode: 'setEmojiMode',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set emoji mode to [MODE]',
                        arguments: {
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EMOJI_MODE',
                                defaultValue: 'colored'
                            }
                        }
                    },
                    {
                        opcode: 'setGrowDownwardOnly',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'grow downward only [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'off'
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
                                defaultValue: defaultText
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
                                defaultValue: defaultText
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
                    {
                        opcode: 'isTyping',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is typing?'
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
                        opcode: 'setAllTypingSpeeds',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set typing speed for all categories to [SECONDS] seconds',
                        arguments: {
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
                        opcode: 'setBackgroundBorder',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set background border color to [COLOR] size to [SIZE]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            },
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },
                    {
                        opcode: 'setBackgroundBorderColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set background border color to [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: 'setBackgroundBorderSize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set background border size to [SIZE]',
                        arguments: {
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },
                    {
                        opcode: 'setBackgroundBorderRoundness',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set background border roundness to [ROUNDNESS] %',
                        arguments: {
                            ROUNDNESS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
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
                        opcode: 'setLineHeight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set line height to [HEIGHT]',
                        arguments: {
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.2
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
                    '---',
                    {
                        opcode: 'repeatForCharInLine',
                        blockType: Scratch.BlockType.LOOP,
                        text: 'repeat for each character in line [CHAR] [LINE]',
                        branchCount: 1,
                        arguments: {
                            CHAR: {
                                type: Scratch.ArgumentType.STRING,
                                fillIn: 'currentCharIndex'
                            },
                            LINE: {
                                type: Scratch.ArgumentType.STRING,
                                fillIn: 'currentLineIndex'
                            }
                        }
                    },
                    {
                        opcode: 'currentLineIndex',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'line #',
                        canDragDuplicate: true,
                        hideFromPalette: true
                    },
                    '---',
                    {
                        opcode: 'repeatForEachWord',
                        blockType: Scratch.BlockType.LOOP,
                        text: 'repeat for each word in text [WORD] [CHAR]',
                        branchCount: 1,
                        arguments: {
                            WORD: {
                                type: Scratch.ArgumentType.STRING,
                                fillIn: 'currentWordIndex'
                            },
                            CHAR: {
                                type: Scratch.ArgumentType.STRING,
                                fillIn: 'currentCharIndex'
                            }
                        }
                    },
                    {
                        opcode: 'currentWordIndex',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'word #',
                        canDragDuplicate: true,
                        hideFromPalette: true
                    },
                    {
                        opcode: 'currentWordValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current word',
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
                    {
                        opcode: 'setCharEffect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set character [INDEX] [EFFECT] effect to [VALUE]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            EFFECT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EFFECT',
                                defaultValue: 'whirl'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'animateChar',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'animate character [INDEX] [PROPERTY] to [VALUE] over [SECS] secs easing [EASING] [DIRECTION]',
                        hideFromPalette: true,
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
                        opcode: 'animateCharNew',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'animate character [INDEX] [PROPERTY] to [VALUE] over [SECS] secs easing [EASING] [DIRECTION] and [WAIT]',
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
                            },
                            WAIT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'WAIT_MODE',
                                defaultValue: "don't wait"
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
                    {
                        opcode: 'onCharAnimationFinished',
                        blockType: Scratch.BlockType.EVENT,
                        isEdgeActivated: false,
                        shouldRestartExistingThreads: false,
                        text: 'when a character animation finishes'
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
                        text: 'Performance'
                    },
                    {
                        opcode: 'setPerformanceEnabled',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'performance report [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'off'
                            }
                        }
                    },
                    {
                        opcode: 'resetPerformance',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset performance stats'
                    },
                    {
                        opcode: 'getPerformanceReport',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'performance report'
                    },
                    {
                        opcode: 'setGlyphWorkerEnabledBlock',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'glyph worker [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ONOFF',
                                defaultValue: 'on'
                            }
                        }
                    },
                    {
                        opcode: 'getGlyphWorkerStatusBlock',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'glyph worker status'
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
                        opcode: 'getCharDimension',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'character [INDEX] [DIMENSION]',
                        disableMonitor: true,
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            DIMENSION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'DIMENSION',
                                defaultValue: 'width'
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
                        opcode: 'getExactTextWidth',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'text width',
                        disableMonitor: true
                    },
                    {
                        opcode: 'getExactTextHeight',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'text height',
                        disableMonitor: true
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
                        opcode: 'gradientMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'gradient [TEXT] with colors [COLORS] as [TYPE] at angle [ANGLE]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'sunset'
                            },
                            COLORS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#ff7e5f,#feb47b'
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'GRADIENT_TYPE',
                                defaultValue: gradientTypeLinear
                            },
                            ANGLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'shadowMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'shadow [TEXT] with color [COLOR] opacity [OPACITY] % blur [BLUR] offset x [OFFSET_X] y [OFFSET_Y]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'dramatic'
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            },
                            OPACITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            },
                            BLUR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 8
                            },
                            OFFSET_X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            OFFSET_Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'borderMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'border [TEXT] with color [COLOR] opacity [OPACITY] % size [SIZE]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'outlined'
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            },
                            OPACITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },
                    {
                        opcode: 'perspectiveMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'perspective [TEXT] to x [X] y [Y] rotation [ROTATION] scale [SCALE] %',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'PERSPECTIVE'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            ROTATION: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 45
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
                        opcode: 'blurMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'blur [TEXT] by [INTENSITY] %',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'hazy'
                            },
                            INTENSITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            }
                        }
                    },
                    {
                        opcode: 'layerMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'layer [TEXT] on layer [LAYER]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'on top'
                            },
                            LAYER: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'effectMarkup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'apply [EFFECT] effect [VALUE] to [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'twisted'
                            },
                            EFFECT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EFFECT',
                                defaultValue: 'whirl'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
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
                                defaultValue: handwritingId
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
                    EMOJI_MODE: {
                        items: ['colored', 'native']
                    },
                    ALIGN: {
                        items: ['left', 'center', 'right', 'justify']
                    },
                    STYLE: {
                        items: ['bold', 'italic', 'underline', 'strikethrough']
                    },
                    GRADIENT_TYPE: {
                        items: [gradientTypeLinear, gradientTypeRadial, gradientTypeConic]
                    },
                    TYPING_GROUP: {
                        items: ['default', 'symbols', 'punctuation', 'numbers']
                    },
                    FONT: {
                        items: 'getFontMenuItems',
                        isTypeable: true,
                        acceptText: true // for my 3 nitrobolt users :P
                    },
                    SPRITE: {
                        items: 'getSpriteMenuItems'
                    },
                    MASK_COSTUME: {
                        items: 'getMaskCostumeMenuItems'
                    },
                    WIPE_DIRECTION: {
                        items: [wipeDirectionBottomUp, wipeDirectionLeftRight, wipeDirectionUpDown, wipeDirectionRightLeft]
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
                    },
                    WAIT_MODE: {
                        items: ['wait', "don't wait"]
                    },
                    DIMENSION: {
                        items: ['width', 'height']
                    },
                    EFFECT: {
                        items: effectNames
                    }
                }
            };
        }

        setPerformanceEnabled(args, util) {
            this.setPerfEnabled(args.ENABLED === 'on');
        }

        resetPerformance(args, util) {
            this.resetPerf();
        }

        getPerformanceReport(args, util) {
            return JSON.stringify(this.getPerfReport());
        }

        setGlyphWorkerEnabledBlock(args, util) {
            this.setGlyphWorkerEnabled(args.ENABLED === 'on');
        }

        getGlyphWorkerStatusBlock(args, util) {
            return JSON.stringify(this.getGlyphWorkerStatus());
        }

        setText(args, util) {
            const state = getState(util.target);
            const frame = util.stackFrame;

            if (frame.irisStages === undefined) {
                const text = Scratch.Cast.toString(args.TEXT);
                state.finalText = stripMarkup(text);
                state.visible = true;
                if (state.resetCharTransformsOnText) resetCharacterTransformsState(state);
                clearTypingBox(state);
                frame.irisStages = splitWaitStages(text);
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
            state.isTyping = false;
            clearTypingBox(state);
            state.rawText = existingText + linePrefix + text;
            state.finalText = stripMarkup(state.rawText);
            state.visible = true;
            state.paintDirty = true;
            state.paintFingerprint = null;
            scheduleTextRender(util.target);
        }

        _typeText(args, util, appendLine) {
            const state = getState(util.target);
            const frame = util.stackFrame;

            if (frame.irisTypingSteps === undefined) {
                const text = Scratch.Cast.toString(args.TEXT);
                const existingText = appendLine && state.visible ? state.rawText : '';
                const linePrefix = appendLine && existingText ? '\n' : '';
                state.rawText = existingText + linePrefix;
                state.typingFullRaw = state.rawText + text;
                state.finalText = stripMarkup(state.typingFullRaw);
                state.visible = true;
                if (state.resetCharTransformsOnText) resetCharacterTransformsState(state);
                state.revealToken++;
                state.typingControl = null;
                state.typingBoxKey = null;
                frame.irisTypingSteps = splitTypingSteps(text);
                frame.irisTypingStepIndex = 0;
                frame.irisTypingCharIndex = stripMarkup(existingText + linePrefix).length;
                frame.irisTypedText = state.rawText;
                frame.irisTypingToken = state.revealToken;
                frame.irisTypingWaitUntil = null;
                state.isTyping = true;
            }

            if (state.revealToken !== frame.irisTypingToken) return;

            if (state.typingControl === 'stop') {
                state.typingControl = null;
                state.finalText = stripMarkup(state.rawText);
                clearTypingBox(state);
                schedulePaint(util.target, state);
                state.isTyping = false;
                return;
            }

            if (state.typingControl === 'skip') {
                while (frame.irisTypingStepIndex < frame.irisTypingSteps.length) {
                    frame.irisTypedText += frame.irisTypingSteps[frame.irisTypingStepIndex++].content;
                }
                state.rawText = frame.irisTypedText;
                state.typingControl = null;
                clearTypingBox(state);
                schedulePaint(util.target, state);
                state.isTyping = false;
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
                if (step.wait !== undefined) {
                    if (step.wait > 0) {
                        frame.irisTypingWaitUntil = Date.now() + step.wait * 1000;
                        util.yieldTick();
                        return;
                    }
                    continue;
                }
                frame.irisTypedText += step.content;
                if (step.char === null) continue;

                state.rawText = frame.irisTypedText;
                schedulePaint(util.target, state);
                startTypingCharacterHat(util.target, step.char, frame.irisTypingCharIndex++);

                const delay = Math.max(0, Scratch.Cast.toNumber(typingDelayForCharacter(state, step.char)));
                if (delay > 0) {
                    frame.irisTypingWaitUntil = Date.now() + delay * 1000;
                    util.yieldTick();
                    return;
                }
            }

            state.rawText = frame.irisTypedText;
            clearTypingBox(state);
            schedulePaint(util.target, state);
            state.isTyping = false;
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

        isTyping(args, util) {
            return !!getState(util.target).isTyping;
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
            const font = requested === randomId ?
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
            const align = Scratch.Cast.toString(args.ALIGN).toLowerCase();
            if (align !== 'left' && align !== 'center' && align !== 'right' && align !== 'justify') return;
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

        setSmoothingForThisSprite(args, util) {
            const sprite = Scratch.Cast.toString(args.SPRITE);
            const target = sprite === '_myself_' ?
                util.target :
                runtime.getSpriteTargetByName(sprite);
            if (!target) return;
            const state = getState(target);
            const smoothing = Scratch.Cast.toString(args.ENABLED).toLowerCase() === 'on';
            if (state.smoothing === smoothing) return;
            state.smoothing = smoothing;
            schedulePaint(target, state);
        }

        setOffscreenCulling(args, util) {
            const state = getState(util.target);
            const enabled = Scratch.Cast.toString(args.ENABLED).toLowerCase() === 'on';
            if (state.cullOffscreen === enabled) return;
            state.cullOffscreen = enabled;
            state.cullRegion = null;
            if (enabled) ensurePreDrawHook();
            schedulePaint(util.target, state);
        }

        setEmojiMode(args, util) {
            const state = getState(util.target);
            const mode = Scratch.Cast.toString(args.MODE).toLowerCase() === 'native' ? 2 : 1;
            if (state.emojiMode === mode) return;
            state.emojiMode = mode;
            schedulePaint(util.target, state);
        }

        setGrowDownwardOnly(args, util) {
            const state = getState(util.target);
            const growDownwardOnly = Scratch.Cast.toString(args.ENABLED).toLowerCase() === 'on';
            if (state.growDownwardOnly === growDownwardOnly) return;
            state.growDownwardOnly = growDownwardOnly;
            schedulePaint(util.target, state);
        }

        setTypingSpeed(args, util) {
            const state = getState(util.target);
            const group = Scratch.Cast.toString(args.GROUP);
            if (!_hasOwn.call(state.typingSpeeds, group)) return;
            state.typingSpeeds[group] = Math.max(0, Scratch.Cast.toNumber(args.SECONDS));
        }

        setAllTypingSpeeds(args, util) {
            const state = getState(util.target);
            const seconds = Math.max(0, Scratch.Cast.toNumber(args.SECONDS));
            for (const group in state.typingSpeeds) {
                if (_hasOwn.call(state.typingSpeeds, group)) {
                    state.typingSpeeds[group] = seconds;
                }
            }
        }

        setCustomTypingSpeed(args, util) {
            const state = getState(util.target);
            const delay = Math.max(0, Scratch.Cast.toNumber(args.SECONDS));
            for (const char of splitGraphemes(Scratch.Cast.toString(args.CHARS))) {
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

        setLineHeight(args, util) {
            const state = getState(util.target);
            const lineHeight = Math.max(0, Scratch.Cast.toNumber(args.HEIGHT));
            if (state.lineSpacing === lineHeight) return;
            state.lineSpacing = lineHeight;
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
            state.textShadow.opacity = clampPercent(Scratch.Cast.toNumber(args.PCT));
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
            state.textBackground.opacity = clampPercent(Scratch.Cast.toNumber(args.PCT));
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
            state.textBorder.opacity = clampPercent(Scratch.Cast.toNumber(args.PCT));
            schedulePaint(util.target, state);
        }

        setTextBorderSize(args, util) {
            const state = getState(util.target);
            state.textBorder.size = Math.max(0, Scratch.Cast.toNumber(args.SIZE));
            schedulePaint(util.target, state);
        }

        setBackgroundBorder(args, util) {
            const state = getState(util.target);
            const color = Scratch.Cast.toString(args.COLOR);
            const size = Math.max(0, Scratch.Cast.toNumber(args.SIZE));
            state.textBackgroundBorder.color = color;
            state.textBackgroundBorder.size = size;
            schedulePaint(util.target, state);
        }

        setBackgroundBorderColor(args, util) {
            const state = getState(util.target);
            state.textBackgroundBorder.color = Scratch.Cast.toString(args.COLOR);
            schedulePaint(util.target, state);
        }

        setBackgroundBorderSize(args, util) {
            const state = getState(util.target);
            state.textBackgroundBorder.size = Math.max(0, Scratch.Cast.toNumber(args.SIZE));
            schedulePaint(util.target, state);
        }

        setBackgroundBorderRoundness(args, util) {
            const state = getState(util.target);
            state.textBackgroundBorder.roundness = clampPercent(Scratch.Cast.toNumber(args.ROUNDNESS));
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

        repeatForCharInLine(args, util) {
            const frame = util.stackFrame;
            const rootFrame = util.thread.stackFrames[0];
            let loop = frame.irisCharInLineLoop;

            if (!loop) {
                loop = {
                    entries: charLineIndices(util.target),
                    position: 0
                };
                frame.irisCharInLineLoop = loop;
                rootFrame.irisTagCharacterNumber = 0;
                rootFrame.irisLineNumber = 0;
            }

            if (loop.position >= loop.entries.length) return;
            const entry = loop.entries[loop.position];
            rootFrame.irisTagCharacterNumber = entry.charIndex + 1;
            rootFrame.irisLineNumber = entry.line;
            loop.position++;
            util.startBranch(1, true);
        }

        currentLineIndex(args, util) {
            const rootFrame = util.thread && util.thread.stackFrames[0];
            return (rootFrame && rootFrame.irisLineNumber !== undefined) ? rootFrame.irisLineNumber : 0;
        }

        repeatForEachWord(args, util) {
            const frame = util.stackFrame;
            const rootFrame = util.thread.stackFrames[0];
            let loop = frame.irisEachWordLoop;

            if (!loop) {
                loop = {
                    words: wordSpans(util.target),
                    position: 0
                };
                frame.irisEachWordLoop = loop;
                rootFrame.irisWordNumber = 0;
                rootFrame.irisWordValue = '';
                rootFrame.irisTagCharacterNumber = 0;
            }

            if (loop.position >= loop.words.length) return;
            const word = loop.words[loop.position];
            rootFrame.irisWordNumber = loop.position + 1;
            rootFrame.irisWordValue = word.text;
            rootFrame.irisTagCharacterNumber = word.charIndex;
            loop.position++;
            util.startBranch(1, true);
        }

        currentWordIndex(args, util) {
            const rootFrame = util.thread && util.thread.stackFrames[0];
            return (rootFrame && rootFrame.irisWordNumber !== undefined) ? rootFrame.irisWordNumber : 0;
        }

        currentWordValue(args, util) {
            const rootFrame = util.thread && util.thread.stackFrames[0];
            return (rootFrame && rootFrame.irisWordValue !== undefined) ? rootFrame.irisWordValue : '';
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
            state.charTransformsVersion++;
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
            state.charTransformsVersion++;
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
            state.charTransformsVersion++;
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
            state.charTransformsVersion++;
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
            state.charTransformsVersion++;
            schedulePaint(util.target, state);
        }

        setCharOpacity(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const opacity = clampPercentToUnit(Scratch.Cast.toNumber(args.PCT));
            const exists = !!state.charOverrides[idx];
            const o = getCharOverride(state, idx);
            if (exists && o.opacity === opacity) return;
            o.opacity = opacity;
            state.charTransformsVersion++;
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
            state.charTransformsVersion++;
            schedulePaint(util.target, state);
        }

        clearCharColor(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const o = state.charOverrides[idx];
            if (!o || o.color === null) return;
            o.color = null;
            state.charTransformsVersion++;
            schedulePaint(util.target, state);
        }

        setCharEffect(args, util) {
            const state = getState(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const name = normalizeEffectName(args.EFFECT);
            if (!name) return;
            const amount = Scratch.Cast.toNumber(args.VALUE);
            if (!Number.isFinite(amount)) return;
            const effects = state.charEffects || (state.charEffects = {});
            const current = effects[idx];
            if (current && _hasOwn.call(current, name) && current[name] === amount) return;
            const next = Object.assign({}, current);
            next[name] = amount;
            effects[idx] = next;
            state.charTransformsVersion++;
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
            state.charTransformsVersion++;
            schedulePaint(util.target, state);
        }

        animateChar(args, util) {
            const target = util.target;
            const state = getState(target);

            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const property = Scratch.Cast.toString(args.PROPERTY).toLowerCase();
            const validProps = ['x', 'y', 'rotation', 'opacity', 'scale'];
            if (!validProps.includes(property)) return;
            let targetValue = Scratch.Cast.toNumber(args.VALUE);
            if (property === 'opacity') targetValue = clampPercentToUnit(targetValue);
            if (property === 'scale') targetValue = Math.max(0, targetValue) / 100;
            const duration = Math.max(0, Scratch.Cast.toNumber(args.SECS));
            const easingName = Scratch.Cast.toString(args.EASING).toLowerCase();
            const easing = Object.prototype.hasOwnProperty.call(EasingMethods, easingName) ? easingName : 'linear';
            const direction = Scratch.Cast.toString(args.DIRECTION).toLowerCase();
            const o = getCharOverride(state, idx);

            const key = target.id + '\u0001' + idx + '\u0001' + property;
            if (duration <= 0) {
                deleteCharAnimation(target.id, key);
                o[property] = targetValue;
                state.charTransformsVersion++;
                schedulePaint(target, state);
                startCharAnimationFinishedHat(target);
                return;
            }

            const token = charAnimTokenSeq++;
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
                duration: duration * 1000,
                token
            });
            ensureAnimationTicker();
        }

        animateCharNew(args, util) {
            const target = util.target;
            const state = getState(target);
            const frame = util.stackFrame;

            if (frame.irisAnimKey === undefined) {
                const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
                const property = Scratch.Cast.toString(args.PROPERTY).toLowerCase();
                const validProps = ['x', 'y', 'rotation', 'opacity', 'scale'];
                if (!validProps.includes(property)) {
                    frame.irisAnimKey = null;
                    return;
                }
                let targetValue = Scratch.Cast.toNumber(args.VALUE);
                if (property === 'opacity') targetValue = clampPercentToUnit(targetValue);
                if (property === 'scale') targetValue = Math.max(0, targetValue) / 100;
                const duration = Math.max(0, Scratch.Cast.toNumber(args.SECS));
                const easingName = Scratch.Cast.toString(args.EASING).toLowerCase();
                const easing = Object.prototype.hasOwnProperty.call(EasingMethods, easingName) ? easingName : 'linear';
                const direction = Scratch.Cast.toString(args.DIRECTION).toLowerCase();
                const shouldWait = Scratch.Cast.toString(args.WAIT).toLowerCase() !== "don't wait";
                const o = getCharOverride(state, idx);

                const key = target.id + '\u0001' + idx + '\u0001' + property;
                if (duration <= 0) {
                    deleteCharAnimation(target.id, key);
                    o[property] = targetValue;
                    state.charTransformsVersion++;
                    schedulePaint(target, state);
                    startCharAnimationFinishedHat(target);
                    frame.irisAnimKey = null;
                    return;
                }

                const token = charAnimTokenSeq++;
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
                    duration: duration * 1000,
                    token
                });
                ensureAnimationTicker();

                if (!shouldWait) {
                    frame.irisAnimKey = null;
                    return;
                }

                frame.irisAnimKey = key;
                frame.irisAnimToken = token;
            }

            if (frame.irisAnimKey === null) return;

            const current = charAnimations.get(frame.irisAnimKey);
            if (current && current.token === frame.irisAnimToken) {
                util.yieldTick();
                return;
            }
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
            const hasEffects = !!state.charEffects && !!state.charEffects[idx];
            if (state.charOverrides[idx] || hasEffects) {
                delete state.charOverrides[idx];
                if (hasEffects) delete state.charEffects[idx];
                state.charOverridesVersion++;
                state.charTransformsVersion++;
                schedulePaint(util.target, state);
            }
        }

        resetAllCharTransforms(args, util) {
            const state = getState(util.target);
            const target = util.target;
            clearCharAnimationsForTarget(target.id);
            const hasEffects = !!state.charEffects && Object.keys(state.charEffects).length > 0;
            if (Object.keys(state.charOverrides).length || hasEffects) {
                state.charOverrides = {};
                state.charEffects = {};
                state.charOverridesVersion++;
                state.charTransformsVersion++;
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
                    paintNeeded = true;
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
                    direction: existing ? existing.direction : wipeDirectionBottomUp,
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
            const direction = Scratch.Cast.toString(args.DIRECTION) || wipeDirectionBottomUp;
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
            const seamless = Scratch.Cast.toString(args.SEAMLESS).toLowerCase() === 'on';
            let changed = false;
            for (let idx = start; idx <= end; idx++) {
                const existing = state.charMasks[idx];
                if (!existing || existing.seamless === seamless) continue;
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

        getCharDimension(args, util) {
            const state = getState(util.target);
            flushRenderIfDirty(util.target);
            const idx = Scratch.Cast.toNumber(args.INDEX) - 1;
            const box = state.charBoxes[idx];
            if (!box) return 0;
            const dimension = Scratch.Cast.toString(args.DIMENSION).toLowerCase();
            return dimension === 'height' ? box.height : box.width;
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

        getExactTextWidth(args, util) {
            const target = util && util.target ? util.target : runtime.getEditingTarget && runtime.getEditingTarget();
            if (!target) return 0;
            flushRenderIfDirty(target);
            return getExactTextDimensionsForTarget(target).width;
        }

        getExactTextHeight(args, util) {
            const target = util && util.target ? util.target : runtime.getEditingTarget && runtime.getEditingTarget();
            if (!target) return 0;
            flushRenderIfDirty(target);
            return getExactTextDimensionsForTarget(target).height;
        }

        colorMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const color = Scratch.Cast.toString(args.COLOR);
            return `[color=${color}]${text}[/color]`;
        }

        gradientMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const colors = Scratch.Cast.toString(args.COLORS)
                .split(',')
                .map(c => c.trim())
                .filter(c => c.length > 0);
            if (colors.length < 2) return text;
            const angle = Scratch.Cast.toNumber(args.ANGLE);
            const type = normalizeGradientType(args.TYPE);
            return `[gradient=${colors.join(',')}|${angle}|${type}]${text}[/gradient]`;
        }

        shadowMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const color = Scratch.Cast.toString(args.COLOR);
            const opacity = clampPercent(Scratch.Cast.toNumber(args.OPACITY));
            const blur = Math.max(0, Scratch.Cast.toNumber(args.BLUR));
            const offsetX = Scratch.Cast.toNumber(args.OFFSET_X);
            const offsetY = Scratch.Cast.toNumber(args.OFFSET_Y);
            return `[shadow=${color}|${opacity}|${blur}|${offsetX}|${offsetY}]${text}[/shadow]`;
        }

        borderMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const color = Scratch.Cast.toString(args.COLOR);
            const opacity = clampPercent(Scratch.Cast.toNumber(args.OPACITY));
            const size = Math.max(0, Scratch.Cast.toNumber(args.SIZE));
            return `[border=${color}|${opacity}|${size}]${text}[/border]`;
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

        blurMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const intensity = Math.min(100, Math.max(0, Scratch.Cast.toNumber(args.INTENSITY)));
            return `[blur=${intensity}]${text}[/blur]`;
        }

        effectMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const name = normalizeEffectName(args.EFFECT);
            const amount = Scratch.Cast.toNumber(args.VALUE);
            if (!name || !Number.isFinite(amount) || amount === 0) return text;
            return `[effect=${name}|${amount}]${text}[/effect]`;
        }

        layerMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const layer = parseLayerValue(Scratch.Cast.toNumber(args.LAYER), 0);
            return `[layer=${layer}]${text}[/layer]`;
        }

        perspectiveMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);
            const rotation = Scratch.Cast.toNumber(args.ROTATION);
            const scale = Scratch.Cast.toNumber(args.SCALE);
            return `[perspective=${x}|${y}|${rotation}|${scale}]${text}[/perspective]`;
        }

        fontMarkup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const requested = Scratch.Cast.toString(args.FONT);
            const font = requested === randomId ? randomFontOtherThan(randomId) : requested;
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
