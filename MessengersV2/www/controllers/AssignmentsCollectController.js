scotchApp.controller('AssignmentsCollectController', function ($scope, $routeParams,mainService) {
    $("#warpPopup").hide();
    $('.assCollectCounter').text("0");
    //console.log('AssignmentsCollectController');
    var taskId, contractId, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, newCaseNumber;
    var barcodesArray = [];
    var IsClickEnable = true;
    //ng-click="IsClickEnable?onPlusClick():null"
    //ng-click="IsClickEnable?open():null"
    //console.log("$routeParams=" + JSON.stringify($routeParams));
    angular.element(document).ready(function () {

        //console.log('angular.element ready');

        $('#headerText').html("משימות - איסוף");

        $.sidr('close');

        $("#warpPopup").hide();

        $(".mainContent").css("height", window.innerHeight - ($("#header").innerHeight() + 125));

        taskId = $routeParams.taskId;
        contractId = $routeParams.contractId;
        contactName = decodeURIComponent($routeParams.contactName);
        contactPhoneNumber = decodeURIComponent($routeParams.contactPhoneNumber);
        fromHour = $routeParams.fromHour;
        toHour = $routeParams.toHour;
        city = decodeURIComponent($routeParams.city);
        street = decodeURIComponent($routeParams.street);
        houseNumber = decodeURIComponent($routeParams.houseNumber);
        newCaseNumber = $routeParams.newCaseNumber;
        collect_floor = $routeParams.collect_floor;
        collect_remarks = decodeURIComponent($routeParams.collect_remarks);

        if (taskId == '[object Object]' || taskId == null || taskId == 'undefined') { taskId = ''; }
        if (contractId == '[object Object]' || contractId == null || contractId == 'undefined') { contractId = ''; }
        if (contactName == '[object Object]' || contactName == null || contactName == 'undefined') { contactName = ''; }
        if (contactPhoneNumber == '[object Object]' || contactPhoneNumber == null || contactPhoneNumber == 'undefined') { contactPhoneNumber = ''; }
        if (fromHour == '[object Object]' || fromHour == null || fromHour == 'undefined') { fromHour = ''; }
        if (toHour == '[object Object]' || toHour == null || toHour == 'undefined') { toHour = ''; }
        if (city == '[object Object]' || city == null || city == 'undefined') { city = '0'; }
        if (street == '[object Object]' || street == null || street == 'undefined') { street = ''; }
        if (houseNumber == '[object Object]' || houseNumber == null || houseNumber == 'undefined') { houseNumber = ''; }
        if (newCaseNumber == '[object Object]' || newCaseNumber == null || newCaseNumber == 'undefined') { newCaseNumber = ''; }
        if (collect_floor == '[object Object]' || collect_floor == null || collect_floor == 'undefined') { collect_floor = ''; }
        if (collect_remarks == '[object Object]' || collect_remarks == null || collect_remarks == 'undefined') { collect_remarks = ''; }

        $("#fromHourToHour").html(fromHour + ' - ' + toHour);
        $("#subscriberNum").html('מנוי ' + contractId);
        $("#subscriberName").html(' ' + getSubscriberName(contractId));
        $("#city").html(city);
        $("#address").html(street + ' ' + houseNumber);
        $("#name").html(contactName);
        $("#phone").html(contactPhoneNumber);
        $('#phone').attr('href', 'tel:' + contactPhoneNumber);
        newCaseNumber = 'פנייה מספר ' + newCaseNumber;
        $("#NewCaseNumber").html(newCaseNumber);
        $('.comments span').html(collect_remarks);
        $('.assign_innerDetails #address').after('<br><span id="flor">' + ' קומה:' + collect_floor + '</span>')

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
                //update the scanned barcode to the screen
                $('#packageinput').val(barcode);
                //same behavior as clicking the plus icon
                sendMSG3(barcode);
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


        //#region On open popup
        $scope.open = function () {
            $("#warpPopup").show();
        };
        //#endregion

        //#region On Close X
        $scope.onXClick = function () {
            $("#warpPopup").hide();
        };
        //#endregion

        //#region side menu
        $scope.$on('$routeChangeStart', function (next, current) {
            $.sidr('close');
        });
        //#endregion


        //#region on plus click
        $scope.onPlusClick = function () {
            var reject = $("select[name=area1]").val(); if (reject == null) { reject = ""; }
            var noDo = $("select[name=area2]").val(); if (noDo == null) { noDo = ""; }
            if (reject != "" || noDo != "") {
                navigator.notification.alert('יש ללחוץ על סיום');
            } else {
                //console.log('onPlusClick()');
                var currentBarCode = $('#packageinput').val().toUpperCase();
                //console.log('currentBarCode= ' + currentBarCode);
                if (currentBarCode == '') {
                    navigator.notification.alert('יש להזין מספר פריט');
                } else {
                    //send message 3 only if the user did not select "דחייה לאחר אישור" or "סיבת אי ביצוע"
                    var isReject = $("select[name=area1]").val(); if (isReject == null) { isReject = ''; }
                    var isNoDo = $("select[name=area2]").val(); if (isNoDo == null) { isNoDo = ''; }
                    //console.log('isReject= ' + isReject + ' isNoDo= ' + isNoDo);
                    var isOk = validateManaualCode(currentBarCode);
                    //console.log('isOK= ' + isOk);
                    if (isOk) {
                        if (isReject == "" && isNoDo == "") {
                            sendMSG3(currentBarCode);
                        } else {
                            navigator.notification.alert('לא ניתן לדווח ברקוד במקביל לדיווח דחייה או אי ביצוע');
                        }

                    }
                }
            }
        }
        //#endregion

        //#region on finish click
        $scope.onOkPressed = function () {
            if ($('#packageinput').val() != '') {
                navigator.notification.alert('יש ללחוץ על כפתור + ');
            } else {
                var isReject = $("select[name=area1]").val(); if (isReject == null) { isReject = ''; }
                var isNoDo = $("select[name=area2]").val(); if (isNoDo == null) { isNoDo = ''; }
                if (isReject == '' && isNoDo == '' && barcodesArray.length == 0) {
                    navigator.notification.alert('לא נסרק פריט או לא נבחרה דחיה או סיבת אי ביצוע');
                } else {
                    var xml = createMsg21(taskId, isReject, isNoDo);
                    $
                              .ajax(
                                            {
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
                                                        window.location='#/assignments_all'
                                                    } else {
                                                        navigator.notification.alert(JSONData.DATA.MSG.DATA.RESMSG);
                                                    }
                                                }//end if (data != null)                                                   
                                            }).fail(function (jqXHR, textStatus, thrownError) {
                                                navigator.notification.alert('אין תקשורת, נסה שנית');
                                            });
                }
            }
        }

    });


    function createMsg21(taskId, isReject, isNoDo) {
        var date = getCurrentDate();
        var stat = "", reason = "";
        if (isReject != '') {
            stat = 10;
            reason = isReject;
        } else if (isNoDo != '') {
            stat = 6;
            reason = isNoDo;
        } else {
            stat = 6;
            reason = 1;
        }
        var BCS = '';
        for (var i = 0; i < barcodesArray.length; i++) {
            BCS += barcodesArray[i] + ',';
        }
        //remove the last comma (,) from BCS
        BCS = BCS.substr(0, BCS.length - 1);
        var BC = '';
        if (barcodesArray[0]) {
            BC = barcodesArray[0];
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
                                <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY> <DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
							    <DATA>\
                                    <STATUS>\
								        <TASKID>' + taskId + '</TASKID>\
										<DT>'+ date + '</DT>\
										<STAT>'+ stat + '</STAT>\
										<REASON>'+ reason + '</REASON>\
										<BC>'+ BC + '</BC>\
                                        <BCS>'+ BCS + '</BCS>\
								    </STATUS>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:' + XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        return xml;
    }

    function sendMSG3(barcode) {

        var xml = createMsg3Xml(barcode);
        $.ajax(
                      {
                          url: serverUrl,
                          dataType: "xml",
                          //dataType: 'json',
                          type: "POST",
                          async: true,
                          contentType: "text/xml;charset=utf-8",
                          headers: {
                              "SOAPAction": SoapActionQA
                          },
                          crossDomain: false,
                          data: xml,
                          timeout: 30000 //30 seconds timeout
                      }).done(function (data) {
                          if (data != null) {
                              var parser = new DOMParser();
                              var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
                              var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                              var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                              if (result == "0") {
                                  $('#packageinput').val('');
                                  barcodesArray.push(barcode);
                                  $('.assCollectCounter').text(barcodesArray.length);
                                  $('#barcdoesList').append('<li>' + barcode + '</li>');
                                  document.getElementById('select1').disabled = true;
                                  document.getElementById('select2').disabled = true;
                                  navigator.notification.alert('פריט נאסף בהצלחה');
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

    function createMsg3Xml(barcode) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                     <soapenv:Header/>\
                        <soapenv:Body>\
                            <tem:'+ XMLMETHOD + '>\
                            <!--Optional:-->\
                                <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>3</ACT><MEM></MEM><DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><RQP></RQP><RQW></RQW><ORG></ORG><CRT></CRT><PLT></PLT><LNK></LNK></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
                            </tem:'+ XMLMETHOD + '>\
                        </soapenv:Body>\
                   </soapenv:Envelope>';
        return xml;
    }


});