export default {
    formatAsCurrency: function(n, digits) {
        return new Intl.NumberFormat('default', { 
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: (digits || 2),
            maximumFractionDigits: (digits || 2)
        }).format(n);
    },
    formatAsPercent: function(n, digits) {
        return new Intl.NumberFormat('default', { 
            style: 'percent',
            minimumFractionDigits: (digits || 2),
            maximumFractionDigits: (digits || 2)
        }).format(n)
    }
}