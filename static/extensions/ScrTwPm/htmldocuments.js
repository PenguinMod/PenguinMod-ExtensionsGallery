(function (Scratch) {
    'use strict';

    const dom = new DOMParser()
    const toAString = new XMLSerializer()

    class HTMLDocuments {
        constructor(runtime) {
            this.pages = new Map()
            this.changePx = [
                "block-size",
                "border-block-end-width",
                "border-block-start-width",
                "border-block-width",
                "border-bottom-left-radius",
                "border-bottom-right-radius",
                "border-bottom-width",
                "border-image-outset",
                "border-image-width",
                "border-inline-end-width",
                "border-inline-start-width",
                "border-inline-width",
                "border-left-width",
                "border-right-width",
                "border-spacing",
                "border-top-left-radius",
                "border-top-right-radius",
                "border-top-width",
                "border-width",
                "bottom",
                "column-gap",
                "column-rule-width",
                "column-width",
                "contain-intrinsic-block-size",
                "contain-intrinsic-height",
                "contain-intrinsic-inline-size",
                "contain-intrinsic-size",
                "contain-intrinsic-width",
                "cx",
                "cy",
                "font-size",
                "gap",
                "grid-auto-columns",
                "grid-auto-rows",
                "grid-template-columns",
                "grid-template-rows",
                "height",
                "inline-size",
                "left",
                "letter-spacing",
                "margin-block-end",
                "margin-block-start",
                "margin-block",
                "margin-bottom",
                "margin-inline-end",
                "margin-inline-start",
                "margin-inline",
                "margin-left",
                "margin-right",
                "margin-top",
                "max-block-size",
                "max-height",
                "max-inline-size",
                "max-width",
                "min-block-size",
                "min-height",
                "min-inline-size",
                "min-width",
                "object-position",
                "offset-distance",
                "offset-path",
                "outline-offset",
                "outline-width",
                "padding-block-end",
                "padding-block-start",
                "padding-block",
                "padding-bottom",
                "padding-inline-end",
                "padding-inline-start",
                "padding-inline",
                "padding-left",
                "padding-right",
                "padding-top",
                "perspective",
                "perspective-origin",
                "r",
                "right",
                "row-gap",
                "rx",
                "ry",
                "scroll-margin-bottom",
                "scroll-margin-left",
                "scroll-margin-right",
                "scroll-margin-top",
                "scroll-padding-bottom",
                "scroll-padding-left",
                "scroll-padding-right",
                "scroll-padding-top",
                "shape-margin",
                "tab-size",
                "text-decoration-thickness",
                "text-indent",
                "top",
                "transform-origin",
                "translate",
                "width",
                "word-spacing",
                "x",
                "y"
            ]
            this.viewing = []
            this.runtime = runtime
        }
        getInfo() {
            return {
                id: 'scrtwpmhtmldocuments',
                name: 'HTML documents',
                color1: '#ff9900',
                menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXYAAAF2CAYAAAB6XrNlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAE/3SURBVHhe7d15nCR5Xef/1/f7jfhGRuRRWdU93TM99/QcPTPMDMzADOJwLnKJB4qIK4iAIIIo64K76nrBHiKuJ7rrAaLo6nrg7ro/RRCVlduBgbnv7rn6PqoqK4+IjPh+f39k5kyRdA/T3ZWREVHf5+ORD5iM7Oquqsx3fvP7/Xw/X2GtxXEcx6kOOX2H4ziOU24u2B3HcSrGBbvjOE7FuGB3HMepGBfsjuM4FeOC3XEcp2JcsDuO41SMC3bHcZyKccHuOI5TMS7YHcdxKsYFu+M4TsW4YHccx6kYF+yO4zgVI+bZ3dGsLmP6vem7HcdxKkm22sgwmr57w80v2NOEzl99mM6f/OKF5uieNwpPvRgIgYPAXqAPCCAFVoFDwBFgOH7cwnFuEeABFjDjmx1/nembBNQJPrVMHsP4z0++np36c5P7s/Ht6/2dk685+brHu2/yNdf/9/qvPbkd7+9c/9+T6+sfN/l603/f5Drj780b/y/rvtbxvqf11n/dicljJj9vjvP3T77+5N+3/nuf/H8x/vdM/k2Tv1+u+7rrfw6Ta5PvZfI4OfXvXv84te7a5O+evk3/vCdfY/J8ON5z6UTW/3uO9zOdvn/9YydO9O883r95+vkx+XdP/u3rv+60yfNk/XNg8mcm/4bJ9cnjp39O603+rvU/w8nvYfL/j/f9yvHvUwP+1O9s/deZfG/rv6/pn9X6/5782fV/3gAx0BvnzzFgbZw/k5/rEBiM/38ANMfZlI3vV8CZwLk2Tox36Y3/1P7Bn/2b2nXP3ofyjvdz2TDzC3Zg7e/+Iuz8ya/8sDnwyNtR+tzp647jOFVghz30Fc/sL7zxJ383eMp1vwrsnn7MRjqZEcaGy5TeZqU6GyFCpMTd3M3d3K2SNyFIPR0apc4Fzhh/8piZuQa7rtet0sH8PjI4juPkQCiNbi6gdFAbT9vMNHtn+sW/Lj9YFUF0FOkl05ccx3GqRPga4Xkr4zn7dPr6RpprsMuoviZq9VUQKXOc63ccx5kZa0EoZL2F0EFvvCA7WbSdibkGuwijVOjaECGy6WuO4zhVIsK6EX4wqTCbqbkGu1cLkL4XA8ms38Ecx3HmRfg11OIZAxGG3VlPwzDvYKfeRkTtw0J6R8e1n47jOJUkfH0E6T063qMzU3MNdhlFiIX2HqvkI1gznL7uOI5TeiaFWoBcWNgrtb4P6Ew/ZKPNNdgBZK3+qPSDA3l8PHEcx5kHEdQRXrAy3lk/mL6+0eYe7KLW6CBFF5O6qRjHcSrHZgkiqCF0MBy3KZj5euJ8g93TiNbCkCBI8lgpdhzHmQcZNayIWnbWPWIm5hvsgGotGlVTFtJcvmHHcZw8CWLkQhMRRjMfqU/MPdjxA2xmsW4mxnGcCrJxAkJZ4Xnru0nO1NyDXUZ1hA6m73Ycx6kMGdVToYNJi9+Zm3uwj52ob7PjOE4VDNf1c5+5uQe7v7iIjKIUa4zrF+M4TqVYCxb89lJfhvUjeWxOogjBbnUEnl4dN8Zxye44TuXYIOzh+wc3TbALXyOjcJ/wvGUX7I7jVI0IfLylrX1ZizbPiF222oha9Oj4TEHHcZzq8XWC8lbHDQ9nbu7BDoBeOoxXX3UjdsdxKkcvgVefHHC9iapigvoKUvWwuZR4Oo7j5MOkiEYLgigbV8TkEnKFCHa1tK0r683Yjdgdx6kSmyXIsIkMIjserW+eYJdRsy/UcIiZedMzx3Gc3AhiRBRadM3mOXAtRLCrLdsMfs24tgKO41SJjRPUwhKy0cwt1AGELcCmoPiOm1n5zXf9RnLv7W8StZbrL+DMlBcIvEAgxPQVZ7OwxjIcWLIZ7wO1nf1EL3udab3mnZ/yzjrvp4BPTT9mFgoR7Mnuu1n5tX/znviOm98maq3F6euOs5G8QBA0BNJ3yb5ZmcQyWLNkyWzzz3b2U//OtyatV7/jo2rr9vcAN00/ZhYKMRXj1QJUI9ojlDzi2go4jlMJ1iK0j1ePYuF5DwHL0w+ZlUIEu9URNthyJ7K2b/qa4zhOaeklqG/t4/v3AUemL89KIYIdgKj9MJ4+6mrZHcepBJOCDsELhsAhoDv9kFkpRLALXyOi1lF8nds37jiOM2siqCPCpkF6vbxa9lKUYJdRhNdeHAglhph0+rLjOM6GMnbcUneGbJYga4H12otWap3rmROFCHZGm5QyoWtuHsZxnMoQUZPx5qRcFSbY8X1Qavpex3Gc0hK+j1Aqzav510Rhgj3zNFa6YHccZ/bSHDYnAaSexkiV6/w6hQl25aEbLZQOLNbaWc99OY7jzJS1YC26Xrcqqh9Cqs70Q2apGMEOoANEECVIz62eOo5TekJphlHLZH6wJ88adgoT7EIiowZCB2tAPH3ZcRynjML2ktX15kMIcXT62iwVI9gBEUaIIDqMkGvT1xzHcUpH+SCVHW9OyjXXChPsXi1ARc1HhfLd2aeO48xMGltMOvt1POEFeGEd4Xn9vM46nShMsANY5T1kpcr1I4vjOM6GMynUAtDa5nkk3kRhgt3qCOrtfSi54vrFOI5TekJja02D78/+48GUwgS78DWqudCROnDn4zmOU3oyqiOj5hDp5bo5iSIFu4wiZNSMscb1i3Ecp9RsloCSqGazJ7XOdX6dIgU7gNDa4nkm7/kox3E2j7x2ncqogQgbR5Aq14oYChXsniarL2B9HefdV8FxHGejpZ7GeP4jCJF7pV9xgh3Q9bpRbpOS4zgVoOt1lA52A4enr81aoYIdP8hEEB0dN6V3HMcpJaE0IogQnvcIsLlH7EOlskzpfSBWXSMwx3FKyVqQHrKxgNDB0TyPxJsoVLDX2kupX28+OI85Kcdxqs8kFpPTCp4IIyv8oJ93y16KFuxAJrzggJBeri0uHcdxNtK6dgLTl3JRqGBXrUUrwzD3vgqO42wOeZx1yqg9CjZspPj+XEq3CxXsAEb5xmKtayvgOE4pmZRxfq0Bc9lJX6hgF75GtbdaWYtSt0nJcZyyks02stE+gPRWp6/loVDBPmorUE9Ras1NxziOU1bC06hma7fUOvcadooW7AAyaiYoeQST9qevOY7jnI482gnYLEHUQtC1h4G5tCEvVrArD4LaAKX2533iiOM4zkYRvo8IwqMoL/cadgoX7EKSeUEyPmzDjdgdx9kwedawp57GKNWd15RysYId0O2loRd5q5DO5QfiOI5zOgQxQbuFF9VjYC49yAsX7EBm42HXppkLdsdxSsfGCUIHCB1k86ruK1ywy6ieCh1057EN13EcZyOIsI7wAwvMfjfUcRQu2P3FReOpKBGp68nuOE75iBg8FVjheXMJdYoY7NTbEERze6dzHMc5bfUFQxDOLcOEzaFvwsk69jNveE7vU3/7n2m0vnH6WilZC9lwss3YmTOvrgkii1TuQ2EhKA1STd+74UxiGaxZsmTGmXd4P4s//qtx9O2vfyfwgXlU+BU12J/d+9Tf/icarRsBMX29VMY/X9FchFo0fdWZAx366IZAquI99zcbmwyxvRVIZ99SJY0tyZqZ+QalcbCvRN/++h8HPuyCfezY+37kWb1/+N/vxguehxCzfyufJWshqKNe+lrUjS9B1BvTj3BypusNorCGV+4hQ/kpj/Sem4k/8ktke26Z+ag9l2C3Fpt0WfyxX3qo/uLv+UngL+fRCKyQwb78wfde2/2/H/5pksGLkSqcvl4q1iK8APWy70O+6JWI5gIYNyUzT1proijCm1OvbOdx6Z1fYPDn78E8eDuo2vTlDZVLsGdDRGuJ9tv+4+ejG1/yc8An5lHhV7zFU0C1t3dkUNuHSStx9qkdDmDQRSSxC3XHWccmMaRz2cMzEzZLkK0tyKi1G9jn6tjXMa2lozZUD0FajX4xJsX0V7EmBVnIH7njzIXtr2GH8fTdM5FHAzBBjG21sGF0YNwAbC4r9IVMGd1e6iilD9g0y33RYcMJAWYNTO7TbI5TfHEXcgr2PNg4wW+08KL6YB5TMBOFDHYZ1YdCB/15vdvNgj/ooYauS4LjrGdXDkASg/CnL22oPBuAyahuhQ7munhZyGAXYWRlo2GEkiaP8wnzYFaOYdZW3Ry740xYg11bwcYV+TRrLUL7yGYrE36QzXOTZSGDHQDVtMjZrpLnxRJgeoPRyMRxnMfY3tHR5r0ZlzrmRjVB1jrA6jxnHAoZ7Kq1iGqfYYQXmHm+620UoTQ2HowqABzHGclSiA9C1pm+UloiaKCWztwvwnD/vHqxU9RgBzDKH1psjK3G3IVdPoztVaPIx3E2ih2AndsS4wYzKdQC8P19wF5gbiO5Qga78DUianXw9fI8V5Y3jPSw/QPYZHn6iuNsWtnKMqZfia0qjxMaoaOjSO/IvA7ZoKjBLqMIr714WOrgwDw/zmwYIaAzhE5/9PHTcRyy1WNYerMuiAHA2NHi5qzJqI7XXuxLrQfz2pxEUYMdQHjBEaw5iEnn9nFmo9m1VeygIhUAjnOaVDZAmvJ/IJ+wWQJKglLZeOF09u8kJ1DcYK/X1wiClXl+nNlINgBrktHv2u0+dRxMdxUbl38P4noyalih51/NV8yEUR6ZDgdWpn1I51YytOE6R2HQnb7XcTYlu3wAG1vyKGvOq51A5kmMH9h5l28WM9hHbQVSpfTQptnc5qk2mp+lqGoU+TjOabNxUq0GYKN2AtaL6nMv0y5msAuJjBpG6KAyKSgCzXBtlbTnRuyOA8BwAKiZtxPIk4zqRtTCDCFcsB+PCCOEr+283/k2iiVA9mNkhRoeOc4pSxMYdsCUv+htPRHWh8IPknlWxFDkYGc0yjVCSZtHmVIebK/jdp86zkQygHTGE995NQAb94kRnoqB7ryLPgob7F4tQEZnGFQ017KhjSKUHm2idYdtOA7ZyjLZygo2m3Xi5shfREWLfeF5K/PeWFnYYAeg1hji19IqBDuMD+4d9NwmJccBbNIBa2beAExqMeu/YqTWAL+2Ahyaxzmn6xU22K2OoN7uomQfayoR7NgEs3rMbVJyNj2R9BA5TMMwPuvUpDOOEJMidAiN9gq+f9AF+wkIX6OaCwekDg7Pe75qQ0gPBjFiOASl3CYlZ1NLBzFm0GP2k9/5sFmCrAXIqLmG9I7NuxVKYdNFRhGqveV+lHwIk9Nb+4zZNMYOum4qxtn0VDZA5NROII/NSQAiaqLaS8Nxn5i5vmMVNtgB8P39KHV43j+kDWNtRVYLHOf0VLGdgPB9hFKFKNEubrCP2gokVqrhvGtCN4QQYDOCuIOXzvVTmuPkbRJ2jwWe7a9V6hBrgNTTtgjtBCh0sAM6quOFTYP05v4OuCGkh+n3sf2eK3l0Ni9rYNCB6jRuRSiNbi5YFRTj1LdCBzs6AF0bgsgqsUnJpNjE9WR3KuVrRuNPho2H2GE1ZlixFoRC6NAI5Q2LMHVc3GAf9YtBBLVVhKjMZNywu0YaV2ek4mxqJxPmj78BZCkkXchp8TQPwq+hmu2hqIWrCDH3udbiBvu4X4wMW4eE9Don+SQqLNnvuX4xThUc7/V4vPu+hun1MP2VXPrE5NJOYEyEUU/4wUFg7uf9FTrYxw4Cq9N3ltYwdlMxTpUdL9zF+GYBa4cJ9Ndy6ROTF6s8+n7YGUr1YBHyqtDBrlqLiMUth62vKzNit8PEtRVwyu7rvRaPd/2xqRiR9KztdXPpE5PXWadC+9RbzZ4O9AE3Yn8ypL8MtoetRhWJTRPIMrf71Km6J07TZC2XPjG5MCnggfSG486Oc/8oUuhkEb5GhtGaVF5lJqVt3CU7dsj1i3HKTEzf8SQ89mdsdwXbW6lMOwHGI3YZhAbpJa4q5uuQUYSM6gOUmvs74IaQ3qjEq+9KHp3Sm8ybn8jxrj1+nxmArcbLGkCGDVR70Uqtn/iTSk4KHex4GhFEyfgjTjXEXUR/FeGC3dmchB3Gwlbx+e8FoLzpe+ei2MEOCB2kwvOqMcEOkA0r9RHUccYmi6Pr/3uawBph40Fuh1jn0QDMZgkoZVHF2SFf+GDH940lM7NvqJwfM+hiXS27U26PVbmMezml41a1T9TbSZClwnZXR7PQFTrEOgvrWK0L0U6AMgS7ai0ia1EhflinTQisGaKHMWo4dP1inLJbH+523bz78ebfH78vXsulT0yem5N0vW6VDgrRTgBA2BxqPE9H/6ZP0fnQz7x/+MA9b8Kr6+nrZWOTLvKqZ+N919uQF+2avjx/SmH3P4p56D4YdKevVkIQBIT1AKmms8eZNTuMSe/6LNnt/4TtdWZa7mgSy2DNkiWzzTjb2U/0stcNW6955ye8s877OeDz04/JW+GDPb7jZlZ+813vTe69/YdErdWcvl42NumiL78B+d1vh4ufMn15/pRC3fI54j94N+kjexC11vQjys1adCTwG2qWmeIUQJ7BXv/Ot/Zar37Hn6mt298H3DH9mLwVfirGX1xERtERYG36WhkJpbGZhUFxSx5VewkZ1kf/Ye1oyqgqN2sxZrIl0XE2hmq1ExGGDwHL09fmofDBLs/YgWy2Hy3KD+x02SzBrh3DJsXdoBQLj1SMnxpCjHbIVun2NdO/jnN6VKudyFr0KLAyfW0eCh/sY7ux5nAePR9mTSiNNWbUVqCo/ACiRYTSufTZcJxZyKVPjLUI7SM8LxuHeiFGbMUPduUhFnY8ImoLx6YvlVWh2wpkGXgeIlwYbbhwHOeJ6SUIFgxSxUWpiil+sAOi0T6MrztVaQQGwDAp7Bw7AEF9VLFQpZ+542w0kyIaLUstmr4yV6UIdtlY7AvfG466qJWc9GAQI5LZHzJwqkSjhVjYAn7pq0sdZ6ZsliBbW5BRKxvX8hdC8YNdSGS9ZYWuFeaHdrrscIBZPlDoOnEV1RFKjFuSOo5zPIIYGdUQQdhDiNnvunqSih/sgNqyDVXXFirSVmB4DLK59+I/MV8jmosIXZu+4jilkUefGIDM0xilClW5V4pgBzDJMLZpkSelnyQhsMkQ0kKssTiOcxpsnOA3WtaL6ncDB6avz0s5gt0PkFHYEUoOZl6+lBO/30WZbFxXXTwmjLBujt0pqVz6xIxLHVVrwQodPAgcmX7IvBQzVabIqA66dQi8zvS1UgqaZCurmLW5n3l7fErhN5ooHYzqgCvyZuo4G80SIMKWFX6wDPSnr89LKYJdhBHCD/YU6R3xdNleB5sUZq3lq2UZQx2S+a6O3XGeiFB6VOkGcRHOOp0oRbCr1iKyteVBlK5EsAulMf0ONi5uVYwI64iwOXnSOo5zAqrVRoRhoT7WliLYha+RQeOQEKIam5Skh11bxXY7o8ZURaMUBGFhjvlynEIyKUJHeEtnmqKdGVGKYJdRhAh0b3xCSyXYzgEYFHSOnXHJY7SAcG0FnBLKpU8MYJWHlTIZnyBVGKUIdgCihcwGYaF2d50yIUYNBgveVsAqH4t1bQUc5wREUAc/6BSl+ddEaYJdtZaQvp9i0sqkjFlbLWYjsDHZbCML1gPDcYrCZgmy2USG0aGinRdRmmAXWhs8r1eklefTliSjDyAFrGUXzRay0cKSubYCjnMcj7UTCBsPINWh6evzVLxEOR7lkdVbmTHJEZsWuJTkJPnLB1G9ApbmZxkYg4iarq2AU0p5tBOwcYKMmogwuhvYP319nsoR7EKi21uGXlR/CKhMX3aSuLhz7L5G1MJRhYzjOMenA4SvH0GIQuVSOYJ9tPt0KHSwu0rBnvS6pHFBNykBmedj3YnPjnNCMqojdFC4ir3SBLsIo0w2GkeEp6oxFRM08ZDImTe0OHV+VMdzm5ScksmlTwwgAo1stqzwA1O0ar3SBLtXC6zw632sGuZRn5oH01uDoh5qrdRoKkbXAJFLTbDjlIa1IBuocMEKzyvci6M0wQ4go6VM6Holyh2F0th4gF1dHtWzF02WkSAxuo5Q/vRVx9n0RNBAeMGwKOecrleaYLc6wjYWsEpWZsOMjbvYtLhz7CKsI7Rr3es4X8OkUAuwjYUevl+4kVlpgl34GvwQpLJFm886VTYZYot64IZS0FjAhE23gOqUSl7tBGR9EdlYPIr0CrfuV5pgZ9Tl0UrfzzAVOCJPepD0scuHCr371HGcr2WzBJREKPVIESv1ShPsMopQjabB8+KiNdw5JUJghz1Ik9HouIC7T6NGRLh1G1Lrykx/OdWXx+YkAOEHyObCw1JrF+ynxfcTlFoeN7Wvhm4HUdDKmL7wGPo1t0nJcY4jC+tYXx8ECtemtVTBnnm6b/3oQBHntE6FUBqbDLDDAr5PjdsK4D12QozjOGNCaXRzARUEq0Xr7Eipgl156EZr4Gl9AGu7eSyO5MEf9FBFLHdk3FYgrCM8F+yO85j15wArL0aqHCZ+Tk55gl1IhmE9yYLoGEIW7h3yVNgsIemsFLetgFKYegMjx+VdjuOMSI9h2CDTYYoQhVuAKk+wA0FQSz2tuwhR0CHuyRFKo+IYWcSpmDE/qqO0O0XJcb6KENRqIb5fzE+zpQp2EUaZDFsDIb2CFn+fgmGBOzwCQgfgpmKcksitT4wXIOstK/ygkHPCpQp2wIy7qOXwq8uHHSbYJC7modZAIj2MSCtRYeo4G6ywmyVLFewDFdjEr2VWqmKm4CmwaQKDfmFH7aK1BGF9+m7H2dzCELll21CEYVrEcC9VsNfrEUGjbhHVOWDZJkNqaYyWopCblPA1NjXFbX3gOOvk0k7ApICH0FEP6cUu2E9T5frFSA9I6XZWieMCrgdnGaLegJo7Hs9x1hPaRzWbx6TWq+Mp4kIRdtbvbhvJGlb/7Hef3f3fH3iPWT16I7LkWyKtRXgB6mXfh3zRKxHNheLNtStF+t63k/3NH09fKS0bQLAAviv2yYWogWidBX57+tKGS2NLsmZm21IgG6LO2kn7zT/16doznvtuhPinop2gVK5gBzof+dAz1j7yO//BLB98EVKVeyg5CfZvejXqJa+C9pbiBXsFaa2JwhpeyccFZTG85dPE/+uXMY/cCTPuFJpXsHvnXc7Cm37qz2rXPusXgFuKVtBRqqkYRuV3q8Lz9gP96WtlZNMYzCyfhc5xCTkKGXc73Zsd36bvH10zmbXd1VFZbw7yaABmswRRqyF0cARYKeJUTOmCPavVjxnJI5i0Ev1isBbTX8MOem607pTFZI1r+nY8T3SttFJPY5TqjxsSFu77K12w63q9o3RwqIiNd05VofvFOM6JPblAi9csBT4p7FToeh2li3eI9UTpgl0uLMUiqq8BM/7AlQMhwGYM11ZJ1zqFrWV3nCli3f9ObscjAGHjRNjh7Keg89p1CqAWlqyM6oUMdcoY7CKMjPCDrKjvlKdCpUOkkqDc1n2nNNaH+gnD3fR6wvZWRZXWkQQxItSp8INCbk6ijMGuWovIUFmowPF444UYTArDxI3YncqxwwS7dgiSaiyJTahWe1WE4UpRe22ULtiFrxG6DSKwM99hlhPTW4OkWnOQjjNhkyE2m/0cSS67Tq0F2QBZ2w88WtTT3EoX7ABCN1LhBWkRy4xOllAaGw8wR92h1k71iKQHnf2QDUclkBUgggYibO1DentdsG8gG0axVXKArUZ9oI27mJzqfB0nbzY5DFln+u5yMimETWR7y4rU2k3FbBQZRXitxa70g7Wi7fY6JdKDQYzorrk5dqdy0kGMSavzvLZZgqwFSB0k45LrQg4uSxfseBpRX1hGiiOYtBLF3zZeG+1AdZyKsf0eJJV4mT7O1xBEKcorbHVe+YIdEPXGEYLgUNEa75wSIbD9o9A9isAWs3Wv45wiOVxDZPmsHeXRTgBARo3RyWIFVsoUyZReNsP+UZvGlfmMZwdd11bAqRZrsMf2YWMLstz9+h4Td5BRaEUYFbpVQimDXdfrfRUE3aIuXJwKP0tRoqCHbTjOKbLdDsSV6Nf3OB1Y4RX73OVSpohcWBrKsJ4UdeHiZIlAj9oK9Kq1icPZ5LIUhmujTprCn766ofJsJyCj+lDoYFDk4o1SBrsIIyt8XdgGPCfLEiD7MdJNxTgVY9c62DifOfa8iLDeF37QKXK/qlIGu2otIsIoGf9gqxHuvQ42qdYLwHFs0oG0Os9rEYMXtTsiDA8XucNsOYN9oY2SUUekdKswHSOUxgxibNXKwpxNLVtZxvR7oHRldp0y6hOzImvRARfss7Efaw5jbWHnuU6GjbtYt/vUqRCR9BBxl9wmv2fNWqwG67EKFPpMiPIGe8t/lJp3sMgLGCcl7kLf9WR3qsVmMdjZT0Xn0gAMENESQjcGgJtjnwWxtPMQ4eIxbAWGA9IDIbFrq64RmFMZtrsCSW/67vIyKWJhC0SNdLw5srDTwOUMduUhW1vWhO/1MGlhf7gnJRvCoD9aC3a17E4F2GGMTZbBVGOwYrME2dpiZXPL6PDuAittgsiomQhdq8y8hc0SiHsINxXjVIRZOYLtr03fXVqCGBnVEDoo9K5Tyhzsass2q+raVOUkJUGM3z2CrNouPWfzirtgdC7tBPLoE2PjBNnemslWO0GIQk8BlzPYhQRdw2bW2DQr/1SMEKNTZirU3tRxbJxAxZ7T412nK0VvQFjOYB/9gBE6iKvULyZZPuraCjjVYA2sPgrJoDLtBESgEZ7XBw4ChX6hljbYGZUerQg/6udR5jRzQRMPiczjGeo4OcjrrNNcjM86FfWlrvCDR8bljoVV2mAXYYSoNfYj1cr0tbIaHWpdjQoCZ5PLUmz3cOXOOvXqrYHwvENAoRfDShvsXi1ANhb24gXL09fKSCiN6XQwax3XCMyphoqddWqlxEqVjEfrbo59FqyOoN4+gJKr2AoEofRGO09dVYxTAY/1iakQEdSh0Tb4flz0He+lDXbha2QYLUvlVSYJTe8oNin0mozjPCki6YENcil1zK2dgPaRQWiQXlbkXaeUOdgBhOf3LVmCqUBhjBCQrEF/1fWLcUqvau0EbJYgglrhzzqdKHWw4+lE+FGG9KavlJIINFHaQ5uhayvglJrpruZ2wEYem5MAhB9Y2VywUuvpS4VT2vSQUYRaXErxRFaJEftYb2WVpJ/PC8JxZsX21yrXhlr4PkKpwrcToMzBDpB52lipKnVEnhnElXtBOJtQ3EUYZr45KU9yYRERRlkZ8qa8wa48dKOFKsmc15PlD3qoYaErqRxnUxJ+YEUtGqK8QlfEUOpgFxLZ3oKI6pUZsQMk3S5p7EbsTomlCXb1aG5z7HmRUd0IHXSBwr9AyxvsY0LpIUJleZQ7zZpQGhXHyGEMSoHvu9ssbm5heqZMr4fpr4CpyCdPaxHSZ1zmeLTou04BhC1xIHbuupW1P3jfL5vbPveDQIQQ0w8pl2yIOmsn8oWvgvMvm77qbKB6FBDo8lZTyTPOQi5uA1W87yE7cpDk//4m6ef/FzYZzLSlgEksgzVLlswwx8YZWf+21681v/0NH1Bbt/8asHv6YUVS6mBPdt9N5w9/9WfiL33y7dakW0sf7JPfRa0BXrXWDoombCn8sLwj99p3/Rj+M19e7GD/4t9gB7PdcJfGlmTNzLbc0VqEF9B65ZuORd/8vf9Jtrf8/njkXlilDnazbw/Lf/hrb+h/7u//PWl8SemDnXG4l/h3UgZeKAkaEumX8PmSJSAU4WvfjX/jdxYy2M2+PQz+1/tJb/0HSGc7z55LsGdDRGuJ5qvffqj+wle8S9Zbf1r0efbyDlke7xdzL0oerES/GMY7UKV0t1neKGGgryOai1CLpu92ZkgEdSvDZob0ukVvAEbZg33cL2a3VN6h6WuOU1WitoioLcx07vp02O4KtnNw5qP1PAlPo5otK7V2deyzJpstVHvrEfxgthN5jlMQNouxygNV3I0/dhhXrt+R8DXoWspoQ2ThlTrYAYQOBsLzZjnD5jiFIoJx2WYR15SswcYDbNwjj/PqcusTEzUoSw07pQ92IUFry6h/g+NUX7aGaC0iooXpK4Vh+2vYeBVsDombA5slpFJiPP8AQqxOXy+icgc7oFqLCN+zmNSFu7MpSK0RXvGqYapKKI1uLqB0sBs4PH29iEof7PgBIoj6SDcd42wSflDIMkcYnXVKfxUq1MjOZgmq2UJG9YeKXr8+Ufpgl1EdoYNloDpd/R3nCYh6G3Qxyx1Nr4c5dhhSO/POjiaxeUzjI5QmUQEp8ihQikKN0ge7CCOEH+wFKnGoteM8IdXAhoujxdMCssMEm3Qq1ScGa4kWWugw7JWhhp0qBLtXC5BB7SEQR92OTafqhAoQfjQ6/Lyg7FqnWp0dlT/ZMzAs+iHWE6UPdgCE2IsQbsTuVJ/SqEaLoh7PJpIe9I6CNTPfQJXLIdYmRSgfwpbF92f8l22c0ge71RG0ty3j615l2go4zvFkyag2XHkzD83TYZMOZBUasYchIqoPx217S6H0wa4W2sgw6o8/JjlOpY36xNSn7y6MdBBj4mNgKhTsQiPrrZ7UuhTz61Qh2FEeMmpm0g9K827qOKfCZjEEzdEce0GpbIA0+Yyx8th1arME4UlELTyK8kpREUMlgl1I8AMsmcGkbi7GqTRRb0IQTt9dDNZg1lawceEPGDopwvMR0tsHrExfK6ryBzsgo6YRupaUZcXacU6VCBoIHRazT8yknYDRIGvTl0pLRE3QtUfLVFJdiWDPanVrfV2KPslPmrWQJjAcFPOWpbOvSHC+WraGabaxYWv6SjHkuOs0r81JxB0yX2G13lemYC/1CUoT/c9+or3yu//hJ9JH9rxR1Fpbpq+XTjZEnnEu4pKnQWtp+mohiAMPY+79Eqa7UugKjePxAkHQEKU7Qcn29+G94C3UvuUdqK3bpy/PX5oQ/+2HSD7237G9ZVCzG7XnctYpYDv7qT3vlSx8/7//Sf/8S36rLNMxlQj2+I6bGyu/+a43Jffe/iOi1rpg+nrpJEeRVz0P9V0/irxo1/TVQlC3fp7h/3wvw4ceAK+4VRrHU9pgTzoEL30r+sVvRrYLOH6ZBPsnPoRdOzLTN/w8gz162etoveadP+Sddd4HylJ9V4mpGBFGiTR6j0g5Nn2tjCwBsh8jc/hIe0qUYhg1GRqBTfP4POwACN2c6Sh4Q2T96rQTAEQMfmMJGdbjsoQ6VQl2b8v2VDZa+4BS9Ep+Mmyvg00KWgucZYggROhg+oozK1mC8EKoF7dPjOn1yI4eqVY7AYD6QkYQlqrirhLBLqPICK1L06Dn6xFKY42BQb/QR4yJoIFQ2i2i5iXwwZvd9MbpssME2z9WqbNObQCyFQ2k1qUZrVOVYAeg5VsCaasSMjbuYtOCTsUw7gketsFzo/a8iNoiIlwsbAMwkfQQcReEmun8Onn1ibEWdAO82ipQquL8ygS7iM6ywqub0VC3/GwyxCwfww4KOvrRGqKF0QvY9eiZuckh1qq5UNgGYOkgJou7lTkSD5MiGlsR9aUDSFWqad7KBLtsn5GJqNkHijt38WRJD5I+9DqABVnMX5OoReAXM2SqRqhg9PMu8FQMAFmnUn1iZLON8P2HMFkpTk6aKGZinCxPI+oLA6Q4jElL9ZHphLJhLqe8nyrRaKEWtyKUAFP+99IyELUGwi/u1JccrCCG1Xj5wahPjGwsIJpLj6C8UlXcVSPYAVFvdEXAI5B2pq+VUtZBxCuIAi+e4mlEQed7nfyZlSPY/tr03aUliDFhgNW6NEfiTVQm2FVrsSdr0T6g/M8sIbDJsPA14kIH4Llgz4sIG1BrzHxh8lTZ1WOQyFz6xOTS2TFO8HWA0sGgTDXsVCnYxz/4FaDApSQnx+uuIIvaKc/XmEYLW2sWtkqjaoTWCF8XtgEYnb2QDKpziHWgGTZbZH6QAqWqEKhMsMuFpZRoqYdV6czLoHIgAo1ZPoxZK+hi/DDBD2p4elzHXoGfeaEpjYm2YAvci910jmHjUs1YnJi1WKupBQ3r++UbuFQm2EUYGVlrDpFeqd5ZT8QSYHqD0QioiHyNCCM3FeM8brAPTK+wU0UnS/gRorFoxOgQn1KNXCoT7IBF+RlS5fAhbfaE0phOB9PvTV8qjER6ZKIaL+KiE7qBV19AFPiN1A6qU8IOo7UuVQuGwvMKXMFwfJUJdq8WIBsL1dkJKT3od0b17EWk1Og0n7C4i3mVkSXgS2y9Udg+MaRJodtfnDSTgg6h3h7g+4kbsc9LvQ2NBYuwFmtK9Us4EXPsIWz3yPTdxeEHiKDuSh7z4NcQQb2wC9XZyjLW9ma9bporoX1ELVxFel23eDpP0jdIlZbt3fW4hEAkQJxBgbskWOVh3Yh95oQKUY12YdsJiKQ3GrXnIJc+MTAatHjBIeBo2Y7drFSwS60TqbxqtBVg1FkOW+CPuL5GhCEI6/rFzJpfG00NFPRN1HZXijtteApsliCCGkIH+8fBXqoneKWCXdTqXaQ4hslp6JCDaNBBm2Eh+8VEjYhaaxFZ4G3ulSJkYWvYTXcVm3q5bE7Ki/ADZHPhsNT6mBuxz4mMItTi0jJBsA8obinJSequrJL0C1jymGX0rWTo10AVcxRZJaK1hAiLewSh7a9hczrxK49dp4+1E/B1Z9xOwI3Y50J5qPbWZVVTe6EijcAAO+jm9oI5ab6GICrsgl6ViLAx6oHv5OKxdgJRPS1jCXV1gl1I0LWezeyyTbNKTMWIQOOnMWpY0G9HKUStBsK4Do8zJrQubg17mkBvBWGYeTuBXOkA4Wtb1OmvJ1KdYAdkVE+FDuKyzYediCUg6cakcUFH7IAJ665fTA6EH4Aq7s/YdlcrddapCDSqtWCFDmwZq+wqFeyAIWhkQmmTRzlUHrw0QebR8egU+VF91C/Gma2oDbqYfWJMr4fpr4Ap6CfLk2UtyAbIWlbWCrtKBbsII2R9qTq7TwE7HEISF7aW3bXuzYHSEDaLu+sUyNZiTDz7DMyvs2MD2VwcCD8YlHEGoFLBXrW2AkJp7KCP7a4WtpZdRvVRuDszI3QDUeDpLjtMkFkPoeTM6+zz2pxklYcMo2PC8w6XrRc7VQt2qyOotzOUzKrSVsCmCWTZqKSwgLXssa6TVuSNtJDGfWKKfNZpnrtOc2FShA6h0d6H7z8KlG7xoHhJcRqEr5Fh1JfK65Xx49Px2GSILehoHcYljzocVSXlMJLalPwasrlQ2HYCACRrkJYu/05IaB8ZhIeQ3n6gdO9alQp2GUWo1tIyfnCsrIseX0V62KSPOXYYOyjwiyaojz6Cu7YCG85mMUgfIYsb6ra7go3z2ROYx+YkABk2UO3FrtR6rYxZUqlgZ1Tve0x43tEyzoudUFLQfjFZhqg3EM2m2306Q6LehHqrsOWOpruK7a2Sx6qmVxOoPNaQ/cCi/HQc6qX7KFq5YMf3V1DqWFWCXWQpIu4jihjsE8MhtnMQ218evQG5KZnTlyXYeBm7ehi72oGCH2yOiXM5ZSOvEbvwfYRSpaxhp3LBrjwyHXbNqH9ywV8JT45NY0x3udBtBdS3vA7/Tb+A/w2vQDba2NW92NW9EK+Ngt4YF/ZPxiTM13aD6aHOuY7gFT9D9NZfxdt13fSjCyPPPjF5yTwf4wd21lU+s1KtYBcSXW8MPK17ZWvac1xCgEnRaYwqaB07gFjcivqmV6De9Uv4v/7/Efzyx6l9/3vwrno+cuFMhBCQxjAcuBH9RJbAsP/YTXgh8qzL8J/1GsK3/jmN991E491/Rfjan0BdeGVhp2GwBgYdqFiw6/ZS5jWaKUIU94X3BKoV7AB+EON5cSWCnVFfaBv3ijnHvl6WwXA46q9x8RXwitej3vVLNH7yN6j9yC+iv+Nt6Ke9ALXlHETWwfYOjoJ+M43mJyPy/iHQEfK86/Ce9a8Jvuc91N7+O0T/7o+J3vxe9I0vR27dUdwwXy9Lsf0BpAV/fp6kRHnDVKhSbk6iisE+7hczrEqwAyTdLmmvV9jdp19lEvDDISiP+OwLMdc/H/Gt3wff929RP/hzhG/9FcIX/QBycTskR6D/CMTLuSy+5S5LsN2Hsd2HAYO67HnUXv0LRG/5LWpvfC+1V7+L4F+9Gv/y65DNdmH7rZ+I6fVGC6eomTcAy2XXqbVgLbWgNvB9b7Wsa3WVC3YRRlb4QYa1FesXU9IR0STolYfYfjbi8mvInvlC7Gv/Df4v/gXN//x/qL3uF5FX/yts1sUcumd0zmuJ5+Zt0sGu7cau3olot/Ff9C7CH/0I0c9+nOjtv0XwktfhXXMj3nk7R2FehpH5Cdhhgk061ekTw6jMWETNrvCDo0Ap55gqF+xeLUDWwgSphmVd0Z5memvQ7RR/Oubrydad3+prqEUkO6/Efutr8d/5ywS/8nEaP/9XRC9/C/Lsy0Ybnxi3hR0Oijmin8yVmwyhG8j2WXiXvYDad/8azV++j+Z7P0P0fT+Nvv6bKhHkx5UMIC3lwPb4hEDVgo7wvENl3HVKFYPd6ghRa6wJ6fWrEOxCaWw8wCZxYdsKnJapEX12w/Mxb3gX/ns+iP6p3yZ6/U8Rvvi1qEufDmqIPXb/aEQ/r6BfX7kyOITYcg7qqS9Fv/xHqb3hvUQ//mHqP/4Bgm97M3LHTvB06aZXToZIetjlA9h0WJk+McILIGyt4ftH3Ii9INRCGxFGR4GVsi58TLPJkGz5WLF3n26Eqfl5cdEusud9C+ZVb0H90M+jf/xD+D/46/jf8ArUGRcgTPfxRdhZvuCnFj3VxS9Av/w9+D/w+wRv+e+Eb/jP1L7lzfjXPr88i57OCVnlodpLA1mLVsvYToAqBjvKw/rBfivVkcosoNoEbMmnYU7FZOrG16P5+adci3rZq1Fv+3nUT/4m4Tv+G9G3/xvU9vPh0F7svnXz86cT9OtG5ebgnWAV3nWvpPbaXyH6t39M9I73E373Owif83L0RbuqOb3yJKWDGDPozefT0yyYdFTC6QdDVHmr66oX7EICYh8mPYKtwLNNejCIEd3xZp/NajKanwT91jPJnvFczL/+Ybxf+gj6wzfhv+sD+M9+FfKsnaNpgeHg8dr5J1qIXV9TbjLEwna8Xd9E8B2/SOs37qL1u7dT/5FfJ3jRa/AuvmpTB/lXsQbZX0aYdObTMHkS2ofRrlNT1unc6gU7IGr1ZUani5fy3XaaHQ6K3eFxXtYtxoqt21Ev/k7Uj/xHvH/363g/8j7Ud70D74ZvHgW98rBxZ7Qb1maQDbHxMsSriNZW1KXPwf+mt1F78/up/+SfU//xD1B75duR517mQvwJ2CQe7bPIYQyVWzuBoG6FX9yma0+GsCcaxZRY5yMfEmsf+Z1fNMsHfxCpmtPXS8VayIZ4L3kN6qXfC4tbpx/hTJssMmcZxAPsof2YfQ8hH7oHdt+J7B1GLzRQ51yEuOha5DmX4G/f4UbiJ8saks99lPj//BL24B5QtelHbKjBimHYn21e2aSLf/G1duFN/+Hva9dc/9PA56cfUwbVHLHXGxZPGMpa+30cZtCtXD+OmZmetjn3QtQznoN4xRvg9f+O2tveS/iDo81B4fO+jeCyq5HtrS7UT9ZkiqtisrBurdZpmT/xVzLYVWsRIU1m07i0v5j1bJbg91ZRw1Iu0M/f+imbxa1k28+BbW6EviHitVz6xOSy6xQg7qAbUepF9V5Zd51S1WCXC0vIsL5a1s0FX0UIEGLUViCe/QvIcU6G7a5CamfeTiBPasu2gay3DgH5nB4yA5UMdn9xEU9F+0XKyvS1slL9LjKHkZHjPFmm18P0VyrVTkDE4EXtrgjDh4DV6etlUclgtzrCenrfeJNSdQwLepKSs2nZtQ42Lv8H4wkbADXdR3r7gLXp62VRyWAXvkYshkcJZPeEtcslY3sdbFKdF5BTfnaYYPvHRht6ZlzHnks7AWtBN8CrJeNBYWk/Ilcy2AHQSx28eiWSUCiNGcSjfjGOUyT9fTBcnr63nEyKDNt47TOM1Douc0uSSga7jCLk0vYuvo6xlSiMwcZdzLHD1e8X45SGSHqjzpsVItpbIWrYcaiXNjwqGewoDxk1e9IPqvGskx7EvVzKyhznybLdFUj603eXmvA0QtcsUs143me2qhnsQiLCZowUaWU2KQ2PQdatZutep5RMdxUb5xPsebQTsFmCqIWWILII4YK9iExrKbGhSqECwS4ENhlie31XFeMUhl0+gI0tyNm2EsiLIMaEAVbrUoc6VQ52Xa8PPR2UdvHjuDpHYdCdvtdx5sLGSW6HWHs1gZrxHihLgF9fsEoHSZkXTqlysOMHFs8r/Tvven6/69oKOMXR2Ts6Fm/Gu05NYkm6M56KGR9iLfzACM/rlH3XemWDXUZ1hA5SrM1mXv+aAxFoTK+D6Zd2l7NTMaZzDBtX5xOkIEZGQSp0sLfMu06pcrCLMAK/1QWvGkNc1cR0eth+dV5ITskNx0cezHhzUl4sAV77jESG9QeAI9PXy6Sywa5ai8hQHYC01O+865lutUZIToml1WxvYYMoxffdiL2ohK8Ruv0AsnZo+lopSQ+7tooduKkYZ/5GDcCOgin1VPTXEJ42SG/FzbEXmNCNB4QXVCPYAZKjkLoRu1MA3eXRprkc5NInZtxOQAR1O+7D7qpiisqG0aNWyeWqtBUAYNAfdXmccBuWnLxZQ9ofYHIqdcxNtAA6tJT0AOv1Kp0IslZfFpJeJXafCgFei/Qvfh/zqz+B/ds/xdz1FeyRQ6OgdwHvzEqaYI4dJn3gDoaf/Vv6f/hfSD74E9iHH4KSHyk8YbME2WzibdmaSK1LPVqHih5mDaMnY+evPizXPvLfPmhWDr8OL5h+RDllQxguY41FbDkf7+xd6J1XYi64jOyMHYgd5yOarfFjHz8Sznmc1pooivA8dyzeE8mOHMQ8cjfmwbvIHrwTs/cezP6bsEkX4S2AX8+lIiaNLcmamWkd+/gQaxZe/+O31J76zHeivI9PP6ZMKh3sK//wf2X3T9/7e3b/o9+PVxfTDym9bMhjB0EqH9HagjrzQvSup2EuvxZz1vmI9iL42oX8Oi7Yj8+sLmMO7yW790tk93xpFOQreyFeXfc807mE+XqDFcOwP+OcSo4ir3oe7de+6y/DK699N8q7ZfohZVLdYLeG/hc/LVd/+yffP3zwvjeKWktPP6RSxjvnMCk2HSCERCydhXf+lYinPRtx1fWwZZs7vNkF+4g1kA4xax2y3beRfukTZPffjDl0NzZeRsggtxH515NHsNvOfmrPeyUL3//v3+uff8mvAvunH1Mm1Q12oH/Tp0TnQz/z7uED97wNr744fb3SrB2N6NMVbH8VlMK76HqC61+KueQasvYWxMLSphzRb9pgTxOyY4cxe+/HHHyY9Oa/J7vzb7D9A6AauU6vnIw8gp3kKLVnfwet17zzx/zzL/ntMh9kTdWDPb7jZrHyez//Q8M7b34nXnAhonqzMU+ataO50ayDiM5AbtuJOvcS/AsuJTvnYsw5FyLaS6CD8ci/uiG/aYLdGszqCubIPszD95De9xXMo7djD+/GrO5HWFvIIJ8282AfvzbqL/lemq/+4Td7Z533wbKXO1Y+2Ff/4H3fntz+Lz+LENds6mBfbzyat+kATIpobkOddTHivEsQl16D3HUNbDtrNJKneouwVQ92s7o8WuzcfRvpA1/E7HsAe2Q3DPsg/bnMk5+OPIIdoP5tr6f57W94g9q6/fenH1I2lQ72ZPfddP7wV2+Mv/TJ/2JNeqML9hOYTNtM6v2jNnLLDoIrrsVecyPm3J2jSpuKjOYrFeyTufIDjzC8/bOkt/w95uHbHx+RlzDIp+US7EGd1nf+gK2/9NVvkO0tH5p+SNlUOtjNvj0s/8lvXdX/1N/8V5LBN5X5yZ2ryYi+ewibdJFnX4W8+rnIi68cjerPPPfxoJeydCP6Ugf7eHolW1vB7rsPc9/NpHd9nuzuT0HWRYTFnCc/VXmUOpINEa0lmq9+e1Z/4SveKOutP5h+SNlUOtizIwdZ+ZP/trP/Tx/5NQbdb67Kkz132RA77I8qbcI26tzL0FfdgD3vEsx5F0OrDbWwNIuwpQv2qUXP7IFbye75DObIA5ANClXBstHyCnZ5xrk0X/VDg+i5L3uTrLf+aPohZVP5YO/85QfO7X/iL37DdFe+rYpP/FzZUUmlHfYQWQd0C3nmpXjnXw4XXY698HLEBZcWfoNUKYLdGsy+B0nv/UppFz03Ql7Brs7aSfN73r4SPuuFb5Fh9KfTDymbSge7WV2m89f/46ze3/7R+83ywe/YDC+EXE3PzQMiaOBddDXhc15GduV1pItnFG4kX8hgn0yxPHQX6U0fI73tH7DLjz6+MYj5bA6at5nPrzMKdu+8y2l+91v31W54/ttkGP3V9EPKZrME+2+Mg92tns7SuhG97R1FNrfh7bxutBP2iqc/vgirvFFvmzktxM492NdtDjLHDpLd+yXSOz+FeeAmzJG7EaoGemnThfjx5BXs/q5nsPDad9weXPWMH0N5H5t+SNlUOthJE9Y+9pEz1/7yt38tO/DwK5HKdcnK07raeUgRW3chrvjGr16EncMGqXkF+2TLvj3wINmDt5He9XnMg596vPdKBSpYNlpewS6f8iza3/sjHw+vvPanUd7npx9SNtUOdmtY+cRfb+/+z/f/V7tv96uQsz7n3DmhSaVNOkAojVjcjjrzIjjzfIKdu7C7nkq29axcKm3yDHazukx235fJHrwD88h9o/4rR/dgB0cRyE0zV36q8gr24IYX0frXb/8dvfOK9yLEA9MPKZtqB/uorcDWzoff957h/be/Bqka09edOZiem5cehC28sy9GX/l0zM6nYC6+YrQTdgYBP9NgTxPM/odJ7791VIZ4z2fcXPlpyCPYbdIlfPa30XrNO37aP/+S3wSOTT+mbDZDsLc7H37fO4b33/6DSHXm9HWnAKbm5oXyEIvn4e+6HvHMb8Kec9Gor80Gzc9vWLCP58qz5SOYvfeT3voZ0ls+jtn3RRguI/RWN1d+mmYe7ONBhnzeK2i/+offHp530e8C8fTDyqbywR7fcXO0+gfv+57k9n95J0LscrtPS2Ayop80MGtfgH/ZMwmuuBaz4wKCcy8g23ImSRCe0rTNaQX7uKY8PbAXe2AP5r4vkt35ScyhWwEK20irjExiGaxZsmSGGTUeVEQv+m6a3/XmSvSJYTMEe7L7bn/1g+99YfzlT/0ccL0L9hKaLMICImwjt56NOveSx2vnT3IR9qSDff30yrqacts9NppicVMrM5FbsD/eJ+aN4z4xM/wL81H5YDf79oiV3/+vN/Q//4lfsCZ9rgv2EhuPrtb3nKexFbX9gscbmF31DNi6/QlH8k8q2NOEZM99ZHd9AXPf50aNtJb3ukXPHOUZ7K1XvcXWv+V1PyDbW1ywl0F25CCrH/iFp/Y//dH3WZO+0AV7xawrqbRxD5tmyLN2oZ7/KuTTnvN4X5t1c/Pa87462NME01l9rKZ8+Ok/J9v9/2C4XOg+5VWXy65TaxFeQPN7fzStv/RVbxr3iSl9KFY+2EkTjv3Of3lq7+N/8Yuk8QsRLtkrbTw/b7uHQNfxLngqYudViEuvgXMuRCxtI9iylZo1yOWD2KP7yHbfQvbgLWS7/wV77H6E13CLngWQV7AT1Fl8y08vR8//1reivD91wV4Syx9879Xdv/mTXyDuvQgh3Kt1s5iE/LppG+/CqxA7LkCbVbwjD2AO3V3aPuVVl0uwjzs7tt/2H++IbnzJvwX+rgrBvjl2YkqdgO1gTTJ9yakwIcDTiFoLdB36qwxv+QTqcx9C3v7XmP23j14CQQv80IV6waQDO9tQHxNBHeHrB4BDVQh1Nkuwq9ZiX9bqB8p+jqFzGtaFfGobGGouzB1sliCCGsKvPQIcnb5eVpsi2EW90cUTezHp2vQ1x3E2N9NawobRcpUGfpsi2FVrsS+kOWjTuDK/OMdxNkDcQTcivKjeB3KY+MnHpgj2YS1KMk+vAm6O3XFKwCT2q9rrzJKM6ggdpMDXbnooqU0R7LX2Uqor9o7sOM7GEGEd4Qe2KgunbJZg92qBFb5XqXdkx3E2hhcEVjzRLuQS2hTBbnUEnh5149sEdfuO4zwJ1oJuYOuLFt+vVDBsimCH0VmcwqtN3+04TgEZ+3gfl1kSuo7wdDru6Dj7vzAnmyLYha8R4YLFq9Y8muM4p8GkYA2qtZjIWlSp9bdNEeyy2UIsbDVIZbDGBbvjOACIZhsa7R7K61dpDW5TBDtCImqNDF8P3YjdcYrLJJa0b0m6ubYTWAY6LthLSEb1odRBvwqnozhOlUzCfNg1DDqG/oqZbQ/2MZslCCkR0js0bidQmWzYRMHe7KHkKiZ1m5QcZ85MMgry3pGM7tFRmA86+YzSJwQxcqGFCOv7gcMu2Esoq9VXrG8PQjqYvuY4zuylsaV3JKOzfxTmeQf5NBsnyKiJCKMjwLIL9hLS9fqyRO63aeaC3XFmbDIiT9ZGo/LO/oz+sRn3Vj8Fw7BO5geDcbuR2c//5GTTBLtcWFqTYf0w4ILdcWZgenpl0LHEa/MdlX89tfaS1VG9cmXQmybY/cXFxFNRX6Sk09ccxzl5k0XP3lFTmOmVkyFi8KJ2LMJwUKWKGDZTsFNvW4KoUr88x8nb9Kg8rwqWmfH0YaS3H4inL5XZ5gl2wASkVpkh1rqAd5wnYX2Ql3FUfkLWYpsNqNUeAfYA/emHlNmmCnZZ37YsgtYyuOkYxzme6UXPygT5NJMiwzYiqB8BDroRe5m1lvahg0explK/RMc5HdPTK2VY9NwIor0VtWXbQGpdqXYCbKZgl1GEt7TtgPC9A5i04k9Zx3liRaspz9tjh1jrIBsfwOOCvazkwtKqCOsrbirG2UzWb9kvck15ngQxMqpZoWumaqWObKpgVx6ZDmMr0xjSSr07O8606emVeWzZLzq5sIhotCxSTV8qvc0T7ICO6pk3+uhVuXdoZ3PbNIueG8QSIPy6Fcqr3OYkNluwowNrvbrBqlxOZ3GcWZoelW+WRc/TZi1C+oxH6pX89L6pgn0oFcYLQXou1Z3SqWxN+TxID1lvGVELM4SoXB5snmAXktriFvTidoQXTF91nEJZv+Dpplc2nvBryMZCJvwgreKoffME++MqOafmVEMaW5K1xw+ccNMrs2GVhwyjVHheXKV2vRObKtgHKiDxa32LTdzZp04RTE+v9I8ZF+SzZlKEryBqdPD9g1VrJ8BmC/Z6PSLcuu12WYt226SbEq+BqdybtVNwx1v0dEGeg2yIHaxCGiPri8jG4l6kdytwbPqhZSfsZqoOSRPM/oeDwd23vmNw5y1vT+79ytnpPZ/BLu9HRFsQtYXRSrkQ03/SqRAvEAQNgfTz+T2bxJINLdaOplpciOfE2lGYdw9hky7yrF34l16PvvQaapdfvaJ3XfNHsr311xHinuk/WnabK9gnrBGkw23Z8pGXpwf2fm+y++5r+5/7eGt4503CHtkDQiDCJfACF/IVNOtgd0E+R9Ziky62dxQRtpFbzyN42nOoPe1GvHMvxN++oysbrX9E+b+CEJ+p6sE7mzPYv5ZPmjwrO3b4jcmee28Y3Py5Mwb//FfNbN/9HoBQGqQ3vrkRfdnNItgnYT4cuCDPzXhEjjXYLBnNnSuNd9kNhM96sQ2ecl3fP+eCZdls70V5fwX8z3GL3srPv7pg/1ot4Jux5qXJ7nvOiW//4pnJXbecPXzwrnp28CFlVw9BGiP8yI3oS2qjgn1SweKCPEfjETlZgtB1RHs76swLrd55pdGXXd2pXXP9XrX1zEMI0QG+DHwEuH18pumm4YL9xATQAK4lTZ6ZHTt8drLn3m29u269Kr3/jgvNPTeF2eGHHxsl4NXcaL4kTiXYTWIxGVjjplhyNZknTwcI0wUVos69GnHxNQSXXGnCy67a759zwVdks/0AytsNfA64DVjdzGXNLtifPAlswZqrzerKpebIvl3J7nueO7jzlsuSe79SS+/5DPSPIsKt4NVdwBfYkw12N1c+R9ZCchTbW0accQn+ld9I7epn2uCiSxN1xtn3ya3b/1mG9XsR4sHxyPzhzTYqfyIu2E+NANpYcwHWnmU6q7uGjz74rd1bvvD0wSf+vG7u+SyIIXgRQkVuNF8wTxTsJrEM1my5z/Esm6lRuY17oNuop7+E5ou+y9YueUpHbt3+GRnW/xYh7hufePQgcHQzzJefChfsp08AAdAeT91cZFaXvzu57/aXdm+/eXt691ekfegessMPYpOum7YpgPXB/tiiZ8+QpbjfSR7WBTkmRUZLyG3nw4VXUNt1jQ2vvK7rn3/xl2UY/RnwaWAZWANWxqNyF1pfhwv2WbJGm9WVK4ePPvjm4UP3fUdy3x1nJPd+hWzfA9jVQ8Itws6HFwiU76ZXcnWcRU/vvF1WX3oN/kWX4Z+385B35jl/KcP67yHEbW5a5fS4YM+PIk2enh07/Kb0wN5nJrvv3hrf/NmF4S0f09mBByQqHNXOKz0KeRf0TplZOwrzYW9UU64M6ryn2uDaF9rgKdfH3rkXrvjbdxyWzfbfo7wPAne4aZWN44J9PppY80zS4Yuz5SM7kz33bu1/+uMXxF/42Lbs0Tu0TbpuJ6xTPpMplu4hEENEuBXvwmtt7VkvyWpPveGof84FD8pGaz/KvxchPgp8YbNXr8yKC/b5E8A5wI2kyVOSPfdti++8eVdy201XJPffvmAOPaxsfxkh5GiDlHrsgADHma/1i55CQmMravsFVu96qgmuuHa59pSn3aPO2HEvyjsI3At8CrjPTbPMngv2YhFAHbgEa3ZlRw+ePbjtSzf277vzWdnD92+xBx6U2d7bsN1VhN9yc/NO/tbPlTe3oc66GHHeJfhnX2CjK5+2qi+58p9lY+EzCLFnHOb3jxc9K9fzvMhcsBebD5yNNeeY1ZUd5si+5ya773nx4Jabzou/8FE/feR2hDKIoA1+043knY03HpWTrmD7q1Dbgn/FswmueRa1y6823tkXHpRbt39ChvWPj2vKHwIeBeLpL+XkxwV7eUigjjVN0uGZZq3zHcN9j3xX/wv/dOHg5n/2v6ZLpZBuEdY5ecdZ9JRnXom44huJnv5swl1Xp94ZZ94mw+gPUf4/IsThcSniGpBOfzlnPlywl58mTa7Mjh3+vsEdX/62/qc/dnZ6182eWT0s7bD/eL9518DMOZ7JiNyOZ0qUD2ELb8dOW3vG82zt6c82/nkXLcuw/gmE+D3gs0B3+ss4xeKCvVo84BvN6vIPdO6/+2lm911tc/8di8m9t9ayvXdLMTgEKgSv4UJ+M1tfveLVkNsvxTt/F/qSp1j/osvS2q6rltUZO46gvFuBDwP/BHSmv4xTXC7Yq6uONdeb1ZUXmyP7LkkP7D17cNctO+NbP7eY7rlDsbYXa6xbhN0s1i96Ko3Ycj7Btc+xetfVqb7g0iP+ORc8LJvtQyhvH/APwCfGW/ddQJSQC/bNwQcuJU2ebTqr5w/3PXJWcv/tVye33XRJ/Pn/U88OPCBE0EAELdfuoCrWlSLa/jJCeXiXPYvguhfY8KrrOt7ZF94tt26/TYb1fQhxP3DTuIKl58K8/Fywbz4CWAQux5oLSYfnx3ff8pzeZ/7hGfHtX2hn+x4QdFfc3HzZTNeU+yGitQVv51WEN7zARk+/saPO2PF5lPfPwO5xKeK94z4srhSxYlywOyGwA9hGmpxp9j/80sHdt750cOctO5L775TZw3dgD90PQrgRfZFMj8hrLdQ5V+JdcDn+BZdSu/RK9K5rYtne+i8I8efAV4BHgH1A343Kq80Fu7PepKSyTjrcni0feUWy595Xpw89cFFyzy1+cv/tZPvvRwwOjermXd/5/GVDGC6D8KFxJt45l6KvfDr60qdY76xzY3/7jptls/0/UN4ngWPjEO+43Z6biwt25+uzxjOrK1dlaytvSvc++M3xbV/c1v/kX3rmji8ptBG2FrlF2FlZfzhzd4Bon2nlDS8mfPpzTXjZVala2taVi1s/KsPo/cAXXYA7uGB3ToEHPJU0+V6z/+Fnrn7+kzviW286w9z/lZo5uk/YYX80x+vV3CapkzXeHIRJH6srF0EDde5l6KtusOEzX5Doiy8/LMP6QYT4LPDHwJeAwfSXcjY3F+zO6dDAM7Hm5dnRgxcmD9y9Lb7tizuH9966LXvkAd8c24eJO48HvZub/1pTi54ibKPOvBAu2GVrV18/rO3cdcA/54IHZL11ZDw//tFxM63l6S/lOBMu2J2NooDzgWeZ1eWdw0f2nDF86L4rk/vuuCq5/87FbM+XpTm8Z3TIwmZuRzwelT+2ZT9s411wDeKipxBccqXVZ517NLjo0i+rM3bchfIOAfcAnx+f6emOBXGeFBfszqzUgZ2kycXZscNnpgf23pDsvvv5/c99fEfypb9Tdnk/ItCbo4HZeFT+WCMtpVDnPZXaDd+MvvI665+385B3xpkfk1HjCyjv0XGY73Y15c6pcsHu5MEDtmLNWaTDs81a51uT3Xd/S/+mT21PvvhJkT18MyYZPH7wd9nn5idBbg02S8CkiK0X4l/6NGpXPYPohudZb8d5XZT/KYT4CHDr+HDmw25U7mwEF+xO3uS4dj4EtpImrzD7H35N99N/f8ng9i/56d7dmKP7sb2jlOpM2GzIZOFYhG1Y2IZsb0XvvILwG15AcMmVmWy270N5HwD+Gjgybm3bc10RnY3mgt0pigBrbjT7HnxL8uD9N3bvu6uR3n+Hb+65yc8evUMWboPU9PRK+wLrX/ZM9MVXGn3xFYl/0WWJd9Z5B2QYfRT4o/Go3FWvOLlwwe4UU5qcazqrrzLHDr4oPbB3R//WL25LvvjJxezhm33TOQS6PRoZ5zk3v76mXHmI7TuRl3+Dja5//qC2c9dBf/uOI7LRugvl/w+E+H+uI6IzLy7YnaITwA7S5EWms3rDcN8jZyb3335x/3MfP3/42b+rkxwdbZCazM9v1Gh+XU35ZNs+6QDvkm+g9qyX2/Ca67v6kivule2tu1H+Awjxd+PqFRfmzty5YHfKZgG4DrjGrC6fObjlC7sGX/7cdenD9203+x70Tqt2fn1NuReM+q9sOw91zkVWX3Z1HN3wvIe8sy/4MsrbA+wfB/lX3METTtG4YHfKTAPnApea1eXzho/sefbwofuem9x3x5nJHTd52UNfwg66gHfiRdjxoidmtH6pdlyGt/MauOhyG116RS/cuesrcnHbP6K8u8ZNtO4HDrit+06RuWB3qmJUUjnqUrnF7H/42uHhAy/v3nXbU4e3/UvT3Pslle2/G7waQtch62D7q4gzLsG74Bqrd15p9WVXJ965F+7xt+/4R9ls/xPKe2hcgnhgPCp37W2dUnDB7lSRGAd9gDV1s7pySba28q3p3gef3//0x3ckd98c2O3nEV3//DjcdfV+74wzPyfD6G9Q/i0IsToejSfAuCm945TL/w+xlwJr2wCYTgAAAABJRU5ErkJggg==',
                blocks: [

                    {
                        opcode: 'createPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create new page named [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'deletePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete page named [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'clearPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear content of [PAGE]',
                        // notchAccepts: "htmldocuments-coolshape",
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'allPages',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all pages',
                        disableMonitor: true,
                    },
                    {
                        opcode: 'getHTML',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get html code of [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    // {
                    //     opcode: 'get',
                    //     blockType: Scratch.BlockType.REPORTER,
                    //     text: 'get',
                    // },
                    { blockType: Scratch.BlockType.LABEL, text: "Render HTML" },
                    {
                        opcode: 'displayPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'display page [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'hidePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'hide page [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'hidePageAll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'hide all pages',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'current',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current pages displayed',
                        disableMonitor: true
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Element Management" },
                    {
                        opcode: 'nestEl',
                        blockType: Scratch.BlockType.CONDITIONAL,
                        text: 'add [EL] id [ID] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nest",
                                defaultValue: "div"
                            }
                        }
                    },
                    {
                        opcode: 'noNestEl',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add [EL] id [ID] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nonest",
                                defaultValue: "input"
                            },
                        }
                    },
                    {
                        opcode: 'text',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add text [TEXT] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello World!"
                            },
                        }
                    },
                    {
                        opcode: 'removeEl',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove element with id [ID] from [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                        }
                    },
                    {
                        opcode: 'setAttr',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [ATTR] of [ID] to [VAL] in [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            VAL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-class"
                            },
                            ATTR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "class",
                                menu: "attr"
                            },
                        }

                    },


                    {
                        opcode: 'changeHTML',
                        blockType: Scratch.BlockType.CONDITIONAL,
                        text: 'change [ID] in [PAGE] to',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nonest",
                                defaultValue: "input"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "CSS Styles" },

                    // {
                    //     opcode: 'styleEl',
                    //     blockType: Scratch.BlockType.CONDITIONAL,
                    //     text: 'add style to [PAGE]',
                    //     branchCount: 1,
                    //     // notchAccepts: "htmldocuments-coolshape",
                    //     branches: [
                    //         { accepts: "htmldocuments-coolshape2" },
                    //     ],
                    //     arguments: {
                    //       PAGE: {
                    //         type: Scratch.ArgumentType.STRING,
                    //         defaultValue: "my-page"
                    //       },
                    //     }
                    // },
                    {
                        opcode: 'property',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [PROPERTY] for [TYPE] [NAME] to [VALUE] in [PAGE]',
                        // notchAccepts: "htmldocuments-coolshape2",
                        arguments: {
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "properties",
                                defaultValue: "color"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "types"
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "green",
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page",
                            },
                        }
                    },

                    {
                        opcode: 'remallstyle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear styling of [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "Event Listeners" },


                    {
                        opcode: 'eve',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when listener for [ID] activated in [PAGE]',
                        isEdgeActivated: false,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el",
                                // defaultValue: '{"Hello":"Item 1", "Bye":"Item 2"}'
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'addeve',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add event listener [EVE] for [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'remeve',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove event listeners from [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "Webpage Data" },

                    {
                        opcode: 'allEls',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all elements in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'dataEl',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[OPTS] of [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            OPTS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "opts"
                            },
                        }
                    },


                    { blockType: Scratch.BlockType.LABEL, text: "Webpage Positioning" },

                    {
                        opcode: 'movePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'move [PAGE] to x: [X] y: [Y]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "50"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "50"
                            },
                        }
                    },
                    {
                        opcode: 'resizePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'resize [PAGE] to x: [X] y: [Y]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "300"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "200"
                            },
                        }
                    },
                    {
                        opcode: 'resetDefault',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [PAGE] display settings to stage size',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "300"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "200"
                            },
                        }
                    },
                    {
                        opcode: 'ppos',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[AXIS] of [PAGE]',
                        disableMonitor: true,
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            AXIS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "axis"
                            },
                        }
                    },
                    {
                        opcode: 'spw',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[WH] of the stage',
                        disableMonitor: true,
                        arguments: {
                            WH: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "wh"
                            },
                        }
                    },

                ],
                menus: {
                    nonest: {
                        acceptReporters: true,
                        items:
                            [
                                "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "script", "source", "textarea", "track", "wbr"
                            ]
                    },
                    nest: {
                        acceptReporters: true,
                        items:
                            [
                                "a", "abbr", "address", "article", "aside", "audio", "b", "bdi", "bdo", "blockquote", "button", "canvas", "caption", "cite", "code", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "i", "iframe", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "menu", "meter", "nav", "object", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "slot", "small", "span", "strong", "sub", "summary", "sup", "table", "tbody", "td", "template", "tfoot", "th", "thead", "time", "tr", "u", "ul", "var", "video"
                            ]
                    },
                    types: {
                        acceptReporters: false,
                        items: [
                            { text: "id", value: "#" },
                            { text: "class", value: "." },
                            { text: "tag", value: "" },
                            // {text: "animation", value: "@keyframes "},
                        ]
                    },
                    opts: {
                        acceptReporters: false,
                        items: [
                            { text: "inner HTML", value: "innerHTML" },
                            { text: "text content", value: "textContent" },
                            { text: "children", value: "children" },
                            { text: "parent element", value: "parentElement" },
                            { text: "tag name", value: "tagName" },
                            // { text: "style", value: "style" },
                            { text: "value", value: "value" },
                            { text: "checked", value: "checked" },
                            { text: "class list", value: "classList" },
                            { text: "offset width", value: "offsetWidth" },
                            { text: "offset height", value: "offsetHeight" },
                            { text: "scroll width", value: "scrollWidth" },
                            { text: "scroll height", value: "scrollHeight" },
                            { text: "disabled", value: "disabled" },
                            // { text: "all data of", value: "all" },
                        ]
                    },
                    properties: {
                        acceptReporters: true,
                        items: [

                            'align-content', 'align-items', 'align-self', 'all', 'animation', 'animation-delay', 'animation-direction', 'animation-duration', 'animation-fill-mode', 'animation-iter-count', 'animation-name', 'animation-play-state', 'animation-timing-fn', 'backface-visibility', 'background', 'background-attachment', 'background-blend-mode', 'background-clip', 'background-color', 'background-image', 'background-origin', 'background-position', 'background-repeat', 'background-size', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-left-rad', 'border-bottom-right-ra', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-image', 'border-image-outset', 'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-radius', 'border-right', 'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width', 'border-width', 'bottom', 'box-decoration-break', 'box-shadow', 'box-sizing', 'caption-side', 'caret-color',
                            'clear', 'clip', 'clip-path', 'color', 'column-count', 'column-fill', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-style', 'column-rule-width', 'column-span', 'column-width', 'columns', 'content', 'counter-increment', 'counter-reset', 'cursor', 'direction', 'display', 'empty-cells', 'filter', 'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'float', 'font',
                            'font-family', 'font-kerning', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'gap', 'grid', 'grid-area', 'grid-auto-columns', 'grid-auto-flow', 'grid-auto-rows', 'grid-column', 'grid-column-end', 'grid-column-gap', 'grid-column-start', 'grid-gap', 'grid-row', 'grid-row-end', 'grid-row-gap', 'grid-row-start', 'grid-template', 'grid-template-areas', 'grid-template-columns', 'grid-template-rows', 'height', 'hyphens',
                            'justify-content',
                            'left', 'letter-spacing', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-height', 'max-width',
                            'min-height', 'min-width', 'object-fit', 'object-position', 'opacity', 'order', 'outline', 'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page-break-after', 'page-break-before', 'page-break-inside', 'perspective', 'perspective-origin', 'pointer-events', 'position', 'quotes', 'right', 'row-gap', 'scroll-behavior', 'table-layout', 'text-align', 'text-align-last', 'text-decoration', 'text-decoration-color', 'text-decoration-line', 'text-decoration-style', 'text-indent', 'text-justify', 'text-overflow', 'text-shadow', 'text-transform', 'top', 'transform', 'transform-origin', 'transform-style', 'transition', 'transition-delay', 'transition-duration', 'transition-property', 'transition-timing-fn', 'user-select', 'vertical-align', 'visibility', 'white-space', 'width', 'word-break', 'word-spacing', 'word-wrap', 'writing-mode', 'z-index'

                        ]
                    },
                    axis: {
                        acceptReporters: false,
                        items: [
                            { text: "x position", value: "x" }, { text: "y position", value: "y" }, "width", "height"
                        ]
                    },
                    wh: {
                        acceptReporters: false,
                        items: [
                            "width", "height"
                        ]
                    },
                    eves: {
                        acceptReporters: true,
                        items: [
                            // Mouse & Pointer
                            "click", "dblclick", "mousedown", "mouseup", "mouseenter",
                            "mouseleave", "mousemove", "mouseover", "mouseout", "contextmenu", "wheel",

                            // Keyboard
                            "keydown", "keyup", "keypress",

                            // Form & Input
                            "submit", "input", "change", "focus", "blur", "reset", "invalid",

                            // Window & Document
                            "load", "DOMContentLoaded", "beforeunload", "unload", "resize",
                            "scroll", "error", "visibilitychange",

                            // Drag & Drop
                            "dragstart", "drag", "dragenter", "dragover", "dragleave", "drop", "dragend",

                            // Mobile & Media
                            "touchstart", "touchmove", "touchend", "play"
                        ]
                    },
                    attr: {
                        acceptReporters: false,
                        items: [
                            "accesskey", "autocapitalize", "autofocus", "class", "contenteditable",
                            "dir", "draggable", "enterkeyhint", "hidden", "inert", "inputmode",
                            "lang", "nonce", "part", "popover", "role", "slot", "style", "tabindex",
                            "title", "translate", "virtualkeyboardpolicy",
                            "accept", "accept-charset", "action", "align", "allow", "alt", "as",
                            "async", "autocomplete", "autoplay", "background", "bgcolor", "border",
                            "capture", "charset", "checked", "cite", "color", "cols", "colspan",
                            "content", "controls", "coords", "crossorigin", "csp", "data", "datetime",
                            "decoding", "default", "defer", "disabled", "download", "enctype", "for",
                            "form", "formaction", "formenctype", "formmethod", "formnovalidate",
                            "formtarget", "headers", "height", "high", "href", "hreflang", "http-equiv",
                            "imagesizes", "imagesrcset", "integrity", "ismap", "kind", "label", "list",
                            "loading", "loop", "low", "max", "maxlength", "min", "minlength", "media",
                            "method", "multiple", "muted", "name", "novalidate", "open", "optimum",
                            "pattern", "ping", "placeholder", "playsinline", "poster", "preload",
                            "readonly", "referrerpolicy", "rel", "required", "reversed", "rows",
                            "rowspan", "sandbox", "scope", "selected", "shape", "size", "sizes",
                            "span", "src", "srcdoc", "srclang", "srcset", "start", "step", "target",
                            "type", "usemap", "value", "width", "wrap"
                        ]

                    }

                }
            };
        }

        createPage(args, util) {
            if (!Object.keys(this.pages).includes(args.PAGE)) {
                if (args.PAGE !== "") {
                    this.pages.set(args.PAGE, new Map().set("data", new Map().set("x", 5).set("y", 5).set("width", 470).set("height", 350)).set("code", dom.parseFromString("", 'text/html')).set("eves", new Map()))

                } else {
                    throw new Error("Name cannot be empty")
                }
            }
        }
        clearPage(args, util) {

            // //if (Object.keys(this.pages).includes(args.PAGE)) {
            // let pages = this.pages

            this.pages.get(args.PAGE)?.set("code", dom.parseFromString("", 'text/html'))
            this.pages.get(args.PAGE)?.set("eves", new Map())
            // }
        }
        deletePage(args, util) {

            //if (Object.keys(this.pages).includes(args.PAGE)) {
            this.pages.delete(args.PAGE)
            if (this.viewing.includes(args.PAGE)) {
                const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                elements.forEach(el => el.remove());
            }

            // }
        }
        allPages() {
            return (JSON.stringify(Array.from(this.pages.keys())))
        }
        get() {
            if (Object.keys(this.pages).includes("my-page")) {
                return (JSON.stringify(this.pages["my-page"].code))
            }
        }


        displayPage(args, util) {
            return new Promise((resolve, reject) => {
                try {
                    const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                    elements.forEach(el => el.remove());
                    const el = document.createElement("iframe");
                    el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    el.setAttribute("class", `htmlpage display${args.PAGE}`)
                    el.style.position = 'absolute';
                    el.style.pointerEvents = 'auto';
                    el.style.zIndex = '10';
                    el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                    el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                    el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                    el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                    el.style.border = "1px solid black"
                    const container = Scratch.renderer.canvas.parentElement;
                    container.appendChild(el);
                    if (!this.viewing.includes(args.PAGE)) {
                        this.viewing.push(args.PAGE)
                    }
                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // 

                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        hidePageAll(args, util) {
            const elements = document.querySelectorAll('.htmlpage');
            elements.forEach(el => el.remove());
            this.viewing = []
        }

        hidePage(args, util) {
            const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
            elements.forEach(el => el.remove());
            this.viewing.splice(this.viewing.indexOf(args.PAGE), 1)
        }

        noNestEl(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (args.ID !== "") {
                    if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        // 
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack();
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        const target = util.thread.target;



                        let parentBlockId = ""
                        let parentBlock = ""


                        let childId = currentBlockId;
                        let blockId = target.blocks.getBlock(currentBlockId)?.parent;

                        let nest = ""
                        const loopOpcodes = [
                            'scrtwpmhtmldocuments_nestEl',
                            'scrtwpmhtmldocuments_changeHTML',
                        ];
                        // let blockId = currentBlockId;






                        while (blockId) {
                            const parentBlock = target.blocks.getBlock(blockId);
                            // if (!parentBlock) break;


                            if (loopOpcodes.includes(parentBlock.opcode)) {


                                const substackId = parentBlock.inputs?.SUBSTACK?.block;
                                //   const substack2Id = parentBlock.inputs?.SUBSTACK2?.block;

                                // 

                                if (substackId === childId) {


                                    parentBlockId = blockId;

                                    const pB = blockContainer.getBlock(parentBlockId)
                                    if (pB && pB.el.bin.includes(currentBlockId)) {
                                        nest = pB.el.el



                                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                        // 
                                        let el = document.createElement(args.EL)
                                        el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                                        el = body.appendChild(el)
                                        return
                                    }
                                }

                                if (substackId) {
                                    let checkId = substackId;
                                    while (checkId) {
                                        if (checkId === childId) return blockId;
                                        checkId = target.blocks.getBlock(checkId)?.next;
                                    }
                                }

                                //   if (substack2Id) {
                                //     let checkId = substack2Id;
                                //     while (checkId) {
                                //       if (checkId === childId) return blockId;
                                //       checkId = target.blocks.getBlock(checkId)?.next;
                                //     }
                                //   }
                            }
                            childId = blockId;
                            blockId = parentBlock.parent;
                        }
                        // 
                        // 
                        // if (currentBlock && currentBlock.parent){
                        //     const parentBlockId = currentBlock.parent;
                        //     const parentBlock = blockContainer.getBlock(parentBlockId)
                        //     if(parentBlock && parentBlock.el){
                        //         
                        //         nest = parentBlock.el.el
                        //     }
                        // } 
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        // 


                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                        // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                        // 


                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        // 
                        let el = document.createElement(args.EL)
                        el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        el = body.appendChild(el)
                    } else {
                        throw new Error(`Only one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)

                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                }
            }
        }

        nestEl(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (util.stackFrame.startedBranch) {
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</${args.EL}><!-- end the bottom of ${args.ID} -->`)
                    // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                    // 
                    util.stackFrame.startedBranch = false;
                    return;
                }
                if (args.ID !== "") {
                    if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack(); //
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        let blocksInLoop = []
                        function fn() {

                            const bc = util.thread.target.blocks;

                            const substackInput = currentBlock.inputs.SUBSTACK;
                            if (!substackInput || !substackInput.block) {

                                return;
                            }

                            const branchBlockIds = [];

                            // Helper function to recursively collect block IDs down the chain
                            const scanChain = (startBlockId) => {
                                let nextBlockId = startBlockId;

                                while (nextBlockId) {
                                    branchBlockIds.push(nextBlockId);

                                    const blockInfo = blockContainer.getBlock(nextBlockId);
                                    if (!blockInfo) break;

                                    // If this block is ANOTHER loop, dive inside its mouth first!
                                    if (blockInfo.inputs && blockInfo.inputs.SUBSTACK && blockInfo.inputs.SUBSTACK.block) {
                                        scanChain(blockInfo.inputs.SUBSTACK.block);
                                    }

                                    // If it's an If-Else block, it might also have a SUBSTACK2 mouth
                                    if (blockInfo.inputs && blockInfo.inputs.SUBSTACK2 && blockInfo.inputs.SUBSTACK2.block) {
                                        scanChain(blockInfo.inputs.SUBSTACK2.block);
                                    }

                                    // Move to the next block directly underneath
                                    nextBlockId = blockInfo.next;
                                }
                            };

                            // Start scanning from the very first block inside your custom loop
                            scanChain(substackInput.block);

                            blocksInLoop = branchBlockIds

                        }

                        fn()

                        if (currentBlock) {
                            currentBlock.el = {
                                el: args.ID,
                                compiledScope: 'global',
                                bin: blocksInLoop
                            };
                        }
                        // 

                        const target = util.thread.target;


                        let parentBlockId = ""
                        let parentBlock = ""
                        let nest = ""
                        const loopOpcodes = [
                            'scrtwpmhtmldocuments_nestEl',
                            'scrtwpmhtmldocuments_changeHTML',
                        ];
                        let blockId = currentBlockId;
                        while (blockId) {
                            const block = target.blocks.getBlock(blockId);
                            if (!block) break;

                            if (loopOpcodes.includes(block.opcode) && block !== currentBlock) {
                                // blockId = block.parent;

                                parentBlockId = block;

                                parentBlock = blockContainer.getBlock(parentBlockId)
                                // const pB = blockContainer.getBlock(parentBlockId)
                                if (parentBlockId && parentBlockId.el.bin.includes(currentBlockId)) {
                                    nest = parentBlockId.el.el



                                    let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                    // 
                                    let el = document.createElement(args.EL)
                                    el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                                    el = body.appendChild(el)


                                    util.stackFrame.startedBranch = true;
                                    util.startBranch(1);
                                    return
                                }


                            }

                            blockId = block.parent; // Move to the parent block [3]

                        }
                        // 
                        // if (currentBlock && currentBlock.parent && currentBlock.parent.el){
                        //     nest = currentBlock.parent.el
                        // } 
                        // 
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        // 
                        let el = document.createElement(args.EL)
                        el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        el = body.appendChild(el)
                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`)
                    } else {
                        throw new Error(`Ony one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)
                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`)
                }
                util.stackFrame.startedBranch = true;
                util.startBranch(1, true);
            }
        }


        changeHTML(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (util.stackFrame.startedBranch) {
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</${args.EL}><!-- end the bottom of ${args.ID} -->`)
                    // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                    // 
                    util.stackFrame.startedBranch = false;
                    return;
                }
                let blocksInLoop = []
                if (args.ID !== "") {
                    if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack(); //
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        function fn() {
                            const bc = util.thread.target.blocks;
                            const currentBlock = bc.getBlock(currentBlockId);
                            if (!currentBlock) return;

                            // 3. Find the ID of the first block inside the loop's C-shaped slot (SUBSTACK)
                            const substackInput = currentBlock.inputs.SUBSTACK;
                            if (!substackInput || !substackInput.block) {

                                return;
                            }

                            const branchBlockIds = [];
                            let nextBlockId = substackInput.block;

                            // 4. Follow the chain of linked blocks sequentially down the branch
                            while (nextBlockId) {
                                branchBlockIds.push(nextBlockId);

                                const blockInfo = bc.getBlock(nextBlockId);
                                // Move down to the next block inline, stopping if there are no more
                                nextBlockId = blockInfo ? blockInfo.next : null;
                            }

                            // 5. Output the list of specific IDs
                            blocksInLoop = (branchBlockIds);
                        }

                        fn()

                        if (currentBlock) {
                            currentBlock.el = {
                                el: args.ID,
                                compiledScope: 'global',
                                bin: blocksInLoop
                            };
                        }
                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                        body.innerHTML = ""
                        // 

                        //   const target = util.thread.target;


                        //     let parentBlockId = ""
                        //     let parentBlock = ""
                        //     let nest = ""
                        //     const loopOpcodes = [
                        //         'scrtwpmhtmldocuments_nestEl',
                        //                 ];
                        //                 let blockId = currentBlockId;
                        //                 while (blockId) {
                        //                     const block = target.blocks.getBlock(blockId);
                        //                     if (!block) break;

                        //                     if (loopOpcodes.includes(block.opcode) && block !== currentBlock) {
                        //                         // blockId = block.parent;
                        //                         
                        //                         parentBlockId = block;
                        //                         
                        //                         parentBlock = blockContainer.getBlock(parentBlockId)
                        //                         nest = parentBlockId.el.el
                        //                         


                        //             // let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        //             // // 
                        //             // let el = document.createElement(args.EL)
                        //             // el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        //             // el = body.appendChild(el)


                        //                         util.stackFrame.startedBranch = true;
                        //     util.startBranch(1);
                        //     return



                        // }

                        //  blockId = block.parent; // Move to the parent block [3]

                        // }
                        // 
                        // if (currentBlock && currentBlock.parent && currentBlock.parent.el){
                        //     nest = currentBlock.parent.el
                        // } 
                        // 
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        // let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        // // 
                        // let el = document.createElement(args.EL)
                        // el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        // el = body.appendChild(el)
                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`)
                    } else {
                        throw new Error(`Ony one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)
                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`)
                }
                util.stackFrame.startedBranch = true;
                util.startBranch(1, true);
            }
        }

        text(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {

            // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}${text}`)



            if ((this.pages).has(args.PAGE)) {
                // if (args.ID !== "") {
                // if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                // 
                const blockContainer = util.thread.blockContainer;
                const currentBlockId = util.thread.peekStack();
                const currentBlock = blockContainer.getBlock(currentBlockId);
                const target = util.thread.target;



                let parentBlockId = ""
                let parentBlock = ""


                let childId = currentBlockId;
                let blockId = target.blocks.getBlock(currentBlockId)?.parent;

                let nest = ""
                const loopOpcodes = [
                    'scrtwpmhtmldocuments_nestEl',
                    'scrtwpmhtmldocuments_changeHTML',

                ];
                // let blockId = currentBlockId;






                while (blockId) {
                    const parentBlock = target.blocks.getBlock(blockId);
                    // if (!parentBlock) break;


                    if (loopOpcodes.includes(parentBlock.opcode)) {


                        const substackId = parentBlock.inputs?.SUBSTACK?.block;
                        //   const substack2Id = parentBlock.inputs?.SUBSTACK2?.block;

                        // 

                        if (substackId === childId) {


                            parentBlockId = blockId;

                            const pB = blockContainer.getBlock(parentBlockId)
                            if (pB && pB.el.bin.includes(currentBlockId)) {
                                nest = pB.el.el


                                let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                // 

                                let text = document.createRange().createContextualFragment(args.TEXT)
                                let elements = text.querySelectorAll(`script`);
                                elements.forEach(el => el.remove());
                                text = toAString.serializeToString(text)
                                body.innerHTML += text


                                return
                            }
                        }

                        if (substackId) {
                            let checkId = substackId;
                            while (checkId) {
                                if (checkId === childId) return blockId;
                                checkId = target.blocks.getBlock(checkId)?.next;
                            }
                        }

                        //   if (substack2Id) {
                        //     let checkId = substack2Id;
                        //     while (checkId) {
                        //       if (checkId === childId) return blockId;
                        //       checkId = target.blocks.getBlock(checkId)?.next;
                        //     }
                        //   }
                    }
                    childId = blockId;
                    blockId = parentBlock.parent;
                }
                // 
                // 
                // if (currentBlock && currentBlock.parent){
                //     const parentBlockId = currentBlock.parent;
                //     const parentBlock = blockContainer.getBlock(parentBlockId)
                //     if(parentBlock && parentBlock.el){
                //         
                //         nest = parentBlock.el.el
                //     }
                // } 
                // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                // 


                // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                // 
                //     } else {
                //         throw new Error(`Only one element with the id "${args.ID}" can exist in the document`)
                //     }
                // } else {
                //         throw new Error(`Element must have an id`)

                //     // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                //     // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                // }

                let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                // 

                let text = document.createRange().createContextualFragment(args.TEXT)
                let elements = text.querySelectorAll(`script`);
                elements.forEach(el => el.remove());
                text = toAString.serializeToString(text)
                body.innerHTML += text

            }



            // }
        }

        removeEl(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {


                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                    // 
                    el.remove()
                }


            }
            // }

        }

        styleEl(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {


            if (util.stackFrame.startedBranch) {
                this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</style><!--end my style-->`)

                util.stackFrame.startedBranch = false;
                return;
            }

            const blockContainer = util.thread.blockContainer;
            const currentBlockId = util.thread.peekStack(); //
            const currentBlock = blockContainer.getBlock(currentBlockId);
            if (currentBlock) {
                currentBlock.stylePage = {
                    page: args.PAGE,
                    compiledScope: 'global',
                };
            }
            this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!--begin my style--><style>`)

            util.stackFrame.startedBranch = true;
            util.startBranch(1, true);

            //             if (Object.keys(this.pages).includes(args.PAGE)){
            //     if (util.stackFrame.startedBranch) {
            //         this.pages[args.PAGE].code += `</${args.EL}><!-- end the bottom of ${args.ID} -->`

            //         util.stackFrame.startedBranch = false; 
            //         return; 
            //     }
            //     if(args.ID !== ""){
            //         if(!this.pages[args.PAGE].ids.includes(args.ID)){
            //         this.pages[args.PAGE].ids.push(args.ID)
            //         this.pages[args.PAGE].code += `<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`
            //         } else {
            //         throw new Error (`Ony one element with the id "${args.ID}" can exist in the document`)
            //         }
            //     } else {
            //         this.pages[args.PAGE].code += `<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`
            //     }
            //     util.stackFrame.startedBranch = true;
            //     util.startBranch(1, true); 
            // }


            //     if (util.stackFrame.startedBranch) {
            //         //do after
            //         this.pages[args.PAGE].code += `</style><!--end my style-->`

            //         util.stackFrame.startedBranch = false; 
            //         return; 
            //     }
            //     //do before
            //         const blockContainer = util.thread.blockContainer;
            //         const currentBlockId = util.thread.peekStack(); //
            //         const currentBlock = blockContainer.getBlock(currentBlockId);
            //         if (currentBlock) {
            //         currentBlock.stylePage = {
            //             page: args.PAGE,
            //             compiledScope: 'global',
            //         };

            //         this.pages[args.PAGE].code += `<!--begin my style--><style>`




            //         }
            //     util.stackFrame.startedBranch = true;
            //     util.startBranch(1, true); 
            // }


            // }
            // }

        }
        property(args, util) {
            if (this.pages.has(args.PAGE)) {
                function containsCssUnit(str) {
                    const cssUnitsPattern = /\d+(?:px|em|rem|ex|ch|vw|vh|vmin|vmax|cm|mm|in|pt|pc|Q|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|%)\b/i;
                    return cssUnitsPattern.test(str);
                }

                // const blockContainer = util.thread.blockContainer;
                // const currentBlockId = util.thread.peekStack();
                // const currentBlock = blockContainer.getBlock(currentBlockId);

                // if (currentBlock) {
                //     if(currentBlock.parent){
                //     const parentBlockId = currentBlock.parent;
                //     const parentBlock = blockContainer.getBlock(parentBlockId);
                let px = this.changePx
                let value = ""

                if (px.includes(args.VALUE)) {
                    if (!containsCssUnit(args.VALUE)) {
                        value = `${args.VALUE}px`
                    } else {
                        value = args.VALUE
                    }
                } else {
                    value = args.VALUE
                }

                // if (parentBlock.stylePage && parentBlock) {


                if (!this.pages.get(args.PAGE)?.get("code").querySelector("style")) {
                    let body = this.pages.get(args.PAGE)?.get("code").querySelector("head")
                    // 
                    let el = document.createElement("style")
                    if (args.TYPE === "") {
                        el.innerHTML = `${args.NAME}{${args.PROPERTY}:${value};}`
                    } else {
                        el.innerHTML = `${args.TYPE}element${args.PAGE}${args.NAME}{${args.PROPERTY}:${value};}`
                    }
                    el = body.appendChild(el)
                } else {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector("style")
                    if (args.TYPE === "") {
                        el.innerHTML += `${args.NAME}{${args.PROPERTY}:${value};}`
                    } else {
                        el.innerHTML += `${args.TYPE}element${args.PAGE}${args.NAME}{${args.PROPERTY}:${value};}`
                    }
                }

                // }

                //     } else {
                //         // throw new Error(`Just clicking this block won't do anything. You have to put it inside of an "add style to" loop first. The shape matches the shape of this block!`)
                //     }
                // }


            }
        }


        remallstyle(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {


            if (this.pages.get(args.PAGE)?.get("code").querySelector(`style`)) {
                let el = this.pages.get(args.PAGE)?.get("code").querySelector(`style`)
                // 
                el.remove()
            }

            // }
        }

        setAttr(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            if (args.ID !== "") {


                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                    // 
                    if (args.ATTR === "class") {
                        el.setAttribute(args.ATTR, `element${args.PAGE}${args.VAL}`)
                    } else {
                        el.setAttribute(args.ATTR, args.VAL)
                    }

                }
            }
            // }
        }

        ppos(args, util) {
            if ((this.pages).has(args.PAGE)) {
                return (this.pages.get(args.PAGE).get("data").get(args.AXIS))
            } else {
                return ('Page does not exist!')
            }
        }

        movePage(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            return new Promise((resolve, reject) => {
                try {
                    this.pages.get(args.PAGE).get("data").set("x", args.X)
                    this.pages.get(args.PAGE).get("data").set("y", args.Y)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // 

                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });


        }
        resizePage(args, util) {

            return new Promise((resolve, reject) => {
                try {
                    //if (Object.keys(this.pages).includes(args.PAGE)) {
                    this.pages.get(args.PAGE).get("data").set("width", args.X)
                    this.pages.get(args.PAGE).get("data").set("height", args.Y)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // 

                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        resetDefault(args, util) {

            return new Promise((resolve, reject) => {
                try {
                    //if (Object.keys(this.pages).includes(args.PAGE)) {
                    this.pages.get(args.PAGE).get("data").set("width", Number(window.getComputedStyle(Scratch.renderer.canvas.parentElement).width.replace("px", "")) - 10)
                    this.pages.get(args.PAGE).get("data").set("height", Number(window.getComputedStyle(Scratch.renderer.canvas.parentElement).height.replace("px", "")) - 10)
                    this.pages.get(args.PAGE).get("data").set("x", 5)
                    this.pages.get(args.PAGE).get("data").set("y", 5)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // 

                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        spw(args, util) {
            return (window.getComputedStyle(Scratch.renderer.canvas.parentElement)[args.WH].replace("px", ""))
        }

        importHTML(args, util) {

        }

        prettierInText(html) {
            let clean = html.replace(/\s*([<>])\s*/g, '$1').replace(/\s+/g, ' ');
            let reg = /(<[^>]+>)/g;
            let matches = clean.split(reg).filter(Boolean);
            let formatted = '';
            let pad = 0;
            matches.forEach((token) => {
                if (token.match(/<\/\w+/)) {
                    pad--;
                }
                formatted += '  '.repeat(Math.max(0, pad)) + token + '\n';
                if (token.match(/<[^\/][^>]*[^>\/]>/) && !token.match(/<(input|img|br|hr|meta|link)/)) {
                    pad++;
                }
            });
            return formatted.trim();
        }


        getHTML(args, util) {
            if ((this.pages).has(args.PAGE)) {
                let doc = this.pages.get(args.PAGE).get("code")
                let el = toAString.serializeToString(doc)
                // let el = this.pages.get(args.PAGE).get("code");
                let cleanString = el.replace(/<!--[\s\S]*?-->/g, "").replace(/xmlns="[\s\S]*?"/g, "").replaceAll(`element${args.PAGE}`, "");
                let toChange = `<html><body>${cleanString}</body></html>`

                return (this.prettierInText(cleanString))
            } else {
                return ('Page does not exist!')
            }
        }


        addeve(args, util) {
            let el = this.pages.get(args.PAGE)?.get("code").getElementById(`element${args.PAGE}${args.ID}`);
            if (!el) throw new Error(`An element with the id "${args.ID}" doesn't exist in the page`);
            this.pages.get(args.PAGE)?.get("eves").set(args.ID, args.EVE)
            // 
        }

        remeve(args) {
            let el = this.pages.get(args.PAGE)?.get("code").getElementById(`element${args.PAGE}${args.ID}`);
            if (!el) return;
            this.pages.get(args.PAGE)?.get("eves").delete(args.ID)


            if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                return new Promise((resolve, reject) => {
                    try {
                        //if (Object.keys(this.pages).includes(args.PAGE)) {
                        if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                            const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                            elements.forEach(el => el.remove());
                            const el = document.createElement("iframe");
                            el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                            el.setAttribute("class", `htmlpage display${args.PAGE}`)
                            el.style.position = 'absolute';
                            el.style.pointerEvents = 'auto';
                            el.style.zIndex = '10';
                            el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                            el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                            el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                            el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                            el.style.border = "1px solid black"
                            const container = Scratch.renderer.canvas.parentElement;
                            container.appendChild(el);
                            if (!this.viewing.includes(args.PAGE)) {
                                this.viewing.push(args.PAGE)
                            }
                        }
                        // }

                        el.onload = () => {
                            for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                                // 

                                el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                    const triggerText = String(key);
                                    const triggerTexta = String(args.PAGE);

                                    const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                    const vm = Scratch.vm;

                                    vm.runtime.targets.forEach(target => {
                                        const blocks = target.blocks;
                                        const scripts = blocks.getScripts();

                                        scripts.forEach(rootBlockId => {
                                            const block = blocks.getBlock(rootBlockId);

                                            if (block && block.opcode === targetOpcode) {
                                                let hatValue = '';
                                                let hatValuea = '';

                                                if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                    hatValue = block.fields.ID.value;
                                                    hatValuea = block.fields.PAGE.value;
                                                }
                                                else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                    const inputID = block.inputs.ID;
                                                    const inputPAGE = block.inputs.PAGE;

                                                    const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                    const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                    if (shadowBlockID && shadowBlockID.fields) {
                                                        const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                        hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                    }
                                                    if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                        const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                        hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                    }
                                                }

                                                if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                    vm.runtime._pushThread(rootBlockId, target);
                                                }
                                            }
                                        });
                                    });
                                }

                                )


                            }
                        }
                    } catch (error) { }
                    resolve();
                });
            }
        }

        allEls(args, util) {
            if (this.pages.has(args.PAGE)) {
                const allIds = Array.from(this.pages.get(args.PAGE).get("code").querySelectorAll('[id]:not([id=""])'))
                    .map(element => element.id.replace(`element${args.PAGE}`, ""));
                return (JSON.stringify(allIds));
            } else {
                return ('[]')
            }
        }

        dataEl(args, util) {
            try {
                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    switch (args.OPTS) {
                        case "children":
                            return ([...this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS]].map(child => child.id).filter(id => id !== ""))
                        case "parentElement":
                            return (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS].getAttribute("id") ?? this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS].tagName)
                        default:
                            if (args.OPTS !== "innerHTML") {
                                if (this.viewing.includes(args.PAGE)) {
                                    return (document.querySelector(`.htmlpage.display${args.PAGE}`).contentDocument.querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS] ?? "")
                                } else {
                                    return ("Display the page to use these.")
                                }
                            } else {
                                return (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS] ?? "")
                            }

                    }
                } else {
                    return (`An element with the id "${args.ID}" doesn't exist in the page`)
                }
            } catch (error) { return ("") }
        }




        eve() {
            return true;
        }

        current() {
            if (document.querySelector(".htmlpage")) {
                return (JSON.stringify(this.viewing))
            } else {
                return ('[]')
            }
        }
    }

    Scratch.extensions.register(new HTMLDocuments(Scratch.runtime));
})(Scratch);
