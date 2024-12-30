export default {
    asString: function(dt, locale) {
        return dt.toLocaleDateString(locale || 'pt-br');
    },
    formatDateFromString: function(dt, locale) {
        return (new Date(dt)).toLocaleDateString(locale || 'pt-br');
    }
}