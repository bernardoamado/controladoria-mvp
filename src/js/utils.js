const ObjectUtil = {
    merge: function(obj, defaultObj, overwrite) {
        const newObj = {};
        if (obj && (typeof obj == 'object'))
            Object.keys(obj).forEach(attr => {
                newObj[attr] = obj[attr];
            });
        if (defaultObj && (typeof defaultObj == 'object'))
            Object.keys(defaultObj).forEach(attr => {
                if (overwrite || (newObj[attr] === undefined))
                    newObj[attr] = defaultObj[attr];
            });
        return newObj;
    },
    copy: function(obj) {
        if (obj instanceof Date)
            return new Date(obj);
        if (Array.isArray(obj))
            return obj.map(i => this.copy(i));
        if (typeof obj == 'object') {
            const newObj = {};
            if (obj)
                Object.keys(obj).forEach(k => {
                    if (typeof obj[k] === 'object')
                        newObj[k] = this.copy(obj[k]);
                    else
                        newObj[k] = obj[k];
                });
            return newObj;
        }
        else
            return obj;
    },
    parseDate: function(d) {
        return new Date(d);
    },
    parse: function(obj, parseAttributes) {
        if (!obj)
            return obj;
        const newObj = {};
        Object.keys(obj).forEach(attr => {
            if (attr in parseAttributes) {
                if (parseAttributes[attr] == 'date')
                    newObj[attr] = this.parseDate(obj[attr]);
                else if (parseAttributes[attr] in this)
                    newObj[attr] = this[parseAttributes[attr]](obj[attr]);
                else
                    newObj[attr] = parseAttributes[attr](obj[attr]);
            }
            else
                newObj[attr] = this.copy(obj[attr]);
        });
        return newObj;
    }
}

const DateUtil = {
    asString: (dt, locale) => dt.toLocaleDateString(locale || 'pt-br')
}

export {
    DateUtil,
    ObjectUtil
};