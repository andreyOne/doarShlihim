scotchApp.controller('deliverJoinedBdikaController', function ($scope, $routeParams) {
    $("#warpPopup").hide();
    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });

    var countPictures = 0;
    var isPalet = "0";
    var kodmesiraValueToTakin;
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
            currentBarcode = barcode;
            $('.packageinput').val(barcode);
            $(".packageinput").prop('disabled', true);
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

    //#region Angular Document Redy
    angular.element(document).ready(function () {
        MesiraMerukezetPicturesArray = [];
        var xml = CreateTablesXML();
        getKodMesiraTable(xml);
        $("#header").load("pages/header.html", function () {
            var tt = $('#header').find('#headerText');
            tt.text('מסירה מרוכזת');
        });
        $("#footer").load("pages/footer.html");
        $('.headerRight span').html("sfssf");

        $("#warpPopup").hide();
        $('input').on('keyup', function (e) {
            var theEvent = e || window.event;
            var keyPressed = theEvent.keyCode || theEvent.which;
            if (keyPressed == 13) {
                 cordova.plugins.Keyboard.close();
            }
            return true;
        });


    });
    //#endregion Angular Document Redy

  


    //#region On Check Barcode
    function CreateValidateBarcodeXML(kodMesira, barcode) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:'+ XMLMETHOD + '>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>32</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER><DATA><USR>' + USR + '</USR><BC>' + barcode + '</BC><ACT>9</ACT><DELIV>' + kodMesira + '</DELIV><MOKED>' + MOKED + '</MOKED></DATA></MSG></DATA>]]></tem:xml>\
      </tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>'
        return xml;
    }

    $scope.onCheckBarCode = function () {
        var barcode = $(".packageinput").val();
        if (barcode.length == 0) {
            navigator.notification.alert('לא הוזן ברקוד');
        }
        else {
            var kodmesiraText = $("#mesiraSelect").val() + "," + $(".area option:selected").text();
            var kodmesiraValue = $("#mesiraSelect").val();
            kodmesiraValueToTakin = kodmesiraValue;
            if (barcode.substring(0, 2) == "51" && barcode.substring(barcode.length - 2, barcode.length) == 17) {
                if (kodmesiraValue == "1" || kodmesiraValue == "7" || kodmesiraValue == "70" || kodmesiraValue == "91" ||
                    kodmesiraValue == "92" || kodmesiraValue == "93" || kodmesiraValue == "99") {
                    navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
                }
            }
            else {
                if (validateManaualCode(barcode)) {

                    if (kodmesiraValue == "-1") {
                        kodmesiraValue = "1";
                        kodmesiraValueToTakin = kodmesiraValue;
                    }

                    var xml = CreateValidateBarcodeXML(kodmesiraValue, barcode);
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
                                   var result = xmlDoc.firstChild.firstChild.children[1].firstChild.innerHTML;
                                   if (result == "0") {
                                       var MEM = xmlDoc.firstChild.firstChild.children[1].children[7].innerHTML;
                                       if (MEM == "") {
                                           MEM = "0";
                                       }

                                       //andrey  change mem logic
                                       MEM == '-1' ? localStorage.PHOTO_REQ = 1 : localStorage.PHOTO_REQ = 0;
                                       //

                                       var requestPics = xmlDoc.firstChild.firstChild.children[1].children[9].innerHTML;
                                       var RQW = xmlDoc.firstChild.firstChild.children[1].children[8].innerHTML
                                       //If Images Are Requested

                                       if (requestPics == "1") {
                                           countPictures = countAmountOfPictures(xmlDoc, countPictures);
                                       }
                                       else {
                                           countPictures = "0";
                                       }

                                       //If weight is requested
                                       if (RQW == "1") {
                                           var mesira = kodmesiraText;
                                           var ORG = xmlDoc.firstChild.firstChild.children[1].children[3].innerHTML;
                                           //If item is EMS
                                           if (barcode[0] == "E" && barcode[1] == "E") {
                                               GoToEms(ORG, barcode, mesira, countPictures, MEM);
                                           }
                                           else {
                                               GoToRegularWeight(ORG, barcode, mesira, countPictures, isPalet, MEM);
                                           }
                                       }
                                       else {
                                           var originalWeghit = "0";
                                           var fixedWeight = "0";
                                           var isPalet = "0";
                                           location.href = "#/mesira_merukezet_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesiraValueToTakin + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;
                                       }

                                   }
                                   else {
                                       var message = xmlDoc.childNodes[0].firstChild.children[1].children[1].innerHTML;
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

                else {

                }
            }
        }
    };
    //#endregion 

    function countAmountOfPictures(xmlDoc, countPictures) {
        var isph1 = xmlDoc.firstChild.firstChild.children[1].children[4].innerHTML;
        var isph2 = xmlDoc.firstChild.firstChild.children[1].children[5].innerHTML;
        var isph3 = xmlDoc.firstChild.firstChild.children[1].children[6].innerHTML;
        if (isph1 == "1") {
            countPictures++;
        }
        if (isph2 == "1") {
            countPictures++;
        }
        if (isph3 == "1") {
            countPictures++;
        }
        return countPictures;
    }

    function GoToEms(ORG, barcode, kodmesira, countPictures, MEM) {
        location.href = "#/weightItem/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM;;
    }

    function GoToRegularWeight(ORG, barcode, kodmesira, countPictures, isPalet, MEM) {
        location.href = "#/weightNormal/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;
    }

    //#region On Deliver Joined
    $scope.onDeliverJoined = function () {
        window.location.href = "#/deliverJoined";
    };
    //#endregion On Deliver Joined

    //#region get kod mesira table
    function getKodMesiraTable(xml) {
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
                               var children = xmlDoc.firstChild.firstChild.children[1].firstChild.children;
                               $('#mesiraSelect').append($('<option>', {
                                   value: -1,
                                   text: 'מסירה \ אי מסירה'
                               }));
                               for (var i = 0; i < children.length; i++) {
                                   var child = children[i];
                                   var value = child.children[0].innerHTML;
                                   var text = child.children[1].innerHTML;
                                   $('#mesiraSelect').append($('<option>', {
                                       value: value,
                                       text: text
                                   }));

                               }
                               $("#mesiraSelect").val(-1);
                               $(".loading2").hide();
                           }
                           else {


                               navigator.notification.alert('יש תקלה בשרת');
                           }

                       }).fail(function (jqXHR, textStatus, thrownError) {
                           navigator.notification.alert('אין תקשורת, נסה שנית');
                       });
    }
    //#endregion

    //#region Create Tables XML
    function CreateTablesXML() {
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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>1</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
</tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }
    //#endregion

});

