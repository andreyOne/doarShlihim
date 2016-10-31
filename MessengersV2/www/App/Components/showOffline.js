scotchApp.component('showOffline', {
    bindings: {},
    templateUrl: '../www/App/Views/showOfflinePage.html',
    controller: function () {
        this.isActive = false;
        this.picBox = JSON.parse(localStorage.getItem('newTable8')) || [];
        this.currentPic = {};
        this.isBox = true;
        $('#headerText').text('בחירת תהליך offline');

        this.changeState = function (flag) {
            this.isBox = flag;
        }

        this.sendCurrent = function (pic) {
            this.currentPic = pic;
            this.changeState(false);
        }

        this.removeCurrent = function (pic) {
            this.picBox.splice(this.picBox.indexOf(pic), 1)
            localStorage.setItem('newTable8', JSON.stringify(this.picBox));
            this.changeState(true);
            $('#headerText').text('בחירת תהליך offline');
        }
    }
})

scotchApp.component('sendOffline', {
    bindings: {
        pic: '<',
        remove: '&'
    },
    templateUrl: '../www/App/Views/sendOfflineMsg.html',
    controller: function (mainService, $attrs, $scope) {
        this.myPic = this.pic[0].img;
        this.deliveryCode = JSON.parse(localStorage.getItem('kodMesiraTable'));
        this.selected = '-1';
        this.barcode = '';
        this.showManui = false;
        this.showSendButton = false;
        this.msg3obj = {};
        angular.element($('.area')).attr('disabled', false)
        $('#headerText').text('השלמת מסירה offline');

        this.sendTo32 = function () {
            if (this.barcode.substring(0, 2) == '51' && this.barcode.substring(11, 13) == '17' && (this.selected == "-1" || this.selected == "1" || this.selected == "7" || this.selected == "70" || this.selected == "91" || this.selected == "92" || this.selected == "93" || this.selected == "99")) {
                navigator.notification.alert('מסירת פריט מסוג 51-17 יש לבצע בתפריט מסירה לספק בלבד');
            } else {
                var self = this;
                if (this.selected == '-1') { this.selected = '1'; }
                if (mainService.validateBarcode(this.barcode)) {
                    mainService.send32(this.selected, this.barcode).then(function (response) {
                        var data = $.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'];
                        if (data.ASSOCIATED == '0') {
                            navigator.notification.alert('לפריט לא בוצע תהליך חלוקה')
                        } else if (data.RESULT == "1") {
                            navigator.notification.alert(data.RESMSG);
                            self.remove({ pic: self.pic });
                        } else {
                            self.msg3obj = data;
                            $('.area,.packageinput2').attr('disabled', true);
                            if (data.MEM > 0) {
                                $scope.dirty.value = data.MEM;
                                self.showManui = true;
                                self.showSendButton = true;
                                $('.packageinput4').attr('disabled', true);
                            } else if (data.MEM == '0' || data.MEM == '') {
                                self.showSendButton = true;
                            } else if (data.MEM == '-1') {
                                self.showManui = true;
                            }
                        }
                    }, function (err) {
                        navigator.notification.alert('אין תקשורת , נסה שנית');
                    })
                }
            }
        }

        this.send = function () {
            if (this.showManui === true && $scope.dirty.value === '') {
                navigator.notification.alert('לא בחרת מספר מנוי');
            } else {

                if ($scope.dirty.value) {
                    if ($scope.dirty.value.split(',')[1]) {
                        this.msg3obj.manui = $scope.dirty.value.split(',')[1].trim();
                    } else {
                        this.msg3obj.manui = $scope.dirty.value.split(',')[0].trim();
                    }
                } else {
                    this.msg3obj.manui = '';
                }

                this.msg3obj.kodMesira = this.selected;
                this.msg3obj.BC = this.barcode;

                this.index = this.msg3obj.RQP == '0' ? 3 : 4;

                this.msg3obj.PH = this.pic[0].img;
                for (var i = 1; i < this.pic.length && i < this.index; i++) {
                    if (this.msg3obj.RQP == '1') {
                        if (this.msg3obj['PH' + [i]] > 0) {
                            this.msg3obj['PH' + [i]] = this.pic[i].img;
                        }
                    } else {
                        this.msg3obj['PH' + [i]] = this.pic[i].img;
                    }


                }
                var self = this;
                mainService.send3(this.msg3obj).then(function (response) {
                    var data = $.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'].ITEM;
                    if (data.RESULT == "1") {
                        navigator.notification.alert(data.RESMSG);
                    }
                    if (data.RESULT == '100' || data.RESULT == '0') {
                        self.remove({ pic: self.pic });
                        navigator.notification.alert('נשלח בהצלחה');
                    }
                }, function (err) {
                    navigator.notification.alert('אין תקשורת , נסה שנית');
                })

            }
        }


        var misparim = JSON.parse(localStorage.getItem("Manuim"));

        $scope.dirty = {};

        function suggest_state(term) {
            var q = term.toLowerCase().trim();
            var results = [];

            // Find first 10 states that start with `term`.
            for (var i = 0; i < misparim.length && results.length < 10; i++) {
                var state = misparim[i];
                var res = state.toLowerCase().indexOf(q) > -1;
                if (state.toLowerCase().indexOf(q) > -1)
                    results.push({ label: state, value: state });
            }

            return results;
        }

        var self = this;
        function chooseManui(selected) {
            self.showSendButton = true;
            $('.packageinput4 ').trigger('blur')
        };

        $scope.autocomplete_options = {
            suggest: suggest_state,
            on_select: chooseManui
        };
    }
})