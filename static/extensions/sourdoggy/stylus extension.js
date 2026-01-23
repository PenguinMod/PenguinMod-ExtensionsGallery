let pressure = 0.5;
let tiltx = 0;
let tilty = 0;
let pointertype = "mouse";
addEventListener(
  "pointerrawupdate",
  (event) => {
    pressure = event.pressure
	tiltx = event.tiltX
	tilty = event.tiltY
	pointertype = event.pointerType
  },
  false,
);

class StylusExtension {
	getInfo () {
		return {
			blockIconURI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAR2SURBVGhD7ZpNqFVVFMff1afmRyn4jSgmqZQSOUijBAeiBiKJA6NJgiQ0iiaFCRE1CJKgZoEZFQ2aRAOxRKiIorQPa6CEQSEkllRGlvlRPl+/33Hd6/V07nn36mmfZ/SHH+ec+/bda6+791r747y+/4oaca1Vg4ODo7nMgYFGo3Ek+/BaEg70wxb4Ak7DL/A0jIsi14Zo8A64AOpPOB/o2N0wKYoOX9HIO6FMOvg9PAFT42vDSzSsAbNgL/wFZRqAA3BjfH14iAaNgLvA+BgFDqFvoUz2ziG4IaqpXzTmPjAeXoG5oGMz4AX4HTpJZx6LauoVDbkFTtqq0I+wFkbDGLgd9oPDqUj1p2YaMRI+g2aWaspGvwyzwd65HraBvZaXZRdFlfWIBjwcDekke+dRGA8mgxVwAvLaB/VM5Bi+DZzwhpKOvgfTwESwAc6CsifFSXNyVJ1OGF0Gv0Ev0pkp4FBbDc4nSkc+gFFRfRph0J5o/qK9ypQ8E0wEi8Ef40WYH9WnEQYnwk9wNfoU5kV9OnNdVnkqYdAM9SaUBXe3Og63QmmAj4hrZQqDD8A6qKJ+11mbWN4PXnxMJBxZDkOtn7qVwW2spF00YnACOB9UJSfF9VF9qaoeWo9AlTn+MLx18TaR+OVWQTeTXrc6B3Oj+jTC4Fj4BvLrqCuVTpgs0gmDTli7tF6RTNk7Ie16CoMPQVVZSjmJpt1AYdCJqn1/cbWyN1ZE9WmEQTdCn0M+Lnx2adFLGvY7OvEspBtSGDMuXgIbkHfkbdDJeXA/uEkaauHYdH5MmEgjDG6GorjwgOAfh2t89mT21876AbLFYTJh0KX1Ucj3hLHSOrLh3oVjNky4boRO6nr2rkwY9AjndcivanVqYxSznLu71qqB+62Ql9+xnudgZBRNIwyaavNOqN3gQXQm7qfHrffuv7+DvHTEoZg8LtztFW1Z3S9Mi2KWc5Zv7431UKQ/4I4olkYYdEh9DPm4UBuijL/8VGgFO/cLoCgp+NnmKJZOGPUg2SFV5Ehrr8B9e094rHPYAm1qxsXzkDwulkDZqnZhFG2Jz+zBN7K/Xi4d8UA6eVyYQj+BMjnksuHE1eGlE89AUVIwLtIuzRVGfYdRdHSZl2P+KfBQ+l4oGoKWWR1VpxWGPSDzPcZrUNS4buVbKF+xpV2aK4xOBlOuk5trpzXwM/QqnXgXqt5WdycM3wOnwJl3Ojj2bwbf7/UiJ70pUW16YfxBaA6ng+DpuEPNE0SdKwrmvNyyLo0q6xENeDxryiW5FHecu4QXV8BnoJN0dDukj4t20QBfvhQFuK/M7BVT80rw0CEv42IP9Ed19YlGvAOdMpXH/jeBQ803TT636ysYG1XVKxryEZSlXA8JloJJYBK8CvbE17AkqqlfNGYoR4wBX425adIZh5q9U8twKsvtF8ATcK9NfJYBOAkH4Az0NxoN/yHmKJznObk6ZhR+2a1cPMvVWZ04BcfgS3gfPqTRx7kOC5WmRpwZz2UinKbRv2Yf/q9/U319fwOwetfcnSkkLQAAAABJRU5ErkJggg==",
			id: "SDStylusExtension",
			name: "Stylus",
			color1: "#694baf",
            color2: "#513691",
            color3: "#281994",
			blocks: [
				{
					opcode: "PointerType",
					blockType: Scratch.BlockType.REPORTER,
					text: "Pointer Type"
				},
				{
					opcode: "Pressure",
					blockType: Scratch.BlockType.REPORTER,
					text: "Pen Pressure"
				},
				{
					opcode: "TiltX",
					blockType: Scratch.BlockType.REPORTER,
					text: "Pen Tilt X"
				},
				{
					opcode: "TiltY",
					blockType: Scratch.BlockType.REPORTER,
					text: "Pen Tilt Y"
				},
			]
		};
	}
	
	Pressure() {
		return pressure;
	}
	
	TiltX() {
		return tiltx;
	}
	
	TiltY() {
		return tilty;
	}
	
	PointerType() {
		return pointertype;
	}
	
}

Scratch.extensions.register(new StylusExtension());