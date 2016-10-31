scotchApp.component('report', {
    bindings: {},
    templateUrl: '../www/App/Views/report.html',
    controller: function (mainService) {
        this.isShowPopup = false;
        this.popupTitle = "";
        this.currentItems = [];
        this.deliveryItems = [];
        this.halukaItems = [];
        this.deliveryNotItems = [];
        this.unbalancedItems = [];
        this.collectItems = [];

        var self = this;

        angular.element(document.getElementById("headerText")).html('דו"ח מאזן')
        $(".circle-wrapper").show();

        mainService.getReport().then(function (result) {
            $(".circle-wrapper").hide();
            var data = $.xml2json($.xml2json(result.data)['s:Envelope']['s:Body'][XMLMETHOD + "Response"][XMLMETHOD + "Result"]["DataObject"].Data).DATA.MSG.DATA;
            console.log(data);
            if (data.HALUKA.ITEM) { self.halukaItems = Array.isArray(data.HALUKA.ITEM) ? data.HALUKA.ITEM : Array(data.HALUKA.ITEM); }
            if (data.COLLECT.ITEM) { self.collectItems = Array.isArray(data.COLLECT.ITEM) ? data.COLLECT.ITEM : Array(data.COLLECT.ITEM); }
            if (data.UNBALANCED.ITEM) { self.unbalancedItems = Array.isArray(data.UNBALANCED.ITEM) ? data.UNBALANCED.ITEM : Array(data.UNBALANCED.ITEM); }
            var deliveryTemp = [];
            if (data.DELIVERY.ITEM) { deliveryTemp = Array.isArray(data.DELIVERY.ITEM) ? data.DELIVERY.ITEM : Array(data.DELIVERY.ITEM); }
            deliveryTemp.forEach(function (item, index, deliveryTemp) {
                if (item.DELIV == 1) {
                    self.deliveryItems.push(item);
                } else {
                    self.deliveryNotItems.push(item);
                }
            })
        }, function (err) {
            navigator.notification.alert('אין תקשורת, נסה שנית');
            $(".circle-wrapper").hide();
        })

        this.showPopup = function (items, title) {
            self.currentItems = items;
            self.popupTitle = title;
            self.isShowPopup = true;
        }

        this.hidePopup = function () {
            self.isShowPopup = false;
        }

        this.displayToday = function () {
            var date = new Date();
            var day = date.getDate() >= 0 && date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var month = (date.getMonth() + 1) >= 0 && (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);

            return [day, month, date.getFullYear()].join('.');
        }
    }
})