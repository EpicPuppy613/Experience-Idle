const G = {};
G.level = new Decimal(0);
G.xp = new Decimal(0);
G.need = new Decimal(500);
G.percent = 0;
G.gain = new Decimal(0);
G.mult = new Decimal(1);
G.points = new Decimal(10);
G.buyables = {};
G.errors = 0;
G.limit = 1;
G.panels = {};
G.ascensions = {};
G.milestones = {};
G.devgain = {};
G.tables = {};
G.blocks = {};
G.start = performance.now();
G.log = function (message, color="white") {
    const T = new Date();
    const M = document.createElement('span');
    const passed = performance.now() - G.start;
    const scroll = E.console.scrollTop + E.console.clientHeight >= E.console.scrollHeight;
    if (passed < 1000) {
        M.innerHTML = `[${T.toLocaleTimeString()} ; ${(performance.now() - G.start).toFixed(1)} ms] ` + message;
    } else if (passed < 60000) {
        M.innerHTML = `[${T.toLocaleTimeString()} ; ${((performance.now() - G.start)/1000).toFixed(2)} s] ` + message;
    } else {
        M.innerHTML = `[${T.toLocaleTimeString()} ; ${((performance.now() - G.start)/60000).toFixed(2)} m] ` + message;
    }
    M.style.color = color;
    E.console.appendChild(M);
    E.console.appendChild(document.createElement('br'));
    if (scroll) {
        E.console.scrollTop = E.console.scrollHeight - E.console.clientHeight;
    }
} 

const C = {};

const E = {};
E.level = document.getElementById('curlvl');
E.prog = document.getElementById('lvlprog');
E.bar = document.getElementById('barprog');
E.icon = document.getElementById('icon');
E.points = document.getElementById('points');
E.console = document.getElementById('console');

document.getElementById("devmenu").style.display = "none";
document.getElementById("debugmenu").style.display = "none";
document.getElementById("debugconsole").style.display = "none";

G.log("START INIT");

const A = {};
/**
 * A buyable object by using a currency
 * @param {String} name - the name of the buyable
 * @param {String} desc - a description of the buyable
 * @param {String} id - unique id for the buyable
 * @param {Number} initial - initial price of the buyable
 * @param {Number} gain - price gain of the buyable
 * @param {Function} onbuy - execute on purchase of the buyable
 * @param {String} location - containing table of the buyable
 * @param {Function} condition - function that returns true when the buyable should be unlocked
 * @param {Object} vars - internal variables for the buyable
 * @param {String} type - purchase currency
 * @param {Number} tier - tier for resetting on ascension
 * @param {String} generate - currency to generate
 * @param {Function} increase - returns amount to gain, most likely going to be (rate * owned)
 * @param {Function} mult - returns multiplier for the buyable's generation currency
 */
A.Buyable = function (name, desc, id, initial, gain, onbuy, location, condition, vars, type, tier, generate, increase, mult) {
    try {
        var b = new D.Buyable(name, desc, id, initial, gain, onbuy, location, condition, vars, type, tier, generate, increase, mult);
        var id = b.id;
        G.buyables[id] = b;
        G.buyables[id].B.addEventListener('click', function () { G.buyables[id].Buy() });
        G.buyables[id].M.addEventListener('click', function () { G.buyables[id].BuyMax() });
    } catch (err) {
        G.log("ERROR/BUYABLE: " + err.stack, "#faa");
        G.errors++;
    }
    return this;
}
/**
 * A panel that contains stuff
 * @param {String} title - the name of the panel
 * @param {String} id - a unique id for the panel
 * @param {String} color1 - top color for the panel gradient
 * @param {String} color2 - bottom color for the panel gradient
 * @param {String} color3 - text color for the panel
 * @param {String} color4 - progress bar color for the panel
 * @param {Function} condition - function returns true if the panel is unlocked
 */
A.Panel = function (title, id, color1, color2, color3, color4, condition) {
    try {
        const p = new D.Panel(title, id, color1, color2, color3, color4, condition);
        G.panels[p.id] = p
    } catch (err) {
        G.log("ERROR/PANEL: " + err.stack, "#faa");
        G.errors++;
    }
    return this;
}
/**
 * A currency that can be used for stuff
 * @param {String} name - the name of the currency
 * @param {String} id - the unique id of the currency
 * @param {Number} initial - the initial amount of the currency
 * @param {String} location - the containing block for the currency
 * @param {Function} condition - function should return true if the currency is unlocked
 * @param {Number} tier - tier for resetting on ascension
 */
A.Currency = function (name, id, initial, location, condition, tier) {
    try {
        const c = new D.Currency(name, id, initial, location, condition, tier);
        C[c.id] = c;
    } catch (err) {
        G.log("ERROR/CURRENCY: " + err.stack, "#faa");
        G.errors++;
    }
    return this;
}
/**
 * reset progress to gain a new currency
 * @param {String} name - name for the ascension
 * @param {String} id - unique id for the ascension
 * @param {String} currency - id of a currency to reward
 * @param {Number} req - target currency amount required to ascend
 * @param {String} target - required currency type
 * @param {Function} scale - scaling for multiple of the new currency
 * @param {Number} mult - total multiplier for the new currency
 * @param {Function} condition - function that returns true if the ascension is unlocked
 * @param {String} location - block container for the ascension
 * @param {Number} tier - tier of reset, all lower tiers are reset
 */
A.Ascension = function (name, id, currency, req, target, scale, mult, condition, location, tier) {
    try {
        const a = new D.Ascension(name, id, currency, req, target, scale, mult, condition, location, tier);
        var id = a.id;
        G.ascensions[id] = a;
        G.ascensions[id].A.addEventListener('click', function () {G.ascensions[id].Ascend() });
    } catch (err) {
        G.log("ERROR/ASCENSION: " + err.stack, "#faa");
        G.errors++;
    }
    return this;
}
/**
 * A conditional milestone that can be unlocked by a certain condition
 * @param {String} name - name of the milestone
 * @param {String} desc - description of the milestone
 * @param {String} id - unique id for the milestone
 * @param {Function} condition - function returns true if milestone should be unlocked
 * @param {Function} milestone - function returns true when milestone should be achieved
 * @param {String} location - block container for the milestone
 * @param {Number} tier - tier of ascension
 * @param {Boolean} preserve - keep milestone on ascension regardless of tier
 * @param {Function} onget - function to run when milestone is achieved
 * @param {String} color1 - the uncompleted color of the milestone
 * @param {String} color2 - the completed color of the milestone
 * @param {String} target - the target currency to modify
 * @param {Function} gain - returns amount of gain to add to the target currency
 * @param {Function} mult - returns multiplier for the target currency
 */
A.Milestone = function (name, desc, id, condition, milestone, location, tier, preserve, onget, color1, color2, target, gain, mult) {
    try {
        const m = new D.Milestone(name, desc, id, condition, milestone, location, tier, preserve, onget, color1, color2, target, gain, mult);
        G.milestones[m.id] = m;
    }
    catch (err) {
        G.log("ERROR/MILESTONE: " + err.stack, "#faa");
        G.errors++;
    }
    return this;
}
/**
 * A table to hold buyable listings
 * @param {String} name - the name of the table
 * @param {String} id - the id of the table
 * @param {Function} condition - function returns true if table should be unlocked
 * @param {String} location - panel container for the table
 */
A.Table = function (name, id, condition, location) {
    try {
        const t = new D.Table(name, id, condition, location);
        G.tables[t.id] = t;
    }
    catch (err) {
        G.log("ERROR/TABLE: " + err.stack, "#faa");
        G.errors++;
    }
    return this;
}
/**
 * A block to hold milestones and ascensions
 * @param {String} name - the name of the block
 * @param {String} id - the id of the block
 * @param {Function} condition - function returns true if block should be unlocked
 * @param {String} location - panel container for the block
 * @param {Number} columns - the number of columns in the block
 */
 A.Block = function (name, id, condition, location, columns) {
    try {
        const b = new D.Block(name, id, condition, location, columns);
        G.blocks[b.id] = b;
    }
    catch (err) {
        G.log("ERROR/BLOCK: " + err.stack, "#faa");
        G.errors++;
    }
    return this;
}

const D = {};
D.Buyable = class Buyable {
    constructor(name, desc, id, initial, gain, onbuy, location, condition, vars, type, tier, generate, increase, mult) {
        G.log(`INIT/BUYABLE: ${id}, ${name}, ${initial.toFixed(2)}, ${location}`, "#bfb");
        this.name = name;
        this.desc = desc;
        this.id = id;
        this.cost = new Decimal(initial);
        this.initial = new Decimal(initial);
        this.gain = gain;
        this.OnBuy = onbuy;
        this.owned = 0;
        this.location = location;
        this.condition = condition;
        this.type = type;
        this.tier = tier;
        this.generate = generate;
        this.increase = increase;
        this.mult = mult;
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.startVar = {};
        for (const variable in vars) {
            this[variable] = vars[variable];
            this.startVar[variable] = vars[variable];
        }
        this.E = document.createElement('tr');
        this.N = document.createElement('th');
        this.N.innerHTML = this.name;
        this.E.appendChild(this.N);
        this.DO = document.createElement('option');
        this.DO.innerHTML = this.name;
        this.DO.value = this.id;
        G.panels[G.tables[this.location].location].BO.appendChild(this.DO);
        // this.D = document.createElement('td');
        // this.D.innerHTML = this.desc;
        G.tables[this.location].E.appendChild(this.E);
        this.BC = document.createElement('td');
        this.B = document.createElement('button');
        this.B.innerHTML = 'Buy 1';
        this.M = document.createElement('button');
        this.M.innerHTML = 'Max';
        this.C = document.createElement('span');
        if (this.type == 'p') this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format() + ' Pts';
        else this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format() + ' ' + C[this.type].name;
        this.A = document.createElement('span');
        this.A.innerHTML = ' Buyable: 0';
        this.PC = document.createElement('td');
        this.PC.style.width = '25%';
        this.P = document.createElement('div');
        this.P.classList.add('progress-small');
        this.V = document.createElement('div');
        this.V.classList.add('progress-small-val');
        this.V.style.backgroundColor = G.panels[G.tables[this.location].location].color[3];
        this.P.appendChild(this.V);
        this.PC.appendChild(this.P);
        this.BC.appendChild(this.B);
        this.BC.appendChild(this.M);
        this.E.appendChild(this.PC);
        this.E.appendChild(this.BC);
        this.E.appendChild(this.C);
        if (!this.unlocked) this.E.style.display = 'none';
    }
    CalcMax(points) {
        if (this.type == 'p') return BruteForceIntegral(this.cost, this.gain, points);
        else return BruteForceIntegral(this.cost, this.gain, C[this.type].amt);
    }
    Buy() {
        if (this.type == 'p') {
            if (G.points.gte(this.cost)) {
                try {
                    this.OnBuy();
                }
                catch (err) {
                    console.log(err)
                }
                G.points = G.points.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
        else {
            if (C[this.type].amt.gte(this.cost)) {
                try {
                    this.OnBuy();
                }
                catch (err) {
                    console.log(err)
                }
                C[this.type].amt = C[this.type].amt.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
    }
    BuyMax() {
        if (this.type == 'p') {
            while (G.points.gte(this.cost)) {
                try {
                    this.OnBuy();
                }
                catch (err) {
                    console.log(err)
                }
                G.points = G.points.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
        else {
            while (C[this.type].amt.gte(this.cost)) {
                try {
                    this.OnBuy();
                }
                catch (err) {
                    console.log(err)
                }
                C[this.type].amt = C[this.type].amt.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
    }
    Update() {
        if (this.type == 'p') {
            this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format() + ' Pts<br>' + this.desc;
            this.V.style.width = Math.min(G.points.div(this.cost).mul(100).toFixed(1), 100) + '%';
        }
        else {
            this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format() + ' ' + C[this.type].name + '<br>' + this.desc;
            this.V.style.width = Math.min(C[this.type].amt.div(this.cost).mul(100).toFixed(1), 100) + '%';
        }
        this.N.innerHTML = this.name + ' [' + this.owned + ']';
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.E.style.display = 'table-row';
        }
    }
    Reset() {
        this.owned = 0;
        this.cost = this.initial;
        this.unlocked = false;
        this.E.style.display = 'none';
        for (const v in this.startVar) {
            this[v] = this.startVar[v];
        }
        this.Update();
    }
}
D.Panel = class Panel {
    constructor(title, id, color1, color2, color3, color4, condition) {
        G.log(`INIT/PANEL: ${id}, ${title}`, "#ffb");
        this.title = title;
        this.id = id;
        this.color = [color1, color2, color3, color4];
        this.condition = condition;
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.E = document.createElement('div');
        if (!this.unlocked) this.E.style.display = 'none';
        this.T = document.createElement('h2');
        this.T.innerHTML = this.title;
        this.BO = document.createElement('optgroup');
        this.CO = document.createElement('optgroup');
        this.AO = document.createElement('optgroup');
        this.MO = document.createElement('optgroup');
        this.BO.label = this.title;
        this.CO.label = this.title;
        this.AO.label = this.title;
        this.MO.label = this.title;
        document.getElementById('buyableselect').appendChild(this.BO);
        document.getElementById('currencyselect').appendChild(this.CO);
        document.getElementById('ascensionselect').appendChild(this.AO);
        document.getElementById('milestoneselect').appendChild(this.MO);
        this.E.appendChild(this.T);
        this.E.style.background = 'linear-gradient(' + this.color[0] + ',' + this.color[1] + ')';
        this.E.style.color = this.color[2];
        this.E.classList.add('panel');
        this.S = document.createElement('div');
        this.E.appendChild(this.S);
        document.getElementById('main').appendChild(this.E);
    }
    Unlock() {
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.E.style.display = '';
        }
    }
}
D.Currency = class Currency {
    constructor(name, id, initial, location, condition, tier) {
        G.log(`INIT/CURRENCY: ${id}, ${name}, ${initial.toFixed(2)}, ${location}`, "#bbf");
        this.name = name;
        this.id = id;
        this.initial = initial;
        this.location = location;
        this.condition = condition;
        this.tier = tier;
        this.mult = new Decimal(1);
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.amt = new Decimal(initial);
        this.gain = new Decimal(0);
        this.E = document.createElement('div');
        this.E.style.display = 'inline-block';
        this.E.style.width = '90%';
        this.V = document.createElement('strong');
        this.V.innerHTML = name + ': 0 (+0.00)';
        this.E.appendChild(this.V);
        this.DO = document.createElement('option');
        this.DO.innerHTML = this.name;
        this.DO.value = this.id;
        G.panels[this.location].CO.appendChild(this.DO);
        this.GC = document.createElement('option');
        this.GC.value = id;
        this.GC.innerHTML = name;
        document.getElementById('givecurrency').appendChild(this.GC);
        this.RC = document.createElement('option');
        this.RC.value = id;
        this.RC.innerHTML = name;
        document.getElementById('gaincurrency').appendChild(this.RC);
        G.panels[this.location].S.appendChild(this.E);
        if (!this.unlocked) {
            this.E.style.display = 'none';
        }
    }
    Unlock() {
        this.unlocked = this.condition();
        if (this.unlocked) this.E.style.display = 'inline-block';
    }
    Tick () {
        this.V.innerHTML = this.name + ': ' + this.amt.toFixed(2).format() + ' (+' + this.gain.mul(this.mult).toFixed(2).format() + ')';
        this.amt = this.amt.add(this.gain.mul(this.mult).div(50));
        if (!this.unlocked) {
            this.Unlock();
        }
    }
    Reset() {
        this.amt = new Decimal(this.initial);
        this.gain = new Decimal(0);
        this.unlocked = false;
        this.E.style.display = 'none';
        this.Tick();
    }
}

D.Ascension = class Ascension {
    constructor(name, id, currency, req, target, scale, mult, condition, location, tier) {
        G.log(`INIT/ASCNESION: ${id}, ${name}, ${currency}, ${target}, ${location}`, "#bff");
        this.name = name;
        this.id = id;
        this.currency = currency;
        this.req = new Decimal(req);
        this.target = target;
        this.scale = scale;
        this.mult = mult;
        this.condition = condition;
        this.location = location;
        this.tier = tier;
        this.ascensions = new Decimal(0);
        this.reward = new Decimal(0);
        try {
        this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.E = document.createElement('div');
        this.E.style.display = 'inline-block';
        this.E.style.width = '90%';
        if (!this.unlocked) this.E.style.display = 'none';
        this.T = document.createElement('h2');
        this.T.innerHTML = this.name;
        this.E.appendChild(this.T);
        this.DO = document.createElement('option');
        this.DO.innerHTML = this.name;
        this.DO.value = this.id;
        G.panels[this.location].AO.appendChild(this.DO);
        this.S = document.createElement('p');
        this.N = document.createElement('strong');
        this.N.innerHTML = 'Requires: ';
        this.NV = document.createElement('span');
        this.R = document.createElement('strong');
        this.R.innerHTML = 'Reward: ';
        this.RV = document.createElement('span');
        this.A = document.createElement('button');
        this.A.innerHTML = 'Ascend';
        this.A.disabled = true;
        if (this.target == 'p') this.NV.innerHTML = this.req.toFixed(2).format() + ' Pts';
        else this.NV.innerHTML = this.req.toFixed(2).format() + ' ' + C[this.target].name;
        if (this.currency == 'p') this.RV.innerHTML = this.reward.toFixed(2).format() + ' Pts';
        else this.RV.innerHTML = this.reward.toFixed(2).format() + ' ' + C[this.currency].name;
        this.S.appendChild(this.N);
        this.S.appendChild(this.NV);
        this.S.appendChild(document.createElement('br'));
        this.S.appendChild(this.R);
        this.S.appendChild(this.RV);
        this.S.appendChild(document.createElement('br'));
        this.S.appendChild(this.A);
        this.E.appendChild(this.S);
        G.panels[this.location].S.appendChild(this.E);
    }
    Tick() {
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.E.style.display = 'inline-block';
        }
        if (this.target == 'p') {
            if (G.points.gte(this.req)) {
                this.A.disabled = false;
            } else {
                this.A.disabled = true;
            }
            this.reward = new Decimal(this.scale(G.points.div(this.req))).add(1);
            
        }
        else {
            if (C[this.target].amt.gte(this.req)) {
                this.A.disabled = false;
            } else {
                this.A.disabled = true;
            }
            this.reward = new Decimal(this.scale(C[this.target].amt.div(this.req))).add(1);
            
        }
        if (this.currency == 'p') {
            if (this.reward.lte(0.001)) this.RV.innerHTML = '0.00 Pts';
            else this.RV.innerHTML = this.reward.toFixed(2).format() + ' Pts';
        }
        else {
            if (this.reward.lte(0.001)) this.RV.innerHTML = '0.00 ' + C[this.currency].name;
            else this.RV.innerHTML = this.reward.toFixed(2).format() + ' ' + C[this.currency].name;
        }
    }
    Ascend() {
        var message = `INFO/ASCEND: ${this.id}, ${this.name}, target: `;
        if (this.target == 'p') {
            message += G.points.toFixed(2).format();
        } else {
            message += C[this.target].amt.toFixed(2).format();
        }
        message += `, currency: ${C[this.currency].amt.toFixed(2).format()}, reward: ${this.reward.toFixed(2).format()}`;
        G.log(message, "#8df");
        this.ascensions = this.ascensions.add(1);
        C[this.currency].amt = C[this.currency].amt.add(this.reward);
        G.points = new Decimal(10);
        G.gain = new Decimal(0);
        G.level = new Decimal(0);
        G.xp = new Decimal(0);
        G.need = new Decimal(500);
        for (const c in C) {
            if (C[c].tier < this.tier) {
                C[c].Reset();
            }
        }
        for (const a in G.ascensions) {
            if (G.ascensions[a].tier < this.tier) {
                G.ascensions[a].Reset();
            }
        }
        for (const b in G.buyables) {
            if (G.buyables[b].tier < this.tier) {
                G.buyables[b].Reset();
            }
        }
        for (const m in G.milestones) {
            if (G.milestones[m].tier < this.tier && !G.milestones[m].preserve) {
                G.milestones[m].Reset();
            }
        }
    }
    Reset() {
        this.ascensions = new Decimal(0);
    }
}

D.Milestone = class Milestone {
    constructor (name, desc, id, condition, milestone, location, tier, preserve, onget, color1, color2, target, gain, mult) {
        G.log(`INIT/MILESTONE: ${id}, ${name}, ${location}, ${target}`, "#fbf");
        this.name = name;
        this.desc = desc;
        this.id = id;
        this.condition = condition;
        this.milestone = milestone;
        this.color = [color1, color2];
        this.location = location;
        this.tier = tier;
        this.preserve = preserve;
        this.onget = onget;
        this.target = target;
        this.gain = gain;
        this.mult = mult;
        try {
            this.achieved = this.milestone();
        } catch {
            this.achieved = false;
        }
        this.E = document.createElement('div');
        this.E.classList.add('milestone');
        this.T = document.createElement('h3');
        this.T.innerHTML = this.name;
        this.D = document.createElement('span');
        this.D.innerHTML = this.desc;
        this.E.style.backgroundColor = this.color[0];
        this.DO = document.createElement('option');
        this.DO.innerHTML = this.name;
        this.DO.value = this.id;
        G.panels[this.location].MO.appendChild(this.DO);
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        if (!this.unlocked) this.E.style.display = 'none';
        else this.E.style.display = 'inline-block';
        this.E.appendChild(this.T);
        this.E.appendChild(this.D);
        G.panels[this.location].S.appendChild(this.E);
    }
    Tick() {
        if (!this.achieved) {
            this.achieved = this.milestone();
            if (this.achieved) this.E.style.backgroundColor = this.color[1];
        }
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.E.style.display = 'inline-block';
        }
    }
    Reset() {
        this.achieved = false;
        this.E.style.backgroundColor = this.color[0];
        this.unlocked = this.condition();
        if (!this.unlocked) this.E.style.display = 'none';
    }
}

D.Table = class Table {
    constructor (name, id, condition, location) {
        G.log(`INIT/TABLE: ${id}, ${name}, ${location}`, "#dfb");
        this.name = name;
        this.id = id;
        this.condition = condition;
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.location = location;
        this.E = document.createElement('table');
        this.E.classList.add('listing');
        if (!this.unlocked) this.E.style.display = 'none';
        G.panels[this.location].S.appendChild(this.E);
    }
    Tick () {
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.E.style.display = '';
        }
    }
}

D.Block = class Block {
    constructor (name, id, condition, location, columns) {
        G.log(`INIT/BLOCK: ${id}, ${name}, ${location}, ${columns}`, "#fbd");
        this.name = name;
        this.id = id;
        this.condition = condition;
        this.columns = columns;
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.location = location;
        this.E = document.createElement('div');
        this.E.classList.add('block');
        this.E.style.columnCount = columns;
        if (!this.unlocked) this.E.style.display = 'none';
        G.panels[this.location].S.appendChild(this.E);
    }
}