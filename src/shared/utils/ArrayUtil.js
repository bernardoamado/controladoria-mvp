export default {
    enumerateSentence: function(arr) {
        if (arr.length <= 1)
            return arr[0] || '';
        else
            return [
                arr.slice(0, -1).join(', '),
                arr[arr.length - 1]
            ].join(' ou ');
    }
}