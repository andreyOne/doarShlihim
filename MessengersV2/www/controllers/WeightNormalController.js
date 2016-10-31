scotchApp.controller('weightNormalController', function ($scope, $routeParams,$rootScope) {
    $("#warpPopup").hide()

    //#region Global Vars
    var originalWeghit = "";
    var barcode = $routeParams.barcode || "";
    var kodmesira = "";
    var countPictures = "";
    var isPalet = "";
    var fixedWeight = '';
    var MEM = '';
    var From = "-1";
    var CountDelivered = "0";
    var KodHanut = "";
    var isYzum =$routeParams.isYzum || "0";
    var myKodMesira = '';
    //#endregion
        $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
        });



        function keyboardShowHandler(e) {
            $("#footer").hide();

        }
        function keyboardHideHandler(e) {
            $("#footer").show();
        }
    //#region On Angular Ready
        angular.element(document).ready(function () {
            window.addEventListener('native.keyboardshow', keyboardShowHandler);
            window.addEventListener('native.keyboardhide', keyboardHideHandler);
        if ($routeParams.originalWeight) {
            originalWeghit = $routeParams.originalWeight;
            barcode = $routeParams.barcode;
            kodmesira = $routeParams.kodmesira;
            myKodMesira = kodmesira.split(',')[0];
            countPictures = $routeParams.countPictures;
            isPalet = $routeParams.isPalet;
            MEM = $routeParams.MEM;
            isYzum = $routeParams.isYzum
        }
        if ($routeParams.originalWeight == undefined && $routeParams.barcode == undefined && $routeParams.kodmesira == undefined && $routeParams.countPictures == undefined) {
            isYzum = "1";
        }
        KodHanut = $routeParams.KodHanut;
        if ($routeParams.From == "1") {
            From = "1";
            CountDelivered = $routeParams.Count;
        }
        if ($routeParams.From == "2") {
            From = "2";
            CountDelivered = $routeParams.Count;
        }

        if ($routeParams.From == "3") {
            From = "3";
            CountDelivered = $routeParams.Count;
        }
        if ($routeParams.From == "4") {
            From = "4";
            CountDelivered = $routeParams.Count;
        }

        if (barcode != "undefined") {
            $("#packageinput").val(barcode);
        }
        if (originalWeghit != "undefined") {
            $(".packageinput4").val(originalWeghit);
        }
        $("#header").load("pages/header.html", function () {
            var tt = $('#header').find('#headerText');
            tt.text('בקרת משקל');
        });
        $("#footer").load("pages/footer.html");
    });
    //#endregion

    //#region on Radio button changed
        $scope.value = '1';
        $scope.$watch('value', function (value) {
            console.log(value);
        if (value == 2) {
            if (barcode != '' && originalWeghit != '') {

            }
            if (originalWeghit != "" && isYzum != "1") {
                var select = "0";
                isPalet = "0";
                if (From == "1") {
                    location.href = "#/weightPallet/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;
                }
                else if (From == "2") {
                    location.href = "#/weightPallet/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered;
                }
                else if (From == "3") {
                    location.href = "#/weightPallet/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered+"/KodHanut/" + KodHanut;
                }
                else if (From == "4") {
                    location.href = "#/weightPallet/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                }

                else {
                    location.href = "#/weightPallet/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;

                }
            }
            else {
                barcode = $('#packageinput').val();
                if (From == "-1" && barcode == '') {
                    $scope.value = '1';
                    $('#radio1').trigger('click');
                    navigator.notification.alert('יש להזין ברקוד')
                    
                } else {                    
                    window.location.href = "#/weightPallet/barcode/" + barcode + "/isYzum/" + isYzum;
                }
            }
        }

        });

        $('.packageinput').val($routeParams.barcode);
    //#endregion

    //#region On Scan Barcode
    $scope.onScan = function () {

        cloudSky.zBar.scan({
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
            camera: "back", // defaults to "back"
            flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);
    };

            var mp3URL = getMediaURL("sounds/scan.amr");
        var media = new Media(mp3URL, null, mediaError);

    function playMP3() {
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
            if (barcode[0] == "E" && barcode[1] == "E") {
                originalWeghit = "-1";
                if (kodmesira == "") { kodmesira = "0" }
                if (countPictures == "") { countPictures = "0" }
                if (MEM == "") { MEM = "0" }
                if (From == "1") {
                    location.href = "#/weightItem/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;

                }
                else if (From == "2") {
                    location.href = "#/weightItem/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered;
                }
                else if (From == "3") {
                    KodHanut = $routeParams.KodHanut;
                    location.href = "#/weightItem/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                }
                else if (From == "4") {
                    location.href = "#/weightItem/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                }

                else {
                    location.href = "#/weightItem/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM;;

                }
            }
            $('#packageinput').val(barcode);
        } else {
            barcode = '';
            $('#packageinput').val(barcode);
            var mp3URL = getMediaURL("sounds/error.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }
    }

    function onFailure(data) {
       
    }
    //#endregion On Scan Barcode

  
    function fixGrams(grm) {
        if (grm.length == 0) { grm = "000"; }
        if (grm.length == 1) { grm = "00" + grm; }
        if (grm.length == 2) { grm = "0" + grm; }
        if (grm.length == 3) { grm = grm; }
        return grm;
    }
    //#region On Ok Pressed
    $scope.onOkPressed = function () {
        barcode = $('.packageinput').val();
        barcode = barcode.toUpperCase();
        var originalW = $('.packageinput4').val();
        var newWeight = $('.selectInputfield>.area').val();

        if (barcode != '' || originalW != '') {
            if (barcode[0] == "E" && barcode[1] == "E") {
                originalW = "-1";
                if (kodmesira == "") { kodmesira = "0" }
                if (countPictures == "") { countPictures = "0" }
                if (MEM == "") { MEM = "0" }
                if (From == "1") {
                    location.href = "#/weightItem/originalWeight/" + originalW + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;

                }
                else if (From == "2") {
                    location.href = "#/weightItem/originalWeight/" + originalW + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered;
                }
                else if (From == "3") {
                    location.href = "#/weightItem/originalWeight/" + originalW + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                }
                else if (From == "4") {
                    location.href = "#/weightItem/originalWeight/" + originalW + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                }
                else {
                    location.href = "#/weightItem/originalWeight/" + originalW + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM;;

                }
            }
            else if (From == "1" || From == "2" || From == "3" || From == "4") {
                var select = $(".area").val();
                fixedWeight = select;

                kodmesira = encodeURIComponent(kodmesira)
                if (fixedWeight == -1) {
                    navigator.notification.alert('יש להזין משקל מתוקן');
                } else {
                    if (From == "1") {
                        location.href = "#/mesira_merukezet_takin/originalWeight/" + originalW + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;

                    }
                    else if (From == "2") {
                        location.href = "#/optics_mesira_sapak/originalWeight/" + originalW + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                    }
                    else if (From == "3") {
                        location.href = "#/optics_mesira_hanut/originalWeight/" + originalW + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                    }
                    else if (From == "4") {
                        if (newWeight != '' && newWeight != -1) {
                            $rootScope.prevPath = 'weightItem';
                            location.href = "#/mesimat_Mesira_Shlav_Rishon/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + myKodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                        } else {
                            navigator.notification.alert('יש להזין משקל מתוקן');
                        }

                    }
                    else {
                        location.href = "#/mesira_takin/originalWeight/" + originalW + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/buffer/" + 0 + "/RQW/"+1;

                    }
                }
                
            }
         
            else if(isYzum == "1") {


                var select = $(".area").val();
                fixedWeight = select;

                if (select == "-1") {
                    navigator.notification.alert("יש לבחור משקל מתוקן");
                }
                else {
                    var selectedFixed = $(".area").val();
                    var original = $(".packageinput4").val();

                    if (original == '') {
                        original = "0";
                    }
                    if (validateManaualCode(barcode)) {
                        var xml = CreateXml(barcode, selectedFixed, original);
                        SendRequest(xml);
                    }

                }

            }

            else {
                fixedWeight = $('.selectInputfield>.area').val();
                if (fixedWeight == -1) {
                    navigator.notification.alert("יש לבחור משקל מתוקן");
                } else {
                    location.href = "#/mesira_takin/originalWeight/" + originalW + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/buffer/" + 0 + "/RQW/" + 1;
                }
                
            }
        }
        else {
            navigator.notification.alert('יש להזין ברקוד ומשקל')

        }
    };
    //#endregion

    //#region Create Xml
    function CreateXml(barcodeNormal, selectedFixed, original) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RLSCODE = localStorage.getItem("RLSCODE");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:'+ XMLMETHOD + '>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER>\
<DATA><ITEM><ITEMID></ITEMID><BC>'+ barcodeNormal + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><ACT>-1</ACT><TYP>0</TYP><MEM></MEM>\
<DEVKEY>9999</DEVKEY><RQP></RQP><RQW></RQW><PH></PH><PH1></PH1><PH2></PH2><PH3></PH3><MEMP></MEMP><ORG>' + original + '</ORG><CRT>' + selectedFixed + '</CRT><PLT>0</PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
      </tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>'

        return xml;
    }
    //#endregion

    //#region SendRequest
    function SendRequest(xml) {
        $
          .ajax(
                        {
                            url: serverUrl,
                            dataType: "xml",
                            //dataType: 'json',
                            type: "POST",
                            async: false,
                            contentType: "text/xml;charset=utf-8",
                            headers: {
                                "SOAPAction": SoapActionQA
                            },
                            crossDomain: true,
                            data: xml,
                            timeout: 30000 //30 seconds timeout
                        }).done(function (data) {
                            if (data != null) {
                                var parser = new DOMParser();
                                var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
                                var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                                var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                                if (result == "0") {
                                    if (barcode != '' && (originalWeghit != '' && originalWeghit != null && originalWeghit != "undefined")) {
                                        if (From == "1") {
                                            location.href = "#/mesira_merukezet_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;

                                        }
                                        else if (From == "2") {
                                            location.href = "#/optics_mesira_sapak/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered;
                                        }
                                        else if (From == "3") {
                                            location.href = "#/optics_mesira_hanut/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                                        }
                                        else if (From == "4") {
                                            location.href = "#/mesimat_Mesira_Shlav_Rishon/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                                        }

                                        else {
                                            location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;

                                        }

                                    }
                                    else {
                                        navigator.notification.alert('בקרת משקל בוצעה בהצלחה');
                                        $('.packageinput').val("");
                                        $('.packageinput4').val("");
                                        $(".area").val(-1);
                                    }
                                }
                                else {
                                    navigator.notification.alert(message);
                                }
                            }
                            else {
                                navigator.notification.alert('יש תקלה בשרת');
                            }

                        }).fail(function (jqXHR, textStatus, thrownError) {
                            navigator.notification.alert('אין תקשורת, נסה שנית');
                        });
    }
    //#endregion

});


