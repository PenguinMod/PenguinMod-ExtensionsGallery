(function (Scratch) {
  const isPM = Scratch.extensions?.isPenguinMod ?? false;

  if (!Scratch.extensions.unsandboxed) {
    window.alert('The extension "Date Format" must be ran unsandboxed!');
    throw new Error('The extension "Date Format" must be ran unsandboxed!');
  }

  const extensionIcon =
    "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNjQiIGhlaWdodD0iMTY0IiB2aWV3Qm94PSIwLDAsMTY0LDE2NCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1OCwtOTgpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0xNTgsMTgwYzAsLTQ1LjI4NzM1IDM2LjcxMjY1LC04MiA4MiwtODJjNDUuMjg3MzUsMCA4MiwzNi43MTI2NSA4Miw4MmMwLDQ1LjI4NzM1IC0zNi43MTI2NSw4MiAtODIsODJjLTQ1LjI4NzM1LDAgLTgyLC0zNi43MTI2NSAtODIsLTgyeiIgZmlsbD0iIzU5YzA3NCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTE4OC45MDY0MSwyMDYuMzc4NDV2LTUxLjgxNTYxbDUwLjkwMTI3LDMzLjk1Mzk3djUxLjU2Mjg1bC01MC43NzMwNSwtMzMuMzY0MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjkuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTI5MC45NjUzOCwyMDYuNzE1NDZsLTUwLjc3MzA1LDMzLjM2NDJ2LTUxLjU2Mjg1bDUwLjkwMTI4LC0zMy45NTM5N3Y1MS44MTU2MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjkuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIzOS45OTk5OSwxODguNjk5ODJsLTUxLjA5MzU5LC0zNC4zODk3NWw1MS4wOTM1OSwtMzQuMzg5NzRsNTEuMDkzNiwzNC4zODk3NHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI5LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjgyLjAwMDAwMDAwMDAwMDAzOjgxLjk5OTk5OTk5OTk5OTk5LS0+";

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
  const pad = (n) => String(n).padStart(2, "0");

  const ddeDateFormat = {
    BlockOutput: {
      blockType: Scratch.BlockType.REPORTER,
      blockShape: Scratch.BlockShape.TICKET,
      forceOutputType: "Date",
    },
    Argument: {
      shape: Scratch.BlockShape.TICKET,
      check: ["Date"],
    },
  };

  class ddeDateType {
    constructor(dateInput) {
      if (dateInput instanceof Date) {
        this._date = dateInput;
      } else if (dateInput instanceof ddeDateType) {
        this._date = dateInput._date;
      } else if (
        typeof dateInput === "number" ||
        typeof dateInput === "string"
      ) {
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
      return new ddeDateType(new Date(NaN));
    }

    _prettyShort() {
      if (!this.isValid()) return "Invalid Date";
      const y = this._date.getFullYear();
      const m = pad(this._date.getMonth() + 1);
      const d = pad(this._date.getDate());
      const hh = pad(this._date.getHours());
      const mm = pad(this._date.getMinutes());
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
    if (isNaN(d?.getTime())) throw new Error("Invalid Date");

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
    if (isNaN(d?.getTime())) throw new Error("Invalid Date");

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
    return new ddeDateType(result);
  }

  function diffDates(d1, d2, unit) {
    if (isNaN(d1?.getTime()) || isNaN(d2?.getTime()))
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

  if (isPM)
    Scratch.vm.runtime.registerSerializer(
      ddeDateType.prototype.customId,
      (i) => {
        if (i instanceof ddeDateType) return { dateString: i._date };
      },
      (i) => {
        if (i.dateString) return new ddeDateType(i.dateString);
      }
    );

  class ddeDateExtension {
    constructor() {
      this.isValidDate = (d) => d instanceof ddeDateType && d.isValid();
    }

    getInfo() {
      return {
        id: "ddeDateFormatV2",
        name: "Date Format",
        menuIconURI: extensionIcon,
        color1: "#59c074",
        blocks: [
          { blockType: Scratch.BlockType.LABEL, text: "Creation & Format" },
          {
            opcode: "currentDate",
            text: "current date",
            ...ddeDateFormat.BlockOutput,
          },
          {
            opcode: "createDate",
            text: "new date from [string]",
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "2025-03-12",
              },
            },
            ...ddeDateFormat.BlockOutput,
          },
          {
            opcode: "formatDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "format [date] as [format]",
            arguments: {
              date: ddeDateFormat.Argument,
              format: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "dddd, MMMM D, YYYY",
              },
            },
          },
          {
            opcode: "localeFormatDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "format [date] as [type] locale",
            arguments: {
              date: ddeDateFormat.Argument,
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: "localeLength",
              },
            },
          },
          {
            opcode: "isoFormatDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "format [date] as ISO string",
            arguments: {
              date: ddeDateFormat.Argument,
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "Comparisons" },
          {
            opcode: "isValid",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is [date] valid?",
            arguments: {
              date: ddeDateFormat.Argument,
            },
          },
          {
            opcode: "compareDate",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is [date1] [operation] [date2]?",
            arguments: {
              date1: ddeDateFormat.Argument,
              operation: {
                type: Scratch.ArgumentType.STRING,
                menu: "compareOperations",
              },
              date2: ddeDateFormat.Argument,
            },
          },
          {
            opcode: "checkDateProperty",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is [date] [property]?",
            arguments: {
              date: ddeDateFormat.Argument,
              property: {
                type: Scratch.ArgumentType.STRING,
                menu: "dateProperties",
              },
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "Operators" },
          {
            opcode: "diffDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "difference between [date1] and [date2] in [unit]",
            arguments: {
              date1: ddeDateFormat.Argument,
              date2: ddeDateFormat.Argument,
              unit: { type: Scratch.ArgumentType.STRING, menu: "timeUnits" },
            },
          },
          /* old version that uses UTC */
          {
            opcode: "getDatePart",
            blockType: Scratch.BlockType.REPORTER,
            text: "get UTC [part] of [date]",
            arguments: {
              part: { type: Scratch.ArgumentType.STRING, menu: "dateParts" },
              date: ddeDateFormat.Argument,
            },
            hideFromPalette: true
          },
          {
            opcode: "getDatePartNew",
            blockType: Scratch.BlockType.REPORTER,
            text: "get [part] of [date]",
            arguments: {
              part: { type: Scratch.ArgumentType.STRING, menu: "dateParts" },
              date: ddeDateFormat.Argument,
            },
          },
          {
            opcode: "setDatePart",
            text: "set [part] of [date] to [value]",
            arguments: {
              part: { type: Scratch.ArgumentType.STRING, menu: "dateParts" },
              date: ddeDateFormat.Argument,
              value: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
            ...ddeDateFormat.BlockOutput,
          },
          {
            opcode: "addTime",
            text: "add [amount] [unit] to [date]",
            arguments: {
              amount: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              unit: { type: Scratch.ArgumentType.STRING, menu: "timeUnits" },
              date: ddeDateFormat.Argument,
            },
            ...ddeDateFormat.BlockOutput,
          },
          {
            opcode: "roundDate",
            text: "round [date] to nearest [unit]",
            arguments: {
              date: ddeDateFormat.Argument,
              unit: { type: Scratch.ArgumentType.STRING, menu: "timeUnits" },
            },
            ...ddeDateFormat.BlockOutput,
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
              { text: "time", value: "time" },
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
          dateProperties: {
            acceptReporters: true,
            items: [
              "weekend",
              "weekday",
              "today",
              "yesterday",
              "tomorrow",
              "first of month",
              "last of month",
              "leap year",
            ],
          },
        },
      };
    }

    toDateType(input) {
      return input instanceof ddeDateType ? input : new ddeDateType(input);
    }

    toNativeDate(input) {
      if (input instanceof ddeDateType && input.isValid())
        return input.toDate();
      const d = this.toDateType(input);
      return d.toDate();
    }

    currentDate() {
      return new ddeDateType(Date.now());
    }

    createDate({ string }) {
      return new ddeDateType(string);
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

    isoFormatDate({ date }) {
      const d = this.toNativeDate(date);
      if (isNaN(d.getTime())) throw new Error("Invalid Date");
      return d.toISOString();
    }

    compareDate({ date1, date2, operation }) {
      const d1 = this.toNativeDate(date1);
      const d2 = this.toNativeDate(date2);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime()))
        throw new Error("Invalid Date");

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

    getDatePartNew({ part, date }) {
      const d = this.toNativeDate(date);
      if (isNaN(d.getTime())) throw new Error("Invalid Date");

      switch (part) {
        case "millisecond":
          return d.getMilliseconds();
        case "second":
          return d.getSeconds();
        case "minute":
          return d.getMinutes();
        case "hour":
          return d.getHours();
        case "weekday":
          return d.getDay();
        case "date":
          return d.getDate();
        case "month":
          return d.getMonth() + 1;
        case "year":
          return d.getFullYear();
        case "time":
          return d.getTime();
        default:
          return 0;
      }
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
        case "time":
          return d.getTime();
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

    setDatePart({ part, date, value }) {
      const d = this.toNativeDate(date);
      if (isNaN(d.getTime())) throw new Error("Invalid Date");

      const v = Number(value);
      const newDate = new Date(d.getTime());

      switch (part) {
        case "millisecond":
          newDate.setMilliseconds(v);
          break;
        case "second":
          newDate.setSeconds(v);
          break;
        case "minute":
          newDate.setMinutes(v);
          break;
        case "hour":
          newDate.setHours(v);
          break;
        case "weekday":
          const diff = v - newDate.getDay();
          newDate.setDate(newDate.getDate() + diff);
          break;
        case "date":
          newDate.setDate(v);
          break;
        case "month":
          newDate.setMonth(v - 1);
          break;
        case "year":
          newDate.setFullYear(v);
          break;
        case "time":
          newDate.setTime(v);
          break;
      }

      return new ddeDateType(newDate);
    }

    roundDate({ date, unit }) {
      const d = this.toNativeDate(date);
      if (isNaN(d.getTime())) throw new Error("Invalid Date");

      const ms = d.getTime();
      let rounded;

      const unitMs = {
        milliseconds: 1,
        seconds: 1000,
        minutes: 60000,
        hours: 3600000,
        days: 86400000,
      }[unit.toLowerCase()];

      if (unitMs) {
        rounded = Math.round(ms / unitMs) * unitMs;
      } else if (unit.toLowerCase() === "months") {
        const temp = new Date(d.getFullYear(), d.getMonth() + 0.5, 1);
        rounded = temp.getTime();
      } else if (unit.toLowerCase() === "years") {
        const temp = new Date(d.getFullYear() + 0.5, 0, 1);
        rounded = temp.getTime();
      } else {
        rounded = ms;
      }

      return new ddeDateType(new Date(rounded));
    }

    checkDateProperty({ date, property }) {
      const d = this.toNativeDate(date);
      if (isNaN(d)) throw new Error("Invalid Date");

      const now = new Date();
      const sameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

      switch (property) {
        case "weekend":
          return [0, 6].includes(d.getDay());
        case "weekday":
          return ![0, 6].includes(d.getDay());
        case "today":
          return sameDay(d, now);
        case "yesterday":
          const y = new Date(now);
          y.setDate(now.getDate() - 1);
          return sameDay(d, y);
        case "tomorrow":
          const t = new Date(now);
          t.setDate(now.getDate() + 1);
          return sameDay(d, t);
        case "first of month":
          return d.getDate() === 1;
        case "last of month":
          const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
          return d.getDate() === last.getDate();
        case "leap year":
          const year = d.getFullYear();
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        default:
          return false;
      }
    }
  }

  Scratch.extensions.register(new ddeDateExtension());
})(Scratch);
