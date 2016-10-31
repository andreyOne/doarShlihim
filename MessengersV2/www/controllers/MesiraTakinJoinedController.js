scotchApp.controller('mesiraMerukezetTakinController', function ($scope, $routeParams, $route, $rootScope, mainService) {
    $("#warpPopup").hide();
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
    });
    //#endregion JQuery On Document Ready
    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });

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
    var countDelivered = 0;
    var isBottomHidden = false;
    var isItemHarig = false;
    $rootScope.table8Obj = {}
    var table8Obj = $rootScope.table8Obj;
    var ph = '';
    var ph1 = '';
    var ph2 = '';
    var ph3 = '';
    //#endregion General Variables




    function HideBottom() {
        $(".signature").css("display", "none");
        $(".cameraBtn").css("display", "none");
        $(".packageinput4").css("display", "none");
        $(".ItemOK").css("display", "none");
        $(".cameraBtn3").css("display", "none");

        if (countDelivered > 0) {
            $(".totalScanItemsedit").css("display", "block");
        }
        else {
            $(".totalScanItemsedit").css("display", "none");
        }



        $("#lgnBtnId").css("display", "block");
        $(".greyText2").css("display", "block");
        $(".packageinput2").css("display", "block");
        $(".BarcodeArea").css("display", "block");
        $(".cameraBtn2").css("display", "block");

        $('.cameraBtn2').css('margin-left', '38px');
        $('.cameraBtn2').css('margin-top', '-38px');
        $('.totalScanItems').css('margin-top', '-42px');

        isBottomHidden = true;
    }

    function HideTop() {
        $(".signature").css("display", "block");
        $(".totalScanItemsedit").css("display", "block");
        $(".cameraBtn").css("display", "block");
        $(".packageinput4").css("display", "block");
        $(".ItemOK").css("display", "block");
        $(".cameraBtn3").css("display", "block");


        $("#lgnBtnId").css("display", "none");
        $(".cameraBtn2").css("display", "none");
        $(".BarcodeArea").css("display", "none");
        $(".greyText2").css("display", "none");
        $(".packageinput2").css("display", "none");

        $('.totalScanItems').css('margin-top', '-20px');
        $('.ItemOK').css('margin-top', '-15px');
        $(".cameraBtn3").css('margin-top', '4px');
        $("#lgnBtnId").css('margin-top', '0px');
        $(".cameraBtn").css('margin-top', '-47px');
        isBottomHidden = false;

    }

    $scope.onMesira = function () {
        location.href = "#/mesira_bdika";
    };


    function HideTopFirst() {
        $(".signature").css("display", "block");
        $(".totalScanItemsedit").css("display", "block");
        $(".cameraBtn").css("display", "block");
        $(".packageinput4").css("display", "block");
        $(".ItemOK").css("display", "block");
        $(".cameraBtn3").css("display", "block");

        $("#lgnBtnId").css("display", "none");

        $(".cameraBtn2").css("display", "none");
        $(".BarcodeArea").css("display", "none");
        $(".greyText2").css("display", "none");
        $(".packageinput2").css("display", "none");

        $('.totalScanItems').css('margin-top', '-20px');
        $('.ItemOK').css('margin-top', '-15px');
        $("#lgnBtnId").css('margin-top', '0px');
        $(".cameraBtn").css('margin-top', '4px');
        $(".cameraBtn3").css('margin-top', '60px');
        $(".cameraBtn3").css('margin-bottom', '10px');
        isBottomHidden = false;

    }
    function keyboardShowHandler(e) {
        $("#footer").hide();

    }
    function keyboardHideHandler(e) {
        $("#footer").show();
    }

    //#region Angular Document Redy
    angular.element(document).ready(function () {
        MesiraMerukezetPicturesArray = [];
        window.addEventListener('native.keyboardshow', keyboardShowHandler);
        window.addEventListener('native.keyboardhide', keyboardHideHandler);

        if ($routeParams.From == "1") {
            countDelivered = $routeParams.Count;
            $(".totalScanItemsIcon2").text(countDelivered);
            HideTopFirst();
        }
        else {
            HideBottom();
        }
        $("#warpPopup").hide();
        $("#sigDialog").hide();

        if ($routeParams.originalWeight) {
            originalWeight = $routeParams.originalWeight;
            currentBarcode = $routeParams.barcode;
            fixedWeight = $routeParams.fixWeight;
            countPictures = $routeParams.countPictures;
            MEM = $routeParams.MEM;
            if (MEM == "0" || MEM == "-1") {
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
            isHarigTzilum();
        }
        getManuim();

        $('.ItemOK strong').text(currentBarcode);

        $(".area").val(kodMesira);
        $(".packageinput").val(currentBarcode)
        isBarcodeOk = true;
        $("#aBarCodeArea").prop('disabled', true);
        $("#selectOptions").prop('disabled', true);
        $("#refreshButton").prop('disabled', true);
        $(".packageinput").prop('disabled', true);


        var tt = $('#header').find('#headerText');
        tt.text('מסירה מרוכזת');

        //$("#header").load("pages/header.html", function () {
        //    var tt = $('#header').find('#headerText');
        //    tt.text('מסירה');
        //});
        //$("#footer").load("pages/footer.html");

        //window.onbeforeunload = function (event) {
        //    alert("leaving page");
        //}

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
            $("#deleteList").empty();
            if (MesiraMerukezetPicturesArray.length > 0) {
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
                        li = '<li><lable>' + item.barcode + '</lable> ';
                        if (item.ImageData != null) {
                            li += '<img style="  width: 45px;margin-left: 2px;height: 45px;margin-right: 2px;" src="data:image/png;base64,' + item.ImageData + '" />'
                        }
                    }
                    oldBarcode = tempBarcode;
                }

                li += '</li>'
                $('#deleteList').append(li);

            }

            if ($routeParams.originalWeight) {
                for (obj in $rootScope.itemView) {
                    var elem = "<li><lable>" + $rootScope.itemView[obj].code + "</lable><img style='width: 45px;margin-left: 2px;height: 45px;margin-right: 2px;' src=" + $rootScope.itemView[obj].img + "></li>"
                    $('#deleteList').append(elem);
                }
            }
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
    function containsNumber(a, obj) {
        if (obj != "") {
            var i = a.length;
            while (i--) {
                if (a[i].split(',')[1].trim() == obj.split(',')[1].trim()) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    function validateMesira() {


        var kodmesira = "1"

        //Check if enough pictures taken
        if (countPictures > pictures.length && pictures.length != 3 && isPhotoMust == true) {
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

        if (!mainService.containsNumber(misparim, MEM) && isMisparManuiMust) {
            navigator.notification.alert('לא בחרת מספר מנוי מהרשימה');
            return false;
        }

        if ($('.packageinput4').val() != '' && !mainService.containsNumber(misparim, MEM)) {
            navigator.notification.alert('לא בחרת מספר מנוי מהרשימה');
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
    function CreateXml(sig, mesira, barcode, ph1, ph2, ph3, isPalet, fixedWeight, RQW, MEMP) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RQP = "0";
        if (ph1 != '' || ph2 != '' || ph3 != '') {
            RQP = "1";
        }
        //var RLSCODE = localStorage.getItem("RLSCODE");

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
<BC>'+ barcode + '</BC>\
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
<MEM></MEM>\
<RQP>'+ RQPGLOBAL + '</RQP>\
<RQW>'+ RQWGLOBAL + '</RQW>\
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

        if (validateMesira()) {
            var sig = '';
            var MEMP = '';
            if (MEM == '') {
                MEMP = $('.packageinput4').val();
            }
            else {
                MEMP = MEM;
            }
            var kodmesira = "1";
            if (base64Signature != emptySignature) {
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
            var xml = CreateXml(sig, kodmesira, currentBarcode, ph1, ph2, ph3, isPalet, fixedWeight, RQWGlobal, MEMP);
            makeDeliverRequest(xml);
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
                            timeout: 10000 //30 seconds timeout
                        }).done(function (data) {
                            if (data != null) {
                                var parser = new DOMParser();
                                var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
                                var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                                var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                                if (result == "0") {
                                    if (isPhotoMust == false) {
                                        MesiraMerukezetPicturesArray.push({ barcode: currentBarcode, ImageData: null });
                                    }
                                    $(".packageinput2").prop('disabled', false);
                                    $(".packageinput2").val("");
                                    countDelivered++;
                                    $(".totalScanItemsIcon2").text(countDelivered);
                                    currentBarcode = '';
                                    isSigMust = false;
                                    isPhotoMust = true;
                                    isMisparManuiMust = false;
                                    HideBottom();
                                    countPictures = 0;
                                    $rootScope.table8Obj = {}
                                    ph = '';
                                    ph1 = '';
                                    ph2 = '';
                                    ph3 = '';
                                    for (var i = 0; i < pictures.length; i++) {
                                        pictures.pop();
                                    }
                                    pictures = [];
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
        var image1 = document.getElementById('Image1');
        if (ph == '') {
            ph = imageData
        } else if (ph1 == '') {
            ph1 = imageData
        } else if (ph2 == '') {
            ph2 = imageData
        } else if (ph3 == '') {
            ph3 = imageData
        }
        pictures.push(imageData);
        indexPic++;
        isMisparManuiMust = false;
        var tempBarcode = currentBarcode;
        MesiraMerukezetPicturesArray.push({ barcode: tempBarcode, ImageData: imageData });

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
                            MesiraMerukezetPicturesArray.push({ barcode: currentBarcode, ImageData: data });
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
                            MesiraMerukezetPicturesArray.push({ barcode: currentBarcode, ImageData: data });
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
                            MesiraMerukezetPicturesArray.push({ barcode: currentBarcode, ImageData: data });
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
                    MesiraMerukezetPicturesArray.push({ barcode: currentBarcode, ImageData: data });
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
        isItemHarig = true;
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

    var misparim = [];
    function getManuim() {
        misparim = mainService.manuim;
        $(".loading2").css("display", "none");

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
                var result = xmlDoc.firstChild.innerHTML;
                var children = xmlDoc.firstChild.firstChild.children[1].firstChild.children;
                for (i = 0; i < children.length; ++i) {
                    var id = children[i].children[0].innerHTML;
                    Harigim.push(id);
                }
                if (contains(Harigim, MEM)) {
                    isHarig();
                }
                if (isSigMust == false) {
                    isPhotoMust = true;
                    isMisparManuiMust = true;
                    if (countPictures == 0) {
                        countPictures++;

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
            navigator.notification.alert('אין תקשורת, נסה שנית');
        });
    }


    //--------------------------------------------------------------------- Bdika Section ---------------------------------------------------------------------------------


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
            $('.packageinput2').val(barcode);
            $(".packageinput2").prop('disabled', true);
            $scope.onCheckBarCode();
        } else {
            barcode = '';
            $('.packageinput2').val(barcode);
            var mp3URL = getMediaURL("sounds/error.amr");
            var media = new Media(mp3URL, null, mediaError);
            media.play();
        }
        function onVolSuccess() { }
        function onVolError() { }
    }
    function onFailure(data) {
    }
    $scope.onCheckBarCode = function () {
        var barcode = $(".packageinput2").val();
        barcode = barcode.toUpperCase();

        currentBarcode = barcode;
        if (barcode.length == 0) {
            navigator.notification.alert('לא הוזן ברקוד');
        }
        else {
            var kodmesiraValue = "1";
            kodmesiraValueToTakin = kodmesiraValue;
            if (barcode.substring(0, 2) == "51" && barcode.substring(barcode.length - 2, barcode.length) == 17) {
                if (kodmesiraValue == "1" || kodmesiraValue == "7" || kodmesiraValue == "70" || kodmesiraValue == "91" ||
                    kodmesiraValue == "92" || kodmesiraValue == "93" || kodmesiraValue == "99") {
                    navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
                }
            }
            else {
                if (validateManaualCode(barcode)) {
                    var xml = CreateValidateBarcodeXML(kodmesiraValue, barcode);
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
                                kodMesira = "1";
                                $('.ItemOK strong').text(currentBarcode);
                                if (data.MEM == '0' || data.MEM == '-1') {
                                    $('packageinput4').val('');
                                } else {
                                    $('.packageinput4').val(getSubscriberName(MEM) + " , " + data.MEM);
                                }

                                isHarigTzilum();
                                HideTopFirst();
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
                    //$.ajax(
                    //       {
                    //           url: serverUrl,
                    //           dataType: "xml",
                    //           //dataType: 'json',
                    //           type: "POST",
                    //           async: false,
                    //           contentType: "text/xml;charset=utf-8",
                    //           headers: {
                    //               "SOAPAction": SoapActionQA
                    //           },
                    //           crossDomain: true,
                    //           data: xml,
                    //           timeout: 30000 //30 seconds timeout
                    //       }).done(function (data) {
                    //           if (data != null) {
                    //               var parser = new DOMParser();
                    //               var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
                    //               var result = xmlDoc.firstChild.firstChild.children[1].firstChild.innerHTML;
                    //               if (result == "0") {

                    //                   var table8xml = createTable8();
                    //                   MEM = xmlDoc.firstChild.firstChild.children[1].children[7].innerHTML;
                    //                   if (MEM == "") {
                    //                       MEM = "0";
                    //                   }

                    //                   //andrey  change mem logic
                    //                   MEM == '-1' ? localStorage.PHOTO_REQ = 1 : localStorage.PHOTO_REQ = 0;
                    //                   //

                    //                   var requestPics = xmlDoc.firstChild.firstChild.children[1].children[9].innerHTML;
                    //                   var RQW = xmlDoc.firstChild.firstChild.children[1].children[8].innerHTML
                    //                   RQWGLOBAL = RQW;
                    //                   RQPGLOBAL = requestPics;
                    //                   //If Images Are Requested

                    //                   if (requestPics == "1") {
                    //                       countPictures = countAmountOfPictures(xmlDoc, countPictures);
                    //                       getTable8(table8xml)

                    //                       var phObj = $.xml2json(xmlDoc.firstChild.firstChild.children[1])['DATA'];

                    //                       $rootScope.table8Obj.phObj = phObj;
                    //                       $rootScope.table8Obj.rqp = requestPics;
                    //                   }
                    //                   else {
                    //                       countPictures = "0";
                    //                   }

                    //                   //If weight is requested
                    //                   if (RQW == "1") {
                    //                       var mesira = "1";
                    //                       var ORG = xmlDoc.firstChild.firstChild.children[1].children[3].innerHTML;
                    //                       //If item is EMS
                    //                       if (barcode[0] == "E" && barcode[1] == "E") {
                    //                           GoToEms(ORG, barcode, mesira, countPictures, MEM);
                    //                       }
                    //                       else {
                    //                           GoToRegularWeight(ORG, barcode, mesira, countPictures, isPalet, MEM);
                    //                       }
                    //                   }
                    //                   else {
                    //                       //var originalWeghit = "0";
                    //                       //var fixedWeight = "0";
                    //                       //var isPalet = "0";
                    //                       // location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesiraValueToTakin + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM;
                    //                       kodMesira = "1";
                    //                       $('.ItemOK strong').text(currentBarcode);
                    //                       if (MEM == '0' || MEM == '' || MEM == '-1') { 
                    //                           $('packageinput4').val('');
                    //                       } else {
                    //                           $('.packageinput4').val(MEM);
                    //                       }

                    //                       isHarigTzilum();
                    //                       HideTopFirst();
                    //                   }

                    //               }
                    //               else {
                    //                   var message = xmlDoc.childNodes[0].firstChild.children[1].children[1].innerHTML;
                    //                   navigator.notification.alert(message);
                    //               }
                    //           }
                    //           else {


                    //               navigator.notification.alert('יש תקלה בשרת');
                    //           }

                    //       }).fail(function (jqXHR, textStatus, thrownError) {
                    //           navigator.notification.alert('אין תקשורת, נסה שנית');
                    //       });
                }

                else {

                }
            }
        }
    };

    $scope.onEnd = function () {

        var bar = $(".packageinput2").val();
        if (isBottomHidden && (bar == "" || bar == "undefined" || bar == null) && countDelivered > 0) {
            MesiraMerukezetPicturesArray = [];
            $rootScope.itemView = {};
            //$('.totalScanItemsIcon2').html(0);
            //currentBarcode = '';
            //barcodes = [];
            //indexPic = 0;
            //pictures = [];
            //base64Signature = "";
            //countPictures = 0;
            //isBarcodeOk = false;
            //fixedWeight = "0";
            //originalWeight = "0";
            //isPalet = "0";
            //RQWGlobal = "0";
            //firstName = '';
            //lastName = '';
            //emptySignature = "";
            //MEM = "0";
            //Harigim = [];
            //isSigMust = false;
            //isPhotoMust = true;
            //isMisparManuiMust = false;
            //kodMesira;
            //countDelivered = 0;
            //isBottomHidden = false;
            //isItemHarig = false;
            //$(".totalScanItemsedit").css("display", "none");
            $route.reload();
            window.location.href = "#/deliverJoined";
        }
        else if (isBottomHidden && (bar == "" || bar == "undefined" || bar == null) && countDelivered == 0) {
            navigator.notification.alert("לא נסרק או הוקלד ברקוד")
        }
        else {
            navigator.notification.alert("יש ללחוץ על כפתור החץ")
        }

    }

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
        $rootScope.itemView = {}
        $(MesiraMerukezetPicturesArray).each(function (index) {
            $rootScope.itemView[index] = {
                'img': 'data:image/png;base64,' + $(this)[0].ImageData,
                'code': $(this)[0].barcode
            }
        })
        location.href = "#/weightItem/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/1/Count/" + countDelivered;
    }
    function GoToRegularWeight(ORG, barcode, kodmesira, countPictures, isPalet, MEM) {
        $rootScope.itemView = {}
        $(MesiraMerukezetPicturesArray).each(function (index) {
            $rootScope.itemView[index] = {
                'img': 'data:image/png;base64,' + $(this)[0].ImageData,
                'code': $(this)[0].barcode
            }
        })
        location.href = "#/weightNormal/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/1/Count/" + countDelivered;
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


});