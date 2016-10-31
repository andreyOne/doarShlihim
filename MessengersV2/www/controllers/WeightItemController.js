scotchApp.controller('weightItemController', function ($scope, $routeParams,$rootScope) {
    var currentBarcode = '';
    var countPictures = 0;
    var isBarcodeOk = false;
    var fixedWeight = "0";
    var originalWeight;
    var kodMesira = '';
    var MEM = '';
    var isYazum = false;
    var From = "-1";
    var CountDelivered = "-1";
    var KodHanut = "";
    var isYazum = "0";

    $("#warpPopup").hide()

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });

    //#region On Ready Angular
    angular.element(document).ready(function () {
        if ($routeParams.originalWeight) {
            MEM = $routeParams.MEM;
            originalWeight = $routeParams.originalWeight;
            currentBarcode = $routeParams.barcode;
            fixedWeight = $routeParams.fixWeight;
            countPictures = $routeParams.countPictures;
            kodMesira = $routeParams.kodmesira;
            KodHanut = $routeParams.KodHanut
            isYazum = $routeParams.isYazum;
            if ($routeParams.originalWeight == undefined && $routeParams.barcode == undefined && $routeParams.kodmesira == undefined && $routeParams.countPictures == undefined) {
                isYzum = "1";
            }

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

            //From = $routeParams.From;
            //CountDelivered = $routeParams.Count;


            if (originalWeight == "-1") {
                var kg = "";
                var grm = "";
                $("#kgOrg").val(kg);
                $("#grmOrg").val(grm);
                isYazum = true;

            }
            else {
                if (originalWeight.length == 5) {
                    var kg = originalWeight[0] + originalWeight[1];
                    var grm = originalWeight[2] + originalWeight[3] + originalWeight[4];
                }
                else if (originalWeight.length == 4) {
                    var kg = originalWeight[0]
                    var grm = originalWeight[1] + originalWeight[2] + originalWeight[3];
                }
                else {
                    var kg = "0";
                    var grm = originalWeight[0] + originalWeight[1] + originalWeight[2];
                }

                if (isNaN(grm)) {
                    grm = "0";
                }
                $("#kgOrg").val(kg);
                $("#grmOrg").val(grm);
            }

        }
        if ($routeParams.barcode) {
            currentBarcode = $routeParams.barcode;
            $(".packageinput").val(currentBarcode);
        }
        $("#header").load("pages/header.html", function () {
            var tt = $('#header').find('#headerText');
            tt.text('בקרת משקל');
        });
        $("#footer").load("pages/footer.html");

        $.sidr('close', 'simple-menu');
        $('input').on('keyup', function (e) {
            var theEvent = e || window.event;
            var keyPressed = theEvent.keyCode || theEvent.which;
            if (keyPressed == 13) {
                cordova.plugins.Keyboard.close();
            }
            return true;
        });

    });
    //#endregion

    function fixGrams(grm) {
        if (grm.length == 0) { grm = "000"; }
        if (grm.length == 1) { grm = "00" + grm; }
        if (grm.length == 2) { grm = "0" + grm; }
        if (grm.length == 3) { grm = grm; }
        return grm;
    }



    $scope.onOk = function () {
        if (originalWeight != null) {
            if ($("#kgFixed").val() == '') {
                navigator.notification.alert('יש להזין ק"ג מתוקן');
            }
            else if ($("#grmFixed").val() == '') {
                navigator.notification.alert('יש להזין גרם מתוקן');
            }
            else {
                var MAX_EE_WT = localStorage.getItem("MAX_EE_WT");

                currentBarcode = $('.packageinput').val();
                var grmOrg = $("#grmOrg").val();
                var grmFixed = $("#grmFixed").val();
                grmOrg = fixGrams(grmOrg);
                grmFixed = fixGrams(grmFixed);


                var originalW = $("#kgOrg").val() + "." + grmOrg;
                var select = $("#kgFixed").val() + "." + grmFixed;

                var selectToChecl = select;
                if (parseFloat(MAX_EE_WT) < parseFloat(selectToChecl)) {
                    navigator.notification.alert("משקל מתוקן שהוקלד גדול מהמשקל המותר");
                }
                else {
                    if (parseFloat(originalW) > parseFloat(MAX_EE_WT)) {
                        navigator.notification.alert("משקל מקורי שהוקלד גדול מהמשקל המותר");
                    }
                    else {
                        select = select.replace('.', '');
                        originalW = originalW.replace('.', '');


                        var isPalet = "0";

                        fixedWeight = select;
                        if (validateManaualCode(currentBarcode)) {
                            if (From == "1" || From == "2" || From == "3" || From == "4") {
                                kodMesira = "1";
                                fixedWeight = select;
                                if (From == "1") {
                                    location.href = "#/mesira_merukezet_takin/originalWeight/" + originalW + "/barcode/" + currentBarcode + "/fixedWeight/" + select + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;
                                }
                                else if (From == "2") {
                                    location.href = "#/optics_mesira_sapak/originalWeight/" + originalW + "/barcode/" + currentBarcode + "/fixedWeight/" + select + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                                }
                                else if (From == "3") {
                                    location.href = "#/optics_mesira_hanut/originalWeight/" + originalW + "/barcode/" + currentBarcode + "/fixedWeight/" + select + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                                }
                                else if (From == "4") {
                                    $rootScope.prevPath = 'weightItem';
                                    kodMesira = $routeParams.kodmesira.split(',')[0];
                                    location.href = "#/mesimat_Mesira_Shlav_Rishon/originalWeight/" + originalW + "/barcode/" + currentBarcode + "/fixedWeight/" + select + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                                }

                                else {
                                    location.href = "#/mesira_takin/originalWeight/" + originalW + "/barcode/" + currentBarcode + "/fixedWeight/" + select + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/buffer/" + 0 + "/RQW/" + 1;

                                }
                            }
                            else if (isYazum) {
                                if (validateManaualCode(currentBarcode)) {
                                    var xml = CreateXml(currentBarcode, select, originalW);
                                    SendRequest(xml);
                                }
                            }
                            else {

                                location.href = "#/mesira_takin/originalWeight/" + originalW + "/barcode/" + currentBarcode + "/fixedWeight/" + select + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/buffer/" + 0 + "/RQW/" + 1;
                            }

                        }


                    }
                }

            }
        }
        else {

            if ($("#kgFixed").val() == '' || $("#grmFixed").val() == '') {
                navigator.notification.alert("חובה להכניס משקל מתוקן")
            }
            else {
                if ($("#kgOrg").val() == '' || $("#grmOrg").val() == '') {
                    navigator.notification.alert("חובה להכניס משקל מקורי")
                }
                else {
                    var fixedW = $("#kgFixed").val() + $("#grmFixed").val();
                    var originalW = $("#kgOrg").val() + $("#grmOrg").val();
                    fixedW = parseFloat(fixedW).toFixed(3);
                    originalW = parseFloat(originalW).toFixed(3);
                    var fixedToCheck = $("#kgFixed").val();
                    var MAX_EE_WT = localStorage.getItem("MAX_EE_WT");
                    if (MAX_EE_WT < originalW) {
                        navigator.notification.alert("משקל שהוקלד גדול מהמשקל המותר");
                    }
                    if (MAX_EE_WT < fixedToCheck) {
                        navigator.notification.alert("משקל שהוקלד גדול מהמשקל המותר");
                    }
                    else {
                        fixedW = fixedW.replace('.', '');
                        originalW = originalW.replace('.', '');
                        currentBarcode = currentBarcode.toUpperCase();
                        var xml = CreateXml(currentBarcode, fixedW, originalW);
                        SendRequest(xml);
                    }

                }
            }
        }
    }



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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER>\
<DATA><ITEM><ITEMID></ITEMID><BC>'+ barcodeNormal + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><ACT>-1</ACT><TYP>0</TYP><MEM></MEM>\
<MEMP></MEMP>\
<MEM></MEM>\
<DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH></PH><PH1></PH1><PH2></PH2><PH3></PH3><RQ></RQ>\
<RQP></RQP>\
<RQW>1</RQW>\
<ORG>'+ original + '</ORG><CRT>' + selectedFixed + '</CRT><PLT>0</PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
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
                                    if (!isYazum) {
                                        var isPalet = 0;
                                        if (From == "1") {
                                            location.href = "#/mesira_merukezet_takin/originalWeight/" + originalWeight + "/barcode/" + currentBarcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/1/Count/" + CountDelivered;

                                        }
                                        else if (From == "2") {
                                            location.href = "#/optics_mesira_sapak/originalWeight/" + originalWeight + "/barcode/" + currentBarcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/2/Count/" + CountDelivered;
                                        }
                                        else if (From == "3") {
                                            location.href = "#/optics_mesira_hanut/originalWeight/" + originalWeight + "/barcode/" + currentBarcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/3/Count/" + CountDelivered + "/KodHanut/" + KodHanut;
                                        }
                                        else if (From == "4") {
                                            location.href = "#/mesimat_Mesira_Shlav_Rishon/originalWeight/" + originalWeight + "/barcode/" + currentBarcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + CountDelivered;
                                        }
                                        else {
                                            location.href = "#/mesira_takin/originalWeight/" + originalWeight + "/barcode/" + currentBarcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;

                                        }
                                    }
                                    else {
                                        navigator.notification.alert('בקרת משקל בוצעה בהצלחה');
                                        $("#kgOrg").val("");
                                        $("#kgFixed").val("");
                                        $("#grmOrg").val("");
                                        $("#grmFixed").val("");
                                        $(".packageinput").val("");
                                        location.href = "#/weightNormal";
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


function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

