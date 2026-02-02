(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    window.alert('The extension "Date Format" must be ran unsandboxed!');
    throw new Error('The extension "Date Format" must be ran unsandboxed!');
  }

  const extensionIcon =
    "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNjQiIGhlaWdodD0iMTY0IiB2aWV3Qm94PSIwLDAsMTY0LDE2NCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1OCwtOTgpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0xNTgsMTgwYzAsLTQ1LjI4NzM1IDM2LjcxMjY1LC04MiA4MiwtODJjNDUuMjg3MzUsMCA4MiwzNi43MTI2NSA4Miw4MmMwLDQ1LjI4NzM1IC0zNi43MTI2NSw4MiAtODIsODJjLTQ1LjI4NzM1LDAgLTgyLC0zNi43MTI2NSAtODIsLTgyeiIgZmlsbD0iIzU5YzA3NCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTE4OC45MDY0MSwyMDYuMzc4NDV2LTUxLjgxNTYxbDUwLjkwMTI3LDMzLjk1Mzk3djUxLjU2Mjg1bC01MC43NzMwNSwtMzMuMzY0MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjkuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTI5MC45NjUzOCwyMDYuNzE1NDZsLTUwLjc3MzA1LDMzLjM2NDJ2LTUxLjU2Mjg1bDUwLjkwMTI4LC0zMy45NTM5N3Y1MS44MTU2MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjkuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIzOS45OTk5OSwxODguNjk5ODJsLTUxLjA5MzU5LC0zNC4zODk3NWw1MS4wOTM1OSwtMzQuMzg5NzRsNTEuMDkzNiwzNC4zODk3NHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI5LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjgyLjAwMDAwMDAwMDAwMDAzOjgxLjk5OTk5OTk5OTk5OTk5LS0+";

  class DateType {
    constructor(dateInput) {
      if (dateInput instanceof Date) {
        this._date = dateInput;
      } else if (dateInput instanceof DateType) {
        this._date = new Date(dateInput._date);
      } else if (["number", "string"].includes(typeof dateInput)) {
        this._date = new Date(dateInput);
      } else {
        this._date = new Date(NaN);
      }
      this.customId = "ddeDateFormat.date";
    }

    isValid() {
      return this._date instanceof Date && !isNaN(this._date.getTime());
    }
    toDate() {
      return new Date(this._date.getTime());
    }
    getTime() {
      return this._date.getTime();
    }

    toString() {
      return this.isValid() ? this._date.toISOString() : "Invalid Date";
    }

    toReporterContent() {
      const container = document.createElement("span");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "center";
      container.style.gap = "0.3em";

      if (this.isValid()) {
        const pretty = document.createElement("span");
        pretty.innerText = this._prettyShort();
        pretty.style.fontWeight = "500";
        pretty.style.fontStyle = "italic";
        container.appendChild(pretty);

        const detail = document.createElement("span");
        detail.innerText = `(${this._date.toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })})`;
        detail.style.opacity = "0.7";
        detail.style.fontSize = "0.85em";
        container.appendChild(detail);

        container.title = this.toString();
      } else {
        const invalid = document.createElement("span");
        invalid.innerText = "Invalid Date";
        invalid.style.fontStyle = "italic";
        container.appendChild(invalid);
      }

      return container;
    }

    toMonitorContent() {
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.flexDirection = "column";

      const top = document.createElement("div");
      top.innerText = this.isValid() ? this._prettyShort() : "Invalid Date";

      const sub = document.createElement("small");
      sub.innerText = this.isValid() ? this.toString() : "";
      sub.style.opacity = "0.7";

      wrap.append(top, sub);
      return wrap;
    }

    toListItem() {
      const span = document.createElement("span");
      span.innerText = this.isValid() ? this.toString() : "Invalid Date";
      span.style.fontStyle = "italic";
      span.title = this.toString();
      return span;
    }

    toListEditor() {
      return this.toString();
    }

    fromListEditor(edit) {
      const newDate = new Date(edit);
      if (!isNaN(newDate.getTime())) {
        this._date = newDate;
        return this;
      }
      return new DateType(new Date(NaN));
    }

    _prettyShort() {
      if (!this.isValid()) return "Invalid Date";
      const y = this._date.getUTCFullYear();
      const m = String(this._date.getUTCMonth() + 1).padStart(2, "0");
      const d = String(this._date.getUTCDate()).padStart(2, "0");
      const hh = String(this._date.getUTCHours()).padStart(2, "0");
      const mm = String(this._date.getUTCMinutes()).padStart(2, "0");
      return `${y}-${m}-${d} ${hh}:${mm}`;
    }

    jwArrayHandler() {
      return this.isValid() ? this._prettyShort() : "Invalid Date";
    }

    dogeiscutObjectHandler() {
      return this.toListItem();
    }
  }

  function formatDate(d, format) {
    if (!(d instanceof Date) || isNaN(d.getTime()))
      throw new Error("Invalid Date");

    const pad = (n) => String(n).padStart(2, "0");

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const tokens = {
      YYYY: () => d.getFullYear(),
      YY: () => String(d.getFullYear()).slice(-2),
      MMMM: () => months[d.getMonth()],
      MMM: () => months[d.getMonth()].slice(0, 3),
      MM: () => pad(d.getMonth() + 1),
      M: () => d.getMonth() + 1,
      DD: () => pad(d.getDate()),
      D: () => d.getDate(),
      dddd: () => weekdays[d.getDay()],
      ddd: () => weekdays[d.getDay()].slice(0, 3),
      HH: () => pad(d.getHours()),
      H: () => d.getHours(),
      hh: () => pad(((d.getHours() + 11) % 12) + 1),
      h: () => ((d.getHours() + 11) % 12) + 1,
      mm: () => pad(d.getMinutes()),
      m: () => d.getMinutes(),
      ss: () => pad(d.getSeconds()),
      s: () => d.getSeconds(),
      A: () => (d.getHours() < 12 ? "AM" : "PM"),
      a: () => (d.getHours() < 12 ? "am" : "pm"),
      Z: () => {
        const offset = -d.getTimezoneOffset();
        const sign = offset >= 0 ? "+" : "-";
        const absOff = Math.abs(offset);
        const hh = pad(Math.floor(absOff / 60));
        const mm = pad(absOff % 60);
        return `${sign}${hh}:${mm}`;
      },
      SSS: () => String(d.getMilliseconds()).padStart(3, "0"),
    };

    const tokenList = Object.keys(tokens).sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(${tokenList.join("|")})`, "g");

    return String(format || "").replace(regex, (match) => tokens[match]());
  }

  function addToDate(d, amount, unit) {
    if (!(d instanceof Date) || isNaN(d.getTime()))
      throw new Error("Invalid Date");

    const result = new Date(d.getTime());
    amount = Number(amount) || 0;
    switch ((unit || "").toLowerCase()) {
      case "milliseconds":
        result.setMilliseconds(result.getMilliseconds() + amount);
        break;
      case "seconds":
        result.setSeconds(result.getSeconds() + amount);
        break;
      case "minutes":
        result.setMinutes(result.getMinutes() + amount);
        break;
      case "hours":
        result.setHours(result.getHours() + amount);
        break;
      case "days":
        result.setDate(result.getDate() + amount);
        break;
      case "months":
        result.setMonth(result.getMonth() + amount);
        break;
      case "years":
        result.setFullYear(result.getFullYear() + amount);
        break;
    }
    return new DateType(result);
  }

  function diffDates(d1, d2, unit) {
    if (
      !(d1 instanceof Date) ||
      isNaN(d1.getTime()) ||
      !(d2 instanceof Date) ||
      isNaN(d2.getTime())
    )
      throw new Error("Invalid Date");
    const ms = d1.getTime() - d2.getTime();
    const absMs = Math.abs(ms);
    switch ((unit || "").toLowerCase()) {
      case "milliseconds":
        return absMs;
      case "seconds":
        return Math.floor(absMs / 1000);
      case "minutes":
        return Math.floor(absMs / 60000);
      case "hours":
        return Math.floor(absMs / 3600000);
      case "days":
        return Math.floor(absMs / 86400000);
      case "months":
        return Math.abs(
          (d1.getFullYear() - d2.getFullYear()) * 12 +
            (d1.getMonth() - d2.getMonth())
        );
      case "years":
        return Math.abs(d1.getFullYear() - d2.getFullYear());
      default:
        return absMs;
    }
  }

  Scratch.vm.runtime.registerSerializer(
    "ddeDateFormat.date",
    (i) => {
      if (i instanceof DateType) {
        return { dateString: i._date };
      }
    },
    (i) => {
      if (!i.dateString) return null;
      return new DateType(i.dateString);
    }
  );

  class DateFormatExtension {
    constructor() {
      this.isValidDate = (d) => d instanceof DateType && d.isValid();
    }

    getInfo() {
      return {
        id: "ddeDateFormat",
        name: "Date Format (OLD VERSION)",
        menuIconURI: extensionIcon,
        color1: "#59c074",
        blocks: [
          { blockType: Scratch.BlockType.LABEL, text: "Creation & Format" },
          {
            opcode: "currentDate",
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.TICKET,
            text: "current date",
          },
          {
            opcode: "createDate",
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.TICKET,
            text: "new date from [string]",
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "2025-03-12",
                exemptFromNormalization: true,
              },
            },
          },
          {
            opcode: "formatDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "format date [date] as [format]",
            arguments: {
              date: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
              format: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "dddd, MMMM D, YYYY",
              },
            },
          },
          {
            opcode: "localeFormatDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "format date [date] to [type] locale",
            arguments: {
              date: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: "localeLength",
              },
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "Comparisons" },
          {
            opcode: "compareDate",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is date [date1] [operation] date [date2]?",
            arguments: {
              date1: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
              operation: {
                type: Scratch.ArgumentType.STRING,
                menu: "compareOperations",
              },
              date2: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
            },
          },
          {
            opcode: "isValid",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is date [date] valid?",
            arguments: {
              date: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "Operators" },
          {
            opcode: "getDatePart",
            blockType: Scratch.BlockType.REPORTER,
            text: "get [part] of [date]",
            arguments: {
              part: { type: Scratch.ArgumentType.STRING, menu: "dateParts" },
              date: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
            },
          },
          {
            opcode: "addTime",
            blockType: Scratch.BlockType.REPORTER,
            text: "add [amount] [unit] to [date]",
            arguments: {
              amount: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              unit: { type: Scratch.ArgumentType.STRING, menu: "timeUnits" },
              date: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
            },
          },
          {
            opcode: "diffDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "difference between [date1] and [date2] in [unit]",
            arguments: {
              date1: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
              date2: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
              },
              unit: { type: Scratch.ArgumentType.STRING, menu: "timeUnits" },
            },
          },
        ],
        menus: {
          compareOperations: {
            acceptReporters: true,
            items: [
              { text: "after", value: "after" },
              { text: "before", value: "before" },
              { text: "same as", value: "same" },
            ],
          },
          dateParts: {
            acceptReporters: true,
            items: [
              { text: "milliseconds", value: "millisecond" },
              { text: "seconds", value: "second" },
              { text: "minutes", value: "minute" },
              { text: "hours", value: "hour" },
              { text: "day (week)", value: "weekday" },
              { text: "day (month)", value: "date" },
              { text: "month", value: "month" },
              { text: "year", value: "year" },
            ],
          },
          timeUnits: {
            acceptReporters: true,
            items: [
              "milliseconds",
              "seconds",
              "minutes",
              "hours",
              "days",
              "months",
              "years",
            ],
          },
          localeLength: {
            acceptReporters: true,
            items: ["short", "long"],
          },
        },
      };
    }

    toDateType(input) {
      return input instanceof DateType ? input : new DateType(input);
    }

    toNativeDate(input) {
      const d = this.toDateType(input);
      return d.isValid() ? d.toDate() : new Date(NaN);
    }

    currentDate() {
      return new DateType(new Date());
    }

    createDate({ string }) {
      return new DateType(string);
    }

    formatDate({ date, format }) {
      return formatDate(
        this.toNativeDate(date),
        format || "dddd, MMMM D, YYYY"
      );
    }

    localeFormatDate({ date, type }) {
      type = type === "long" ? "long" : "short";

      const d = this.toNativeDate(date);
      if (isNaN(d.getTime())) throw new Error("Invalid Date");

      return d.toLocaleDateString(undefined, {
        weekday: type,
        year: "numeric",
        month: type,
        day: "numeric",
      });
    }

    compareDate({ date1, date2, operation }) {
      const d1 = this.toNativeDate(date1);
      const d2 = this.toNativeDate(date2);

      switch (operation) {
        case "after":
          return d1.getTime() > d2.getTime();
        case "before":
          return d1.getTime() < d2.getTime();
        case "same":
          return d1.getTime() === d2.getTime();
        default:
          return false;
      }
    }

    isValid({ date }) {
      return this.toDateType(date).isValid();
    }

    getDatePart({ part, date }) {
      const d = this.toNativeDate(date);
      if (isNaN(d.getTime())) throw new Error("Invalid Date");

      switch (part) {
        case "millisecond":
          return d.getUTCMilliseconds();
        case "second":
          return d.getUTCSeconds();
        case "minute":
          return d.getUTCMinutes();
        case "hour":
          return d.getUTCHours();
        case "weekday":
          return d.getUTCDay();
        case "date":
          return d.getUTCDate();
        case "month":
          return d.getUTCMonth() + 1;
        case "year":
          return d.getUTCFullYear();
        default:
          return 0;
      }
    }

    addTime({ amount, unit, date }) {
      return addToDate(this.toNativeDate(date), amount, unit);
    }

    diffDate({ date1, date2, unit }) {
      return diffDates(
        this.toNativeDate(date1),
        this.toNativeDate(date2),
        unit
      );
    }
  }

  Scratch.extensions.register(new DateFormatExtension());
})(Scratch);
