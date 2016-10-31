

scotchApp.controller('deliverController', function ($scope, $routeParams,$rootScope,mainService) {    
    $("#warpPopup").hide()
    $("#headerText").html("מסירה")

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });

    $('.packageinput').on('click', function () {
        window.setTimeout(function () { $('body').scrollTop(100) }, 500);
    });

    var countPictures = 0;
    var isPalet = "0";
    var kodmesiraValueToTakin;
    var kodmesiraText = ''
    //#region On Scan Barcode
    $scope.onScan = function () {

        cloudSky.zBar.scan({
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
            camera: "back", // defaults to "back"
            flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);
    };
    var mp3URL = "/android_asset/www/sounds/scan.amr";
    var media = new Media(mp3URL, null, mediaError);

    function playMP3() {
        media.play();
    }

    function mediaError(e) {
        alert('Media Error');
        alert(JSON.stringify(e));
    }
    function onSuccess(barcode) {
        if (validateManaualCode(barcode)) {
            playMP3();
            currentBarcode = barcode;
            $('.packageinput').val(barcode);
            $(".packageinput").prop('disabled', true);
        } else {
            barcode = '';
            $('.packageinput2').val(barcode);
            var mp3URL = getMediaURL("sounds/error.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }
    }

    function onFailure(data) {
    }
    //#endregion On Scan Barcode

    //#region Angular Document Redy


    function keyboardShowHandler(e) {
        $("#footer").hide();
          
    }
    function keyboardHideHandler(e) {
        $("#footer").show();
    }

        window.addEventListener('native.keyboardshow', keyboardShowHandler);
        window.addEventListener('native.keyboardhide', keyboardHideHandler);
        var children = JSON.parse(localStorage.getItem('kodMesiraTable'));
        $('#mesiraSelect').append($('<option>', {
            value: -1,
            text: 'מסירה \ אי מסירה'
        }));
        $(children).each(function (index) {
            $('#mesiraSelect').append($('<option>', {
                value: children[index].deliveryCode,
                text: children[index].deliveryDesc + " , " + children[index].deliveryCode
            }));
        })
        $("#mesiraSelect").val(-1);

        $rootScope.table8Obj = {}
        //$("#header").load("pages/header.html", function () {
        //    var tt = $('#header').find('#headerText');
        //    tt.text('מסירה');
        //});
        //$("#footer").load("pages/footer.html");

        //$("#warpPopup").hide();
        //$('input').on('keyup', function (e) {
        //    var theEvent = e || window.event;
        //    var keyPressed = theEvent.keyCode || theEvent.which;
        //    if (keyPressed == 13) {
        //        cordova.plugins.Keyboard.close();
        //    }
        //    return true;
        //});


    //#endregion Angular Document Redy

    


    //#region On Check Barcode
    function CreateValidateBarcodeXML(kodMesira, barcode) {
        barcode = barcode.toUpperCase();
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:'+XMLMETHOD+'>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>32</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER><DATA><USR>' + USR + '</USR><BC>' + barcode + '</BC><ACT>9</ACT><DELIV>' + kodMesira + '</DELIV><MOKED>' + MOKED + '</MOKED></DATA></MSG></DATA>]]></tem:xml>\
      </tem:'+XMLMETHOD+'>\
   </soapenv:Body>\
</soapenv:Envelope>'
        return xml;
    }

    $scope.onCheckBarCode = function () {
        var barcode = $(".packageinput").val().toUpperCase();
        if (barcode.length == 0) {
            navigator.notification.alert('לא הוזן ברקוד');
        }
        else {
            var kodmesiraValue = $('#mesiraSelect').val();
            kodmesiraValueToTakin = kodmesiraValue;
            if ((barcode.substring(0, 2) == "51" && barcode.substring(barcode.length - 2, barcode.length) == "17") && (kodmesiraValue == "-1" || kodmesiraValue == "1" || kodmesiraValue == "7" || kodmesiraValue == "70" || kodmesiraValue == "91" || kodmesiraValue == "92" || kodmesiraValue == "93" || kodmesiraValue == "99")) {
               navigator.notification.alert('מסירת פריט מסוג 51-17 יש לבצע בתפריט מסירה לספק בלבד');     
            }
            else {
                if (validateManaualCode(barcode)) {
                    if (kodmesiraValue == "-1") {
                        kodmesiraValue = "1";
                        kodmesiraValueToTakin = kodmesiraValue;
                        $("#mesiraSelect").val("1");
                    } else {
                        kodmesiraValueToTakin = kodmesiraValue;
                    }
                    kodmesiraText = kodmesiraValue + "," + $(".area option:selected").text();
                    kodmesiraText = encodeURIComponent(kodmesiraText);
                    //var xml = CreateValidateBarcodeXML(kodmesiraValue, barcode);
                    //+++++++++++++++++++++++++++++++++++++
                    mainService.send32(kodmesiraValue, barcode).then(function (response) {
                        var data = $.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'];
                        if (data.RESULT == '0') {
                            var table8xml = createTable8();
                            if (data.MEM == "") data.MEM = "0";
                            data.MEM == '-1' ? localStorage.PHOTO_REQ = 1 : localStorage.PHOTO_REQ = 0;
                            RQWGLOBAL = data.RQW;
                            RQPGLOBAL = data.RQP;
                            if (data.RQP == "1") {
                                getTable8(table8xml)

                                $rootScope.table8Obj.phObj = data;
                                $rootScope.table8Obj.rqp = data.RQP;
                            } 

                            if (data.RQW == "1") {
                                //If item is EMS
                                if (barcode[0] == "E" && barcode[1] == "E") {
                                    GoToEms(data.ORG, barcode, kodmesiraValueToTakin, countPictures, data.MEM);
                                }
                                else {
                                    isPalet = "0";
                                    GoToRegularWeight(data.ORG, barcode, kodmesiraValueToTakin, countPictures, isPalet, data.MEM);
                                }
                            }
                            else {
                                var originalWeghit = "0";
                                var fixedWeight = "0";
                                var isPalet = "0";
                                location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesiraText + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + data.MEM + "/buffer/" + 0 + "/RQW/"+data.RQW;
                            }
                        } else {
                            var message = data.RESMSG;
                            navigator.notification.alert(message);
                        }
                    }, function (error) {
                        //location.href = "#/takeImagePage";


                        navigator.notification.alert('אין תקשורת , פעל בהתאם להנחיות שקבלת מהתפעול');
                        location.href = "#/mesira_takin/originalWeight/" + 0 + "/barcode/" + barcode + "/fixedWeight/" + 0 + "/kodmesira/" + kodmesiraText + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + "-1" + "/buffer/" + 1 + "/RQW/" + RQWGLOBAL;


                        //navigator.notification.alert('אין תקשורת');
                    })
                    //+++++++++++++++++++++++++++++++++++++
                    //$.ajax({
                    //    url: serverUrl,
                    //    dataType: "xml",
                    //    //dataType: 'json',
                    //    type: "POST",
                    //    async: false,
                    //    contentType: "text/xml;charset=utf-8",
                    //    headers: {
                    //        "SOAPAction": SoapActionQA
                    //    },
                    //    crossDomain: true,
                    //    data: xml,
                    //    timeout: 30000 //30 seconds timeout
                    //}).done(function (data) {
                    //    var parser = new DOMParser();
                    //    var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
                    //    var result = xmlDoc.firstChild.firstChild.children[1].firstChild.innerHTML;
                    //    if (result == "0") {
                    //        var table8xml = createTable8();


                    //        var MEM = xmlDoc.firstChild.firstChild.children[1].children[7].innerHTML;
                    //        if (MEM == "") {
                    //            MEM = "0";
                    //        }

                    //        //andrey  change mem logic
                    //        MEM == '-1' ? localStorage.PHOTO_REQ = 1 : localStorage.PHOTO_REQ = 0;
                    //        //

                    //        var requestPics = xmlDoc.firstChild.firstChild.children[1].children[9].innerHTML;
                    //        var RQW = xmlDoc.firstChild.firstChild.children[1].children[8].innerHTML

                    //        RQWGLOBAL = RQW;
                    //        RQPGLOBAL = requestPics;
                    //        //If Images Are Requested

                    //        if (requestPics == "1") {
                    //            countPictures = countAmountOfPictures(xmlDoc, countPictures);
                    //            getTable8(table8xml)
                                
                    //            var phObj = $.xml2json(xmlDoc.firstChild.firstChild.children[1])['DATA'];

                    //            $rootScope.table8Obj.phObj = phObj;
                    //            $rootScope.table8Obj.rqp = requestPics;
                                
                    //        }
                    //        else {
                    //            countPictures = "0";
                    //        }
                    //        //If weight is requested
                    //        if (RQW == "1") {
                    //            var mesira = kodmesiraText;
                    //            var ORG = xmlDoc.firstChild.firstChild.children[1].children[3].innerHTML;

                    //            //If item is EMS
                    //            if (barcode[0] == "E" && barcode[1] == "E") {
                    //                GoToEms(ORG, barcode, kodmesiraValueToTakin, countPictures, MEM);
                    //            }
                    //            else {
                    //                isPalet = "0";
                    //                GoToRegularWeight(ORG, barcode, kodmesiraValueToTakin, countPictures, isPalet, MEM);
                    //            }
                    //        }
                    //        else {
                    //            var originalWeghit = "0";
                    //            var fixedWeight = "0";
                    //            var isPalet = "0";
                    //            location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesiraText + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;
                    //        }

                    //    }
                    //    else {
                    //        var message = xmlDoc.childNodes[0].firstChild.children[1].children[1].innerHTML;
                    //        navigator.notification.alert(message);
                    //    }

                    //}).fail(function (jqXHR, textStatus, thrownError) {
                    //    location.href = "#/takeImagePage";
                    //    navigator.notification.alert('אין תקשורת, אתה עובר לעבוד בתהליך OFFLINE');
                    //    //navigator.notification.alert('אין תקשורת, המסר ירשם לזכרון וישלח מאוחר יותר. הקפד על הוראות של תהליך OFFLINE');
                    //    //location.href = "#/mesira_takin/originalWeight/" + 0 + "/barcode/" + barcode + "/fixedWeight/" + 0 + "/kodmesira/" + kodmesiraText + "/countPictures/" + 0 + "/isPalet/" + 0 + "/MEM/" + 0;
                    //});
                }

                else {

                }
            }
        }
    };
    //#endregion 

    //function countAmountOfPictures(xmlDoc, countPictures) {
    //    var isph1 = xmlDoc.firstChild.firstChild.children[1].children[4].innerHTML;
    //    var isph2 = xmlDoc.firstChild.firstChild.children[1].children[5].innerHTML;
    //    var isph3 = xmlDoc.firstChild.firstChild.children[1].children[6].innerHTML;
    //    if (isph1 == "1") {
    //        countPictures++;
    //    }
    //    if (isph2 == "1") {
    //        countPictures++;
    //    }
    //    if (isph3 == "1") {
    //        countPictures++;
    //    }
    //    return countPictures;
    //}

    function GoToEms(ORG, barcode, kodmesira, countPictures, MEM) {
        location.href = "#/weightItem/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesiraText + "/countPictures/" + countPictures + "/MEM/" + MEM;
    }

    function GoToRegularWeight(ORG, barcode, kodmesira, countPictures, isPalet, MEM) {
        location.href = "#/weightNormal/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesiraText + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;
    }

    //#region On Deliver Joined
    $scope.onDeliverJoined = function () {
        window.location.href = "#/deliverJoined";
    };
    //#endregion On Deliver Joined

    //#region get kod mesira table
    //function getKodMesiraTable(xml) {
    //    $.ajax({
    //        url: serverUrl,
    //        dataType: "xml",
    //        //dataType: 'json',
    //        type: "POST",
    //        async: true,
    //        contentType: "text/xml;charset=utf-8",
    //        headers: {
    //            "SOAPAction": SoapActionQA
    //        },
    //        crossDomain: true,
    //        data: xml,
    //        timeout: 30000 //30 seconds timeout
    //    }).done(function (data) {
    //        if (data != null) {
    //            var parser = new DOMParser();
    //            var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
    //            var children = xmlDoc.firstChild.firstChild.children[1].firstChild.children;
    //            $('#mesiraSelect').append($('<option>', {
    //                value: -1,
    //                text: 'מסירה \ אי מסירה'
    //            }));
    //            for (var i = 0; i < children.length; i++) {
    //                var child = children[i];
    //                var value = child.children[0].innerHTML;
    //                var text = child.children[1].innerHTML;
    //                $('#mesiraSelect').append($('<option>', {
    //                    value: value,
    //                    text: text + " , " + value
    //                }));
    //            }
    //            $("#mesiraSelect").val(-1);
    //            $(".loading2").hide();
    //        }
    //        else {
    //            navigator.notification.alert('יש תקלה בשרת');
    //        }
    //    }).fail(function (jqXHR, textStatus, thrownError) {
    //        //navigator.notification.alert('אין תקשורת, נסה שנית');
    //    });
    //}
    //#endregion


    function getTable8(table8xml) {
        $.ajax({
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
            data: table8xml,
            timeout: 30000 //30 seconds timeout
        }).done(function (data) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");

            var table8 = $.xml2json(xmlDoc.firstChild.firstChild.children[1].firstChild)['NewDataSet']['Table'];
            $rootScope.table8Obj.table = table8;
        })
    }

    function createTable8() {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        <soapenv:Header/>\
           <soapenv:Body>\
              <tem:'+ XMLMETHOD + '>\
                 <!--Optional:-->\
                 <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>8</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
                </tem:'+ XMLMETHOD + '>\
           </soapenv:Body>\
        </soapenv:Envelope>';
        return xml;
    }


    //#region Create Tables XML
    //function CreateTablesXML() {
    //    var date = getCurrentDate();
    //    var USRKEY = localStorage.getItem("USRKEY");
    //    var USR = localStorage.getItem("USR");
    //    var MOKED = localStorage.getItem("MOKED");
    //    var RLSCODE = localStorage.getItem("RLSCODE");

    //    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
    //    <soapenv:Header/>\
    //       <soapenv:Body>\
    //          <tem:'+XMLMETHOD+'>\
    //             <!--Optional:-->\
    //             <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>1</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
    //            </tem:'+XMLMETHOD+'>\
    //       </soapenv:Body>\
    //    </soapenv:Envelope>';
    //    return xml;
    //}
    //#endregion\
});

