scotchApp.controller('mesimatMesiraShlavRishon', function ($scope, $routeParams, $rootScope, $location, mainService) {
    $("#warpPopup").hide();
    $('.loginBtn').hide();
    MesimatMesiraObject = mainService.currentAssignment;
    getKodMesiraTable();
    var kodmesira = $routeParams.kodmesira;


    //#region JQuery On Document Ready
    $(document).ready(function () {
        $('.sigPad').signaturePad({ drawOnly: true });
        $('.sigPad').signaturePad({ lineWidth: 0 });
        $('.sigPad').signaturePad({ lineColour: '#FFFFFF' });
        $('.sigPad').signaturePad({ penColour: '#000000' });
        $("#sigDiv").prop('disabled', true);
        $("#takePic").prop('disabled', true);
        $('.signatureButton').click(function () {
            $('.sigPad').signaturePad().clearCanvas();
        })
        if ($rootScope.prevPath == 'weightItem') {
                $(".selectInput").css("display", "block");
                $('.loginBtn').show();
                $('.packageinput2a').val($routeParams.barcode);        
                $('#selectDehia').hide();
                $('#refreshBarcode').hide();
                $('.BarcodeFields').scrollTop(150)
                $('#selectMesira').val(kodmesira);
                $rootScope.prevPath = "";
                
                window.setTimeout(function () {
                    $('#selectMesira').val(kodmesira);
                    $('#selectMesira').attr('disabled', true)
                    isHarigTzilum();
                }, 700)


            } else {
            $(".selectInput").css("display", "none");
            $('#selectMesira').attr('disabled', false)
            }
    });
    //#endregion JQuery On Document Ready

    //#region General Variables
    var currentBarcode = '';
    var index = 0;
    var barcodes = [];
    var indexPic = 0;
    var pictures = [];
    var base64Signature = "";
    var countPictures = 0;
    var isBarcodeOk = false;
    var fixedWeight = "0";
    var originalWeight = "0";
    var isPalet = "0";
    var RQWGlobal = "0";
    var firstName = '';
    var lastName = '';
    var emptySignature = "";
    var MEM = "0";
    var Harigim = [];
    var isSigMust = false;
    var isPhotoMust = true;
    var isMisparManuiMust = false;
    var kodMesira;
    var givenBarcode = "";
    var taskId, contractId, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, newCaseNumber, enterance, floor, apartment_number;
    var isMesiraValue = "0";
    var isDehiaValue = "0";
    var ph = '';
    var ph1 = '';
    var ph2 = '';
    var ph3 = '';
    $rootScope.table8Obj = {}
    $rootScope.table8Obj.rqp = 0;
    var table8Obj = $rootScope.table8Obj;

    //#endregion General Variables

    //#region Select events
    $scope.onRefreshDehia = function () {
        isDehiaValue = true;
        sendMesser21();
    }

    $scope.onRefreshMesira = function () {
        kodMesira = $("#selectMesira").val();
        $scope.onCheckBarCode();
    }

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });

    $("#selectMesira").change(function () {   
        kodMesira = $("#selectMesira").val();
        $scope.onRefreshMesira();
        //$("#refreshMesira").show();
        $("#refreshDehia").hide();
        $("#selectDehia").val(-1);

    });


    $("#selectDehia").change(function () {
        $("#refreshMesira").hide();
        $("#refreshDehia").show();
        $("#selectMesira").val(-1);
    });

    //#endregion

    //#region On Compare Barcodes from previous screen event
    $scope.onCompareBarcodes = function () {
        var tempBarcode = $('.packageinput2a').val().toUpperCase();
        if (tempBarcode == givenBarcode.toUpperCase()) {
            $(".totalScanItems").children().prop('disabled', false);
            $(".selectInput").css("display", "block");
            $(".packageinput2a").prop('disabled', true);
            $(".BarcodeArea").prop('disabled', true);
            $("#refreshBarcode").hide();
            $("#selectDehia").val(-1);
            $("#selectMesira").val('-1');
            return true;
        }
        else {
            navigator.notification.alert('ברקוד לא תואם לברקוד שהוקצא למשימה');
            return false;
        }

    };
    //#endregion

    //#region Disable/Enable elements
    function disableAll() {
        $(".mainContent").children().prop('disabled', true);
        $("#footer").children().prop('disabled', true);
        $("#header").children().prop('disabled', true);
    }

    function enableAll() {
        $(".mainContent").children().prop('disabled', false);
        $("#footer").children().prop('disabled', false);
        $("#header").children().prop('disabled', false);
    }
    //#endregion

    function getKodMesiraTable() {
        var children = JSON.parse(localStorage.kodMesiraTable)
        $('#selectMesira').append($('<option>', {
            value: -1,
            text: 'מסירה \ אי מסירה'
        }));
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var value = child.deliveryCode;
            var text = child.deliveryDesc;
            $('#selectMesira').append($('<option>', {
                value: value,
                text: text + " , " + value
            }));
            enableAll();
        }
        $("#selectMesira").val('-1');
    }
    //#endregion

    //#region Angular Document Redy
    angular.element(document).ready(function () {
        disableAll();
        $("#refreshMesira").hide();
        $("#refreshDehia").hide();
        taskId = MesimatMesiraObject.taskID;
        MEM = MesimatMesiraObject.new_account_number;
        contactName = MesimatMesiraObject.new_address_contact;
        contactPhoneNumber = MesimatMesiraObject.new_ms_celular;
        fromHour = MesimatMesiraObject.new_delivery_from_hour;
        toHour = MesimatMesiraObject.new_delivery_until_hour;
        city = MesimatMesiraObject.new_cityid;
        street = MesimatMesiraObject.new_street;
        houseNumber = MesimatMesiraObject.new_house_number;
        newCaseNumber = MesimatMesiraObject.new_case_number;
        givenBarcode = MesimatMesiraObject.new_barkod;
        enterance = MesimatMesiraObject.new_enterance;
        floor = MesimatMesiraObject.new_ms_floor;
        apartment_number = MesimatMesiraObject.new_apartment_number;
        comments = MesimatMesiraObject.new_comments;
        

        $('.returnedBarcode span').text(givenBarcode);

        $("#fromHourToHour").html(fromHour + ' - ' + toHour);
        $("#subscriberNum").html('מנוי ' + MEM);
        $("#subscriberName").html(' ' + getSubscriberName(MEM));
        $("#city").html(city);
        $("#address").html(street + ' ' + houseNumber);
        $("#name").html(contactName);
        $("#phone").html(contactPhoneNumber);
        $('#phone').attr('href', 'tel:' + contactPhoneNumber);
        $('.comments span').html(comments);

        $('.assign_innerDetails .assign_innrtDetailsLeft').after('<div style="clear:both;font-size: 12px;"><span style="margin-right: 20px">' + ' כניסה:' + MesimatMesiraObject.new_enterance + '</span><span>' + ' קומה:' + MesimatMesiraObject.new_ms_floor + '</span><span>' + ' דירה:' + MesimatMesiraObject.new_apartment_number + '</span><div>')



        //getManuim();
        $(".totalScanItems").children().prop('disabled', true);
        

        $("#warpPopup").hide();
        $("#sigDialog").hide();

        if ($routeParams.originalWeight) {
            originalWeight = $routeParams.originalWeight;
            currentBarcode = $routeParams.barcode;
            fixedWeight = $routeParams.fixWeight;
            countPictures = $routeParams.countPictures;
            MEM = $routeParams.MEM;
            if (MEM == "0") {
                $(".packageinput4").val('');
            }
            else {
                $(".packageinput4").val(MEM);
            }
            isPalet = $routeParams.isPalet;
            RQWGlobal = "1";
            kodMesira = $routeParams.kodmesira;
            var arr = kodMesira.split(',');
            kodMesira = arr[0];
            //isHarigTzilum();
        }




        $("#selectMesira").val(kodMesira);
        $(".packageinput").val(currentBarcode)
        isBarcodeOk = true;
        $("#aBarCodeArea").prop('disabled', true);
        $("#selectOptions").prop('disabled', true);
        $("#refreshButton").prop('disabled', true);
        $(".packageinput").prop('disabled', true);


        var tt = $('#header').find('#headerText');
        tt.text('משימת מסירה');

        //$("#header").load("pages/header.html", function () {
        //    var tt = $('#header').find('#headerText');
        //    tt.text('משימת מסירה');
        //});
        //$("#footer").load("pages/footer.html");



        //$('input').on('keyup', function (e) {
        //    var theEvent = e || window.event;
        //    var keyPressed = theEvent.keyCode || theEvent.which;
        //    if (keyPressed == 13) {
        //        cordova.plugins.Keyboard.close();
        //    }
        //    return true;
        //});
    });
    //#endregion Angular Document Redy

    //#region On Open Popup
    $scope.open = function () {
        if (isBarcodeOk) {
            $("#warpPopup").show();
        }
    };
    //#endregion On Open Popup

    //#region On X Click
    $scope.onXClick = function () {
        $("#warpPopup").hide();
    };
    //#endregion On X Click

    //#region On Add Barcode


    function validateMesira() {

        if ($("#selectMesira").val() == "-1" && $('#selectDehia').val() == -1) {
            navigator.notification.alert('יש לבחור קוד מסירה או דחיה');
            $('.loginBtn').hide();
            return false;
        } 

        var tempBarcode = $('.packageinput2a').val();
        if (tempBarcode == null || tempBarcode == "") {
            navigator.notification.alert('לא הקלדת או סרקת ברקוד');
            return false;
        }

        if (!$scope.onCompareBarcodes()) {
            return false;
        }
        //Check if code mesira is enetered
        
        if (kodMesira == "-1") {
            kodMesira = "1";
        }

        //Check if enough pictures taken
        if (isPhotoMust) {
            if ((countPictures > pictures.length) && pictures.length != 3) {
                navigator.notification.alert("לא צילמת מספיק תמונות");
                return false;
            }
        }

        if (table8Obj.phObj != undefined && ((table8Obj.phObj.PH1 > 0 && ph1 == '') || (table8Obj.phObj.PH2 > 0 && ph2 == '') || (table8Obj.phObj.PH3 > 0 && ph3 == ''))) {
            navigator.notification.alert("לא צילמת מספיק תמונות", onConfirm);

            function onConfirm() {
                isHarigTzilum()
            }

            return false;
        }
    
        //check if barcode is entered


        //check is barcode is ok
        if (!validateManaualCode(givenBarcode)) {
            return false;
        }

        if (isSigMust) {
            if (base64Signature == emptySignature) {
                navigator.notification.alert("פריט זה מחייב חתימה");
                return false;
            }
        }
        if (isPhotoMust) {
            if (pictures.length == 0) {
                navigator.notification.alert("פריט זה מחייב לפחות תמונה אחת");
                return false;
            }
        }
        if (isMisparManuiMust) {
            if ($(".packageinput4").val() == '') {
                navigator.notification.alert("פריט זה מחייב להכניס מספר מנוי");
                return false;
            }
        }
        return true;
    }
    function CreateXml(sig, mesira, barcode, ph1, ph2, ph3, isPalet, fixedWeight, RQW, MEMP) {
        barcode = barcode.toUpperCase();
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
         var RQW = $rootScope.rootRQW ;
         var RQP = $rootScope.rootRQP;
        //var RLSCODE = localStorage.getItem("RLSCODE");
        if (sig == emptySignature) {
            sig = "";
        }
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
<soapenv:Header/>\
<soapenv:Body>\
<tem:'+ XMLMETHOD + '>\
<!--Optional:-->\
<tem:xml><![CDATA[\
<DATA>\
<MSG><SYSTEMID>1</SYSTEMID>\
<HEADER>\
<MSGVER>1</MSGVER>\
<CODE>3</CODE>\
<SENDTIME>'+ date + '</SENDTIME>\
<GPS/>\
<USRKEY>'+ USRKEY + '</USRKEY>\
<DEVKEY>9999</DEVKEY>\
<VER>2</VER>\
</HEADER>\
<DATA>\
<ITEM>\
<ITEMID></ITEMID>\
<BC>'+ givenBarcode + '</BC>\
<CRDT>'+ date + '</CRDT>\
<DST>0</DST>\
<DELIV>'+ mesira + '</DELIV>\
<USR>'+ USR + '</USR>\
<MOKED>'+ MOKED + '</MOKED>\
<ACT>9</ACT>\
<MEM>'+ MEM + '</MEM>\
<MEMP>' + MEMP + '</MEMP>\
<DEVKEY>9999</DEVKEY>\
<FN>'+ firstName + '</FN>\
<LN>'+ lastName + '</LN>\
<TYP>0</TYP>\
<DST></DST>\
<SIG>'+ sig + '</SIG>\
<PH>' + ph + '</PH>\
<PH1>'+ ph1 + '</PH1>\
<PH2>'+ ph2 + '</PH2>\
<PH3>'+ ph3 + '</PH3>\
<RQ></RQ>\
<RQP>'+ RQP + '</RQP>\
<RQW>'+ RQW + '</RQW>\
<ORG>'+ originalWeight + '</ORG>\
<CRT>'+ fixedWeight + '</CRT>\
<PLT>'+ isPalet + '</PLT>\
</ITEM>\
<BATCH></BATCH>\
</DATA>\
</MSG>\
</DATA>]]>\
</tem:xml>\
</tem:'+ XMLMETHOD + '>\
</soapenv:Body>\
</soapenv:Envelope>';
        return xml;

    }

    $scope.onOkPressed = function () {
        if ($('#selectDehia').val() != -1 && $('#selectDehia').val() != null) {
             sendMesser21();
         } else {
            if (validateMesira()) {
                var sig = '';
                var MEMP = '';
                if (MEM == '') {
                    MEMP = $('.packageinput4').val();
                }
                else {
                    MEMP = MEM;
                }

                if (base64Signature != null) {
                    sig = base64Signature;
                }
                //for (var i = 0; i < pictures.length; i++) {
                //    if (i == 0) {
                //        ph1 = pictures[i];
                //    }
                //    else if (i == 1) {
                //        ph2 = pictures[i];
                //    }
                //    else {
                //        ph3 = pictures[i];
                //    }
                //}
                currentBarcode = currentBarcode.toUpperCase();
                var xml = CreateXml(sig, kodMesira, currentBarcode, ph1, ph2, ph3, isPalet, fixedWeight, RQWGlobal, MEMP);
                makeDeliverRequest(xml);
            }

        }


    };

    function makeDeliverRequest(xml) {
        var x = 10;

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
                        sendMesser21();
                        $rootScope.table8Obj = {}
                        ph = '';
                        ph1 = '';
                        ph2 = '';
                        ph3 = '';
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


    //#endregion   On Add Barcode

    //#region Camera Handler.
    $scope.onTakePicture = function () {
        if (isBarcodeOk) {
            if (pictures.length < 3) {
                navigator.camera.getPicture(onCameraSuccess, onCameraFail,
                    {
                        quality: 30,
                sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                correctOrientation: true,
                saveToPhotoAlbum: false,
                targetWidth: 1500,
                targetHeight: 1500
                    });
            }
            else {
                navigator.notification.alert("כבר צילמת מספיק תמונות");
            }
        }
    };

    function onCameraSuccess(imageData) {
        if (ph == '') {
            ph = imageData
        } else if (ph1 == '') {
            ph1 = imageData
        } else if (ph2 == '') {
            ph2 = imageData
        } else if (ph3 == '') {
            ph3 = imageData
        }
        var image1 = document.getElementById('Image1');
        pictures[indexPic] = imageData;
        indexPic++;
        currentBarcode = $('.packageinput2a').val();
        $('#deleteList').append('<li><lable>' + currentBarcode + '</lable> <img style="width: 45px;height: 45px;margin-right: 125px;" src="data:image/png;base64,' + imageData + '" /></li>');
    }

    function onCameraFail(message) {
        console.log('camera error: ' + message);
        if (message != 'Camera cancelled.') {
            var errorMessage = 'סליחה, מצלמת האנדרואיד נתקלה בבעיה. ייתכן שיהיה עליך להפעיל מחדש את המכשיר';
            displayErrorMessage(errorMessage);
        }
    }

    //#endregion Camera Handler.

    //#region On Check Barcode And Handle Next Move

    //#region On Check Barcode
    function CreateValidateBarcodeXML(kodMesira, barcode) {
        barcode = barcode.toUpperCase();
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        kodMesira = $("#selectMesira").val();
        if (kodMesira == "-1" || kodMesira == "" || kodMesira == undefined) {
            kodMesira = "1";
        }
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
        var barcode = $(".packageinput2a").val();
        barcode = barcode.toUpperCase();
        if (barcode.length == 0) {
            navigator.notification.alert('לא הוזן ברקוד');
        }
        else {
            var kodmesiraText = $("#selectMesira").val() + "," + $(".area option:selected").text();
            var kodmesiraValue = $("#selectMesira").val();
            kodmesiraValueToTakin = kodmesiraValue;
            if (validateManaualCode(barcode)) {
                if (kodmesiraValue == "-1") {
                    kodmesiraValue = "1";
                    $('#selectMesira').val(1);
                    kodmesiraValueToTakin = kodmesiraValue;
                }
                //var xml = CreateValidateBarcodeXML(kodmesiraValue, barcode);

                mainService.send32(kodmesiraValue, barcode).then(function (response) {
                    var data = $.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'];
                    if (data.RESULT == '0') {
                        var table8xml = createTable8();
                        $rootScope.rootRQW = data.RQW;
                        $rootScope.rootRQP = data.RQP;
                        if (data.RQP == "1") {
                            getTable8(table8xml)
                            $rootScope.table8Obj.phObj = data;
                            $rootScope.table8Obj.rqp = data.RQP;
                        }

                        if (data.RQW == "1") {
                            var mesira = kodmesiraText;
                            var ORG = data.ORG;

                            //If item is EMS
                            if (barcode[0] == "E" && barcode[1] == "E") {
                                GoToEms(ORG, barcode, mesira, countPictures, data.MEM);
                            }
                            else {
                                isPalet = '0';
                                mesira = encodeURIComponent(mesira);
                                GoToRegularWeight(ORG, barcode, mesira, countPictures, isPalet, data.MEM);
                            }
                        }
                        else {
                            isHarigTzilum();
                            $('.loginBtn').show();
                            $('.BarcodeFields').animate({ scrollTop: 180 }, '300');
                            var originalWeghit = "";
                            var fixedWeight = "";
                            var isPalet = "";
                            if (data.RQP != 1) {
                                countPictures++;
                            }
                        }
                    } else {
                        var message = data.RESMSG;
                        navigator.notification.alert(message);
                    }
                }, function (error) {
                    //location.href = "#/takeImagePage";
                    //navigator.notification.alert('אין תקשורת, אתה עובר לעבוד בתהליך OFFLINE');


                    navigator.notification.alert('אין תקשורת');
                })

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
                //    if (data != null) {
                //        var parser = new DOMParser();
                //        var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
                //        var result = xmlDoc.firstChild.firstChild.children[1].firstChild.innerHTML;
                //        if (result == "0") {
                //            var table8xml = createTable8();
                //            var requestPics = xmlDoc.firstChild.firstChild.children[1].children[9].innerHTML;
                //            var RQW = xmlDoc.firstChild.firstChild.children[1].children[8].innerHTML;
                //            $rootScope.rootRQW = xmlDoc.firstChild.firstChild.children[1].children[8].innerHTML;
                //            $rootScope.rootRQP = xmlDoc.firstChild.firstChild.children[1].children[9].innerHTML;
                //            //If Images Are Requested

                //            if (requestPics == "1") {
                //                countPictures = countAmountOfPictures(xmlDoc, countPictures);
                //                getTable8(table8xml)

                //                var phObj = $.xml2json(xmlDoc.firstChild.firstChild.children[1])['DATA'];

                //                $rootScope.table8Obj.phObj = phObj;
                //                $rootScope.table8Obj.rqp = requestPics;
                //            }
                //            else {
                //                countPictures = "0";
                //            }

                //            //If weight is requested




                //            if (RQW == "1") {
                //                var mesira = kodmesiraText;
                //                var ORG = xmlDoc.firstChild.firstChild.children[1].children[3].innerHTML;

                //                //If item is EMS
                //                if (barcode[0] == "E" && barcode[1] == "E") {
                //                    GoToEms(ORG, barcode, mesira, countPictures, MEM);
                //                }
                //                else {
                //                    isPalet = '0';
                //                    mesira = encodeURIComponent(mesira);
                //                    GoToRegularWeight(ORG, barcode, mesira, countPictures, isPalet, MEM);
                //                }
                //            }
                //            else {
                //                //show the ok and the signature
                //                isHarigTzilum();
                //                $('.loginBtn').show();
                //                $('.BarcodeFields').animate({ scrollTop: 180 }, '300');
                //                var originalWeghit = "";
                //                var fixedWeight = "";
                //                var isPalet = "";
                //                if (requestPics != 1) {
                //                    countPictures++;
                //                }
                //                //isHarigTzilum();
                //                //location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesiraValueToTakin + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;
                //            }

                //        }
                //        else {
                //            var message = $(xmlDoc).find('RESMSG').text();
                //            navigator.notification.alert(message);
                //        }
                //    }
                //    else {


                //        navigator.notification.alert('יש תקלה בשרת');
                //    }

                //}).fail(function (jqXHR, textStatus, thrownError) {
                //    navigator.notification.alert('אין תקשורת, נסה שנית');
                //});
            }

            else {

            }
        }
    };
    //#endregion 

    //function countAmountOfPictures(xmlDoc, countPictures) {
    //    countPictures = 0;
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

        location.href = "#/weightItem/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/4/Count/" + 0;
    }
    function GoToRegularWeight(ORG, barcode, kodmesira, countPictures, isPalet, MEM) {
        location.href = "#/weightNormal/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/4/Count/" + 0;
    }

    //#endregion 

    //#region Close/Open Signature Dialog
    $scope.onCloseSigDialog = function () {
        $("#sigDialog").hide();
    }
    $scope.onOpenSig = function () {
        $("#sigDialog").show();

    }
    //#endregion

    //#region Get signature Base64
    $scope.onSaveSignarture = function () {
        var canvas = document.getElementById('pad');
        var context = canvas.getContext('2d');
        base64Signature = canvas.toDataURL().split(',')[1];
        if (base64Signature != emptySignature) {
            firstName = $("#firstName").val();
            lastName = $("#lastName").val();
            if (firstName == '' || lastName == '') {
                navigator.notification.alert('יש להכניס שם פרטי ושם משפחה');
            }
            else {
                $("#sigDialog").hide();
            }

        }
        else {
            base64Signature = '';
            $("#sigDialog").hide();
        }



    };
    //#endregion Get signature Base64

    //#region Is Harig
    function isHarigTzilum() {
        kodMesira = $("#selectMesira").val();
        if (kodMesira == "-1") {kodMesira="1"}
        var firstTwoChars = localStorage.getItem("NO_PH_SUG_MOZAR");
        var lastTwoChars = localStorage.getItem("NO_PH_BC_ENDING");
        var arrOfFirstChars = firstTwoChars.split(','); // create array
        var arrOflastChars = lastTwoChars.split(',');
        var firstTwoLettersOfBarcode = $('.packageinput2a').val().substring(0, 2);
        var lastTwoLettersOfBarcode = $('.packageinput2a').val().substring($('.packageinput2a').val().length,$('.packageinput2a').val().length - 2);

        if ($rootScope.prevPath != undefined) {
            table8Obj = $rootScope.table8Obj;
        }

        if (contains(arrOfFirstChars, firstTwoLettersOfBarcode) || contains(arrOflastChars, lastTwoLettersOfBarcode)) {
            isHarig();
        }
        else if (parseInt(MEM) > 0) {
            getCheckHarigim();
        }

        
        if (table8Obj.rqp > 0) {
            if (table8Obj.phObj.PH3 > 0 && ph3 == '') {
                $(table8Obj.table).each(function (index) {
                    if (table8Obj.table[index].photoRequestCode == table8Obj.phObj.PH3) {
                        navigator.notification.alert('נא צלם ' + table8Obj.table[index].PhotoRequestDesc, onConfirm);

                        function onConfirm() {
                            navigator.camera.getPicture(success, fail,
                            {
                                quality: 30,
                                sourceType: Camera.PictureSourceType.CAMERA,
                                destinationType: Camera.DestinationType.DATA_URL,
                                encodingType: Camera.EncodingType.JPEG,
                                correctOrientation: true,
                                saveToPhotoAlbum: false,
                                targetWidth: 1500,
                                targetHeight: 1500
                            });
                        }
                        function success(data) {
                            ph3 = data;
                            pictures.push(data);
                            currentBarcode = $('.packageinput2a').val();
                            $('#deleteList').append('<li><lable>' + currentBarcode + '</lable> <img style="width: 45px;height: 45px;margin-right: 125px;" src="data:image/png;base64,' + data + '" /></li>');
                        }
                        function fail() {
                            if (message != 'Camera cancelled.') {
                                var errorMessage = 'סליחה, מצלמת האנדרואיד נתקלה בבעיה. ייתכן שיהיה עליך להפעיל מחדש את המכשיר';
                                displayErrorMessage(errorMessage);
                            }
                        }
                    }
                })
            }
            if (table8Obj.phObj.PH2 > 0 && ph2 == '') {
                $(table8Obj.table).each(function (index) {
                    if (table8Obj.table[index].photoRequestCode == table8Obj.phObj.PH2) {
                        navigator.notification.alert('נא צלם ' + table8Obj.table[index].PhotoRequestDesc, onConfirm);

                        function onConfirm() {
                            navigator.camera.getPicture(success, fail,
                            {
                                quality: 30,
                                sourceType: Camera.PictureSourceType.CAMERA,
                                destinationType: Camera.DestinationType.DATA_URL,
                                encodingType: Camera.EncodingType.JPEG,
                                correctOrientation: true,
                                saveToPhotoAlbum: false,
                                targetWidth: 1500,
                                targetHeight: 1500
                            });
                        }
                        function success(data) {
                            ph2 = data;
                            pictures.push(data);
                            currentBarcode = $('.packageinput2a').val();
                            $('#deleteList').append('<li><lable>' + currentBarcode + '</lable> <img style="width: 45px;height: 45px;margin-right: 125px;" src="data:image/png;base64,' + data + '" /></li>');
                        }
                        function fail() {
                            if (message != 'Camera cancelled.') {
                                var errorMessage = 'סליחה, מצלמת האנדרואיד נתקלה בבעיה. ייתכן שיהיה עליך להפעיל מחדש את המכשיר';
                                displayErrorMessage(errorMessage);
                            }
                        }
                    }
                })
            }
            if (table8Obj.phObj.PH1 > 0 && ph1 == '') {
                $(table8Obj.table).each(function (index) {
                    if (table8Obj.table[index].photoRequestCode == table8Obj.phObj.PH1) {
                        navigator.notification.alert('נא צלם ' + table8Obj.table[index].PhotoRequestDesc, onConfirm);

                        function onConfirm() {
                            navigator.camera.getPicture(success, fail,
                            {
                                quality: 30,
                                sourceType: Camera.PictureSourceType.CAMERA,
                                destinationType: Camera.DestinationType.DATA_URL,
                                encodingType: Camera.EncodingType.JPEG,
                                correctOrientation: true,
                                saveToPhotoAlbum: false,
                                targetWidth: 1500,
                                targetHeight: 1500
                            });
                        }
                        function success(data) {
                            ph1 = data;
                            pictures.push(data);
                            currentBarcode = $('.packageinput2a').val();
                            $('#deleteList').append('<li><lable>' + currentBarcode + '</lable> <img style="width: 45px;height: 45px;margin-right: 125px;" src="data:image/png;base64,' + data + '" /></li>');
                        }
                        function fail() {
                            if (message != 'Camera cancelled.') {
                                var errorMessage = 'סליחה, מצלמת האנדרואיד נתקלה בבעיה. ייתכן שיהיה עליך להפעיל מחדש את המכשיר';
                                displayErrorMessage(errorMessage);
                            }
                        }
                    }
                })
            }


        }

        if (isSigMust != true && isPhotoMust != false) {
            if (kodMesira == "1" || kodMesira == "13" || kodMesira == "14" || kodMesira == "91" || kodMesira == "92" || kodMesira == "93") {
                if (countPictures == 0) {
                    countPictures++;
                }
                var errorMessage = 'נא לצלם תעודת משלוח';
                navigator.notification.alert(errorMessage, onConfirm);

                function onConfirm() {
                    navigator.camera.getPicture(success, fail,
                    {
                        quality: 30,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        destinationType: Camera.DestinationType.DATA_URL,
                        encodingType: Camera.EncodingType.JPEG,
                        correctOrientation: true,
                        saveToPhotoAlbum: false,
                        targetWidth: 1500,
                        targetHeight: 1500
                    });
                }


                function success(data) {
                    ph = data;
                    pictures.push(data);
                    isPhotoMust = false;
                    isMisparManuiMust = false;
                    countPictures = 0;
                    currentBarcode = $('.packageinput2a').val();
                    $('#deleteList').append('<li><lable>' + currentBarcode + '</lable> <img style="width: 45px;height: 45px;margin-right: 125px;" src="data:image/png;base64,' + data + '" /></li>');
                }
                function fail() {
                    isPhotoMust = true;
                    isMisparManuiMust = true;
                    if (message != 'Camera cancelled.') {
                        var errorMessage = 'סליחה, מצלמת האנדרואיד נתקלה בבעיה. ייתכן שיהיה עליך להפעיל מחדש את המכשיר';
                        displayErrorMessage(errorMessage);
                    }
                }
            }
            else {
                isPhotoMust = false;
                isMisparManuiMust = false;
            }
        }

        else if (parseInt(MEM) == 0 || MEM == '' || MEM == null) {
            var PHOTO_REQ = localStorage.getItem("PHOTO_REQ");
            if (PHOTO_REQ == "1" && isPhotoMust == true) {
                isMisparManuiMust = true;
            }
        }


    }

    function sendMesser21() {
        var isReject = $("#selectDehia").val();
        if (isReject == null) {
            isReject = '';
        }
        var isMesi = $("#selectMesira").val();
        if (isMesi == null) {
            isMesi = '';
        }
        if (isReject == '' && isMesi == '' && barcodesArray.length == 0) {
            navigator.notification.alert('לא נסרק פריט או לא נבחרה דחיה או סיבת אי ביצוע');
        } else {
            var xml = createMsg21(taskId, isReject, isMesi);
            $.ajax({
                url: serverUrl,
                dataType: "xml",
                type: "POST",
                async: true,
                contentType: "text/xml;charset=utf-8",
                headers: {
                    "SOAPAction": SoapActionQA
                },
                crossDomain: true,
                data: xml,
                timeout: 30000 //30 seconds timeout
            }).done(function (data) {
                //console.log(data);
                if (data != null) {
                    var dataXML = new XMLSerializer().serializeToString(data);
                    //console.log(dataXML);
                    var responseXML = $(dataXML).find("DataObject Data").text();
                    var JSONData = $.xml2json(responseXML);
                    if (JSONData.DATA.MSG.DATA.RESULT == 0) {
                        //console.log('taskid ' + taskId + ' has been successfully reported.');
                        navigator.notification.alert('דווח בהצלחה');
                        //back to previous screen - all assignments list
                        if ($rootScope.rootRQW != undefined) {
                            $rootScope.prevPath = '';
                            location.href = '#/assignments_all/';
                        } else {
                            history.back();
                        }                       
                    } else {
                        navigator.notification.alert(JSONData.DATA.MSG.DATA.RESMSG);
                    }
                }//end if (data != null)                                                   
            }).fail(function (jqXHR, textStatus, thrownError) {
                navigator.notification.alert('אין תקשורת, נסה שנית');
            });
        }
    }

    function createMsg21(taskId, isReject, isNoDo) {
        var date = getCurrentDate();
        var stat = "", reason = "";
        if (isReject != '-1') {
            stat = 10;
            reason = isReject;
        }
        else if (isNoDo != '-1') {
            stat = 6;
            reason = "";
        } else {
            stat = 6;
            reason = 1;
        }
        var USRKEY = localStorage.getItem("USRKEY");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:' + XMLMETHOD + '>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>21</CODE>\
                                <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + ' </USRKEY> <DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
							    <DATA>\
                                    <STATUS>\
								        <TASKID>' + taskId + '</TASKID>\
										<DT>'+ date + '</DT>\
										<STAT>'+ stat + '</STAT>\
										<REASON>'+ reason + '</REASON>\
										<BC>' + givenBarcode + '</BC>\
                                        <BCS></BCS>\
								    </STATUS>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:' + XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        //console.log(xml);
        return xml;
    }


    function isHarig() {
        isSigMust = true;
        isPhotoMust = false;
        countPictures = 0;
    }
    //#endregion

    //#region Get Misparei Manui
    var misparim = [];

    //function getManuim() {
    //    misparim = mainService.manuim;
    //    //var manuiName = contains(misparim, MesimatMesiraObject.contractId);
    //    $("#subscriberName").html(MesimatMesiraObject.contractId + ' ' + getSubscriberName(MesimatMesiraObject.contractId));

    //}

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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>3</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
</tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }
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
            currentBarcode = barcode;
            $('.packageinput2a').val(barcode);
            $(".packageinput2a").prop('disabled', true);
            $scope.onCompareBarcodes();
        } else {
            barcode = '';
            $('.packageinput2a').val(barcode);
            var mp3URL = getMediaURL("sounds/error.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }
    }

    function onFailure(data) {
    }
    //#endregion On Scan Barcode


    //autocomplete start

    $scope.dirty = {};

    function suggest_state(term) {
        misparim = mainService.manuim;
        var q = term.toLowerCase().trim();
        var results = [];

        // Find first 5 states that start with `term`.
        for (var i = 0; i < misparim.length && results.length < 5; i++) {
            var state = misparim[i].MemberDesc + ',' + misparim[i].MemberNumber;
            if (state.toLowerCase().indexOf(q) > -1)
                results.push({ label: state, value: state });
        }

        return results;
    }

    function add_tag(selected) {
        MEM = selected.value.split(",")[1];
        getCheckHarigim(); // need to check this function if relevant
    };

    $scope.autocomplete_options = {
        suggest: suggest_state,
        on_select: add_tag
    };

    //autocomplete end

    //#region Get Harigim Table
    function CreateTablesHarigimXML() {
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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>7</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
</tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

    function getCheckHarigim() {

        var xml = CreateTablesHarigimXML();
        var ee = 10;
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
            data: xml,
            timeout: 30000 //30 seconds timeout
        }).done(function (data) {
            if (data != null) {
                var tempKodMesira = $('#selectMesira').val();
                kodMesira = tempKodMesira == -1 ? 1 : tempKodMesira;
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
                var result = xmlDoc.firstChild.innerHTML;
                var children = xmlDoc.firstChild.firstChild.children[1].firstChild.children;
                for (i = 0; i < children.length; ++i) {
                    var id = children[i].children[0].innerHTML;
                    Harigim.push(id);
                }
                if (contains(Harigim, MEM)) {
                    isHarig();
                }
         
            }
            else {
                navigator.notification.alert('יש תקלה בשרת');
            }

        }).fail(function (jqXHR, textStatus, thrownError) {
            navigator.notification.alert('אין תקשורת, נסה שנית');
        });
    }

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

    //#endregion
    function containsNumber(a, obj) {
        var i = a.length;
        while (i--) {
            if (obj.indexOf(',') != -1) {
                if (a[i].split(',')[1].trim() == obj) {
                    return true;
                }
            }
            else {
                if (a[i].split(',')[1].trim() == obj) {
                    return true;
                }
            }

        }
        return false;
    }

    function contains(a, obj) {
        var i = a.length;
        while (i--) {
            a[i] = a[i].toUpperCase();
            obj = obj.toUpperCase();
            if (a[i] === obj) {
                return true;
            }
        }
        return "";
    }
});