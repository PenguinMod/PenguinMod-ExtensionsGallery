(function (Scratch) {
    'use strict';
    const extIcon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxODUuNDk4MSIgaGVpZ2h0PSIxODUuNDk4MSIgdmlld0JveD0iMCwwLDE4NS40OTgxLDE4NS40OTgxIj48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjI0MCIgeTE9Ijg5LjI1MDk1IiB4Mj0iMjQwIiB5Mj0iMjcwLjc0OTA1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAwOGNiYiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwNjY4OCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIyNDAiIHkxPSI4OS4yNTA5NSIgeDI9IjI0MCIgeTI9IjI3MC43NDkwNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0yIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMDdlYTgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDUyNmQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQ3LjI1MDk1LC04Ny4yNTA5NSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTE0OS4yNTA5NSwxODBjMCwtNTAuMTE5MzIgNDAuNjI5NzMsLTkwLjc0OTA1IDkwLjc0OTA1LC05MC43NDkwNWM1MC4xMTkzMiwwIDkwLjc0OTA1LDQwLjYyOTczIDkwLjc0OTA1LDkwLjc0OTA1YzAsNTAuMTE5MzIgLTQwLjYyOTczLDkwLjc0OTA1IC05MC43NDkwNSw5MC43NDkwNWMtNTAuMTE5MzIsMCAtOTAuNzQ5MDUsLTQwLjYyOTczIC05MC43NDkwNSwtOTAuNzQ5MDV6IiBmaWxsPSJ1cmwoI2NvbG9yLTEpIiBzdHJva2U9InVybCgjY29sb3ItMikiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik0xOTYuODY2MzIsMjE2LjY0MjgybDE2LjQ4NjM4LC0yNy41ODE3OGwxNi40ODYzOSwyNy41ODE3OHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxYzUwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTIyOS4yNzYxMiwyMTYuNTg4NzRsMjMuOTgwMiwtNDYuMDc3NzlsMjMuOTgwMiw0Ni4wNzc3OXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxYzUwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTE4Ni41MDY4OSwyMzYuMjk1MjVjLTIuMjA5MTQsMCAtNCwtMS45Mzc1MyAtNCwtNC4zMjc1OXYtOTkuOTQxMzJjMCwtMi4zOTAwNiAxLjc5MDg2LC00LjMyNzU5IDQsLTQuMzI3NTloMTEwLjk4MDIyYzIuMjA5MTQsMCA0LDEuOTM3NTMgNCw0LjMyNzU5djk5Ljk0MTMyYzAsMi4zOTAwNiAtMS43OTA4Niw0LjMyNzU5IC00LDQuMzI3NTl6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGEwZDYiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xODQuNTA5ODksMjM0LjI5ODI1Yy0yLjIwOTE0LDAgLTQsLTEuOTM3NTMgLTQsLTQuMzI3NTl2LTk5Ljk0MTMyYzAsLTIuMzkwMDYgMS43OTA4NiwtNC4zMjc1OSA0LC00LjMyNzU5aDExMC45ODAyMmMyLjIwOTE0LDAgNCwxLjkzNzUzIDQsNC4zMjc1OXY5OS45NDEzMmMwLDIuMzkwMDYgLTEuNzkwODYsNC4zMjc1OSAtNCw0LjMyNzU5eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBjMWZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTk0LjUzNTk5LDIxNC42NDU4M2wxNi40ODYzOCwtMjcuNTgxNzhsMTYuNDg2MzksMjcuNTgxNzh6IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNGRlMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0yOTMuMzkzOTQsMTU0LjgyNzE5YzAsOS42Nzc0NCAtNy4yNjM5OSwxNy41MjI1NCAtMTYuMjI0NTcsMTcuNTIyNTRjLTguOTYwNTgsMCAtMTYuMjI0NTgsLTcuODQ1MTEgLTE2LjIyNDU4LC0xNy41MjI1NGMwLC05LjY3NzQ0IDcuMjYzOTksLTE3LjUyMjU0IDE2LjIyNDU4LC0xNy41MjI1NGM4Ljk2MDU4LDAgMTYuMjI0NTcsNy44NDUxMSAxNi4yMjQ1NywxNy41MjI1NHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QyY2IwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTIyNy4yNzkxMywyMTQuNTkxNzRsMjMuOTgwMiwtNDYuMDc3NzlsMjMuOTgwMTksNDYuMDc3Nzl6IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNGRlMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0yOTEuMDYzNjEsMTUyLjgzMDE5YzAsOS42Nzc0NCAtNy4yNjM5OSwxNy41MjI1NCAtMTYuMjI0NTcsMTcuNTIyNTRjLTguOTYwNTgsMCAtMTYuMjI0NTgsLTcuODQ1MTEgLTE2LjIyNDU4LC0xNy41MjI1NGMwLC05LjY3NzQ0IDcuMjYzOTksLTE3LjUyMjU0IDE2LjIyNDU4LC0xNy41MjI1NGM4Ljk2MDU4LDAgMTYuMjI0NTcsNy44NDUxMSAxNi4yMjQ1NywxNy41MjI1NHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZjcwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6OTIuNzQ5MDUwMDAwMDAwMDE6OTIuNzQ5MDUwMDAwMDAwMDEtLT4=";
    let saved = {};
function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
function RGBAToHex(rgba, forceRemoveAlpha = false) {
    return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
      .split(',') // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string)) // Converts them to numbers
      .map((number, index) => index === 4 ? Math.round(number * 255) : number) // Converts alpha to 255 number
      .map(number => number.toString(16)) // Converts numbers to hex
      .map(string => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
      .join("") // Puts the array to together to a string
  }
  
    class images {
        canvas;
        ctx;
        current;
        constructor() {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.current = "";
                }
        getInfo() {
            return {
                id:"images",
                name:"Images",
                blockIconURI: extIcon,
                color1:"#327da8",
                color2:"#1f475e",
                color3:"#235c7d",
                blocks:[
                    {
                        opcode:"newImage",
                        text:"new image [name] with size [width], [height]",
                        blockType:Scratch.BlockType.COMMAND,
                        arguments:{
                            name:{
                                type:Scratch.ArgumentType.STRING,
                                defaultValue: "image"
                            },
                            width:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue: 128
                            },
                            height:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue: 128
                            }
                        }
                    },
                    {
                        opcode:"removeImage",
                        text:"delete image [name]",
                        blockType:Scratch.BlockType.COMMAND,
                        arguments:{
                            name:{
                                type:Scratch.ArgumentType.STRING,
                                defaultValue:"image"
                            }
                        }
                    },
                    {
                        opcode:"setCurrent",
                        text:"set current image to [name]",
                        blockType:Scratch.BlockType.COMMAND,
                        arguments:{
                            name:{
                                type:Scratch.ArgumentType.STRING,
                                defaultValue: "image"
                            }
                        }
                    },
                    {
                        opcode:"writePixel",
                        text:"write pixel [color] at [x], [y]",
                        blockType:Scratch.BlockType.COMMAND,
                        arguments:{
                            color:{
                                type:Scratch.ArgumentType.COLOR,
                                defaultValue: "#ffffff"
                            },
                            x:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            y:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode:"readPixel",
                        text:"read pixel [x], [y]",
                        blockType:Scratch.BlockType.REPORTER,
                        arguments:{
                            x:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            y:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode:"importImage",
                        text:"import image [uri] as [name]",
                        blockType:Scratch.BlockType.COMMAND,
                        arguments:{
                            uri:{
                                type:Scratch.ArgumentType.STRING,
                                defaultValue:"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMjIuOTc3MjIiIGhlaWdodD0iMTEyLjU5MzUiIHZpZXdCb3g9IjAsMCwxMjIuOTc3MjIsMTEyLjU5MzUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzkuNTA5ODksLTEyNC43MDE3NSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMTk2Ljg2NjMyLDIxNi42NDI4MmwxNi40ODYzOCwtMjcuNTgxNzhsMTYuNDg2MzksMjcuNTgxNzh6IiBzdHJva2U9IiMyMWM1MDAiLz48cGF0aCBkPSJNMjI5LjI3NjEyLDIxNi41ODg3NGwyMy45ODAyLC00Ni4wNzc3OWwyMy45ODAyLDQ2LjA3Nzc5eiIgc3Ryb2tlPSIjMjFjNTAwIi8+PHBhdGggZD0iTTE4Ni41MDY4OSwyMzYuMjk1MjVjLTIuMjA5MTQsMCAtNCwtMS45Mzc1MyAtNCwtNC4zMjc1OXYtOTkuOTQxMzJjMCwtMi4zOTAwNiAxLjc5MDg2LC00LjMyNzU5IDQsLTQuMzI3NTloMTEwLjk4MDIyYzIuMjA5MTQsMCA0LDEuOTM3NTMgNCw0LjMyNzU5djk5Ljk0MTMyYzAsMi4zOTAwNiAtMS43OTA4Niw0LjMyNzU5IC00LDQuMzI3NTl6IiBzdHJva2U9IiMwMGEwZDYiLz48cGF0aCBkPSJNMTg0LjUwOTg5LDIzNC4yOTgyNWMtMi4yMDkxNCwwIC00LC0xLjkzNzUzIC00LC00LjMyNzU5di05OS45NDEzMmMwLC0yLjM5MDA2IDEuNzkwODYsLTQuMzI3NTkgNCwtNC4zMjc1OWgxMTAuOTgwMjJjMi4yMDkxNCwwIDQsMS45Mzc1MyA0LDQuMzI3NTl2OTkuOTQxMzJjMCwyLjM5MDA2IC0xLjc5MDg2LDQuMzI3NTkgLTQsNC4zMjc1OXoiIHN0cm9rZT0iIzAwYzFmZiIvPjxwYXRoIGQ9Ik0xOTQuNTM1OTksMjE0LjY0NTgzbDE2LjQ4NjM4LC0yNy41ODE3OGwxNi40ODYzOSwyNy41ODE3OHoiIHN0cm9rZT0iIzI0ZGUwMCIvPjxwYXRoIGQ9Ik0yOTMuMzkzOTQsMTU0LjgyNzE5YzAsOS42Nzc0NCAtNy4yNjM5OSwxNy41MjI1NCAtMTYuMjI0NTcsMTcuNTIyNTRjLTguOTYwNTgsMCAtMTYuMjI0NTgsLTcuODQ1MTEgLTE2LjIyNDU4LC0xNy41MjI1NGMwLC05LjY3NzQ0IDcuMjYzOTksLTE3LjUyMjU0IDE2LjIyNDU4LC0xNy41MjI1NGM4Ljk2MDU4LDAgMTYuMjI0NTcsNy44NDUxMSAxNi4yMjQ1NywxNy41MjI1NHoiIHN0cm9rZT0iI2QyY2IwMCIvPjxwYXRoIGQ9Ik0yMjcuMjc5MTMsMjE0LjU5MTc0bDIzLjk4MDIsLTQ2LjA3Nzc5bDIzLjk4MDE5LDQ2LjA3Nzc5eiIgc3Ryb2tlPSIjMjRkZTAwIi8+PHBhdGggZD0iTTI5MS4wNjM2MSwxNTIuODMwMTljMCw5LjY3NzQ0IC03LjI2Mzk5LDE3LjUyMjU0IC0xNi4yMjQ1NywxNy41MjI1NGMtOC45NjA1OCwwIC0xNi4yMjQ1OCwtNy44NDUxMSAtMTYuMjI0NTgsLTE3LjUyMjU0YzAsLTkuNjc3NDQgNy4yNjM5OSwtMTcuNTIyNTQgMTYuMjI0NTgsLTE3LjUyMjU0YzguOTYwNTgsMCAxNi4yMjQ1Nyw3Ljg0NTExIDE2LjIyNDU3LDE3LjUyMjU0eiIgc3Ryb2tlPSIjZmZmNzAwIi8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6NjAuNDkwMTA5OTk5OTk5OTk6NTUuMjk4MjQ5OTk5OTk5OTk2LS0+"
                            },
                            name:{
                                type:Scratch.ArgumentType.STRING,
                                defaultValue:"image"
                            }
                        }
                    },
                    {
                        opcode:"exportImage",
                        text:"export current image  as [format]",
                        disableMonitor:true,
                        blockType:Scratch.BlockType.REPORTER,
                        arguments:{
                            format:{
                                type:Scratch.ArgumentType.STRING,
                                menu:"exportTypes",
                                defaultValue:"png"
                            }
                        }
                    },
                    {
                        opcode:"listImages",
                        text:"list images",
                        disableMonitor:true,
                        blockType:Scratch.BlockType.REPORTER
                    },
                    {
                        opcode:"getCurrent",
                        text:"get current",
                        disableMonitor:true,
                        blockType:Scratch.BlockType.REPORTER
                    },
                    {
                        opcode:"getWidth",
                        text:"get width",
                        blockType:Scratch.BlockType.REPORTER
                    },
                    {
                        opcode:"getHeight",
                        text:"get height",
                        blockType:Scratch.BlockType.REPORTER
                    },
                    {
                        opcode:"grabRegion",
                        text:"grab region at [x], [y] of size [width], [height]",
                        blockType:Scratch.BlockType.REPORTER,
                        arguments:{
                            x:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue:0
                            },
                            y:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue:0
                            },
                            width:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue:16
                            },
                            height:{
                                type:Scratch.ArgumentType.NUMBER,
                                defaultValue:16
                            }
                        }
                    }
                ],
                menus:{
                    exportTypes:{
                        items:[
                        "png",
                        "jpeg",
                        "bitmap"
                        ],
                        acceptReporters: false
                    }
                }
            };
        };
        newImage({name,width,height}){
            let image = new Image(width,height);
            this.canvas.width = width;
            this.canvas.height = height;
            // fill canvas
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
            image.src = this.canvas.toDataURL('image/png');
            saved[name] = image;
        };
        removeImage({name}) {
            delete saved[name];
        }
        setCurrent({name}) {
            this.current = name;
        };
        writePixel({color,x,y}) {
            if (!saved[this.current]) {
                throw new Error("image does not exists!");
            }
            let image = saved[this.current];
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.ctx.drawImage(image,0,0);
            this.ctx.fillStyle = hexToRGB(color);
            this.ctx.fillRect(x + 1,y + 1,x + 1,y + 1);
            image.src = this.canvas.toDataURL('image/png');
            saved[this.current] = image;
        };
        importImage({uri,name}) {
            let image = document.createElement("img");
            image.src = uri;
            saved[name] = image;
        };
        readPixel({x,y}) {
            if (!saved[this.current]) {
                throw new Error("image does not exists!");
            }
            let image = saved[this.current];
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.ctx.drawImage(image,0,0);
            let pixel = this.ctx.getImageData(x + 1,y + 1,1,1);
            // reformat to array
            let newArray = RGBAToHex("rgba(" + pixel.data["0"] + ", " + pixel.data["1"] + ", " + pixel.data["2"] + ", " + pixel.data["3"] + ")");
            return newArray;
        };
        listImages() {
            return JSON.stringify(Object.keys(saved));
        };
        getCurrent() {
            return this.current;
        };
        getWidth() {
            return saved[this.current].width;
        };
        getHeight() {
            return saved[this.current].height;
        };
        // a harder function
        grabRegion({x,y,width,height}) {
            if (!saved[this.current]) {
                throw new Error("image does not exists!");
            }
            let image = saved[this.current];
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.ctx.drawImage(image,0,0);
            let pixels = this.ctx.getImageData(x + 1,y + 1,width,height);
            console.log(pixels);
            //start formating
            let array = [];
            function fp(i) {
                return pixels.data[i + ""];
            }
            for (let i = 0;i < pixels.data.length;i += 4) {
                array.push(RGBAToHex("rgba(" + fp(i) + ", " + fp(i + 1) + ", " + fp(i + 2) + ", " + fp(i + 3) + ")"));
            }
            return JSON.stringify(array);
        };
        exportImage({format}) {
            let image = saved[this.current];
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.ctx.drawImage(image,0,0);
            return this.canvas.toDataURL("image/" + format);
        };
    }
    Scratch.extensions.register(new images());
})(Scratch)
