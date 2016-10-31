scotchApp.component('assignmentsCollectComponent', {
    templateUrl: 'App/Views/assignmentsCollect.html',
    controller: function ($scope, $routeParams, mainService) {
        this.assignment = mainService.currentAssignment;
        this.barcode = "";
        this.arrBarcodes = [];
        this.select1 = "";
        this.select2 = "";

        var self = this;

        angular.element(document.getElementById("headerText")).html("משימות - איסוף")

        this.getSubscriberName = function (mem) { return getSubscriberName(mem).trim() };

        this.send3 = function () {         
            if (validateManaualCode(self.barcode)) {
                //$(".circle-wrapper").show();
                mainService.send3assignment(self.barcode).then(function (result) {
                    res = $.xml2json($.xml2json(result.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'].ITEM;
                    if (res.RESULT == "0") {
                        //$(".circle-wrapper").hide();
                        self.arrBarcodes.push(self.barcode);
                        self.barcode = "";
                        console.log(result);
                    } else {
                        navigator.notification.alert(res.RESMSG);
                        //$(".circle-wrapper").hide();
                    }

                }, function (err) {
                    navigator.notification.alert('אין תקשורת, נסה שנית');
                    //$(".circle-wrapper").hide();
                })
            } else {
                //$(".circle-wrapper").hide();
            }
        }

        this.send21 = function () {
            $(".circle-wrapper").show();
            mainService.send21assignment(self.assignment.taskID, self.select1, self.select2, self.arrBarcodes.toString(), self.arrBarcodes[0] || "").then(function (result) {
                console.log(result.data);
                res = $.xml2json($.xml2json(result.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'];
                if (res.RESULT == "0") {
                    $(".circle-wrapper").hide();
                    navigator.notification.alert('דווח בהצלחה');
                    location.href = "#/assignments_all";
                } else {
                    navigator.notification.alert(res.RESMSG);
                    $(".circle-wrapper").hide();
                    location.href = "#/assignments_all";
                }
                
            }, function (err) {
                navigator.notification.alert('אין תקשורת, נסה שנית');
                $(".circle-wrapper").hide();
            })
        }

        this.open = function () {
            $("#warpPopup").show();
        }

        this.onXClick = function () {
            $("#warpPopup").hide();
        }

        console.log(mainService.currentAssignment);
    }
});
