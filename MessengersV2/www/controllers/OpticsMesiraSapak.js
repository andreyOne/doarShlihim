scotchApp.controller('opticsMesiraSapakController', function ($scope, $routeParams,$route,$rootScope,mainService) {
    $("#warpPopup").hide();
    $("#sigDialog").hide();
    HideTop();
    HideBottom();
    $('.BarcodeFields .area').val(-1);

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });


    $scope.onMesiraClick = function () {
        location.href = "#/optics_mesira_hanut";
    }

    $scope.onIsufClick = function () {
        location.href = "#/optica_isuf";
    }
    $scope.onMesiraSapakClick = function () {
        location.href = "#/optics_mesira_sapak";
    }


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
    var btnErrorMsg = 'יש ללחוץ על כפתור חץ'
    var ph = '';
    var ph1 = '';
    var ph2 = '';
    var ph3 = '';
    $rootScope.table8Obj = {}
    var table8Obj = $rootScope.table8Obj;

    var KodHanut = "";
    //#endregion General Variables

    function CreateHanuiotXml() {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");

        //var RLSCODE = localStorage.getItem("RLSCODE");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
<soapenv:Header/>\
<soapenv:Body>\
<tem:'+ XMLMETHOD + '>\
<!--Optional:-->\
<tem:xml><![CDATA[\
<DATA>\
<MSG>\
<HEADER>\
<MSGVER>1</MSGVER>\
<CODE>35</CODE>\
<SENDTIME>'+ date + '</SENDTIME>\
<GPS/>\
<USRKEY>'+ USRKEY + '</USRKEY>\
<DEVKEY>9999</DEVKEY>\
<VER>4</VER>\
</HEADER>\
<DATA>\
<MOKED>'+ MOKED + '</MOKED>\
</DATA>\
</MSG>\
</DATA>>]]>\
</tem:xml>\
</tem:'+ XMLMETHOD + '>\
</soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

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
        $('.totalScanItems').css('margin-top', '-25px');
        $('#loginBtn').css('margin-top', '-25px');


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

    function getHanuiot(xml) {
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

    //#region Angular Document Redy
    angular.element(document).ready(function () {
        $("#warpPopup").hide();
        $("#sigDialog").hide();

        MesiraMerukezetPicturesArray = [];
        getSuppliers();
        if ($routeParams.From == "1" || $routeParams.From == "2") {
            countDelivered = $routeParams.Count;
            $(".totalScanItemsIcon2").text(countDelivered);
            HideTopFirst();
        }
        else {
            HideBottom();

        }

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
            btnErrorMsg = 'יש ללחוץ על כפתור פלוס'
            isHarigTzilum();
        }
        getMisparMaui();
        KodHanut = $routeParams.KodHanut;

        $('.ItemOK strong').text(currentBarcode);

        $(".packageinput").val(currentBarcode)
        isBarcodeOk = true;
        $("#aBarCodeArea").prop('disabled', true);
        $("#selectOptions").prop('disabled', true);
        $("#refreshButton").prop('disabled', true);
        $(".packageinput").prop('disabled', true);


        $("input").focus(function () {
            $("#footer").css("display", "none");
        });
        $("input").blur(function () {
            $("#footer").css("display", "block");
        });

        $("#header").load("pages/header.html", function () {
            var tt = $('#header').find('#headerText');
            tt.text('מסירת אופטיקה לספק');
        });
        $("#footer").load("pages/footer.html");

        window.onbeforeunload = function (event) {
            alert("leaving page");
        }

        $('input').on('keyup', function (e) {
            var theEvent = e || window.event;
            var keyPressed = theEvent.keyCode || theEvent.which;
            if (keyPressed == 13) {
                cordova.plugins.Keyboard.close();
                $("#footer").css("display", "block");
            }
            return true;
        });
    });
    //#endregion Angular Document Redy

    //#region On Open Popup
    $scope.open = function () {
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
                        li = '<li><lable>' + tempBarcode + '</lable> ';
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
        var i = a.length;
        var flag = false;
        if (obj == "") {
            return false;
        }
        while (i--) {
            temp = obj;
            if (obj.indexOf(',') > -1) {
                if (a[i].split(',')[1].trim() == temp.split(',')[1].trim()) {
                    flag = true;
                }
            }
            else {
                if (a[i].split(',')[1].trim() == temp) {
                    flag = true;
                }
            }

        }
        return flag;
    }
 
    function validateMesira() {


        var kodmesira = "1"

        //Check if enough pictures taken
        if (countPictures > pictures.length && pictures.length != 3) {
            navigator.notification.alert("לא צילמת מספיק תמונות");
            return false;
        }

        if (table8Obj.phObj != undefined && ((table8Obj.phObj.PH1 > 0 && ph1 == '') || (table8Obj.phObj.PH2 > 0 && ph2 == '') || (table8Obj.phObj.PH3 > 0 && ph3 == ''))) {
            navigator.notification.alert("לא צילמת מספיק תמונות", onConfirm);

            function onConfirm() {
                isHarigTzilum()
            }

            return false;
        }

        if ($routeParams.originalWeight) {
            if (MEM == '-1') {
                isMisparManuiMust = true;
            }
        }

        if (!mainService.containsNumber(misparim, MEM) && isMisparManuiMust == true) {
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

    function CreateXml(sig, mesira, barcode, ph1, ph2, ph3, isPalet, fixedWeight, RQW, MEMP, KodHanut) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RQP = "0";
        if (ph1 != '' || ph2 != '' || ph3 != '') {
            RQP = "1";
        }
        if (fixedWeight == undefined) {
            fixedWeight = "";
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
<MEM>' + KodHanut + '</MEM>\
<MEMP>' + MEMP + '</MEMP>\
<DEVKEY>9999</DEVKEY>\
<FN>'+ firstName + '</FN>\
<LN>'+ lastName + '</LN>\
<TYP>1</TYP>\
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
            var xml = CreateXml(sig, kodmesira, currentBarcode, ph1, ph2, ph3, isPalet, fixedWeight, RQWGlobal, MEMP, KodHanut);
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
                            timeout: 30000 //30 seconds timeout
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
                                    if (isItemHarig) {
                                        isItemHarig = false;
                                        //MesiraMerukezetPicturesArray.push({ barcode: currentBarcode, ImageData: null });
                                    }
                                    //isBarcodeOk = false;
                                    //pictures = [];
                                    //currentBarcode = '';
                                    //$('.area').val('-1');
                                    //base64Signature = '';
                                    //$(".packageinput").val('');
                                    //$("#warpPopup").load(location.href + " #warpPopup");
                                    //index = 0;
                                    //barcodes = [];
                                    //indexPic = 0;
                                    //pictures = [];
                                    //countPictures = 0;
                                    //fixedWeight = "0";
                                    //originalWeight = "0";
                                    //isPalet = "0";
                                    //RQWGlobal = "0";
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
    function getMisparMaui() {
        misparim = mainService.manuim;
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
         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>32</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>999999</DEVKEY><VER>4</VER></HEADER><DATA><USR>' + USR + '</USR><BC>' + barcode + '</BC><ACT>9</ACT><DELIV>' + kodMesira + '</DELIV><MOKED>' + MOKED + '</MOKED></DATA></MSG></DATA>]]></tem:xml>\
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

    function getSuppliers() {
        var xml = CreateTablesSuppliersXML();
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
                    var Name = children[i].children[1].innerHTML;
                    $('.area').append($("<option></option>").attr("value", id).text(Name));
                }

                if ($routeParams.originalWeight) {
                    KodHanut = $routeParams.KodHanut;
                    $(".area").val(KodHanut || -1);
                }
            }
            else {
                navigator.notification.alert('יש תקלה בשרת');
            }

        }).fail(function (jqXHR, textStatus, thrownError) {
            navigator.notification.alert('אין תקשורת, נסה שנית');
        });
    }

    function CreateTablesSuppliersXML() {
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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>5</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
</tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
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
            $(".packageinput2").prop('disabled', false);
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
        var currentOption = $(".area").val();
        if (currentOption == null || currentOption == "-1") {
            navigator.notification.alert('לא בחרת ספק מהרשימה');
        }
        else {
            if (barcode.length == 0) {
                navigator.notification.alert('לא הוזן ברקוד');
            }
            else {
                var kodmesiraValue = "1";
                kodmesiraValueToTakin = kodmesiraValue;

                if (validateManaualCode(barcode)) {
                    MEM = $(".area").val();
                    //var xml = CreateValidateBarcodeXML(kodmesiraValue, barcode);
                    mainService.send32(kodmesiraValue, barcode).then(function (response) {
                        var data = $.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'];
                        if (data.RESULT == '0') {
                            var table8xml = createTable8();
                            if (data.MEM == "") data.MEM = "0";
                            data.MEM == '-1' ? localStorage.PHOTO_REQ = 1 : localStorage.PHOTO_REQ = 0;
                            MEM = data.MEM;
                            RQWGLOBAL = data.RQW;
                            RQPGLOBAL = data.RQP;
                            if (data.RQP == "1") {
                                getTable8(table8xml)

                                $rootScope.table8Obj.phObj = data;
                                $rootScope.table8Obj.rqp = data.RQP;
                            } 

                            if (data.RQW == "1") {
                                var mesira = "1";
                                var ORG = data.ORG
                                KodHanut = $('.area').find(":selected").val();
                                //If item is EMS
                                if (barcode[0] == "E" && barcode[1] == "E") {
                                    GoToEms(ORG, barcode, mesira, countPictures, MEM, KodHanut);
                                }
                                else {
                                    GoToRegularWeight(ORG, barcode, mesira, countPictures, isPalet, MEM, KodHanut);
                                }
                            }
                            else {
                                kodMesira = "1";
                                KodHanut = $('.area').find(":selected").val();

                                $('.ItemOK strong').text(currentBarcode);

                                if (data.MEM == '0' || data.MEM == '-1') {
                                    $('packageinput4').val('');
                                } else {
                                    $('.packageinput4').val(getSubscriberName(MEM) + " , " + data.MEM);
                                }
                                isHarigTzilum();
                                HideTopFirst();
                                btnErrorMsg = 'יש ללחוץ על כפתור פלוס'
                            }
                        } else {
                            $(".packageinput2").prop('disabled', false);
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
                    //                       var ORG = xmlDoc.firstChild.firstChild.children[1].children[3].innerHTML
                    //                       KodHanut = $('.area').find(":selected").val();
                    //                       //If item is EMS
                    //                       if (barcode[0] == "E" && barcode[1] == "E") {
                    //                           GoToEms(ORG, barcode, mesira, countPictures, MEM, KodHanut);
                    //                       }
                    //                       else {
                    //                           GoToRegularWeight(ORG, barcode, mesira, countPictures, isPalet, MEM, KodHanut);
                    //                       }
                    //                   }
                    //                   else {
                    //                       kodMesira = "1";
                    //                       KodHanut = $('.area').find(":selected").val();

                    //                       $('.ItemOK strong').text(currentBarcode);

                    //                       if (MEM == '0' || MEM == '' || MEM == '-1') {
                    //                           $('packageinput4').val('');
                    //                       } else {
                    //                           $('.packageinput4').val(MEM);
                    //                       }
                    //                       isHarigTzilum();
                    //                       HideTopFirst();
                    //                       btnErrorMsg = 'יש ללחוץ על כפתור פלוס'
                    //                   }

                    //               }
                    //               else {

                    //                   $(".packageinput2").prop('disabled', false);
                    //                   var message = xmlDoc.childNodes[0].firstChild.children[1].children[1].innerHTML;
                    //                   navigator.notification.alert(message);
                    //               }
                    //           }
                    //           else {

                    //               $(".packageinput2").prop('disabled', false);

                    //               navigator.notification.alert('יש תקלה בשרת');
                    //           }

                    //       }).fail(function (jqXHR, textStatus, thrownError) {

                    //           $(".packageinput2").prop('disabled', false);

                    //       });
                }

                else {

                }
            }

        }



    };

    $scope.onEnd = function () {
        $rootScope.itemView = {};
        $('.totalScanItemsIcon2').html(0);
        var bar = $(".packageinput2").val();
        if (isBottomHidden && (bar == "" || bar == "undefined" || bar == null) && countDelivered > 0) {
            MesiraMerukezetPicturesArray = [];
            location.href = "#/optics_mesira_hanut";
            location.href = "#/optics_mesira_sapak";
        }
        else if (isBottomHidden && (bar == "" || bar == "undefined" || bar == null) && countDelivered == 0) {
            navigator.notification.alert("לא נסרק או הוקלד ברקוד")
        }
        else {
            navigator.notification.alert(btnErrorMsg)
        }

    }

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

    function GoToEms(ORG, barcode, kodmesira, countPictures, MEM, KodHanut) {
        $rootScope.itemView = {}
        $(MesiraMerukezetPicturesArray).each(function (index) {
            $rootScope.itemView[index] = {
                'img': 'data:image/png;base64,' + $(this)[0].ImageData,
                'code': $(this)[0].barcode
            }
        })
        if (MEM == "") {
            MEM = 0;
        }
        location.href = "#/weightItem/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/MEM/" + MEM + "/From/2/Count/" + countDelivered + "/KodHanut/" + KodHanut;
    }
    function GoToRegularWeight(ORG, barcode, kodmesira, countPictures, isPalet, MEM, KodHanut) {
        $rootScope.itemView = {}
        $(MesiraMerukezetPicturesArray).each(function (index) {
            $rootScope.itemView[index] = {
                'img': 'data:image/png;base64,' + $(this)[0].ImageData,
                'code':$(this)[0].barcode
            }
        })
        if (MEM == "") {
            MEM = 0;
        }
        location.href = "#/weightNormal/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet + "/MEM/" + MEM + "/From/2/Count/" + countDelivered + "/KodHanut/" + KodHanut;
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