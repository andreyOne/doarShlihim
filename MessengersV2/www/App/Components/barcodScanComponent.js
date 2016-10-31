scotchApp.component('barcode', {
    bindings:{
        barcode: "=",
        send: "&"
    },
    template: '<div class="BarcodeArea" ng-click="$ctrl.onScan()" id="deliver_startScan"></div> <div class="greyText2">* במידה והברקוד אינו קריא ניתן להקליד מספר פריט</div>',
    controller: function () {
        var self = this;

        this.onScan = function () {
            cloudSky.zBar.scan({
                text_instructions: "Please point your camera at the QR code.", // Android only
                camera: "back", // defaults to "back"
                flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
                drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
            }, onSuccess, onFailure);
        };
        function playMP3() {
            var mp3URL = getMediaURL("sounds/scan.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }

        function getMediaURL(s) {
            if (device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
            return s;
        }

        function mediaError(e) {
            alert('Media Error');
            alert(JSON.stringify(e));
        }
        function onSuccess(barcode) {
            if (validateManaualCode(barcode)) {
                playMP3();
                //update the scanned barcode to the screen
                self.barcode = barcode;
                //$('#packageinput').val(barcode);
                //same behavior as clicking the plus icon
                if (self.send) {
                    self.send();
                }
                
            } else {
                self.barcode = '';
                //barcode = '';
                //$('#packageinput').val(barcode);
                var mp3URL = getMediaURL("sounds/error.amr");
                var media = new Media(mp3URL, null, mediaError);
                media.play();
            }
        }

        function onFailure(data) {
        }
    }
});
