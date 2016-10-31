scotchApp.component('items', {
    bindings: {},
    templateUrl: '../www/App/Views/itemsInMemory.html',
    controller: function () {
        $("#headerText").html("מסירה - פריטים בזיכרון")
        this.items = [];
        for (i in JSON.parse(localStorage.offlineXml)) {
            this.items.push(i);
        }
        this.itemLength = this.items.length;
        this.memory = "100%";
        if ((1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length) / 5230000 < 1)
        {
            this.memory = ((1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length) / 5230000).toFixed(2) * 100 + "%"
        } 
    }
})