module.exports = class BananenBaseModule {
  constructor(options = {}) {
    this.BananenBase = {};
    this.dependencies = options.dependencies || [];
    this.name = options.name || "???";
    this.toConfigure = options.toConfigure;
    this.priority = options.priority || 1;
    if (this.priority < 0 || this.priority > 10) this.priority = 1;
  }

  async internal_BB_Execute(thing, ...args) {
    if (thing === "internal.beforeReady" && this.toConfigure) {
      let toConfigure = (options) => {
        if (!options) throw new Error(`Module configuration "${this.name}" error:\nNo opions found!`);
        this.options = {};
        for (let i in this.toConfigure) {
          if (this.toConfigure[i].split(".")[0].toLowerCase() === "required" 
            && !options[i.toLowerCase()]) throw new Error(`Module configuration ${this.name} error:\n  Option ${i.toLowerCase()} required, but not found.`);
          if (typeof options[i.toLowerCase()] === "undefined") continue;
          if (typeof options[i.toLowerCase()] !== this.toConfigure[i].split(".")[1].toLowerCase()) throw new Error(`Module configuration ${this.name} error:\n  Option ${i.toLowerCase()} needs to be "${this.toConfigure[i].split(".")[1].toLowerCase()}", but it is "${typeof options[i.toLowerCase()]}".`);
          this.options[i.toLowerCase()] = options[i.toLowerCase()];
        }
        let missed = [];
        for (let i in options) {
          if (!this.options[i.toLowerCase()]) missed.push(i.toLowerCase());
        }
        if (missed.length !== 0) console.warn(`WARNING: Module Configuration ${this.name}:\n  ${missed.length} option(s) added, but not asked for: ${missed.join(", ")}.`);
      }
      this.BananenBase.toConfigure[this.name.toLowerCase()] = toConfigure;
      return;
    }
    if (typeof this[thing] !== "function") return true;
    return await this[thing](...args);
  }
}