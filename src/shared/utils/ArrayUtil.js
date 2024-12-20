export default {
    enumerateSentence: function(arr) {
        return [arr.slice(0, -1).join(', '), arr[arr.length - 1]].join(' ou ');
    }
}