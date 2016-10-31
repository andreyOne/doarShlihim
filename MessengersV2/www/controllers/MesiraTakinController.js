scotchApp.controller('mesiraTakinController', function ($scope, $routeParams, $rootScope, mainService) {

    MesiraMerukezetPicturesArray = [];

    $("#warpPopup").hide();

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });

    //#region JQuery On Document Ready
    $('.sigPad').signaturePad({ drawOnly: true });
    $('.sigPad').signaturePad({ lineWidth: 0 });
    $('.sigPad').signaturePad({ lineColour: '#FFFFFF' });
    $('.sigPad').signaturePad({ penColour: '#000000' });
    $("#sigDiv").prop('disabled', true);
    $("#takePic").prop('disabled', true);

    $('.signatureButton').click(function () {
        $('.sigPad').signaturePad().clearCanvas();
    })
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
    var isPalet = $routeParams.isPalet || "0";
    var buffer = $routeParams.buffer || "0"
    var RQWGlobal = $routeParams.RQW || "0";
    var firstName = '';
    var lastName = '';
    var emptySignature = "";
    var MEM = "0";
    var Harigim = [];
    var isSigMust = false;
    var isPhotoMust = true;
    var isMisparManuiMust = false;
    var kodMesira;
    var ph = '';
    var ph1 = '';
    var ph2 = '';
    var ph3 = '';
    var misparim = mainService.manuim || [];
    var table8Obj = $rootScope.table8Obj;
    //function getManuim() {
    //misparim = JSON.parse(localStorage.getItem("Manuim"));
    //$(".loading2").css("display", "none");
    //console.log(misparim)

    //misparim = mainService.manuim;
    //}

    //#endregion General Variables

    //#region Angular Document Redy

    //$("#warpPopup").hide();
    //$("#sigDialog").hide();


        if ($routeParams.originalWeight) {
            originalWeight = $routeParams.originalWeight;
            currentBarcode = $routeParams.barcode;
            fixedWeight = $routeParams.fixWeight;
            countPictures = $routeParams.countPictures;
            MEM = $routeParams.MEM;
            
            isPalet = $routeParams.isPalet;


            //RQWGlobal = "1";
            kodMesira = decodeURIComponent($routeParams.kodmesira);

            $('#selectOptions').append($("<option></option>").attr("value", 1).text(kodMesira.split(',')[1] + ' , ' + kodMesira.split(',')[0]));

            var arr = kodMesira.split(',');
            kodMesira = arr[0];

        }

        isHarigTzilum();

        angular.element(document).ready(function () {
            if (MEM == "0" || MEM == '-1') {
                $(".packageinput4").val('');
            }
            else {
                $(".packageinput4").val(getSubscriberName(MEM) + " , " + MEM);
            }
        })

    $('.ItemOK strong').text(currentBarcode);



    $(".area").val(kodMesira);
    $(".packageinput").val(currentBarcode)
    isBarcodeOk = true;
    $("#aBarCodeArea").prop('disabled', true);
    $("#selectOptions").prop('disabled', true);

    $("#refreshButton").prop('disabled', true);
    $(".packageinput").prop('disabled', true);

    $('#selectOptions').val(1);


    //#endregion Angular Document Redy

    //#region On Open Popup
    $scope.open = function () {
        MesiraMerukezetPicturesArray = [];
        if (ph != '') {
            MesiraMerukezetPicturesArray.push({ barcode: $('.packageinput').val(), ImageData: ph })
        } if (ph1 != '') {
            MesiraMerukezetPicturesArray.push({ barcode: $('.packageinput').val(), ImageData: ph1 })
        } if (ph2 != '') {
            MesiraMerukezetPicturesArray.push({ barcode: $('.packageinput').val(), ImageData: ph2 })
        } if (ph3 != '') {
            MesiraMerukezetPicturesArray.push({ barcode: $('.packageinput').val(), ImageData: ph3 })
        }
        if (isBarcodeOk) {
            $("#deleteList").empty();
            if (MesiraMerukezetPicturesArray.length >> 0) {
                var tempBarcode = MesiraMerukezetPicturesArray[0].barcode;
                var oldBarcode = tempBarcode;
                var li = '<li><lable>' + tempBarcode + '</lable> ';
                var isEndOk = false;
                for (var i = 0; i < MesiraMerukezetPicturesArray.length; i++) {
                    var item = MesiraMerukezetPicturesArray[i];
                    tempBarcode = item.barcode;
                    if (oldBarcode == item.barcode) {
                        if (item.ImageData != null) {
                            li += '<img style="  width: 45px;margin-left: 2px;height: 45px;margin-right: 2px;" src="data:image/png;base64,' + item.ImageData + '" />'
                        }
                    }
                    else {
                        li += '</li>'
                        $('#deleteList').append(li);
                        li = '<li><lable>' + currentBarcode + '</lable> ';
                        if (item.ImageData != null) {
                            li += '<img style="  width: 45px;margin-left: 2px;height: 45px;margin-right: 2px;" src="data:image/png;base64,' + item.ImageData + '" />'
                        }
                    }
                    oldBarcode = tempBarcode;
                }

                li += '</li>'
                $('#deleteList').append(li);

            }
            $("#warpPopup").show();
        }
    }
    //#endregion On Open Popup

    //#region On X Click
    $scope.onXClick = function () {
        $("#warpPopup").hide();
    };
    //#endregion On X Click

    //#region On Add Barcode



    //function containsNumber(a, obj) {
    //    var i = a.length;
    //    while (i--) {
    //        if (!contains(obj, ",")) {
    //            if (a[i].split(',')[1].trim() == obj) {
    //                return true;
    //            }
    //        }
    //        else {
    //            if (a[i].split(',')[1].trim() == obj.split(',')[1].trim()) {
    //                return true;
    //            }
    //        }

    //    }
    //    return false;
    //}


    function validateMesira() {
        var misparim = mainService.manuim;
        var selectedManui = ($(".packageinput4").val().split(",")[1] || '').trim();
        var kodmesira = $(".area").val();

        if (MEM =="-1" && !mainService.containsNumber(misparim, selectedManui)) {
            navigator.notification.alert('לא בחרת מספר מנוי מהרשימה');
            return false;
        }
        //Check if code mesira is enetered
        if (kodmesira == "-1") {
            navigator.notification.alert('יש לבחור קוד מסירה');
            return false;
        }

        //Check if enough pictures taken
        if (countPictures > pictures.length && isPhotoMust == true) {
            navigator.notification.alert("לא צילמת מספיק תמונות", onConfirm);

            function onConfirm() {
                isHarigTzilum()
            }

            return false;
        }

        if (table8Obj.phObj != undefined && ((table8Obj.phObj.PH1 > 0 && ph1 == '') || (table8Obj.phObj.PH2 > 0 && ph2 == '') || (table8Obj.phObj.PH3 > 0 && ph3 == ''))) {
            navigator.notification.alert("לא צילמת מספיק תמונות", onConfirm);

            function onConfirm() {
                isHarigTzilum()
            }
            return false;
        }
        //check if barcode is entered
        if (!$routeParams.originalWeight) {
            currentBarcode = $(".packageinput2").val();
            if (currentBarcode == '') {
                navigator.notification.alert('לא בחרת ברקוד');
                return false;
            }
        }

        //check is barcode is ok
        if (!validateManaualCode(currentBarcode)) {
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
        if (localStorage.PHOTO_REQ == '1' || isMisparManuiMust) {
            if ($(".packageinput4").val() == '') {
                navigator.notification.alert("פריט זה מחייב להכניס מספר מנוי");
                return false;
            }
        }
        return true;
    }
    //function CreateXml(sig, mesira, barcode, ph1, ph2, ph3, isPalet, fixedWeight, RQW, MEMP) {
    //    barcode = barcode.toUpperCase();
    //    var date = getCurrentDate();
    //    var USRKEY = localStorage.getItem("USRKEY");
    //    var USR = localStorage.getItem("USR");
    //    var MOKED = localStorage.getItem("MOKED");
    //    var RQP = "0";
    //    if (ph1 != '' || ph2 != '' || ph3 != '') {
    //        RQP = "1";
    //    }
    //    if (fixedWeight == undefined || fixedWeight == "undefined") {
    //        fixedWeight = "";
    //    }
    //    //var RLSCODE = localStorage.getItem("RLSCODE");

    //    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
    //    <soapenv:Header/>\
    //    <soapenv:Body>\
    //    <tem:'+ XMLMETHOD + '>\
    //    <!--Optional:-->\
    //    <tem:xml><![CDATA[\
    //    <DATA>\
    //    <MSG><SYSTEMID>1</SYSTEMID>\
    //    <HEADER>\
    //    <MSGVER>1</MSGVER>\
    //    <CODE>3</CODE>\
    //    <SENDTIME>'+ date + '</SENDTIME>\
    //    <GPS/>\
    //    <USRKEY>'+ USRKEY + '</USRKEY>\
    //    <DEVKEY>9999</DEVKEY>\
    //    <VER>2</VER>\
    //    </HEADER>\
    //    <DATA>\
    //    <ITEM>\
    //    <ITEMID></ITEMID>\
    //    <BC>'+ barcode + '</BC>\
    //    <CRDT>'+ date + '</CRDT>\
    //    <DST>0</DST>\
    //    <DELIV>'+ mesira + '</DELIV>\
    //    <USR>'+ USR + '</USR>\
    //    <MOKED>'+ MOKED + '</MOKED>\
    //    <ACT>9</ACT>\
    //    <MEM>'+ MEM + '</MEM>\
    //    <MEMP>' + MEMP + '</MEMP>\
    //    <DEVKEY>9999</DEVKEY>\
    //    <FN>'+ firstName + '</FN>\
    //    <LN>'+ lastName + '</LN>\
    //    <TYP>0</TYP>\
    //    <DST></DST>\
    //    <SIG>'+ sig + '</SIG>\
    //    <PH>' + ph + '</PH>\
    //    <PH1>'+ ph1 + '</PH1>\
    //    <PH2>'+ ph2 + '</PH2>\
    //    <PH3>'+ ph3 + '</PH3>\
    //    <MEM></MEM>\
    //    <BUFFER>'+buffer+'</BUFFER>\
    //    <RQP>'+ RQPGLOBAL + '</RQP>\
    //    <RQW>'+ RQWGLOBAL + '</RQW>\
    //    <ORG>'+ originalWeight + '</ORG>\
    //    <CRT>'+ fixedWeight + '</CRT>\
    //    <PLT>'+ isPalet + '</PLT>\
    //    </ITEM>\
    //    <BATCH></BATCH>\
    //    </DATA>\
    //    </MSG>\
    //    </DATA>]]>\
    //    </tem:xml>\
    //    </tem:'+ XMLMETHOD + '>\
    //    </soapenv:Body>\
    //    </soapenv:Envelope>';
    //    //console.log(xml);
    //    return xml;

    //}

    $scope.onOkPressed = function () {
        if (validateMesira()) {
            var sig = '';
            var MEMP = '';
            if (MEM == '') {
                MEMP = $('.packageinput4').val();
            }
            else {
                MEMP = MEM;
            }
            var kodmesira = $(".area").val();
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

            var xml = mainService.create3(currentBarcode, kodMesira, MEM, MEMP, ph, ph1, ph2, ph3, RQPGLOBAL, RQWGlobal, originalWeight, sig, isPalet, fixedWeight, buffer)


            //var xml = CreateXml(sig, kodMesira, currentBarcode, ph1, ph2, ph3, isPalet, fixedWeight, RQWGlobal, MEMP);

            // offline start

            var offlineXml = JSON.parse(localStorage.getItem('offlineXml'))
            offlineXml[currentBarcode] = xml;
            localStorage.setItem('offlineXml', JSON.stringify(offlineXml));

            MesiraMerukezetPicturesArray = [];
            location.href = "#/mesira_bdika";
            navigator.notification.alert('נמסר בהצלחה');

            setTimeout(mainService.getOfflineArray(), 100);

            // ofline end

            //makeDeliverRequest(xml, currentBarcode);
        }
    };

    //function makeDeliverRequest(xml, currentBarcode) {
    //    var x = 10;
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
    //        var parser = new DOMParser();
    //        var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
    //        var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
    //        var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
    //        if (result == "0") {
    //            MesiraMerukezetPicturesArray = [];
    //            location.href = "#/mesira_bdika";
    //            navigator.notification.alert('נמסר בהצלחה');
    //            // offline start
    //            offlineXml = JSON.parse(localStorage.getItem('offlineXml'));
    //            delete offlineXml[currentBarcode];
    //            localStorage.setItem('offlineXml', JSON.stringify(offlineXml));
    //            // offline end

    //        }
    //        else {
    //            navigator.notification.alert(message);
    //        }
    //    }).fail(function (jqXHR, textStatus, thrownError) {
    //        //this.newTable8 = [];
    //        //if (ph != '') {
    //        //    this.newTable8.push({img:'data:image/png;base64,'+ph})
    //        //}
    //        //if (ph1 != '') {
    //        //    this.newTable8.push({ img: 'data:image/png;base64,' + ph1 })
    //        //}
    //        //if (ph2 != '') {
    //        //    this.newTable8.push({ img:'data:image/png;base64,'+ ph2 })
    //        //}
    //        //if (ph3 != '') {
    //        //    this.newTable8.push({ img:'data:image/png;base64,'+ ph3 })
    //        //}

    //        //if (localStorage.newTable8 === undefined) {
    //        //    localStorage.setItem('newTable8', JSON.stringify([this.newTable8]));
    //        //    navigator.notification.alert('הצילומים נשמרים לתהליך OFFLINE');
    //        //    location.href = '#/mesira_bdika'
    //        //} else {
    //        //    var tb = JSON.parse(localStorage.newTable8)
    //        //    tb.push(this.newTable8)
    //        //    localStorage.setItem('newTable8', JSON.stringify(tb));
    //        //    navigator.notification.alert('הצילומים נשמרים לתהליך OFFLINE');
    //        //    location.href = '#/mesira_bdika'
    //        //}



    //        //makeDeliverRequest(xml,currentBarcode)
    //        //navigator.notification.alert('אין תקשורת, נסה שנית');
    //    });
    //}


    //#endregion   On Add Barcode

    //#region Camera Handler.
    $scope.onTakePicture = function () {
        if ((($rootScope.table8Obj.rqp == 0 || $rootScope.table8Obj.rqp == undefined) && ph2 != '') || $rootScope.table8Obj.rqp == 1 && ph3 != '') {
            displayErrorMessage('כבר צילמת מספיק תמונות');
        } else {
            navigator.camera.getPicture(onCameraSuccess, onCameraFail,
                   {
                       quality: 20,
                       sourceType: Camera.PictureSourceType.CAMERA,
                       destinationType: Camera.DestinationType.DATA_URL,
                       encodingType: Camera.EncodingType.JPEG,
                       correctOrientation: true,
                       saveToPhotoAlbum: false,
                       targetWidth: 1000,
                       targetHeight: 1000
                   });
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
        isMisparManuiMust = false;
        MesiraMerukezetPicturesArray.push({ barcode: currentBarcode, ImageData: imageData });
    }

    function onCameraFail(message) {
        if (message != 'Camera cancelled.') {
            var errorMessage = 'סליחה, מצלמת האנדרואיד נתקלה בבעיה. ייתכן שיהיה עליך להפעיל מחדש את המכשיר';
            displayErrorMessage(errorMessage);
        }
    }

    //#endregion Camera Handler.

    $scope.onCloseSigDialog = function () {
        $("#sigDialog").hide();
    }
    $scope.onOpenSig = function () {
        $("#sigDialog").show();

    }

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
            $("#sigDialog").hide();
        }
    };
    //#endregion Get signature Base64

    function isHarigTzilum() {
        var firstTwoChars = localStorage.getItem("NO_PH_SUG_MOZAR");
        var lastTwoChars = localStorage.getItem("NO_PH_BC_ENDING");
        var arrOfFirstChars = firstTwoChars.split(',');
        var arrOflastChars = lastTwoChars.split(',');
        var firstTwoLettersOfBarcode = currentBarcode[0] + currentBarcode[1];
        var lastTwoLettersOfBarcode = currentBarcode[currentBarcode.length - 2] + currentBarcode[currentBarcode.length - 1];

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
                                    quality: 20,
                                    sourceType: Camera.PictureSourceType.CAMERA,
                                    destinationType: Camera.DestinationType.DATA_URL,
                                    encodingType: Camera.EncodingType.JPEG,
                                    correctOrientation: true,
                                    saveToPhotoAlbum: false,
                                    targetWidth: 1000,
                                    targetHeight: 1000

                            });
                        }
                        function success(data) {
                            ph3 = data;
                            pictures.push(data);
                        }
                        function fail(message) {
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
                                quality: 20,
                                sourceType: Camera.PictureSourceType.CAMERA,
                                destinationType: Camera.DestinationType.DATA_URL,
                                encodingType: Camera.EncodingType.JPEG,
                                correctOrientation: true,
                                saveToPhotoAlbum: false,
                                targetWidth: 1000,
                                targetHeight: 1000
                            });
                        }
                        function success(data) {
                            ph2 = data;
                            pictures.push(data);
                        }
                        function fail(message) {
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
                                quality: 20,
                                sourceType: Camera.PictureSourceType.CAMERA,
                                destinationType: Camera.DestinationType.DATA_URL,
                                encodingType: Camera.EncodingType.JPEG,
                                correctOrientation: true,
                                saveToPhotoAlbum: false,
                                targetWidth: 1000,
                                targetHeight: 1000
                            });
                        }
                        function success(data) {
                            ph1 = data;
                            pictures.push(data);
                        }
                        function fail(message) {
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
                        quality: 20,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        destinationType: Camera.DestinationType.DATA_URL,
                        encodingType: Camera.EncodingType.JPEG,
                        correctOrientation: true,
                        saveToPhotoAlbum: false,
                        targetWidth: 1000,
                        targetHeight: 1000
                    });
                }


                function success(data) {
                    ph = data;
                    pictures.push(data);
                    isPhotoMust = false;
                    isMisparManuiMust = false;
                    countPictures = 0;
                }
                function fail(message) {
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

        else if (parseInt(MEM) == 0 || parseInt(MEM) || MEM == '' || MEM == null) {
            var PHOTO_REQ = localStorage.getItem("PHOTO_REQ");
            if (PHOTO_REQ == "1" && isPhotoMust == true) {
                isMisparManuiMust = true;
            }
        }


    }

    function isHarig() {
        isSigMust = true;
        isPhotoMust = false;
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
        return false;
    }



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
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
                var children = xmlDoc.firstChild.firstChild.children[1].firstChild.children;
                for (i = 0; i < children.length; ++i) {
                    var id = children[i].children[0].innerHTML;
                    Harigim.push(id);
                }
                if (contains(Harigim, MEM)) {
                    isHarig();
                }
                if (isSigMust == false) {
                    if (kodMesira == "1" || kodMesira == "13" || kodMesira == "14" || kodMesira == "91" || kodMesira == "92" || kodMesira == "93") {
                        if (countPictures == 0) {
                            countPictures++;
                        }
                        isPhotoMust = true;
                        isMisparManuiMust = true;
                    }
                }
                else {
                    isPhotoMust = false;
                }
            }
            else {
                navigator.notification.alert('יש תקלה בשרת');
            }

        }).fail(function (jqXHR, textStatus, thrownError) {
            //navigator.notification.alert('אין תקשורת, נסה שנית');
        });
    }
});