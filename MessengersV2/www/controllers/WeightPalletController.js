scotchApp.controller('weightPalletController', function ($scope, $routeParams,$rootScope,$location) {
    console.log('9999999999999999999999999999999999999999999999999999999 $rootScope 9999999999999999999999999999');
    console.log($rootScope);
    console.log($location);
    $("#warpPopup").hide();

    $('.packageinput').val($routeParams.barcode);

    var originalWeghit = "";
    var barcode = "";
    var kodmesira = ""; 
    var countPictures = "";
    var isPalet = "";
    var MEM = '';
    var From = "-1";
    var CountDelivered = "-1"
    var KodHanut = "";
    var isYazum = "0";
    var myKodMesira = '';
    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });

    angular.element(document).ready(function () {
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

        //$rootScope.isYazum = $routeParams.isYazum;
        //$rootScope.KodHanut = $routeParams.KodHanut;
        //$rootScope.originalWeghit = $routeParams.originalWeghit;
        //$rootScope.barcode = $routeParams.barcode;
        //$rootScope.kodmesira = $routeParams.kodmesira;
        //$rootScope.countPictures = $routeParams.countPictures;
        //$rootScope.isPalet = $routeParams.isPalet;
        //$rootScope.MEM = $routeParams.MEM;

        isYazum = $routeParams.isYazum || $routeParams.isYzum || "0";
        KodHanut = $routeParams.KodHanut;
        originalWeghit = $routeParams.originalWeghit;
        barcode = $routeParams.barcode;
        kodmesira = $routeParams.kodmesira || '';
        myKodMesira = kodmesira.split(',')[0];
        countPictures = $routeParams.countPictures;
        isPalet = $routeParams.isPalet;
        MEM = $routeParams.MEM;
        if ($routeParams.originalWeight == undefined && $routeParams.barcode == undefined && $routeParams.kodmesira == undefined && $routeParams.countPictures == undefined) {
            isYazum = "1";
        }
        $("#header").load("pages/header.html", function () {
            var tt = $('#header').find('#headerText');
            tt.text('בקרת משקל');
        });
        $("#footer").load("pages/footer.html");
    });

    $scope.onOk = function () {
        isPalet = "1";

        if (From == "1" || From == "2" || From == "3" || From == "4") {
            var select = $(".area").val();
            fixedWeight = select;
            barcode = barcode.toUpperCase();

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
                $rootScope.prevPath = 'weightItem';
                location.href = "#/mesimat_Mesira_Shlav_Rishon/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + myKodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
            }
            else
                location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/buffer/" + 0 + "/RQW/" + 1;

        }
        else if (isYazum == "1") {
            var currentBarcode = $(".packageinput").val();
            if (validateManaualCode(currentBarcode)) {
                var select = "0";
                isPalet = "1";
                var xml = CreateXml(currentBarcode);
                SendRequest(xml);
            }
            
        }
        else {
            fixedWeight = "0";

            location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/buffer/" + 0 + "/RQW/" + 1;

        }
    }

    $scope.$watch('value', function (value) {
        console.log('from' + From);
        console.log('value' + value);
        if (value == 1) {
            var isYzum = $routeParams.isYzum || '0';
            if (isYzum == "1") {
                location.href = "#/weightNormal/barcode/" + barcode + "/isYzum/" + isYzum;
            } else {
                var select = "0";
                isPalet = "0";
                if (MEM == '' | MEM == null) {
                    MEM = "-1";
                }

                if (From == "1") {
                    location.href = "#/weightNormal/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;
                }
                else if (From == "2") {
                    location.href = "#/weightNormal/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered;
                }
                else if (From == "3") {
                    location.href = "#/weightNormal/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                }
                else if (From == "4") {
                    location.href = "#/weightNormal/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                }
                else {
                    location.href = "#/weightNormal/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;
                }
            }           
        }

    });

    //#region On Scan Barcode
    $scope.onScan = function () {

        cloudSky.zBar.scan({
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
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
            $('.packageinput').val(barcode);
        } else {
            barcode = '';
            $('.packageinput').val(barcode);
            var mp3URL = getMediaURL("sounds/error.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }
    }

    function onFailure(data) {

    }
    //#endregion On Scan Barcode



    //#region Create Xml
    function CreateXml(barcodeNormal) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RLSCODE = localStorage.getItem("RLSCODE");
        barcodeNormal = barcodeNormal.toUpperCase();

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:'+ XMLMETHOD + '>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER>\
<DATA><ITEM><ITEMID></ITEMID><BC>'+ barcodeNormal + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><ACT>-1</ACT><TYP>0</TYP><MEM></MEM>\
<DEVKEY>9999</DEVKEY><RQ>1</RQ><RQP></RQP><RQW></RQW><PH></PH><PH1></PH1><PH2></PH2><PH3></PH3><MEMP></MEMP><ORG></ORG><CRT></CRT><PLT>1</PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
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
                                    if (From == "-1") {
                                        $(".packageinput").val("");
                                        navigator.notification.alert("בקרת משקל בוצעה בהצלחה");
                                        location.href = "#/weightNormal";
                                    }
                                    else {
                                        var select = "0";
                                        if (From == "1") {
                                            location.href = "#/mesira_merukezet_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + select + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;
                                        }
                                        else if (From == "2") {
                                            location.href = "#/optics_mesira_sapak/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered;
                                        }
                                        else if (From == "3") {
                                            location.href = "#/optics_mesira_hanut/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + select + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                                        }
                                        else if (From == "4") {
                                            location.href = "#/mesimat_Mesira_Shlav_Rishon/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                                        }
                                        else {
                                            location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + select + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;

                                        }
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





